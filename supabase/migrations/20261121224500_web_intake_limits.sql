-- Bound anonymous web requests and the emails they queue. Defaults await owner approval:
-- 10 web requests per hour, 30 per day, and 3 receipts per rider address per day.
create index ride_web_created_idx on booking_private.ride (created_at) where source = 'web';

create or replace function booking_private.save_ride(p_request_key uuid, p_trip jsonb, p_source text)
returns jsonb
language plpgsql security definer set search_path = ''
as $$
declare
  key_hash bytea := sha256(uuid_send(p_request_key));
  payload_hash bytea := sha256(convert_to(p_trip::text || ':' || p_source, 'UTF8'));
  saved booking_private.ride;
  pickup_time timestamptz;
  email text;
begin
  if p_source is distinct from 'web' then
    perform booking_private.require_driver();
  end if;
  if p_request_key is null or p_request_key::text !~ '^[0-9a-f-]{14}4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$'
      or jsonb_typeof(p_trip) is distinct from 'object' or octet_length(p_trip::text) > 16000 then
    raise sqlstate '22023' using message = 'INVALID_REQUEST';
  end if;

  -- Serialize retries for the same key, including an overlapping first submission.
  perform pg_advisory_xact_lock(hashtextextended(p_request_key::text, 0));
  select * into saved from booking_private.ride where request_key_hash = key_hash;
  if found then
    if saved.request_hash <> payload_hash then
      raise sqlstate '23505' using message = 'REQUEST_KEY_REUSED';
    end if;
    return booking_private.rider_fields(saved);
  end if;

  if p_source = 'web' then
    -- Count and insert under one lock so parallel requests cannot pass the limit together.
    perform pg_advisory_xact_lock(2704, 2);
    if (select count(*) filter (where created_at > now() - interval '1 hour') >= 10 or count(*) >= 30
        from booking_private.ride where source = 'web' and created_at > now() - interval '1 day') then
      raise sqlstate '42501' using message = 'WEB_INTAKE_LIMIT';
    end if;
  end if;

  pickup_time := booking_private.paris_time(p_trip->>'pickup_time');
  if pickup_time is null or pickup_time <= now() then
    raise sqlstate '22007' using message = 'PICKUP_MUST_BE_FUTURE';
  end if;
  insert into booking_private.ride (
    request_key_hash, request_hash, source, status, language, pickup, destination,
    pickup_at, return_at, passengers, passenger_name, passenger_phone, passenger_notes, estimated_minutes
  ) values (
    key_hash, payload_hash, p_source, case when p_source = 'web' then 'pending' else 'confirmed' end,
    p_trip->>'language', btrim(p_trip->>'pickup'), btrim(p_trip->>'destination'), pickup_time,
    booking_private.paris_time(p_trip->>'return_time'), (p_trip->>'passengers')::int,
    btrim(p_trip->>'passenger_name'), btrim(p_trip->>'passenger_phone'), nullif(btrim(p_trip->>'passenger_notes'), ''), (p_trip->>'estimated_minutes')::int
  ) returning * into saved;

  email := nullif(btrim(p_trip->>'passenger_email'), '');
  if p_source = 'web' and email is not null then
    insert into booking_private.rider_email (reference, address) values (saved.reference, email);
    -- Later updates follow driver decisions. Only the automatic receipt needs a per-address limit.
    if (select count(*) from booking_private.booking_email as sent
        where sent.kind = 'receipt' and lower(sent.recipient) = lower(email)
          and sent.queued_at > now() - interval '1 day') < 3 then
      perform booking_private.queue_rider_email(saved, 'receipt');
    end if;
  end if;

  return booking_private.rider_fields(saved);
end;
$$;

create or replace function booking_private.change_ride(
  p_reference bigint, p_version integer, p_status text, p_schedule jsonb, p_driver_notes text
)
returns jsonb
language plpgsql security definer set search_path = ''
as $$
declare
  saved booking_private.ride;
  pickup_time timestamptz;
  return_time timestamptz;
  duration integer;
  pickup_address text;
  dropoff_address text;
begin
  perform booking_private.require_driver();
  select * into saved from booking_private.ride where reference = p_reference for update;
  if not found or saved.version is distinct from p_version then
    raise sqlstate 'PT409' using message = 'STALE_RIDE';
  end if;
  if (saved.status = 'pending' and p_status in ('confirmed', 'declined')
      or saved.status = 'confirmed' and p_status in ('confirmed', 'cancelled')) is not true then
    raise sqlstate 'PT409' using message = 'INVALID_RIDE_TRANSITION';
  end if;
  pickup_time := saved.pickup_at;
  return_time := saved.return_at;
  duration := saved.estimated_minutes;
  pickup_address := saved.pickup;
  dropoff_address := saved.destination;
  if p_schedule is not null then
    if p_status <> 'confirmed' or jsonb_typeof(p_schedule) <> 'object' then
      raise sqlstate '22023' using message = 'INVALID_RESCHEDULE';
    end if;
    if p_schedule ? 'estimated_minutes' then
      duration := (p_schedule->>'estimated_minutes')::integer;
    end if;
    if p_schedule ? 'pickup_time' or p_schedule ? 'pickup' or p_schedule ? 'destination' then
      if saved.status <> 'confirmed' then
        raise sqlstate '22023' using message = 'INVALID_RESCHEDULE';
      end if;
      if p_schedule ? 'pickup_time' then
        pickup_time := booking_private.paris_time(p_schedule->>'pickup_time');
        return_time := booking_private.paris_time(p_schedule->>'return_time');
      end if;
      if p_schedule ? 'pickup' then pickup_address := btrim(p_schedule->>'pickup'); end if;
      if p_schedule ? 'destination' then dropoff_address := btrim(p_schedule->>'destination'); end if;
    end if;
  end if;
  if p_status = 'confirmed' then
    -- Accepting needs a future pickup. A confirmed ride can keep a leg that already happened
    -- while the driver moves the other leg, but every moved leg must be in the future.
    if pickup_time is null or pickup_time <= now()
        and (saved.status = 'pending' or pickup_time is distinct from saved.pickup_at) then
      raise sqlstate '22007' using message = 'PICKUP_MUST_BE_FUTURE';
    end if;
    if return_time <= now() and return_time is distinct from saved.return_at then
      raise sqlstate '22007' using message = 'RETURN_MUST_BE_FUTURE';
    end if;
  end if;

  update booking_private.ride
    set status = p_status, version = version + 1, pickup_at = pickup_time, return_at = return_time,
      pickup = pickup_address, destination = dropoff_address,
      estimated_minutes = duration, driver_notes = coalesce(p_driver_notes, driver_notes)
    where reference = p_reference
    returning * into saved;
  return to_jsonb(saved) - 'request_key_hash' - 'request_hash';
end;
$$;

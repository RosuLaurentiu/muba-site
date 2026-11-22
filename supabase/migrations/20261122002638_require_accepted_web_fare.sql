alter table booking_private.ride
  add column if not exists agreed_fare_cents integer check (agreed_fare_cents > 0);

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
  fare_cents integer;
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
  fare_cents := saved.agreed_fare_cents;
  if saved.source = 'web' and saved.status = 'pending' and p_status = 'confirmed' then
    if p_schedule->'fare_accepted' is distinct from 'true'::jsonb
        or jsonb_typeof(p_schedule->'agreed_fare_cents') is distinct from 'number'
        or coalesce(p_schedule->>'agreed_fare_cents', '') !~ '^[1-9][0-9]{0,9}$' then
      raise sqlstate '22023' using message = 'ACCEPTED_FARE_REQUIRED';
    end if;
    if (p_schedule->>'agreed_fare_cents')::bigint > 2147483647 then
      raise sqlstate '22023' using message = 'ACCEPTED_FARE_REQUIRED';
    end if;
    fare_cents := (p_schedule->>'agreed_fare_cents')::integer;
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
      estimated_minutes = duration, agreed_fare_cents = fare_cents,
      driver_notes = coalesce(p_driver_notes, driver_notes)
    where reference = p_reference
    returning * into saved;
  return to_jsonb(saved) - 'request_key_hash' - 'request_hash';
end;
$$;

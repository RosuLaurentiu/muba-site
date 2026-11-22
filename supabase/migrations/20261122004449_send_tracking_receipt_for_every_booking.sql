-- Keep the bearer key in the private outbox only while the receipt can be sent.
alter table booking_private.booking_email
  add column if not exists receipt_key uuid check (receipt_key is null or kind = 'receipt');

create or replace function booking_private.get_ride(p_request_key uuid)
returns jsonb
language sql stable security definer set search_path = ''
as $$
  select booking_private.rider_fields(ride)
  from booking_private.ride
  where request_key_hash = sha256(uuid_send(p_request_key)) and (source = 'web' or exists (
    select from booking_private.rider_email where reference = ride.reference
  ));
$$;

create or replace function booking_private.notify_ride_change()
returns trigger language plpgsql set search_path = '' as $$
declare
  event_kind text;
begin
  if new.status <> old.status then
    event_kind := new.status;
  elsif new.status = 'confirmed' and (new.pickup_at, new.return_at) is distinct from (old.pickup_at, old.return_at) then
    event_kind := 'changed';
  end if;
  if event_kind is not null then
    perform booking_private.queue_rider_email(new, event_kind);
  end if;
  return new;
end;
$$;

create or replace function booking_private.finish_booking_email(p_id uuid, p_lease uuid, p_sent boolean)
returns void language sql set search_path = '' as $$
  update booking_private.booking_email
    set sent_at = case when p_sent then now() end, failed = not p_sent, lease = null,
        receipt_key = case when p_sent then null else receipt_key end
    where id = p_id and lease = p_lease and sent_at is null;
$$;

create or replace function booking_private.claim_booking_email()
returns setof booking_private.booking_email language sql security definer set search_path = '' as $$
  with expired as (
    update booking_private.booking_email set receipt_key = null
    where receipt_key is not null and first_attempt <= now() - interval '23 hours'
  ), candidate as (
    select email.id from booking_private.booking_email as email
    where email.sent_at is null and email.next_attempt <= now()
      and (email.first_attempt is null or email.first_attempt > now() - interval '23 hours')
      and (email.driver_user_id is null or exists (
        select from booking_private.assigned_google_email() as driver
        where driver.user_id = email.driver_user_id and driver.address = email.recipient
      ))
    order by email.next_attempt, email.queued_at, email.id
    limit 10
    for update skip locked
  )
  update booking_private.booking_email as email
    set first_attempt = coalesce(email.first_attempt, now()), lease = gen_random_uuid(),
        next_attempt = now() + interval '5 minutes'
    from candidate where email.id = candidate.id
    returning email.*;
$$;

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

  email := nullif(btrim(p_trip->>'passenger_email'), '');
  if email is null then
    raise sqlstate '22023' using message = 'BOOKING_EMAIL_REQUIRED';
  end if;
  if jsonb_typeof(p_trip->'passenger_email') <> 'string' or char_length(email) > 254
      or email !~* '^[a-z0-9.!#$%&''*+/=?^_`{|}~-]+@[a-z0-9-]+(\.[a-z0-9-]+)+$' then
    raise sqlstate '22023' using message = 'INVALID_BOOKING_EMAIL';
  end if;

  if p_source = 'web' then
    -- Count and insert under one lock so parallel requests cannot pass the limit together.
    perform pg_advisory_xact_lock(2704, 2);
    if (select count(*) filter (where created_at > now() - interval '1 hour') >= 10 or count(*) >= 30
        from booking_private.ride where source = 'web' and created_at > now() - interval '1 day') then
      raise sqlstate '42501' using message = 'WEB_INTAKE_LIMIT';
    end if;
    if (select count(*) >= 3 from booking_private.booking_email as receipt
        join booking_private.ride as ride on ride.reference = receipt.reference
        where receipt.kind = 'receipt' and ride.source = 'web'
          and lower(receipt.recipient) = lower(email)
          and receipt.queued_at > now() - interval '1 day') then
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

  insert into booking_private.rider_email (reference, address) values (saved.reference, email);
  insert into booking_private.booking_email
    (reference, version, kind, recipient, language, pickup_at, return_at, receipt_key)
  values (saved.reference, saved.version, 'receipt', email, saved.language,
    saved.pickup_at, saved.return_at, p_request_key);

  return booking_private.rider_fields(saved);
end;
$$;

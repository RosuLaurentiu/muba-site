alter table booking_private.booking_code
  add column driver_assisted boolean not null default false;

-- Count public attempts independently of mailbox state, including duplicate requests.
create table booking_private.booking_code_attempt (
  id uuid primary key,
  source_hash bytea not null,
  created_at timestamptz not null default now()
);
alter table booking_private.booking_code_attempt enable row level security;
revoke all on booking_private.booking_code_attempt from public, anon, authenticated, service_role;
insert into booking_private.booking_code_attempt (id, source_hash, created_at)
  select id, source_hash, created_at from booking_private.booking_code
  where created_at > now() - interval '1 hour';

create function booking_private.issue_booking_code(p_email text, p_language text, p_driver_assisted boolean)
returns boolean language plpgsql security definer set search_path = '' as $$
declare
  mailbox text := lower(btrim(p_email));
  source bytea;
  job uuid := gen_random_uuid();
  code text := replace(gen_random_uuid()::text, '-', '');
begin
  if p_driver_assisted then
    perform booking_private.require_driver();
    source := convert_to('driver-assisted', 'UTF8');
  else
    source := booking_private.client_network();
  end if;
  if mailbox is null or char_length(mailbox) > 254
      or mailbox !~ '^[a-z0-9.!#$%&''*+/=?^_`{|}~-]+@[a-z0-9-]+(\.[a-z0-9-]+)+$'
      or p_language is null or p_language not in ('en','fr') then
    raise sqlstate '22023' using message = 'INVALID_BOOKING_EMAIL';
  end if;
  perform pg_advisory_xact_lock(2704, 3);
  -- Approve a pending code in place so the rider can use the email already delivered.
  if p_driver_assisted then
    update booking_private.booking_code set driver_assisted = true where address = mailbox
      and not used and created_at > now() - interval '15 minutes';
    if found then return true; end if;
    if (select count(*) >= 60 or count(*) filter (where source_hash = sha256(uuid_send(id) || source)) >= 6
        from booking_private.booking_code where created_at > now() - interval '1 hour') then
      raise sqlstate 'PT429' using message = 'BOOKING_CODE_LIMIT';
    end if;
  else
    if (select count(*) >= 54 or count(*) filter (where source_hash = sha256(uuid_send(id) || source)) >= 6
        from booking_private.booking_code_attempt where created_at > now() - interval '1 hour') then
      return true;
    end if;
    insert into booking_private.booking_code_attempt (id, source_hash)
      values (job, sha256(uuid_send(job) || source));
    if exists (select from booking_private.booking_code where address = mailbox and not used
        and created_at > now() - interval '15 minutes') then return true; end if;
  end if;
  insert into booking_private.booking_code (id, address, language, source_hash, code_hash, delivery_code, driver_assisted)
    values (job, mailbox, p_language, sha256(uuid_send(job) || source), sha256(convert_to(code, 'UTF8')), code, p_driver_assisted);
  return true;
end;
$$;

revoke all on function booking_private.issue_booking_code(text,text,boolean) from public, anon, authenticated, service_role;
grant execute on function booking_private.issue_booking_code(text,text,boolean) to authenticated;

create or replace function booking_private.request_booking_code(p_email text, p_language text)
returns boolean language sql security definer set search_path = '' as $$
  select booking_private.issue_booking_code(p_email, p_language, false);
$$;

create function public.approve_booking_code(p_email text, p_language text)
returns boolean language sql set search_path = '' as $$
  select booking_private.issue_booking_code(p_email, p_language, true);
$$;
revoke all on function public.approve_booking_code(text,text) from public, anon, authenticated, service_role;
grant execute on function public.approve_booking_code(text,text) to authenticated;

create or replace function booking_private.claim_booking_codes()
returns table (id uuid, recipient text, language text, code text)
language plpgsql security definer set search_path = '' as $$
begin
  delete from booking_private.booking_code_attempt where created_at <= now() - interval '1 hour';
  delete from booking_private.booking_code as c where c.created_at <= now() - interval '1 hour';
  update booking_private.booking_code as c set delivery_code = null
    where c.delivery_code is not null and c.created_at <= now() - interval '15 minutes';
  delete from booking_private.web_intake_source as s using booking_private.ride as r
    where s.reference = r.reference and r.created_at <= now() - interval '1 day';
  return query
    with pending as (
      select c.id from booking_private.booking_code as c
      where c.delivery_code is not null and c.next_attempt <= now() and c.created_at > now() - interval '15 minutes'
      order by c.created_at limit 10 for update skip locked
    )
    update booking_private.booking_code as c set next_attempt = now() + interval '2 minutes'
      from pending where c.id = pending.id returning c.id, c.address, c.language, c.delivery_code;
end;
$$;

create or replace function booking_private.save_ride(p_request_key uuid, p_trip jsonb, p_source text)
returns jsonb
language plpgsql security definer set search_path = ''
as $$
declare
  key_hash bytea := sha256(uuid_send(p_request_key));
  payload_hash bytea;
  saved booking_private.ride;
  pickup_time timestamptz;
  email text;
  network_id bytea;
  assisted boolean;
begin
  if p_source is distinct from 'web' then
    perform booking_private.require_driver();
  end if;
  if p_request_key is null or p_request_key::text !~ '^[0-9a-f-]{14}4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$'
      or jsonb_typeof(p_trip) is distinct from 'object' or octet_length(p_trip::text) > 16000 then
    raise sqlstate '22023' using message = 'INVALID_REQUEST';
  end if;
  if p_trip ? 'estimated_fare_cents' and jsonb_typeof(p_trip->'estimated_fare_cents') <> 'number' then
    raise sqlstate '22023' using message = 'INVALID_FARE_ESTIMATE';
  end if;
  payload_hash := sha256(convert_to((p_trip - 'email_code')::text || ':' || p_source, 'UTF8'));

  -- Serialize retries for the same key, including an overlapping first submission.
  perform pg_advisory_xact_lock(hashtextextended(p_request_key::text, 0));
  select * into saved from booking_private.ride where request_key_hash = key_hash;
  if found then
    if saved.request_hash <> payload_hash and
        saved.request_hash <> sha256(convert_to(p_trip::text || ':' || p_source, 'UTF8')) then
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
    -- Deliver the receipt to the same canonical address as the verification code.
    email := lower(email);
    -- Count and insert under one lock so parallel requests cannot pass the limit together.
    perform pg_advisory_xact_lock(2704, 2);
    network_id := booking_private.client_network();
    update booking_private.booking_code set used = true, delivery_code = null
      where address = email and code_hash = sha256(convert_to(lower(p_trip->>'email_code'), 'UTF8'))
        and not used and created_at > now() - interval '15 minutes'
      returning driver_assisted into assisted;
    if not found then
      raise sqlstate 'PT403' using message = 'BOOKING_EMAIL_PROOF_REQUIRED';
    end if;

    delete from booking_private.web_intake_source as source using booking_private.ride as ride
      where source.reference = ride.reference and ride.created_at <= now() - interval '1 day';
    if (select count(*) >= 3 from booking_private.web_intake_source as source
        join booking_private.ride as ride using (reference)
        where source.fingerprint = sha256(ride.request_key_hash || network_id)) then
      raise sqlstate '42501' using message = 'WEB_INTAKE_LIMIT';
    end if;
    if (select count(*) filter (where created_at > now() - interval '1 hour') >= (case when assisted then 10 else 9 end)
        or count(*) >= (case when assisted then 30 else 27 end)
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
  if p_source = 'web' and pickup_time < now() + interval '2 hours' then
    raise sqlstate 'PT422' using message = 'WEB_NOTICE_REQUIRED';
  end if;
  insert into booking_private.ride (
    request_key_hash, request_hash, source, status, language, pickup, destination,
    pickup_at, return_at, passengers, passenger_name, passenger_phone, passenger_notes, estimated_minutes,
    estimated_fare_cents
  ) values (
    key_hash, payload_hash, p_source, case when p_source = 'web' then 'pending' else 'confirmed' end,
    p_trip->>'language', btrim(p_trip->>'pickup'), btrim(p_trip->>'destination'), pickup_time,
    booking_private.paris_time(p_trip->>'return_time'), (p_trip->>'passengers')::int,
    btrim(p_trip->>'passenger_name'), btrim(p_trip->>'passenger_phone'), nullif(btrim(p_trip->>'passenger_notes'), ''), (p_trip->>'estimated_minutes')::int,
    case when p_source = 'web' then (p_trip->>'estimated_fare_cents')::int end
  ) returning * into saved;

  if p_source = 'web' then
    insert into booking_private.web_intake_source (reference, fingerprint)
    values (saved.reference, sha256(key_hash || network_id));
  end if;

  insert into booking_private.rider_email (reference, address) values (saved.reference, email);
  insert into booking_private.booking_email
    (reference, version, kind, recipient, language, pickup_at, return_at, receipt_key)
  values (saved.reference, saved.version, 'receipt', email, saved.language,
    saved.pickup_at, saved.return_at, p_request_key);

  return booking_private.rider_fields(saved);
end;
$$;

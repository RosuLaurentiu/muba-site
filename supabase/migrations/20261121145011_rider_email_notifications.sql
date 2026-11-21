create table booking_private.rider_email (
  reference bigint primary key references booking_private.ride on delete cascade,
  address text not null check (char_length(address) <= 254 and address ~* '^[a-z0-9.!#$%&''*+/=?^_`{|}~-]+@[a-z0-9-]+(\.[a-z0-9-]+)+$')
);

create table booking_private.booking_email (
  id uuid primary key default gen_random_uuid(),
  reference bigint not null references booking_private.ride on delete cascade,
  version integer not null,
  kind text not null check (kind in ('receipt', 'confirmed', 'changed', 'declined', 'cancelled')),
  recipient text not null,
  language text not null check (language in ('en', 'fr')),
  pickup_at timestamptz not null,
  return_at timestamptz,
  queued_at timestamptz not null default clock_timestamp(),
  next_attempt timestamptz not null default clock_timestamp(),
  first_attempt timestamptz,
  lease uuid,
  failed boolean not null default false,
  sent_at timestamptz,
  unique (reference, version, kind)
);

create index booking_email_outbox_idx on booking_private.booking_email (next_attempt, queued_at) where sent_at is null;
alter table booking_private.rider_email enable row level security;
alter table booking_private.booking_email enable row level security;
revoke all on booking_private.rider_email, booking_private.booking_email from public, anon, authenticated;

create function booking_private.queue_rider_email(ride booking_private.ride, event_kind text)
returns void language sql set search_path = '' as $$
  insert into booking_private.booking_email (reference, version, kind, recipient, language, pickup_at, return_at)
  select ride.reference, ride.version, event_kind, address, ride.language, ride.pickup_at, ride.return_at
  from booking_private.rider_email where reference = ride.reference;
$$;

create function booking_private.notify_ride_change()
returns trigger language plpgsql set search_path = '' as $$
declare
  event_kind text;
begin
  if new.status <> old.status then
    event_kind := new.status;
  elsif new.status = 'confirmed' and (new.pickup_at, new.return_at) is distinct from (old.pickup_at, old.return_at) then
    event_kind := 'changed';
  end if;
  if new.source = 'web' and event_kind is not null then
    perform booking_private.queue_rider_email(new, event_kind);
  end if;
  return new;
end;
$$;

create trigger notify_ride_change after update of status, pickup_at, return_at on booking_private.ride
  for each row execute function booking_private.notify_ride_change();

-- Reuse the same message ID within the provider's 24-hour deduplication window.
create function booking_private.claim_booking_email()
returns setof booking_private.booking_email language sql set search_path = '' as $$
  with candidate as (
    select id from booking_private.booking_email
    where sent_at is null and next_attempt <= now()
      and (first_attempt is null or first_attempt > now() - interval '23 hours')
    order by next_attempt, queued_at, id
    limit 10
    for update skip locked
  )
  update booking_private.booking_email as email
    set first_attempt = coalesce(email.first_attempt, now()), lease = gen_random_uuid(),
        next_attempt = now() + interval '5 minutes'
    from candidate where email.id = candidate.id
    returning email.*;
$$;

create function booking_private.finish_booking_email(p_id uuid, p_lease uuid, p_sent boolean)
returns void language sql set search_path = '' as $$
  update booking_private.booking_email
    set sent_at = case when p_sent then now() end, failed = not p_sent, lease = null
    where id = p_id and lease = p_lease and sent_at is null;
$$;

create function booking_private.booking_email_failures()
returns jsonb language plpgsql stable security definer set search_path = '' as $$
begin
  perform booking_private.require_driver();
  return jsonb_build_object(
    'retryable', count(*) filter (where first_attempt > now() - interval '23 hours'),
    'expired', count(*) filter (where first_attempt <= now() - interval '23 hours')
  ) from booking_private.booking_email
  where sent_at is null and (failed or (lease is not null and next_attempt <= now()));
end;
$$;

create function booking_private.retry_booking_email()
returns void language plpgsql security definer set search_path = '' as $$
begin
  perform booking_private.require_driver();
  update booking_private.booking_email set next_attempt = now()
  where sent_at is null and failed and lease is null and first_attempt > now() - interval '23 hours';
end;
$$;

create function public.claim_booking_email()
returns setof booking_private.booking_email language sql set search_path = '' as $$
  select * from booking_private.claim_booking_email();
$$;
create function public.finish_booking_email(p_id uuid, p_lease uuid, p_sent boolean)
returns void language sql set search_path = '' as $$
  select booking_private.finish_booking_email(p_id, p_lease, p_sent);
$$;
create function public.booking_email_failures()
returns jsonb language sql stable set search_path = '' as $$
  select booking_private.booking_email_failures();
$$;
create function public.retry_booking_email()
returns void language sql set search_path = '' as $$
  select booking_private.retry_booking_email();
$$;

revoke execute on function booking_private.queue_rider_email(booking_private.ride, text),
  booking_private.notify_ride_change(), booking_private.claim_booking_email(),
  booking_private.finish_booking_email(uuid, uuid, boolean), booking_private.booking_email_failures(),
  booking_private.retry_booking_email(), public.claim_booking_email(), public.finish_booking_email(uuid, uuid, boolean),
  public.booking_email_failures(), public.retry_booking_email() from public, anon, authenticated;

grant usage on schema booking_private to service_role;
grant select, update on booking_private.booking_email to service_role;
grant execute on function booking_private.claim_booking_email(), booking_private.finish_booking_email(uuid, uuid, boolean),
  public.claim_booking_email(), public.finish_booking_email(uuid, uuid, boolean) to service_role;
grant execute on function booking_private.booking_email_failures(), booking_private.retry_booking_email(),
  public.booking_email_failures(), public.retry_booking_email() to authenticated;

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
    perform booking_private.queue_rider_email(saved, 'receipt');
  end if;

  return booking_private.rider_fields(saved);
end;
$$;

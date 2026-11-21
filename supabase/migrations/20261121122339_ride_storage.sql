create schema booking_private;
revoke all on schema booking_private from public;
grant usage on schema booking_private to anon, authenticated;

-- Driver access is granted by an administrator to an existing Supabase Auth user.
create table booking_private.driver (
  singleton boolean primary key default true check (singleton),
  user_id uuid not null references auth.users (id) on delete cascade
);

create table booking_private.ride (
  reference bigint generated always as identity primary key,
  request_key_hash bytea not null unique,
  request_hash bytea not null,
  source text not null check (source in ('web', 'phone', 'whatsapp')),
  status text not null check (status in ('pending', 'confirmed', 'declined', 'cancelled')),
  language text not null check (language in ('en', 'fr')),
  pickup text not null check (char_length(pickup) between 1 and 300),
  destination text not null check (char_length(destination) between 1 and 300),
  pickup_at timestamptz not null,
  return_at timestamptz check (return_at > pickup_at),
  passengers integer not null check (passengers between 1 and 8),
  passenger_name text not null check (char_length(passenger_name) between 1 and 150),
  passenger_phone text not null check (
    char_length(passenger_phone) <= 40
    and passenger_phone ~ '^[+]?[0-9 ().-]+$'
    and regexp_replace(passenger_phone, '[^0-9]', '', 'g') ~ '^[0-9]{7,15}$'
  ),
  passenger_notes text check (char_length(passenger_notes) <= 1500),
  driver_notes text check (char_length(driver_notes) <= 1500),
  version integer not null default 1,
  created_at timestamptz not null default now()
);
create index ride_pickup_idx on booking_private.ride (pickup_at, reference);
alter table booking_private.driver enable row level security;
alter table booking_private.ride enable row level security;
revoke all on all tables in schema booking_private from public, anon, authenticated;

create function booking_private.require_driver()
returns void
language plpgsql stable set search_path = ''
as $$
begin
  if not exists (select from booking_private.driver where user_id = auth.uid()) then
    raise sqlstate '42501' using message = 'DRIVER_REQUIRED';
  end if;
end;
$$;

create function booking_private.paris_time(value text)
returns timestamptz
language plpgsql stable strict set search_path = ''
as $$
declare
  local_time timestamp;
  instant timestamptz;
begin
  if value !~ '^[0-9]{4}-[0-9]{2}-[0-9]{2}T([01][0-9]|2[0-3]):[0-5][0-9]$' then
    raise sqlstate '22007' using message = 'INVALID_PARIS_TIME';
  end if;
  local_time := value::timestamp;
  instant := local_time at time zone 'Europe/Paris';
  if instant at time zone 'Europe/Paris' <> local_time then
    raise sqlstate '22007' using message = 'INVALID_PARIS_TIME';
  end if;
  -- At the autumn clock change, PostgreSQL resolves the repeated hour to standard time.
  return instant;
end;
$$;

create function booking_private.rider_fields(value booking_private.ride)
returns jsonb
language sql immutable set search_path = ''
as $$
  select jsonb_build_object(
    'reference', value.reference::text, 'status', value.status, 'language', value.language,
    'pickup', value.pickup, 'destination', value.destination, 'pickup_at', value.pickup_at,
    'return_at', value.return_at, 'passengers', value.passengers
  );
$$;

create function booking_private.save_ride(p_request_key uuid, p_trip jsonb, p_source text)
returns jsonb
language plpgsql security definer set search_path = ''
as $$
declare
  key_hash bytea := sha256(uuid_send(p_request_key));
  payload_hash bytea := sha256(convert_to(p_trip::text || ':' || p_source, 'UTF8'));
  saved booking_private.ride;
  pickup_time timestamptz;
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
    pickup_at, return_at, passengers, passenger_name, passenger_phone, passenger_notes
  ) values (
    key_hash, payload_hash, p_source, case when p_source = 'web' then 'pending' else 'confirmed' end,
    p_trip->>'language', btrim(p_trip->>'pickup'), btrim(p_trip->>'destination'), pickup_time,
    booking_private.paris_time(p_trip->>'return_time'), (p_trip->>'passengers')::int,
    btrim(p_trip->>'passenger_name'), btrim(p_trip->>'passenger_phone'), nullif(btrim(p_trip->>'passenger_notes'), '')
  ) returning * into saved;

  return booking_private.rider_fields(saved);
end;
$$;

create function booking_private.get_ride(p_request_key uuid)
returns jsonb
language sql stable security definer set search_path = ''
as $$
  select booking_private.rider_fields(ride)
  from booking_private.ride
  where request_key_hash = sha256(uuid_send(p_request_key)) and source = 'web';
$$;

create function booking_private.list_rides()
returns setof jsonb
language plpgsql stable security definer set search_path = ''
as $$
begin
  perform booking_private.require_driver();
  return query select to_jsonb(ride) - 'request_key_hash' - 'request_hash'
    from booking_private.ride order by pickup_at, reference;
end;
$$;

create function booking_private.change_ride(
  p_reference bigint, p_version integer, p_status text, p_schedule jsonb, p_driver_notes text
)
returns jsonb
language plpgsql security definer set search_path = ''
as $$
declare
  saved booking_private.ride;
  pickup_time timestamptz;
  return_time timestamptz;
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
  if p_schedule is not null then
    if saved.status <> 'confirmed' or p_status <> 'confirmed' then
      raise sqlstate '22023' using message = 'INVALID_RESCHEDULE';
    end if;
    pickup_time := booking_private.paris_time(p_schedule->>'pickup_time');
    return_time := booking_private.paris_time(p_schedule->>'return_time');
  end if;
  if p_status = 'confirmed' and (pickup_time is null or pickup_time <= now()) then
    raise sqlstate '22007' using message = 'PICKUP_MUST_BE_FUTURE';
  end if;

  update booking_private.ride
    set status = p_status, version = version + 1, pickup_at = pickup_time, return_at = return_time,
      driver_notes = coalesce(p_driver_notes, driver_notes)
    where reference = p_reference
    returning * into saved;
  return to_jsonb(saved) - 'request_key_hash' - 'request_hash';
end;
$$;

-- Expose narrow invoker functions. Elevated functions and data stay outside the Data API schemas.
create function public.save_ride(p_request_key uuid, p_trip jsonb, p_source text default 'web')
returns jsonb
language sql set search_path = ''
as $$ select booking_private.save_ride(p_request_key, p_trip, p_source); $$;

create function public.get_ride(p_request_key uuid)
returns jsonb
language sql stable set search_path = ''
as $$ select booking_private.get_ride(p_request_key); $$;

create function public.list_rides()
returns setof jsonb
language sql stable set search_path = ''
as $$ select booking_private.list_rides(); $$;

create function public.change_ride(
  p_reference bigint, p_version integer, p_status text, p_schedule jsonb default null, p_driver_notes text default null
)
returns jsonb
language sql set search_path = ''
as $$ select booking_private.change_ride(p_reference, p_version, p_status, p_schedule, p_driver_notes); $$;

revoke execute on all functions in schema booking_private from public, anon, authenticated;
revoke execute on function public.save_ride(uuid, jsonb, text), public.get_ride(uuid),
  public.list_rides(), public.change_ride(bigint, integer, text, jsonb, text) from public, anon, authenticated;
grant execute on function public.save_ride(uuid, jsonb, text), public.get_ride(uuid),
  booking_private.save_ride(uuid, jsonb, text), booking_private.get_ride(uuid) to anon, authenticated;
grant execute on function public.list_rides(), public.change_ride(bigint, integer, text, jsonb, text),
  booking_private.list_rides(), booking_private.change_ride(bigint, integer, text, jsonb, text) to authenticated;

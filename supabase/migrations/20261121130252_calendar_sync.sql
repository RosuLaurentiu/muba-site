create table booking_private.calendar_connection (
  singleton boolean primary key default true check (singleton),
  owner_id uuid not null references auth.users(id) on delete cascade,
  calendar_id text not null,
  encrypted_token text not null
);

create table booking_private.calendar_oauth (
  state_hash text primary key,
  owner_id uuid not null references auth.users(id) on delete cascade,
  calendar_id text not null,
  verifier text not null,
  expires_at timestamptz not null default now() + interval '10 minutes'
);

create table booking_private.calendar_job (
  event_id text primary key default ('muba' || replace(gen_random_uuid()::text, '-', '')),
  ride_reference bigint not null,
  leg text not null check (leg in ('outbound', 'return')),
  active boolean not null default true,
  revision integer not null default 1,
  synced_revision integer not null default 0,
  lease_id uuid,
  lease_until timestamptz,
  failed boolean not null default false
);
create unique index calendar_active_leg on booking_private.calendar_job (ride_reference, leg) where active;
create index calendar_unsynced_jobs
  on booking_private.calendar_job (active, ride_reference, leg) where synced_revision < revision;

alter table booking_private.calendar_connection enable row level security;
alter table booking_private.calendar_oauth enable row level security;
alter table booking_private.calendar_job enable row level security;
revoke all on booking_private.calendar_connection, booking_private.calendar_oauth, booking_private.calendar_job
  from public, anon, authenticated;

create function booking_private.queue_calendar(ride booking_private.ride, removed boolean)
returns void
language plpgsql set search_path = ''
as $$
declare
  leg_record record;
begin
  for leg_record in select * from (values ('outbound', ride.pickup_at), ('return', ride.return_at)) as legs(name, starts_at) loop
    if not removed and ride.status = 'confirmed' and leg_record.starts_at is not null then
      insert into booking_private.calendar_job (ride_reference, leg) values (ride.reference, leg_record.name)
      on conflict (ride_reference, leg) where active do update
        set revision = calendar_job.revision + 1, failed = false;
    else
      update booking_private.calendar_job
        set active = false, revision = revision + 1, failed = false
        where ride_reference = ride.reference and leg = leg_record.name and active;
    end if;
  end loop;
end;
$$;

create function booking_private.on_ride_calendar_change()
returns trigger language plpgsql set search_path = ''
as $$
begin
  if tg_op = 'DELETE' then
    perform booking_private.queue_calendar(old, true);
  elsif tg_op = 'INSERT' or
      (old.status, old.pickup_at, old.return_at, old.pickup, old.destination, old.estimated_minutes)
      is distinct from
      (new.status, new.pickup_at, new.return_at, new.pickup, new.destination, new.estimated_minutes) then
    perform booking_private.queue_calendar(new, false);
  end if;
  return null;
end;
$$;

create trigger ride_calendar_change after insert or update or delete on booking_private.ride
  for each row execute function booking_private.on_ride_calendar_change();

do $$
declare
  ride booking_private.ride;
begin
  for ride in select * from booking_private.ride where status = 'confirmed' loop
    perform booking_private.queue_calendar(ride, false);
  end loop;
end;
$$;

create function booking_private.calendar_status()
returns jsonb language plpgsql stable security definer set search_path = ''
as $$
begin
  perform booking_private.require_driver();
  return jsonb_build_object(
    'calendar_id', (select calendar_id from booking_private.calendar_connection where owner_id = auth.uid()),
    'outstanding', coalesce((
      select jsonb_agg(jsonb_build_object('reference', pending.ride_reference, 'failed', pending.failed))
      from (
        select ride_reference, bool_or(failed) as failed
        from booking_private.calendar_job where synced_revision < revision
        group by ride_reference order by ride_reference limit 100
      ) pending
    ), '[]'::jsonb)
  );
end;
$$;

create function booking_private.calendar_service(action text, args jsonb)
returns jsonb language plpgsql security definer set search_path = ''
as $$
declare
  owner uuid := (args->>'owner_id')::uuid;
  calendar text := args->>'calendar_id';
  leased uuid := (args->>'lease_id')::uuid;
  result jsonb;
begin
  case action
    when 'begin_oauth' then
      if not exists (select from booking_private.driver where user_id = owner)
          or exists (select from booking_private.calendar_connection where calendar_id <> calendar) then
        raise sqlstate '42501' using message = 'CALENDAR_RECONNECT_REQUIRED';
      end if;
      delete from booking_private.calendar_oauth where expires_at <= now() or owner_id = owner;
      insert into booking_private.calendar_oauth(state_hash, owner_id, calendar_id, verifier)
        values (args->>'state_hash', owner, calendar, args->>'verifier');
    when 'consume_oauth' then
      delete from booking_private.calendar_oauth as state using booking_private.driver as driver
        where state.state_hash = args->>'state_hash' and state.expires_at > now() and driver.user_id = state.owner_id
        returning jsonb_build_object('owner_id', state.owner_id, 'calendar_id', state.calendar_id, 'verifier', state.verifier)
        into result;
    when 'connect' then
      if not exists (select from booking_private.driver where user_id = owner) then
        raise sqlstate '42501' using message = 'DRIVER_REQUIRED';
      end if;
      insert into booking_private.calendar_connection (owner_id, calendar_id, encrypted_token)
        values (owner, calendar, args->>'encrypted_token')
      on conflict (singleton) do update set owner_id = excluded.owner_id, encrypted_token = excluded.encrypted_token
        where calendar_connection.calendar_id = excluded.calendar_id;
      if not found then raise sqlstate 'PT409' using message = 'CALENDAR_RECONNECT_REQUIRED'; end if;
    when 'connection' then
      select jsonb_build_object('calendar_id', calendar_id, 'encrypted_token', encrypted_token)
        into result from booking_private.calendar_connection where owner_id = owner;
    when 'claim' then
      if not exists (select from booking_private.calendar_connection where owner_id = owner and calendar_id = calendar) then
        raise sqlstate '42501' using message = 'CALENDAR_CONNECTION_REQUIRED';
      end if;
      with picked as (
        select j.event_id from booking_private.calendar_job j
        where j.synced_revision < j.revision and (j.lease_until is null or j.lease_until < now())
          and (not j.active or not exists (
            select from booking_private.calendar_job old
            where old.ride_reference = j.ride_reference and old.leg = j.leg and not old.active
              and old.synced_revision < old.revision
          ))
        order by j.active, j.ride_reference, j.leg limit 8 for update skip locked
      ), claimed as (
        update booking_private.calendar_job as j set lease_id = leased, lease_until = now() + interval '90 seconds'
        from picked where picked.event_id = j.event_id returning j.*
      )
      select coalesce(jsonb_agg(jsonb_build_object(
        'event_id', j.event_id, 'reference', j.ride_reference, 'leg', j.leg, 'active', j.active,
        'revision', j.revision, 'starts_at', case when j.leg = 'return' then r.return_at else r.pickup_at end,
        'pickup', case when j.leg = 'return' then r.destination else r.pickup end, 'estimated_minutes', r.estimated_minutes
      )), '[]'::jsonb) into result
      from claimed j left join booking_private.ride r on r.reference = j.ride_reference;
    when 'finish' then
      update booking_private.calendar_job
        set synced_revision = case when (args->>'ok')::boolean then (args->>'revision')::integer else synced_revision end,
          failed = not (args->>'ok')::boolean, lease_id = null, lease_until = null
        where event_id = args->>'event_id' and lease_id = leased;
    else
      raise sqlstate '22023' using message = 'INVALID_CALENDAR_ACTION';
  end case;
  return result;
end;
$$;

create function public.calendar_status()
returns jsonb language sql stable set search_path = ''
as $$ select booking_private.calendar_status(); $$;

create function public.calendar_service(action text, args jsonb)
returns jsonb language sql set search_path = ''
as $$ select booking_private.calendar_service(action, args); $$;

revoke execute on function booking_private.queue_calendar(booking_private.ride, boolean),
  booking_private.on_ride_calendar_change(), booking_private.calendar_status(),
  public.calendar_status(), booking_private.calendar_service(text, jsonb), public.calendar_service(text, jsonb)
  from public, anon, authenticated;
grant execute on function booking_private.calendar_status(), public.calendar_status() to authenticated;
grant usage on schema booking_private to service_role;
grant execute on function booking_private.calendar_service(text, jsonb), public.calendar_service(text, jsonb) to service_role;

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
  if p_status = 'confirmed' and (pickup_time is null or pickup_time <= now()) then
    raise sqlstate '22007' using message = 'PICKUP_MUST_BE_FUTURE';
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

alter table booking_private.ride
  add column estimated_minutes integer check (estimated_minutes between 1 and 1440);

create table booking_private.time_block (
  id uuid primary key,
  starts_at timestamptz not null,
  ends_at timestamptz not null check (ends_at > starts_at)
);
alter table booking_private.time_block enable row level security;
revoke all on booking_private.time_block from public, anon, authenticated;

create function booking_private.ride_slot(starts_at timestamptz, minutes integer)
returns tstzrange
language sql immutable set search_path = ''
as $$
  select case when starts_at is not null
    then tstzrange(starts_at, starts_at + make_interval(mins => coalesce(minutes, 1)), '[)') end;
$$;

create function booking_private.has_schedule_conflict(slot tstzrange, excluded_reference bigint)
returns boolean
language sql stable set search_path = ''
as $$
  select slot is not null and (
    exists (
      select from booking_private.ride
      where status = 'confirmed' and reference is distinct from excluded_reference
        and (booking_private.ride_slot(pickup_at, estimated_minutes) && slot
          or booking_private.ride_slot(return_at, estimated_minutes) && slot)
    ) or exists (
      select from booking_private.time_block where tstzrange(starts_at, ends_at, '[)') && slot
    )
  );
$$;

create function booking_private.enforce_ride_schedule()
returns trigger
language plpgsql set search_path = ''
as $$
declare
  outbound tstzrange;
  return_slot tstzrange;
begin
  if new.status = 'confirmed' or (tg_op = 'UPDATE' and old.status = 'confirmed') then
    -- Keep the conflict check and write together even across different ride records.
    perform pg_advisory_xact_lock(2704, 1);
  end if;
  if new.status = 'confirmed' then
    outbound := booking_private.ride_slot(new.pickup_at, new.estimated_minutes);
    return_slot := booking_private.ride_slot(new.return_at, new.estimated_minutes);
    if outbound && return_slot
       or booking_private.has_schedule_conflict(outbound, new.reference)
       or booking_private.has_schedule_conflict(return_slot, new.reference) then
      raise sqlstate 'PT409' using message = 'SCHEDULE_CONFLICT';
    end if;
  end if;
  return new;
end;
$$;

create trigger ride_schedule_conflict before insert or update of status, pickup_at, return_at, estimated_minutes
  on booking_private.ride for each row execute function booking_private.enforce_ride_schedule();

create function booking_private.list_blocks()
returns setof jsonb
language plpgsql stable security definer set search_path = ''
as $$
begin
  perform booking_private.require_driver();
  return query select to_jsonb(time_block) from booking_private.time_block order by starts_at, id;
end;
$$;

create function booking_private.save_block(p_id uuid, p_start text, p_end text)
returns jsonb
language plpgsql security definer set search_path = ''
as $$
declare
  start_time timestamptz := booking_private.paris_time(p_start);
  end_time timestamptz := booking_private.paris_time(p_end);
  saved booking_private.time_block;
begin
  perform booking_private.require_driver();
  if p_id is null or start_time is null or end_time is null or end_time <= start_time then
    raise sqlstate '22023' using message = 'INVALID_TIME_BLOCK';
  end if;
  perform pg_advisory_xact_lock(2704, 1);
  select * into saved from booking_private.time_block where id = p_id;
  if found then
    if saved.starts_at <> start_time or saved.ends_at <> end_time then
      raise sqlstate 'PT409' using message = 'SCHEDULE_CONFLICT';
    end if;
    return to_jsonb(saved);
  end if;
  if end_time <= now() then
    raise sqlstate '22023' using message = 'INVALID_TIME_BLOCK';
  end if;
  if booking_private.has_schedule_conflict(tstzrange(start_time, end_time, '[)'), null) then
    raise sqlstate 'PT409' using message = 'SCHEDULE_CONFLICT';
  end if;
  insert into booking_private.time_block (id, starts_at, ends_at)
    values (p_id, start_time, end_time)
    returning * into saved;
  return to_jsonb(saved);
end;
$$;

create function booking_private.remove_block(p_id uuid)
returns void
language plpgsql security definer set search_path = ''
as $$
begin
  perform booking_private.require_driver();
  perform pg_advisory_xact_lock(2704, 1);
  delete from booking_private.time_block where id = p_id;
end;
$$;

create function public.list_blocks()
returns setof jsonb language sql stable set search_path = ''
as $$ select booking_private.list_blocks(); $$;
create function public.save_block(p_id uuid, p_start text, p_end text)
returns jsonb language sql set search_path = ''
as $$ select booking_private.save_block(p_id, p_start, p_end); $$;
create function public.remove_block(p_id uuid)
returns void language sql set search_path = ''
as $$ select booking_private.remove_block(p_id); $$;

revoke execute on function booking_private.ride_slot(timestamptz, integer),
  booking_private.has_schedule_conflict(tstzrange, bigint), booking_private.enforce_ride_schedule()
  from public, anon, authenticated;
revoke execute on function booking_private.list_blocks(), booking_private.save_block(uuid, text, text),
  booking_private.remove_block(uuid), public.list_blocks(), public.save_block(uuid, text, text), public.remove_block(uuid)
  from public, anon, authenticated;
grant execute on function booking_private.list_blocks(), booking_private.save_block(uuid, text, text),
  booking_private.remove_block(uuid), public.list_blocks(), public.save_block(uuid, text, text), public.remove_block(uuid)
  to authenticated;

create or replace function booking_private.save_ride(p_request_key uuid, p_trip jsonb, p_source text)
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
    pickup_at, return_at, passengers, passenger_name, passenger_phone, passenger_notes, estimated_minutes
  ) values (
    key_hash, payload_hash, p_source, case when p_source = 'web' then 'pending' else 'confirmed' end,
    p_trip->>'language', btrim(p_trip->>'pickup'), btrim(p_trip->>'destination'), pickup_time,
    booking_private.paris_time(p_trip->>'return_time'), (p_trip->>'passengers')::int,
    btrim(p_trip->>'passenger_name'), btrim(p_trip->>'passenger_phone'), nullif(btrim(p_trip->>'passenger_notes'), ''), (p_trip->>'estimated_minutes')::int
  ) returning * into saved;

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
  if p_schedule is not null then
    if p_status <> 'confirmed' or jsonb_typeof(p_schedule) <> 'object' then
      raise sqlstate '22023' using message = 'INVALID_RESCHEDULE';
    end if;
    if p_schedule ? 'estimated_minutes' then
      duration := (p_schedule->>'estimated_minutes')::integer;
    end if;
    if p_schedule ? 'pickup_time' then
      if saved.status <> 'confirmed' then
        raise sqlstate '22023' using message = 'INVALID_RESCHEDULE';
      end if;
      pickup_time := booking_private.paris_time(p_schedule->>'pickup_time');
      return_time := booking_private.paris_time(p_schedule->>'return_time');
    end if;
  end if;
  if p_status = 'confirmed' and (pickup_time is null or pickup_time <= now()) then
    raise sqlstate '22007' using message = 'PICKUP_MUST_BE_FUTURE';
  end if;

  update booking_private.ride
    set status = p_status, version = version + 1, pickup_at = pickup_time, return_at = return_time,
      estimated_minutes = duration, driver_notes = coalesce(p_driver_notes, driver_notes)
    where reference = p_reference
    returning * into saved;
  return to_jsonb(saved) - 'request_key_hash' - 'request_hash';
end;
$$;

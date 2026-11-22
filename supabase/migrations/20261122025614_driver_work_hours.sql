create table booking_private.work_hours (
  singleton boolean primary key default true check (singleton),
  revision integer not null default 0,
  hours jsonb
);

alter table booking_private.work_hours enable row level security;
revoke all on booking_private.work_hours from public, anon, authenticated;
insert into booking_private.work_hours default values;

create function booking_private.get_work_hours()
returns jsonb language plpgsql stable security definer set search_path = ''
as $$
begin
  perform booking_private.require_driver();
  return (select jsonb_build_object('revision', revision, 'hours', hours) from booking_private.work_hours);
end;
$$;

create function booking_private.save_work_hours(p_revision integer, p_hours jsonb)
returns jsonb language plpgsql security definer set search_path = ''
as $$
declare
  period jsonb;
  saved booking_private.work_hours;
begin
  perform booking_private.require_driver();
  if p_revision is null or p_revision < 0 or (case when jsonb_typeof(p_hours) = 'array'
      then jsonb_array_length(p_hours) <> 7 else true end) then
    raise sqlstate '22023' using message = 'INVALID_WORK_HOURS';
  end if;

  for period in select value from jsonb_array_elements(p_hours) loop
    if period = 'null'::jsonb then continue; end if;
    if (case when jsonb_typeof(period) = 'array' then
        jsonb_array_length(period) <> 2
        or coalesce(period->>0, '') !~ '^([01][0-9]|2[0-3]):[0-5][0-9]$'
        or coalesce(period->>1, '') !~ '^([01][0-9]|2[0-3]):[0-5][0-9]$'
        or period->>0 = period->>1
      else true end) then
      raise sqlstate '22023' using message = 'INVALID_WORK_HOURS';
    end if;
  end loop;

  update booking_private.work_hours
    set hours = p_hours, revision = revision + 1
    where revision = p_revision and hours is distinct from p_hours
    returning * into saved;
  if not found then
    select * into saved from booking_private.work_hours;
    if saved.hours is distinct from p_hours then
      raise sqlstate 'PT409' using message = 'WORK_HOURS_CHANGED';
    end if;
  end if;
  return jsonb_build_object('revision', saved.revision, 'hours', saved.hours);
end;
$$;

create function public.get_work_hours()
returns jsonb language sql stable set search_path = ''
as $$ select booking_private.get_work_hours(); $$;

create function public.save_work_hours(p_revision integer, p_hours jsonb)
returns jsonb language sql set search_path = ''
as $$ select booking_private.save_work_hours(p_revision, p_hours); $$;

revoke execute on function booking_private.get_work_hours(), booking_private.save_work_hours(integer, jsonb),
  public.get_work_hours(), public.save_work_hours(integer, jsonb) from public, anon, authenticated;
grant execute on function booking_private.get_work_hours(), booking_private.save_work_hours(integer, jsonb),
  public.get_work_hours(), public.save_work_hours(integer, jsonb) to authenticated;

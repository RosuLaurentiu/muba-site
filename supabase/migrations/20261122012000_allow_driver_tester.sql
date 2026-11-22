create table booking_private.driver_tester (
  singleton boolean primary key default true check (singleton),
  user_id uuid not null references auth.users (id) on delete cascade
);

alter table booking_private.driver_tester enable row level security;
revoke all on booking_private.driver_tester from public, anon, authenticated;

create or replace function booking_private.require_driver()
returns void
language plpgsql stable set search_path = ''
as $$
declare
  account_id uuid := auth.uid();
begin
  if not exists (select from booking_private.driver where user_id = account_id)
      and not exists (select from booking_private.driver_tester where user_id = account_id) then
    raise sqlstate '42501' using message = 'DRIVER_REQUIRED';
  end if;
end;
$$;

create or replace function booking_private.calendar_status()
returns jsonb language plpgsql stable security definer set search_path = ''
as $$
begin
  perform booking_private.require_driver();
  if not exists (select from booking_private.driver where user_id = auth.uid()) then
    return jsonb_build_object('can_manage', false, 'calendar_id', null, 'outstanding', '[]'::jsonb);
  end if;
  return jsonb_build_object(
    'can_manage', true,
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

create table booking_private.schedule_revision (
  singleton boolean primary key default true check (singleton),
  revision bigint not null default 0
);
alter table booking_private.schedule_revision enable row level security;
revoke all on booking_private.schedule_revision from public, anon, authenticated;
insert into booking_private.schedule_revision default values;

create function booking_private.bump_schedule_revision()
returns trigger language plpgsql set search_path = '' as $$
begin
  update booking_private.schedule_revision set revision = revision + 1 where singleton;
  return null;
end;
$$;
revoke execute on function booking_private.bump_schedule_revision() from public, anon, authenticated;

create trigger ride_schedule_revision after insert or update or delete on booking_private.ride
  for each row execute function booking_private.bump_schedule_revision();
create trigger block_schedule_revision after insert or update or delete on booking_private.time_block
  for each row execute function booking_private.bump_schedule_revision();

create or replace function booking_private.driver_booking_alerts()
returns jsonb language plpgsql stable security definer set search_path = '' as $$
begin
  perform booking_private.require_driver();
  return (
    select jsonb_build_object('count', count(*), 'latest', max(reference)::text,
      'revision', (select revision::text from booking_private.schedule_revision where singleton))
    from booking_private.ride where source = 'web' and status = 'pending'
  );
end;
$$;

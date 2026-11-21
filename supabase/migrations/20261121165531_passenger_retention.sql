alter table booking_private.ride add column final_decision_at timestamptz;

-- Existing terminal rides have no recorded decision time. Give them the full retention period.
update booking_private.ride set final_decision_at = now()
where status in ('declined', 'cancelled');

create function booking_private.record_final_decision()
returns trigger language plpgsql set search_path = '' as $$
begin
  if new.status in ('declined', 'cancelled') then
    new.final_decision_at := now();
  end if;
  return new;
end;
$$;

create trigger ride_final_decision before update of status on booking_private.ride
  for each row when (old.status is distinct from new.status)
  execute function booking_private.record_final_decision();

create function booking_private.purge_expired_rides()
returns integer language plpgsql set search_path = '' as $$
declare
  removed integer;
begin
  delete from booking_private.ride
  where coalesce(final_decision_at,
    coalesce(return_at, pickup_at) + make_interval(mins => coalesce(estimated_minutes, 0))
  ) <= now() - interval '90 days';
  get diagnostics removed = row_count;
  return removed;
end;
$$;

revoke execute on function booking_private.record_final_decision(), booking_private.purge_expired_rides()
  from public, anon, authenticated, service_role;

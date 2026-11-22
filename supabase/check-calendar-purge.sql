-- Run after the daily purge on installations that use or previously used Calendar.
do $$
declare
  pending bigint;
begin
  select count(*) into pending
  from booking_private.calendar_job as job
  where not job.active and job.synced_revision < job.revision
    and not exists (
      select from booking_private.ride as ride where ride.reference = job.ride_reference
    );
  if pending > 0 then
    raise exception 'Calendar deletions awaiting confirmation after booking purge: %', pending;
  end if;
end;
$$;

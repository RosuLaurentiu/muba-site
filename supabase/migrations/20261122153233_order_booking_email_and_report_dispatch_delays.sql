alter table booking_private.booking_email
  add column superseded boolean not null default false,
  add column template text check (template in ('confirmed_receipt', 'trip_changed'));

-- Keep completed history and existing leases. Only the newest rider decision may be retried.
update booking_private.booking_email as older set superseded = true
where older.sent_at is null and older.kind not in ('receipt', 'driver_new') and exists (
  select from booking_private.booking_email as newer
  where newer.reference = older.reference and newer.recipient = older.recipient
    and newer.version > older.version and newer.kind not in ('receipt', 'driver_new')
);

create or replace function booking_private.notify_ride_change()
returns trigger language plpgsql set search_path = '' as $$
declare
  event_kind text;
begin
  if new.status <> old.status then
    event_kind := new.status;
  elsif new.status = 'confirmed' and
      (new.pickup_at, new.return_at, new.pickup, new.destination) is distinct from
      (old.pickup_at, old.return_at, old.pickup, old.destination) then
    event_kind := 'changed';
  end if;
  if event_kind is not null then
    update booking_private.booking_email set superseded = true
    where reference = new.reference and sent_at is null and not superseded
      and kind not in ('receipt', 'driver_new');
    perform booking_private.queue_rider_email(new, event_kind);
  end if;
  return new;
end;
$$;

create or replace trigger notify_ride_change
  after update of status, pickup_at, return_at, pickup, destination on booking_private.ride
  for each row execute function booking_private.notify_ride_change();

create or replace function booking_private.claim_booking_email()
returns setof booking_private.booking_email language sql security definer set search_path = '' as $$
  with expired as (
    update booking_private.booking_email set receipt_key = null
    where receipt_key is not null and first_attempt <= now() - interval '23 hours'
  ), candidate as (
    select email.id from booking_private.booking_email as email
    where email.sent_at is null and not email.superseded and email.next_attempt <= now()
      and (email.first_attempt is null or email.first_attempt > now() - interval '23 hours')
      and (email.driver_user_id is null or exists (
        select from booking_private.assigned_google_email() as driver
        where driver.user_id = email.driver_user_id and driver.address = email.recipient
      ))
      and not exists (
        select from booking_private.booking_email as older
        where older.reference = email.reference and lower(older.recipient) = lower(email.recipient)
          and (older.version, older.kind <> 'receipt') < (email.version, email.kind <> 'receipt')
          and older.sent_at is null and (
            -- An in-flight worker still owns its lease even if a later decision superseded it.
            (older.lease is not null and older.next_attempt > now()) or
            (not older.superseded and (older.first_attempt is null or older.first_attempt > now() - interval '23 hours')
              and (older.driver_user_id is null or exists (
                select from booking_private.assigned_google_email() as driver
                where driver.user_id = older.driver_user_id and driver.address = older.recipient
              )))
          )
      )
    order by email.next_attempt, email.queued_at, email.id
    limit 10 for update of email skip locked
  )
  update booking_private.booking_email as email
    set first_attempt = coalesce(email.first_attempt, now()), lease = gen_random_uuid(),
        next_attempt = now() + interval '5 minutes',
        -- Freeze the payload on first claim, including older jobs with an ambiguous provider result.
        template = case when email.first_attempt is not null then email.template
          when email.kind = 'changed' then 'trip_changed'
          when email.kind = 'receipt' and ride.source <> 'web' then 'confirmed_receipt' end
    from candidate, booking_private.ride as ride
    where email.id = candidate.id and ride.reference = email.reference
    returning email.*;
$$;

create or replace function booking_private.booking_email_failures()
returns jsonb language plpgsql stable security definer set search_path = '' as $$
begin
  perform booking_private.require_driver();
  return (
    select jsonb_build_object(
      'retryable', count(*) filter (where first_attempt > now() - interval '23 hours'),
      'expired', count(*) filter (where first_attempt <= now() - interval '23 hours'),
      'overdue', count(*) filter (where first_attempt is null),
      'oldest_overdue_minutes', floor(extract(epoch from
        (now() - min(queued_at) filter (where first_attempt is null))) / 60)::integer
    ) from booking_private.booking_email as email
    where sent_at is null and not superseded and
      ((first_attempt is null and queued_at <= now() - interval '2 minutes') or
       ((lease is null and failed) or (lease is not null and next_attempt <= now())))
      and (email.driver_user_id is null or exists (
        select from booking_private.assigned_google_email() as driver
        where driver.user_id = email.driver_user_id and driver.address = email.recipient
      ))
  );
end;
$$;

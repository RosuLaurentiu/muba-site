alter table booking_private.booking_email
  add column driver_user_id uuid references auth.users (id) on delete cascade,
  drop constraint booking_email_kind_check,
  add constraint booking_email_kind_check check (
    (driver_user_id is null and kind in ('receipt', 'confirmed', 'changed', 'declined', 'cancelled'))
    or (driver_user_id is not null and kind = 'driver_new')
  );

create index booking_email_driver_idx on booking_private.booking_email (driver_user_id) where driver_user_id is not null;
create index pending_web_ride_idx on booking_private.ride (reference desc) where source = 'web' and status = 'pending';

create function booking_private.assigned_google_email()
returns table (user_id uuid, address text) language sql stable set search_path = '' as $$
  select driver.user_id, identity.identity_data->>'email'
  from booking_private.driver as driver
  join auth.identities as identity on identity.user_id = driver.user_id
  where identity.provider = 'google'
    and identity.identity_data->'email_verified' = 'true'::jsonb
    and char_length(identity.identity_data->>'email') <= 254
    and identity.identity_data->>'email' ~* '^[a-z0-9.!#$%&''*+/=?^_`{|}~-]+@[a-z0-9-]+(\.[a-z0-9-]+)+$'
  order by identity.last_sign_in_at desc nulls last, identity.id
  limit 1;
$$;

create function booking_private.notify_new_web_ride()
returns trigger language plpgsql set search_path = '' as $$
begin
  insert into booking_private.booking_email
    (reference, version, kind, recipient, language, pickup_at, return_at, driver_user_id)
  select new.reference, new.version, 'driver_new', address, new.language, new.pickup_at, new.return_at, user_id
  from booking_private.assigned_google_email();
  return new;
end;
$$;

create trigger notify_new_web_ride after insert on booking_private.ride
  for each row when (new.source = 'web') execute function booking_private.notify_new_web_ride();

create or replace function booking_private.claim_booking_email()
returns setof booking_private.booking_email language sql security definer set search_path = '' as $$
  with candidate as (
    select email.id from booking_private.booking_email as email
    where email.sent_at is null and email.next_attempt <= now()
      and (email.first_attempt is null or email.first_attempt > now() - interval '23 hours')
      and (email.driver_user_id is null or exists (
        select from booking_private.assigned_google_email() as driver
        where driver.user_id = email.driver_user_id and driver.address = email.recipient
      ))
    order by email.next_attempt, email.queued_at, email.id
    limit 10
    for update skip locked
  )
  update booking_private.booking_email as email
    set first_attempt = coalesce(email.first_attempt, now()), lease = gen_random_uuid(),
        next_attempt = now() + interval '5 minutes'
    from candidate where email.id = candidate.id
    returning email.*;
$$;

create or replace function booking_private.booking_email_failures()
returns jsonb language plpgsql stable security definer set search_path = '' as $$
begin
  perform booking_private.require_driver();
  return jsonb_build_object(
    'retryable', count(*) filter (where first_attempt > now() - interval '23 hours'),
    'expired', count(*) filter (where first_attempt <= now() - interval '23 hours')
  ) from booking_private.booking_email as email
  where sent_at is null and (failed or (lease is not null and next_attempt <= now()))
    and (email.driver_user_id is null or exists (
      select from booking_private.assigned_google_email() as driver
      where driver.user_id = email.driver_user_id and driver.address = email.recipient
    ));
end;
$$;

create or replace function booking_private.retry_booking_email()
returns void language plpgsql security definer set search_path = '' as $$
begin
  perform booking_private.require_driver();
  update booking_private.booking_email as email set next_attempt = now()
  where sent_at is null and failed and lease is null and first_attempt > now() - interval '23 hours'
    and (email.driver_user_id is null or exists (
      select from booking_private.assigned_google_email() as driver
      where driver.user_id = email.driver_user_id and driver.address = email.recipient
    ));
end;
$$;

create function booking_private.driver_booking_alerts()
returns jsonb language plpgsql stable security definer set search_path = '' as $$
begin
  perform booking_private.require_driver();
  return (
    select jsonb_build_object('count', count(*), 'latest', max(reference)::text)
    from booking_private.ride where source = 'web' and status = 'pending'
  );
end;
$$;

create function public.driver_booking_alerts()
returns jsonb language sql stable set search_path = '' as $$
  select booking_private.driver_booking_alerts();
$$;

revoke execute on function booking_private.assigned_google_email(), booking_private.notify_new_web_ride(),
  booking_private.driver_booking_alerts(), public.driver_booking_alerts() from public, anon, authenticated;
grant execute on function booking_private.driver_booking_alerts(), public.driver_booking_alerts() to authenticated;

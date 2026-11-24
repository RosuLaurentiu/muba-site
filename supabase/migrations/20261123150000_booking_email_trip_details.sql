-- Copy the trip onto each queued email so the message shows the ride as it was when the email was queued.
-- Passenger names, phone numbers and notes stay out of the outbox. The copy is deleted with its ride.
alter table booking_private.booking_email
  add column pickup text,
  add column destination text,
  add column passengers integer,
  add column agreed_fare_cents integer,
  add column estimated_fare_cents integer;

create function booking_private.copy_email_trip_details()
returns trigger language plpgsql set search_path = '' as $$
begin
  select ride.pickup, ride.destination, ride.passengers, ride.agreed_fare_cents, ride.estimated_fare_cents
    into new.pickup, new.destination, new.passengers, new.agreed_fare_cents, new.estimated_fare_cents
  from booking_private.ride as ride where ride.reference = new.reference;
  return new;
end;
$$;

revoke execute on function booking_private.copy_email_trip_details() from public, anon, authenticated;

create trigger copy_email_trip_details before insert on booking_private.booking_email
  for each row execute function booking_private.copy_email_trip_details();

-- Emails not yet attempted take the current trip. Emails already attempted stay without the copy.
update booking_private.booking_email as email
  set pickup = ride.pickup, destination = ride.destination, passengers = ride.passengers,
      agreed_fare_cents = ride.agreed_fare_cents, estimated_fare_cents = ride.estimated_fare_cents
from booking_private.ride as ride
where ride.reference = email.reference and email.sent_at is null and email.first_attempt is null;

# Pilot preparation

## Environment and roles

- Local rehearsal used Supabase with fictional bookings and local email capture.
  The deployed test environment, sender, and first live test still require
  approval.
- Pilot roles are the owner, the assigned driver, and invited regular riders.
  Use fictional data to verify the setup before sending invitations. The
  proposed fallback is the existing phone or WhatsApp contact.
- Confirm who watches the driver inbox, checks failed or missed alerts, and
  handles rider support before launch. Pause if requests go unnoticed,
  registrations are lost, or the recovery checks fail. Record the owner's
  go-or-hold decision before sending invitations.

## Local data safeguards

- Confirmed ride data became eligible at the 90-day cutoff after its finish.
  A ride whose return leg ended later stayed available. A recent final
  decision kept the booking past its old pickup date, and an expired
  decision removed a booking even if its former pickup was in the future.
- The expired booking's contact and delivery rows cascaded. Its Calendar
  removal stayed queued, and a second purge removed nothing.
- A fictional export was encrypted with AES-GCM before being written to disk.
  The local rehearsal kept seven dated copies, decrypted the newest one into
  a separate test database, and used the original private link key to fetch
  the restored booking. The opt-in recipient was also restored. No real
  passenger data or recovery keys were used.

## Remaining pilot checks

- [MS-002 walkthrough](../../tasks/ms-002%20-%20Revamp-Private-Taxi-Paris-for-rider-reservations-and-driver-scheduling.md)
  needs an approved, phone-accessible test deployment.
- [MS-010 booking rules](../../tasks/ms-010%20-%20Agree-the-booking-rules-for-the-Paris-taxi-service.md)
  still need owner and driver review.
- [MS-009 travel buffer](../../tasks/ms-009%20-%20Allow-travel-time-between-consecutive-driver-pickups.md)
  has an adjustable one-hour draft advisory pending driver review.
- Local email capture validates retry and delivery logic. A live test must
  still confirm the driver receives an alert with the workspace closed and
  the opted-in rider receives a booking-change email.

# Google Calendar mirror verification

The owner chose local simulation for this stage. The checks used the local
Supabase Auth and Data API, fictional bookings, and simulated Google
responses. All provider calls were intercepted.

- The assigned driver connected a selected calendar through the simulated
  OAuth flow. A non-driver could not initiate the connection. The check
  covered one-time OAuth state, encryption at rest and reconnection errors.
- An accepted return booking produced separate outbound and return events.
  Confirmed phone and WhatsApp bookings each produced one event. Pending
  and declined requests produced none.
- Moving the time or pickup updated the existing event ID. Removing and
  re-adding a return leg replaced its old event without a duplicate.
  Cancelling a ride removed its events. The check covered the repeated
  Paris hour at the autumn daylight-saving transition.
- The event showed pickup, a Paris timestamp, a known finish when present,
  and a link to the signed-in ride detail. The payload omitted passenger
  phone, names and private notes.
- A lost response after event creation left a failed job. Retrying kept one
  event per leg. A change while an older sync was in flight left the newer
  revision pending until the mirror caught up. In Chromium at 390 px the
  driver saw the failed ride in EN and FR, retried and cleared it. The saved
  ride remained available throughout.
- The local Supabase Edge gateway handled browser preflight and rejected
  anonymous, invalid and authenticated non-driver sessions. With fictional
  OAuth settings, the assigned driver obtained an authorization URL and the
  function saved one state record. The test did not follow the Google URL.

Actual create, update and delete on an authorized Google test calendar
remain unverified. The local UI and worker use an owned calendar and support
reconnecting that calendar. No hosted resources or Google events were
created.

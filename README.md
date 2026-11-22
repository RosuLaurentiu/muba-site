# Muba Site React App

This Vite and React site accepts advance requests for a private taxi in Paris.
A saved request has a booking reference and stays pending until the driver
confirms it. The private status link shows the latest decision.

## Commands

- `npm install`
- `npm run dev`
- `npm run build`
- `npm run preview`

## Local booking database

The booking API uses Supabase Auth and PostgreSQL. Start Docker and run these
commands from this repository. The CLI configuration uses PostgreSQL 17
and was verified with Supabase CLI 3.2.0.

```powershell
# Create this network once to keep the published ports on loopback.
docker network create --driver bridge --opt com.docker.network.bridge.host_binding_ipv4=127.0.0.1 muba-site-local
npx --yes supabase@3.2.0 start --network-id muba-site-local -x realtime,storage-api,imgproxy,mailpit,postgres-meta,studio,edge-runtime,logflare,vector,supavisor | Out-Null
npx --yes supabase@3.2.0 status -o json 2>$null | node supabase/tests/ride-storage.mjs
npx --yes supabase@3.2.0 status -o json 2>$null | node supabase/tests/intake-limits.mjs
npx --yes supabase@3.2.0 db advisors --level warn --fail-on warn
node supabase/tests/rider-input.mjs
node supabase/tests/schedule.mjs
node supabase/tests/work-hours.mjs
```

The `supabase/tests/work-hours.sql` check runs on an unassigned local stack
with the working-hours migration applied. It rolls back its fixtures.

Run the integration test on an unassigned local stack. It provisions two
fictional users through local Auth and removes the users and its bookings after
the check. Status JSON is piped to the test without printing credentials. Run
`npx --yes supabase@3.2.0 stop` when the local stack is no longer needed.

Public sign-up is disabled. A database administrator assigns an existing Auth
user to `booking_private.driver` as the primary driver. The administrator can
assign a different existing Auth user to `booking_private.driver_tester` for
testing. Both can use the same schedule and booking records. Booking alerts
and the shared Google Calendar connection belong to the primary driver.
Remove the tester row to revoke workspace access. Keep `booking_private`
outside the exposed Data API schemas.

- `save_ride` takes `p_trip` with `passenger_email` and a new UUID v4 `p_request_key`. Use the same
  key and payload on retry. The key also acts as the rider's private access
  credential. Keep it out of logs and use it only with the rider's booking.
  The ride stores its hash. The private receipt queue keeps the key until
  delivery or the end of the retry window. Anonymous saves create pending web rides.
  The driver can also save a confirmed phone or WhatsApp ride via `p_source`.
- `get_ride` takes the private key and returns a limited rider view. The
  reference identifies the ride but does not grant access.
- `list_rides` and `change_ride` require the assigned driver's authenticated
  session. A change includes the current `p_version`. On a conflict, reload the
  ride before submitting a new decision. To confirm a pending web request,
  include `agreed_fare_cents` as a positive integer and `fare_accepted: true`
  in `p_schedule`. The driver can open a quote email from the ride details or
  use WhatsApp, then records the total after the rider accepts it. Rider
  email is available through the signed-in driver list. Existing confirmed rides and manual
  bookings can be managed without a new quote.
- Send pickup and return as local Paris values (`YYYY-MM-DDTHH:mm`). The
  database returns absolute timestamps for display in Paris time. It rejects
  nonexistent spring clock times and resolves the repeated autumn hour to
  standard time.

To connect the rider form to the local stack, set these variables in the
terminal that runs Vite. Only the publishable key belongs in browser code.

```powershell
$supabaseStatus = npx --yes supabase@3.2.0 status -o json 2>$null | ConvertFrom-Json
$env:VITE_SUPABASE_URL = $supabaseStatus.API_URL
$env:VITE_SUPABASE_PUBLISHABLE_KEY = $supabaseStatus.PUBLISHABLE_KEY
npm run dev -- --host 127.0.0.1
```

Add `?driver` to the local site URL and sign in with the assigned driver's
email and password. Pending requests and confirmed work have separate lists.
The driver can open a ride, use its passenger contact or pickup directions,
and accept or decline a pending request. Refresh to load new requests.

To enable Google sign-in locally, use a separate Google Web application OAuth
client with the authorized redirect URI `http://127.0.0.1:54321/auth/v1/callback`.
While the Google project is in Testing, add both approved Google accounts as
test users. In the ignored project-root `.env`, set
`SUPABASE_AUTH_EXTERNAL_GOOGLE_ENABLED=true` and set
`SUPABASE_AUTH_EXTERNAL_GOOGLE_CLIENT_ID` and `SUPABASE_AUTH_EXTERNAL_GOOGLE_SECRET`
to the test client's credentials. Keep the secret on the server side. Restart
local Supabase and open `http://127.0.0.1:5173/?driver`.

Create each Auth account with the verified email of its Google account. Assign
the account IDs in the primary and tester tables. Supabase links each Google
identity to its existing account. The sign-in flow requests basic Google
identity. Connect Google Calendar separately from the primary workspace.

For hosted Google sign-in, use the approved Supabase project's
`/auth/v1/callback` as the Google OAuth redirect URI. Add
`https://privatetaxiparis.com/?driver&google-sign-in` to the Supabase redirect
allowlist when testing against the public domain. Use the corresponding URL
for a separate test site.

For production, use `privatetaxiparis@gmail.com` for the public contact and the
assigned driver's verified sign-in. Confirm that the backend is the approved
production project before provisioning or assigning the account. The Resend
sender remains the verified address on the site domain.

The driver workspace starts with the next pickup. On desktop, the daily agenda
sits beside the month calendar, with any pending requests above the calendar.
On a phone, the inbox comes first when requests are pending. Select a calendar
day to open its agenda, including pending, confirmed, cancelled and declined
rides. Earlier months show retained bookings.
The agenda lists each leg separately. Ride details group pickup directions with
the trip and contact actions with the passenger information. The driver can
record phone or WhatsApp bookings, reschedule a confirmed ride, and cancel it.
The rider form and **Add ride** use the same passenger selector. Both start at
one passenger and use the largest configured vehicle capacity. Muba styles the
UI SDK Select to match the existing Light and Dark controls.
Use the calendar button or type a date in day/month/year order. Enter hours
and minutes directly on a 24-hour clock. The rider can switch off round trip
temporarily and still recover the return date and time when switching it back on.
Use **Working hours** in the agenda to set a regular week in Paris time. Check
each day when a shift starts. An end time earlier than the start means the
shift ends the following day. **Block time** still applies to one-off changes.
The agenda shows that day's hours. A pending request with a pickup outside
these hours has a warning in the driver workspace and can still be reviewed
and confirmed. Changing hours does not change existing rides or time blocks.
After saving a ride or block, return to the same selected day. If a refresh
fails, the workspace identifies the
last loaded schedule and offers another refresh. The save controls show overlaps
with rides and blocks before writing, and the database checks again during
each write. With no finish estimate, the schedule reserves the pickup minute
and shows the unknown finish. Ride previews show the minutes available
between successive legs after deducting intervening blocks. If the prior
finish is unknown, the preview identifies that gap as unknown.
The preview starts with a draft target of 60 minutes. Adjust the advisory
target to the locations during review. A short gap or unknown finish shows a
warning. The driver still has to approve the travel-buffer rule.

Use the local stack for development and verification. Ask the owner before
creating or modifying a hosted project.
The hosted build needs the hosted Supabase URL and publishable key before
release. Avoid publishing a build configured for the local stack.
For GitHub Pages, set `VITE_SUPABASE_URL` and
`VITE_SUPABASE_PUBLISHABLE_KEY` as configuration variables on the
`github-pages` environment. Use the backend intended for the public site.
For a test build, pass the test project's values to Vite separately.

The owner approved a Supabase Free project in Paris at no subscription cost
within Free limits. The release plan removes passenger data 90 days after the
ride or final decision. Keep one encrypted database export per operating day
for seven days and verify a restore locally before release. These are approved
operating terms. Purge automation and the backup and restore procedure must
be in place before release.

The retention migration records the final decision for declines and
cancellations. Other rides use the final scheduled leg. A privileged
database job can run `booking_private.purge_expired_rides()` after release
approval. The purge also removes the rider email and its delivery records,
and queues removals of the ride's mirrored Calendar events.

Run the recovery rehearsal in PowerShell 7.4 or later with local Supabase
running.

```powershell
.\supabase\tests\pilot-retention.ps1
```

It uses two disposable databases, fictional data, and a one-time encryption
key. It checks the intake pause, 90-day cutoff, seven dated encrypted copies
and a private booking lookup after restore. Before public release, verify the
scheduled purge and export on the approved environment. Store the export key
separately from the archives.

### Run the retention and recovery jobs

Use an owner-approved scheduler and a dedicated archive directory. Run the
purge daily through a privileged database connection. Run the encrypted export
once per operating day. Use a PostgreSQL client compatible with the target
server. Set `PGSERVICE` through the approved connection configuration and
load the 32-byte `$archiveKey` from secret storage before running the export.

```powershell
psql -X --no-password -v ON_ERROR_STOP=1 -c 'select booking_private.purge_expired_rides();'
# Run the export under its approved PostgreSQL service.
. .\supabase\booking-archive.ps1
Export-BookingArchive -Directory $archiveDirectory -Key $archiveKey
```

Export names use the Paris date. The script replaces a same-day archive and
expires copies older than six days only after the new encrypted file is
written. The export and restore hold the dump in memory. Verify that the
scheduler has enough memory for the hosted dump and alert the operator if
either job fails or an expected archive is missing.

For a restore rehearsal, set `PGSERVICE` to an empty, isolated recovery
database and use the separately stored key. Verify a fictional booking by
its private status link after restoring.

```powershell
. .\supabase\booking-archive.ps1
Restore-BookingArchive -Path $archivePath -Key $archiveKey -Arguments @('--single-transaction', '--no-password', '--dbname', 'service=muba-restore')
```

### Web request limits

`save_ride` requires at least two hours between submission and pickup for new
web requests. For shorter notice, use Call or WhatsApp. The driver can save a
short-notice ride directly. A retry of a saved request returns the original
booking, including after its pickup enters the two-hour window.

`save_ride` accepts at most 10 web requests per hour and 30 per day across
all riders. Above either limit it refuses new web requests with
`WEB_INTAKE_LIMIT`, and the rider sees the phone and WhatsApp fallback. A retry
with an already saved key still returns that booking. The web form accepts at
most 3 new bookings per rider email address in a rolling day so every accepted
booking can receive a receipt. Driver-entered phone and WhatsApp rides can be
saved for the same address and also receive receipts. These limits keep
scripted requests within a small daily email volume.
The owner approved these numbers under MS-017. Verify them on the hosted
release candidate. Change them in a new migration.

A confirmed round trip can keep an outbound pickup that already happened while
the driver moves the return. Every moved leg must be in the future.

### Pause public booking intake

Rehearse this on the test database. A database administrator can apply the
pause to the approved production backend if requests go missing, booking
status and driver decisions disagree, passenger data is exposed, or recovery
fails. Revoke the anonymous save grants so riders can still open their
private status links and the driver can manage existing and manual rides.

```sql
revoke execute on function public.save_ride(uuid, jsonb, text),
  booking_private.save_ride(uuid, jsonb, text) from anon;
```

Check that a fictional web request is refused and shows the phone and WhatsApp
fallback. Check that an existing private status link and the assigned driver
workspace remain available. Restore intake after the failure is resolved and
the owner approves reopening.

```sql
grant execute on function public.save_ride(uuid, jsonb, text),
  booking_private.save_ride(uuid, jsonb, text) to anon;
```

Verify a fictional pending web request after reopening. The rider's Retry
button uses the same key and details if the pause began during a submission.

## Google Calendar mirror

The driver can connect an owned calendar by its exact Calendar ID from Google
Calendar settings. The app is the source of truth. Changes to a confirmed ride
queue one event per leg. The event contains pickup, Paris time, an estimated
finish if known, and a link to the signed-in ride. Calendar edits are outside
the workflow.
When the finish is unknown, Calendar shows a one-minute pickup and the event
description says the finish time is unknown.

The driver workspace attempts sync when it loads or saves a change. If a
connection or delivery fails, the ride stays saved. Expand **Google Calendar**
to see unsynced rides, reconnect if needed, and retry. Reconnect to the same
calendar to preserve existing event identities.

Run the simulation against the local Supabase stack described above:

```powershell
npx --yes supabase@3.2.0 status -o json 2>$null | node supabase/tests/calendar-sync.mjs
deno check --no-config supabase/functions/calendar-sync/index.ts
```

The simulation uses local Auth and PostgreSQL plus simulated Google responses.
For a separate authorized Google test, the Edge Function needs
`GOOGLE_CALENDAR_CLIENT_ID`, `GOOGLE_CALENDAR_CLIENT_SECRET`,
`GOOGLE_CALENDAR_REDIRECT_URI`, `MUBA_APP_URL`, and
`MUBA_CALENDAR_ENCRYPTION_KEY` (64 hex characters from a secure generator).
Supply them through the function runtime's secret configuration. Use the
app URL and the exact `calendar-sync` callback URL for the test environment.
Retain the encryption key for reconnect and recovery. The authorized
test-calendar check requires the owner's approval before any external action.

When serving the function locally, use the same Docker network as the stack:
`npx --yes supabase@3.2.0 functions serve calendar-sync --network-id muba-site-local --env-file <local-secret-file>`.

## Booking emails

Every new booking needs an email address. The driver enters it when saving a
phone or WhatsApp ride. Both entry points send a receipt with the reservation
number and the private tracking link and email later changes. The web receipt
page also shows the same link. The private email queue commits with the
booking. Existing bookings keep their current access and email settings.

Riders review their trip and estimate before entering passenger details. They
can edit the trip without losing those details. If a rider cannot verify a
save, **Retry request** repeats the same request. The private booking page
shows the current decision, with Paris times for each leg.

Run the local delivery test on an unassigned stack with an empty email queue.
The test starts a loopback mail capture server and uses fictional addresses.

```powershell
npx --yes supabase@3.2.0 status -o json 2>$null | node supabase/tests/booking-email.mjs
deno check --no-config supabase/functions/booking-email/index.ts
```

For live delivery, obtain owner approval for the sender, provider and email
limits before setup. The server-side function accepts a POST at
`/functions/v1/booking-email` with `Authorization: Bearer <worker token>`.
Configure `MUBA_EMAIL_WORKER_TOKEN`, `MUBA_EMAIL_FROM`,
`MUBA_EMAIL_API_KEY` and `MUBA_APP_URL` in the function runtime. Use the
approved app URL for that environment and keep link click tracking disabled
on the sending domain. Schedule the POST at a regular
interval. The function uses the Resend email endpoint by default. Set
`MUBA_EMAIL_API_URL` to use a local capture endpoint when serving the function
locally. Keep the worker token and mail API key off the frontend.

The driver workspace shows failed deliveries. If the delivery status is
unavailable, select **Check email status** to load it again.
**Retry booking emails** queues another attempt and leaves the ride unchanged. The worker
reuses the same delivery ID for up to 23 hours after its first attempt.
Deliveries outside that window stay visible for manual follow-up.

## Driver booking alerts

The open driver workspace checks for pending web requests every 15 seconds.
The alert shows the pending count and links to the latest request. The driver
must still be assigned to see it. New web requests also queue one email to the
verified Google email linked to the assigned driver's Supabase account.
The agenda shows the next pickup, call and directions before the day list.
Opening a return leg shows directions to its pickup. After a ride or time
block save, the selected day stays available when returning to the agenda.
Phone and WhatsApp rides entered by the driver do not queue alerts. Google
Calendar uses its own consent.

Set `MUBA_APP_URL` in the email worker runtime to include a link to the
driver-only ride screen. The local booking email test also checks driver
recipient selection, manual ride exclusion, and assignment removal.

## Main files

- `src/App.jsx` renders trip entry, review, receipt, and private status.
- `src/booking.js` contains Paris time validation and the booking API client.
- `src/App.css` contains the light and dark layouts.
- `src/i18n.js` contains the English and French translations.
- `src/config.js` contains your business details and integration settings.

## Configuration

Update `src/config.js` with your real:

- business name
- phone number
- email
- service area
- Google Maps API key
- pricing values

## Language behavior

The app supports English and French.

- On first load, it defaults to the device/browser language when available.
- If the visitor manually switches language, that choice is saved locally.
- The booking page and driver workspace start in Dark. Each remembers its own
  Light or Dark preference. Switching language or appearance preserves trip details.
- **Reserve a ride** focuses the pickup field. The footer links to the driver
  workspace, where the next pickup includes a passenger phone link and directions.

## Google Maps setup

The site uses Maps JavaScript API with Places Autocomplete and Directions
Service on its existing Google Cloud project. Use a browser key restricted
to the approved website origins and only the Maps services this app uses.
Manual addresses continue to work when suggestions fail. If no route is
returned, riders can still send an advance request without a fare estimate.

Run `node supabase/tests/fare.mjs` to verify the configured estimate rates.
The published domain passed a real public-landmark route. The restricted key
rejected localhost, so use simulated Maps responses for local browser checks.
Ask before changing Google Cloud restrictions or using a billable API.

## Integrations

- Google Maps powers autocomplete, map display, and fare estimates. If Maps is
  unavailable, type both addresses and send the request without a fare estimate.
- The contact links are separate ways to reach the driver. They do not submit
  the rider's form or include its passenger or trip details.

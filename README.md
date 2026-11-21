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
npx --yes supabase@3.2.0 db advisors --level warn --fail-on warn
node supabase/tests/rider-input.mjs
node supabase/tests/schedule.mjs
```

Run the integration test on an unassigned local stack. It provisions two
fictional users through local Auth and removes the users and its bookings after
the check. Status JSON is piped to the test without printing credentials. Run
`npx --yes supabase@3.2.0 stop` when the local stack is no longer needed.

Public sign-up is disabled. A database administrator assigns an existing Auth
user to `booking_private.driver`. The table allows one driver and has no
client write access. Keep the `booking_private` schema outside the exposed
Data API schemas.

- `save_ride` takes `p_trip` and a new UUID v4 `p_request_key`. Use the same
  key and payload on retry. The key also acts as the rider's private access
  credential. Keep it out of logs and use it only with the rider's booking.
  The database stores its hash. Anonymous saves create pending web rides.
  The driver can also save a confirmed phone or WhatsApp ride via `p_source`.
- `get_ride` takes the private key and returns a limited rider view. The
  reference identifies the ride but does not grant access.
- `list_rides` and `change_ride` require the assigned driver's authenticated
  session. A change includes the current `p_version`. On a conflict, reload the
  ride before submitting a new decision.
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
While the Google project is in Testing, add the driver's Google account as a
test user. In the ignored project-root `.env`, set
`SUPABASE_AUTH_EXTERNAL_GOOGLE_ENABLED=true` and set
`SUPABASE_AUTH_EXTERNAL_GOOGLE_CLIENT_ID` and `SUPABASE_AUTH_EXTERNAL_GOOGLE_SECRET`
to the test client's credentials. Keep the secret on the server side. Restart
local Supabase and open `http://127.0.0.1:5173/?driver`.

Create the driver's Auth account with the same verified email as their Google
account, then assign that Auth user ID in `booking_private.driver`. Supabase
links the Google identity to the existing account. The sign-in flow requests
basic Google identity only. Connect Google Calendar separately in the driver
workspace if the driver wants calendar sync.

The day schedule uses Paris time and lists each leg separately. The driver
can browse upcoming days, block time, record phone or WhatsApp bookings,
reschedule a confirmed ride, and cancel it. The save controls show overlaps
with rides and blocks before writing, and the database checks again during
each write. With no finish estimate, the schedule reserves the pickup minute
and shows the unknown finish. Check travel time between adjacent rides.

Use the local stack for development and verification. Ask the owner before
creating or modifying a hosted project.
The hosted build needs the hosted Supabase URL and publishable key before
release. Avoid publishing a build configured for the local stack.

The owner approved a Supabase Free project in Paris at no subscription cost
within Free limits. The release plan removes passenger data 90 days after the
ride or final decision. Keep one encrypted database export per operating day
for seven days and verify a restore locally before release. These are approved
operating terms. Purge automation and the backup and restore procedure must
be in place before release.

## Google Calendar mirror

The driver can connect an owned calendar by its exact Calendar ID from Google
Calendar settings. The app is the source of truth. Changes to a confirmed ride
queue one event per leg. The event contains pickup, Paris time, an estimated
finish if known, and a link to the signed-in ride. Calendar edits are outside
the workflow.

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
- Light and Dark are available in both languages. Changing language or layout
  preserves the entered trip details.

## Integrations

- Google Maps powers autocomplete, map display, and fare estimates. If Maps is
  unavailable, type both addresses and send the request without a fare estimate.
- The contact links are separate ways to reach the driver. They do not submit
  the rider's form or include its passenger or trip details.

# Muba booking app audit

22 November 2026 · MS-022 · Local working tree on `codex/muba-release-readiness` at `72394f37f6934073897e52637b46225059992260`.

## What this repo does

Private Taxi Paris accepts advance ride requests in English and French. A driver confirms the fare, manages the agenda, and can send rider updates and mirror pickups to Google Calendar. This review assumes one operating driver, an authorized tester or second device on the same schedule, and the configured limit of 10 web requests per hour and 30 per day.

The working tree included existing changes to scheduling, configuration, translations and schedule tests. MS-016 identifies the base commit as the published release. Production behavior was not retested in this audit.

## Must fix

1. **The public backup promise exceeds the recorded production setup.** The rider notice says encrypted copies are kept for seven days. MS-015 records a successful fictional restore and an explicit deferral of the daily live backup. The hosted retention purge also awaits verification. After a production loss, there is no verified seven-day recovery window from the documented process. Align the English and French notice with actual operations now. Restore the stronger claim once an authorized production backup and an isolated restore have been verified. [Rider notice](../../../src/i18n.js#L118) · [Operating terms](../../../README.md#L150) · [MS-015](../../tasks/ms-015%20-%20Prepare-production-operations-for-booking.md)

2. **A rider can receive “Ride confirmed” after “Ride cancelled.”** In a rollback-only database check, a confirmation failed, the cancellation was claimed and marked sent, then a retry claimed the old confirmation. Each message has its own delivery ID, so deduplication cannot correct the order. Suppress superseded, unsent decision messages and serialize delivery for the same booking and recipient, including overlapping workers. Preserve delivery of the original private tracking link. [Queue claim](../../../supabase/migrations/20261122004449_send_tracking_receipt_for_every_booking.sql#L47) · [Worker](../../../supabase/functions/booking-email/handler.mjs#L66)

3. **A cancelled pickup can stay at the top of the driver’s agenda.** A second signed-in session cancelled the displayed next ride. The first browser received a successful alert poll and still offered directions to that pickup. Manual refresh removed it. The poll observes only the count and latest reference of pending web requests. Use the existing polling cycle to detect schedule changes, including confirmed rides and blocks, and reload the agenda when they change. [Poll](../../../src/DriverWorkspace.jsx#L416) · [Alert query](../../../supabase/migrations/20261121145544_driver_booking_alerts.sql#L89)

4. **Changing a pickup or destination alone sends no rider update.** The driver can save a new address with the original pickup time. The audit fixture changed the pickup on a confirmed ride and found zero change emails. The rider can wait at the old address. Include pickup and destination changes in the notification rule and use wording that tells the rider to check the updated trip. [Notification rule](../../../supabase/migrations/20261122004449_send_tracking_receipt_for_every_booking.sql#L23) · [Driver edit](../../../src/DriverSchedule.jsx#L315)

5. **A driver can lose the recovery path for a saved phone booking.** The browser test let the database commit a manual ride, then discarded the response. After pickup time passed, “Retry save” validated the frozen form as a new ride and sent zero requests. The driver cannot tell from that screen whether the booking exists. When an attempt already exists, resend its original key and payload before validating a new draft. The database already recognizes that retry. [Editor](../../../src/DriverSchedule.jsx#L300) · [Database retry](../../../supabase/migrations/20261122050000_share_rider_fare_estimate.sql#L42)

6. **An email worker outage can leave the driver with no failure indication.** A fictional receipt left unclaimed for a day produced zero retryable and zero expired messages. The status query counts failed or expired leases, so stopping the worker before its first claim hides the backlog. Riders can miss their receipt and private link. Show the count and age of overdue, never-attempted mail against the dispatch interval. Include that signal in the missed-alert procedure tracked by MS-011. [Status query](../../../supabase/migrations/20261121145544_driver_booking_alerts.sql#L63) · [Driver status](../../../src/DriverWorkspace.jsx#L122)

## Should fix

7. **A Calendar copy can retain a pickup address after the database purge.** A mirrored event contains the pickup location. Purging its booking queues a deletion. In the repository, delivery of that deletion depends on the primary driver opening or refreshing the workspace. If the driver stays offline, the Calendar copy can outlive the database record. Give operations a way to drain and verify overdue deletions independently of an open driver tab, or document and verify a manual deletion procedure. The local suite verified queued removal and simulated Calendar deletion. Actual hosted scheduling and Google retention were outside this check. [Event contents](../../../supabase/functions/calendar-sync/handler.mjs#L39) · [Deletion queue](../../../supabase/migrations/20261121130252_calendar_sync.sql#L50) · [Sync trigger](../../../src/CalendarPanel.jsx#L35)

8. **Confirmed manual rides get an email that says only “Ride request received.”** The database confirms phone and WhatsApp rides at creation, while the worker sends the pending-request subject and body in either language. The current email test explicitly expects that wording. Riders who booked by phone can think they still need approval. Carry the initial status into the receipt template and retain the private link in both variants. [Save rule](../../../supabase/migrations/20261122050000_share_rider_fare_estimate.sql#L87) · [Email template](../../../supabase/functions/booking-email/handler.mjs#L2) · [Current test](../../../supabase/tests/booking-email.mjs#L199)

9. **An open driver workspace keeps yesterday as “Today” after Paris midnight.** The driver day and date picker each initialize today once. A tab left open overnight continues to use the old default agenda, Today link and picker preset, even as the next-pickup clock advances. Refresh the shared Paris date at rollover or on return to the tab. Keep a day the driver explicitly selected. This finding follows from the state initialization. [Workspace](../../../src/DriverWorkspace.jsx#L368) · [Date picker](../../../src/DateTimeFields.jsx#L11)

10. **The locked development tools have outstanding advisories.** The npm registry reported 13 affected package entries, including Vite: 10 high, two moderate and one low. The production-only dependency audit reported zero. The affected tools run on developer machines or during builds. Review the compatible lockfile updates and rerun the build and local checks. The registry severity does not establish a reachable flaw in the published static site. [Vite lock entry](../../../package-lock.json#L2586)

11. **A Pages build can publish with failing booking tests.** The release workflow checks backend configuration and builds, but does not invoke lint or the booking suites. A regression in fare calculation, Paris time or booking decisions can compile successfully and reach the live site. Require lint and the fast rule suites before deployment, and require the isolated database checks for changes to booking rules and migrations. [Pages workflow](../../../.github/workflows/deploy.yml#L34)

## Nice to have

12. **Remove an unused abort controller.** Maps setup creates a controller and aborts it on cleanup, but no listener or request receives its signal. A repository search found only those two references. Delete both lines. The autocomplete listener cleanup is separate and still needed. Lean saving is two lines and zero dependencies. [Creation](../../../src/App.jsx#L326) · [Cleanup](../../../src/App.jsx#L468)

## Verification

| Surface | What was checked | Result |
| --- | --- | --- |
| Frontend and functions | ESLint, Vite production build, Deno check for both Edge Function entry points | Passed |
| Booking rules | Rider validation, DST in Paris, fares, schedule conflicts, travel gaps and work hours | All four JavaScript suites passed |
| Database and worker integration | Applied all 13 migrations to an empty local stack. Ran storage, intake-limit, booking-email and Calendar suites, the working-hours SQL test and database advisors at warning threshold | All passed. Advisors returned zero warnings |
| Recovery | Project rehearsal for pause and resume, 90-day purge, encrypted seven-day rotation and restore into an isolated database | Passed with fictional records |
| Browser | Headless Edge, 390 × 844 and 1280 × 900. Entered addresses with Maps unavailable, submitted a request, opened the private link, switched language, signed in as the driver, accepted a fare and checked the confirmed rider status | Passed. No uncaught page errors in the completed booking walkthrough |
| Additional cases | Controlled email retry ordering, address-only edit, never-claimed receipt, cancellation from another session and lost manual-save response | Reproduced findings 2–6 locally |
| Dependencies | Registry audit of the locked graph, then production dependencies only | 13 development entries, zero production entries |

The integration copies changed only the hard-coded loopback port and disposable Docker container name in the test harness. The application rules, migrations, worker code and assertions were unchanged. The occupied local Muba database was excluded from integration fixture writes. The recovery rehearsal used its own disposable databases.

**Verdict.** Correct the backup notice and email ordering first. The normal booking flow passed from rider submission to driver confirmation and private status. The most consequential failures appeared during retries, second-device changes and unattended operation.

**Not checked.** Hosted database contents or privileges, production backups or purge schedules, actual Google OAuth, Maps and Calendar, live Resend delivery, provider-side settings, a physical driver phone, assistive technology and sustained load. The hosted walkthrough and operating checks remain recorded in MS-011, MS-015 and MS-016. The audit covered application-owned code and configuration. Third-party source and historical evidence archives were outside the line-by-line review.

# Local verification of the MS-022 repairs

22 November 2026. The finding numbers refer to the [audit](review.md).

| Finding | Backlog | Repair and evidence |
| --- | --- | --- |
| 1 | MS-025, MS-015 | The English and French privacy notices state the 90-day retention period. The owner removed the requirement for project-managed booking backups. Checked both notices in the mobile rider form and verified the 90-day database cutoff. |
| 2 | MS-023 | The outbox suppresses obsolete decisions and respects an active earlier delivery lease. Tests covered a failed confirmation, cancellation during a lease, receipt-first delivery, duplicate-safe retries and a worker resumed after its lease deadline. |
| 3 | MS-024 | Ride and block changes advance a database revision. The driver poll acknowledges that revision after both lists load. Database tests checked revision changes. A second session cancelled the next pickup in Edge. After an injected list failure, the next poll removed it. An unchanged poll made no list request. |
| 4 | MS-023 | A pickup-only or destination-only edit queues a localized trip update. Tests exercised both edits in both languages, checked the instructions for viewing the revised trip, and verified that a no-op edit sends nothing. |
| 5 | MS-024 | A manual retry reuses the original request key and payload. In Edge, the database committed the first save and the browser lost the response. After pickup passed and the language changed, retry returned the saved ride. The database contained one matching record. |
| 6 | MS-023, MS-011 | The driver sees the count and oldest age of first attempts waiting at least two minutes. Tested the queue threshold and clearance, checked the warning in English and French in Edge, and recorded the missed-alert procedure in the README. |
| 7 | MS-025 | The post-purge SQL check fails while a deleted booking has outstanding Calendar removals. The regression mirrored both legs, purged the booking, observed the alert, simulated Google being unavailable and retried. Both simulated events disappeared and the check passed. The operating procedure assigns manual follow-up to the primary driver. |
| 8 | MS-023 | New phone and WhatsApp receipts say the ride is confirmed and retain the private link. Tests checked English and French, and preserved the original message format when retrying an ambiguous pre-migration send. |
| 9 | MS-024 | The agenda and date controls follow the Paris day across midnight and on return to the tab. A controlled browser clock verified that the default agenda advanced, an explicit calendar date stayed selected and the open date picker's Today button chose the new day. |
| 10 | MS-026 | Clean installation of the revised lockfile, lint, four fast rule suites and the Vite 8.3.8 production build passed. The npm registry reported zero vulnerabilities in the full locked dependency graph. |
| 11 | MS-026 | The local Pages workflow now runs lint, rule tests, Calendar, email, storage, intake limits, working-hours SQL and database advisors before build and deploy. Verified workflow syntax and suite order and ran the checks using a disposable stack. |
| 12 | MS-026 | Removed the unused Maps abort controller. With external browser requests blocked, a rider entered both addresses manually, reviewed the trip, saved it and opened its private status. |

Both Edge Function entry points passed Deno checks. Supabase advisors returned zero warnings at the configured threshold. The local retention rehearsal also verified that pausing anonymous intake preserves private lookup and driver operations.

The exact staged frontend was also exported into a clean dependency installation, linted, tested, built and checked in Edge. This excluded pre-existing local edits to the schedule and translations. A second session added and removed a time block. The first tab showed both changes, including when the alert endpoint failed and the workspace had to read the lists directly.

Browser checks used fictional records, local Supabase Auth and the production bundle in headless Edge. The integration harness changed only its hard-coded test endpoint and Docker container name. Google Calendar and email delivery used simulated providers. Deployment, production scheduling, real provider delivery, physical phones and the GitHub-hosted runner require separate verification.

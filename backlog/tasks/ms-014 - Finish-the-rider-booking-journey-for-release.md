---
id: MS-014
title: Finish the rider booking journey for release
status: To Do
assignee: []
created_date: '2026-11-21 21:47'
updated_date: '2026-11-22 01:02'
labels: []
dependencies:
  - MS-010
references:
  - MS-006
  - MS-015
modified_files:
  - README.md
  - src/App.jsx
  - src/booking.js
  - src/DriverWorkspace.jsx
  - src/config.js
  - src/i18n.js
  - >-
    supabase/migrations/20261122005750_enforce_web_notice_and_driver_quote_email.sql
priority: high
type: enhancement
ordinal: 21000
---

## Description

<!-- SECTION:DESCRIPTION:BEGIN -->
Apply the approved booking and privacy wording to the existing bilingual rider experience before public release.
<!-- SECTION:DESCRIPTION:END -->

## Current Checkpoint

<!-- SECTION:CURRENT_CHECKPOINT:BEGIN -->
```yaml
done: >-
  The candidate requires two hours of notice for web bookings and guides
  shorter-notice riders to Call or WhatsApp. The driver can email a quote from
  the signed-in ride details or use WhatsApp and record acceptance from either
  channel. Required email and shared private receipts remain in place. Local
  database and email regressions passed. The staged candidate passed lint,
  build, fare, rider, schedule, Deno and EN/FR phone-width browser checks.
next: >-
  Use this candidate in the driver phone walkthrough and controlled hosted test.
  Verify the two receipt paths and the hosted configured sender with click
  tracking disabled.
latestChange: >-
  Two-hour web notice and email-first quotes passed the local checks. Staged
  source was tested separately from the pre-existing cleanup. The driver and
  hosted checks remain open.
resultAt: '2026-11-22T01:02:58.573Z'
remainingChecks:
  - >-
    Driver phone walkthrough, including the short-notice contact and quote
    choices
  - 'Hosted web and driver receipt delivery, private tracking and recovery'
  - Assigned production driver sign-in when the production backend is identified
```
<!-- SECTION:CURRENT_CHECKPOINT:END -->

## Acceptance Criteria
<!-- AC:BEGIN -->
- [ ] #1 The current visual design is retained. Rider screens make the estimate, saved request, later confirmation and approved service and privacy terms clear in English and French.
- [ ] #2 Verify one-way and return, edits, manual addresses without Maps, a lost-response retry creating one request, and private status after a driver decision.
<!-- AC:END -->

## Implementation Notes

<!-- SECTION:NOTES:BEGIN -->
2026-11-21T21:57:26.775Z: Local rehearsal passed the bilingual rider flow and same-request retry. Final copy still needs owner decisions.

2026-11-22T00:31:23.752Z: Prior current facts: {"done":"Local Chromium fixtures passed one-way and return requests, editing, manual addresses without Maps, retry through a lost response and an intake pause, and private status. Local Supabase confirmed same-key idempotency, denied unassigned access, and rejected stale decisions and overlaps.","resultAt":"2026-11-21T21:57:26.774Z"}

2026-11-22T00:31:23.752Z: The quote and privacy changes passed the local checks. Production Auth assignment awaits the designated backend. The existing test driver was preserved.

2026-11-22T00:49:37.626Z: Prior current facts: {"done":"Implemented and locally verified the WhatsApp quote flow. Pending web requests require an agreed fare and driver acknowledgment before confirming. The rider sees bilingual quote instructions and a privacy notice naming Mubashir. The existing public contact is also the requested production driver address. Local database, mobile EN/FR, lint and build checks passed.","resultAt":"2026-11-22T00:31:23.751Z"}

2026-11-22T00:49:37.626Z: Verified the shared email and tracking receipt flow locally. Existing booking links continue to work. Hosted email delivery and optional WhatsApp automation remain open.

2026-11-22T01:02:58.574Z: Prior current facts: {"done":"Both web and driver-entered bookings now require email and queue the same receipt with the reservation number and private tracking link. Rider updates work for both. The private queue clears the link key after delivery or retry expiry. Local EN/FR mobile, booking, email retry, Calendar, limits, restore, lint and build checks passed.","resultAt":"2026-11-22T00:49:37.625Z"}

2026-11-22T01:02:58.574Z: Two-hour web notice and email-first quotes passed the local checks. Staged source was tested separately from the pre-existing cleanup. The driver and hosted checks remain open.
<!-- SECTION:NOTES:END -->

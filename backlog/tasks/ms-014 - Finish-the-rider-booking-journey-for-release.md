---
id: MS-014
title: Finish the rider booking journey for release
status: To Do
assignee: []
created_date: '2026-11-21 21:47'
updated_date: '2026-11-22 00:49'
labels: []
dependencies:
  - MS-010
references:
  - MS-006
  - MS-015
modified_files:
  - README.md
  - src/App.jsx
  - src/DriverSchedule.jsx
  - src/booking.js
  - src/i18n.js
  - supabase/functions/booking-email/handler.mjs
  - >-
    supabase/migrations/20261122004449_send_tracking_receipt_for_every_booking.sql
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
  Both web and driver-entered bookings now require email and queue the same
  receipt with the reservation number and private tracking link. Rider updates
  work for both. The private queue clears the link key after delivery or retry
  expiry. Local EN/FR mobile, booking, email retry, Calendar, limits, restore,
  lint and build checks passed.
next: >-
  Verify the two receipt paths in the controlled hosted rehearsal with the
  approved Resend sender and click tracking disabled.
latestChange: >-
  Verified the shared email and tracking receipt flow locally. Existing booking
  links continue to work. Hosted email delivery and optional WhatsApp automation
  remain open.
resultAt: '2026-11-22T00:49:37.625Z'
remainingChecks:
  - >-
    Hosted receipt and tracking tests for web and driver entry, including a
    failed delivery retry
  - Review final bilingual booking terms and driver walkthrough
  - >-
    Optional WhatsApp automation would require an approved Business Platform
    sender, template and budget
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
<!-- SECTION:NOTES:END -->

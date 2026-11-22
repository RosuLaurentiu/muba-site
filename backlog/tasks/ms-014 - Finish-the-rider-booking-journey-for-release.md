---
id: MS-014
title: Finish the rider booking journey for release
status: To Do
assignee: []
created_date: '2026-11-21 21:47'
updated_date: '2026-11-22 00:31'
labels: []
dependencies:
  - MS-010
references:
  - MS-006
  - MS-015
modified_files:
  - README.md
  - src/App.jsx
  - src/DriverWorkspace.jsx
  - src/config.js
  - src/i18n.js
  - src/fare.js
  - supabase/migrations/20261122002638_require_accepted_web_fare.sql
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
  Implemented and locally verified the WhatsApp quote flow. Pending web requests
  require an agreed fare and driver acknowledgment before confirming. The rider
  sees bilingual quote instructions and a privacy notice naming Mubashir. The
  existing public contact is also the requested production driver address. Local
  database, mobile EN/FR, lint and build checks passed.
next: >-
  Review the remaining booking and privacy wording against MS-010 and identify
  the approved production backend for the driver assignment. Use the quote
  candidate for the driver walkthrough and hosted checks.
latestChange: >-
  The quote and privacy changes passed the local checks. Production Auth
  assignment awaits the designated backend. The existing test driver was
  preserved.
resultAt: '2026-11-22T00:31:23.751Z'
remainingChecks:
  - Confirm privacy contact and review final provider and booking terms
  - Apply any remaining approved rules and review the hosted rider journey
  - >-
    Provision the requested verified driver account in the designated production
    backend and verify sign-in
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
<!-- SECTION:NOTES:END -->

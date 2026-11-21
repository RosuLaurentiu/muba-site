---
id: MS-015
title: Prepare production operations for booking
status: In Progress
assignee:
  - '@codex'
created_date: '2026-11-21 21:47'
updated_date: '2026-11-21 21:57'
labels: []
dependencies: []
references:
  - README.md
  - MS-011
modified_files:
  - README.md
  - src/App.jsx
  - src/i18n.js
  - supabase/tests/pilot-retention.ps1
priority: high
type: task
ordinal: 22000
---

## Description

<!-- SECTION:DESCRIPTION:BEGIN -->
The public booking service needs a tested operating and recovery procedure and named ownership for missed requests.
<!-- SECTION:DESCRIPTION:END -->

## Current Checkpoint

<!-- SECTION:CURRENT_CHECKPOINT:BEGIN -->
```yaml
done: >-
  Locally verified the anonymous intake pause and resume, private status and
  signed-in driver operations. The disposable rehearsal passed 90-day purge,
  seven encrypted daily copies and a private booking restore. Existing local
  Auth, booking, email and Calendar integration tests passed.
next: >-
  Confirm the production backend and responsible operator, then verify approved
  hosted public booking and mail limits, scheduled jobs and the intake pause.
latestChange: >-
  The disposable SQL rehearsal and browser fixtures verified local intake pause
  and rider fallback. Hosted operations and production scheduling are pending
  approval and verification.
resultAt: '2026-11-21T21:57:24.953Z'
remainingChecks:
  - >-
    Confirm production backend, support owner and approved booking and email
    usage limits
  - >-
    Verify regularly scheduled 90-day purge and seven daily encrypted exports on
    approved environment
  - Rehearse pause and resume on hosted test candidate
```
<!-- SECTION:CURRENT_CHECKPOINT:END -->

## Acceptance Criteria
<!-- AC:BEGIN -->
- [ ] #1 Verify assigned-driver access, private status, passenger data protection and public booking and email limits for the approved environment.
- [ ] #2 Verify the approved 90-day purge, seven daily encrypted exports, and a local restore of a fictional booking.
- [ ] #3 Rehearse pausing new web requests while private status, driver operations, and phone or WhatsApp contact remain available.
<!-- AC:END -->

## Implementation Notes

<!-- SECTION:NOTES:BEGIN -->
2026-11-21T21:57:24.954Z: The disposable SQL rehearsal and browser fixtures verified local intake pause and rider fallback. Hosted operations and production scheduling are pending approval and verification.
<!-- SECTION:NOTES:END -->

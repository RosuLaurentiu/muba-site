---
id: MS-011
title: Prepare a small pilot with the driver and regular riders
status: In Progress
assignee:
  - '@codex'
created_date: '2026-11-21 15:23'
updated_date: '2026-11-21 17:00'
labels: []
dependencies: []
references:
  - README.md
  - >-
    backlog/tasks/ms-002 -
    Revamp-Private-Taxi-Paris-for-rider-reservations-and-driver-scheduling.md
  - backlog/tasks/ms-008 - Alert-the-assigned-driver-to-new-web-bookings.md
  - backlog/tasks/ms-002.07 - Keep-riders-informed-when-a-booking-changes.md
documentation:
  - backlog/evidence/MS-011/review.md
priority: high
type: task
ordinal: 18000
---

## Description

<!-- SECTION:DESCRIPTION:BEGIN -->
Rider emails and driver alerts have local coverage. Pilot readiness needs delivery evidence on controlled accounts, proof of the agreed data recovery and retention procedure, and a decision on whether to invite regular clients. Reuse the owner and driver walkthrough evidence from MS-002. Pilot preparation does not authorize invitations or production changes.
<!-- SECTION:DESCRIPTION:END -->

## Current Checkpoint

<!-- SECTION:CURRENT_CHECKPOINT:BEGIN -->
```yaml
done: >-
  Passed an isolated fictional-data test for the 90-day purge, Calendar removal
  queue, seven dated encrypted archives and private booking recovery.
next: >-
  After an approved test deployment, verify closed-workspace driver phone
  delivery and rider updates, then obtain support, sender and go-or-hold
  decisions.
latestChange: >-
  Verified the 90-day retention boundary, seven dated encrypted copies and
  private link restore with fictional data. Ride, email and Calendar regressions
  passed. Live pilot approval is still pending.
resultAt: '2026-11-21T17:00:25.543Z'
remainingChecks:
  - 'Approved pilot environment, sender and support ownership'
  - Fictional phone and rider mail test on approved delivery setup
  - 'Driver rehearsal and rules, travel review and owner go-or-hold'
```
<!-- SECTION:CURRENT_CHECKPOINT:END -->

## Acceptance Criteria
<!-- AC:BEGIN -->
- [ ] #1 Record the pilot environment, participants by role, approved sender and delivery cost limit, who monitors missed requests, and the phone or WhatsApp fallback. Keep real passenger details out of pilot evidence.
- [ ] #2 With the approved test setup, show that one fictional web booking alerts the driver on his phone while the workspace is closed and that an opted-in rider receives an update after the ride changes. Verify that a failed delivery is visible and can be recovered without duplicating the ride.
- [x] #3 Demonstrate the approved data safeguards with test records: passenger data is removed after the 90-day retention period, daily encrypted exports are kept for seven days, and a local restore recovers a usable test booking.
- [ ] #4 Link the MS-002 rehearsal result, the booking rules and the travel-buffer disposition. Record outstanding blockers, who handles support, when to pause and the owner's decision to proceed or hold before inviting regular riders.
<!-- AC:END -->

## Implementation Plan

<!-- SECTION:PLAN:BEGIN -->
Prove retention and encrypted recovery using fictional data locally. Record pilot scope and outstanding approvals. A real phone delivery check requires an approved environment and sender.
<!-- SECTION:PLAN:END -->

## Implementation Notes

<!-- SECTION:NOTES:BEGIN -->
2026-11-21T16:55:17.858Z: Started local retention and recovery work without sending email or provisioning a pilot environment.

2026-11-21T17:00:25.544Z: Prior current facts: {"done":"The rider and driver flows are locally verified. Owner approval is still required for deployment and live sender setup.","resultAt":"2026-11-21T16:55:17.857Z"}

2026-11-21T17:00:25.544Z: Verified the 90-day retention boundary, seven dated encrypted copies and private link restore with fictional data. Ride, email and Calendar regressions passed. Live pilot approval is still pending.
<!-- SECTION:NOTES:END -->

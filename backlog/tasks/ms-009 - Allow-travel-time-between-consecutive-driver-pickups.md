---
id: MS-009
title: Allow travel time between consecutive driver pickups
status: In Progress
assignee:
  - '@codex'
created_date: '2026-11-21 15:23'
updated_date: '2026-11-21 16:55'
labels: []
dependencies: []
references:
  - >-
    backlog/tasks/ms-002 -
    Revamp-Private-Taxi-Paris-for-rider-reservations-and-driver-scheduling.md
  - backlog/evidence/MS-002.05/review.md
  - src/schedule.js
priority: high
type: enhancement
ordinal: 16000
---

## Description

<!-- SECTION:DESCRIPTION:BEGIN -->
The driver can already enter a ride duration. The schedule checks ride overlaps, but leaves travel from one drop-off to the next pickup to the driver. A ride with unknown duration occupies just the pickup minute. Use two consecutive fictional rides from the MS-002 walkthrough to agree how the driver wants to allow for this gap. The buffer must work with manual addresses.
<!-- SECTION:DESCRIPTION:END -->

## Current Checkpoint

<!-- SECTION:CURRENT_CHECKPOINT:BEGIN -->
```yaml
done: >-
  Owner selected 60 minutes as a draft planning target, adjustable for the
  locations. Verified the advisory at 59 and 60 minutes and when the prior
  finish is unknown, on phone width in English and French.
next: >-
  Review the draft with the driver. Confirm the target, adjustment and whether a
  short gap should remain advisory or become a save restriction.
latestChange: >-
  Owner approved a 60-minute draft, not final policy. Phone tests show that 59
  minutes warns and 60 fits. Example: 10:30 drop-off and 11:29 pickup leave 59
  minutes.
resultAt: '2026-11-21T16:55:00.039Z'
remainingChecks:
  - Driver review of the one-hour target and warning or blocking rule
  - Verify final save behavior after driver review
```
<!-- SECTION:CURRENT_CHECKPOINT:END -->

## Acceptance Criteria
<!-- AC:BEGIN -->
- [ ] #1 The driver and owner agree how to set or adjust travel minutes, how to handle an unknown finish and what happens when the gap is too short. Record a worked example with the prior drop-off, next pickup and available minutes.
- [x] #2 When accepting, manually entering or rescheduling a ride, the driver can see the time available against the required buffer on either side. The interface distinguishes passenger ride duration from travel between jobs and identifies an unknown finish explicitly.
- [ ] #3 The agreed warning or blocking rule is consistent on preview and save, including return legs, existing rides without an estimate, time blocks and concurrent changes. Cancelling or moving a ride frees its former interval. The buffer does not change the passenger fare or pickup time.
- [ ] #4 Verify a Paris-time schedule with a gap shorter than the buffer, an exact fit, and an unknown finish. Check the driver flow on a phone in English and French with Maps unavailable.
<!-- AC:END -->

## Implementation Plan

<!-- SECTION:PLAN:BEGIN -->
Compute available travel time on both sides of each draft leg, including time blocks and unknown finishes. Apply the confirmed driver preference and verify all affected write paths and mobile previews.
<!-- SECTION:PLAN:END -->

## Implementation Notes

<!-- SECTION:NOTES:BEGIN -->
2026-11-21T16:44:47.874Z: Confirmed the existing schedule overlap enforcement and identified the shared preview and write entry points.

2026-11-21T16:46:56.398Z: Prior current facts: {"done":"Confirmed the current schedule reserves each ride leg and shows adjacent rides. Its overlap rule is enforced in PostgreSQL.","resultAt":"2026-11-21T16:44:47.873Z"}

2026-11-21T16:46:56.398Z: Verified the neutral time-gap calculation and both-language phone previews. Fixture: 10:30 prior drop-off, 10:44 next pickup, 14 minutes available. Required buffer policy is pending.

2026-11-21T16:55:00.040Z: Prior current facts: {"done":"Verified bilingual mobile previews and tests for available time on both sides, return legs, time blocks, a 14-minute gap, an exact 15-minute gap, and an unknown finish.","resultAt":"2026-11-21T16:46:56.397Z"}

2026-11-21T16:55:00.040Z: Owner approved a 60-minute draft, not final policy. Phone tests show that 59 minutes warns and 60 fits. Example: 10:30 drop-off and 11:29 pickup leave 59 minutes.
<!-- SECTION:NOTES:END -->

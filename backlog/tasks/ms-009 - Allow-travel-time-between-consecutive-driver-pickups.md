---
id: MS-009
title: Allow travel time between consecutive driver pickups
status: To Do
assignee: []
created_date: '2026-11-21 15:23'
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

## Acceptance Criteria
<!-- AC:BEGIN -->
- [ ] #1 The driver and owner agree how to set or adjust travel minutes, how to handle an unknown finish and what happens when the gap is too short. Record a worked example with the prior drop-off, next pickup and available minutes.
- [ ] #2 When accepting, manually entering or rescheduling a ride, the driver can see the time available against the required buffer on either side. The interface distinguishes passenger ride duration from travel between jobs and identifies an unknown finish explicitly.
- [ ] #3 The agreed warning or blocking rule is consistent on preview and save, including return legs, existing rides without an estimate, time blocks and concurrent changes. Cancelling or moving a ride frees its former interval. The buffer does not change the passenger fare or pickup time.
- [ ] #4 Verify a Paris-time schedule with a gap shorter than the buffer, an exact fit, and an unknown finish. Check the driver flow on a phone in English and French with Maps unavailable.
<!-- AC:END -->

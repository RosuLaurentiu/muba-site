---
id: MS-011
title: Prepare a small pilot with the driver and regular riders
status: To Do
assignee: []
created_date: '2026-11-21 15:23'
labels: []
dependencies: []
references:
  - README.md
  - >-
    backlog/tasks/ms-002 -
    Revamp-Private-Taxi-Paris-for-rider-reservations-and-driver-scheduling.md
  - backlog/tasks/ms-008 - Alert-the-assigned-driver-to-new-web-bookings.md
  - backlog/tasks/ms-002.07 - Keep-riders-informed-when-a-booking-changes.md
priority: high
type: task
ordinal: 18000
---

## Description

<!-- SECTION:DESCRIPTION:BEGIN -->
Rider emails and driver alerts have local coverage. Pilot readiness needs delivery evidence on controlled accounts, proof of the agreed data recovery and retention procedure, and a decision on whether to invite regular clients. Reuse the owner and driver walkthrough evidence from MS-002. Pilot preparation does not authorize invitations or production changes.
<!-- SECTION:DESCRIPTION:END -->

## Acceptance Criteria
<!-- AC:BEGIN -->
- [ ] #1 Record the pilot environment, participants by role, approved sender and delivery cost limit, who monitors missed requests, and the phone or WhatsApp fallback. Keep real passenger details out of pilot evidence.
- [ ] #2 With the approved test setup, show that one fictional web booking alerts the driver on his phone while the workspace is closed and that an opted-in rider receives an update after the ride changes. Verify that a failed delivery is visible and can be recovered without duplicating the ride.
- [ ] #3 Demonstrate the approved data safeguards with test records: passenger data is removed after the 90-day retention period, daily encrypted exports are kept for seven days, and a local restore recovers a usable test booking.
- [ ] #4 Link the MS-002 rehearsal result, the booking rules and the travel-buffer disposition. Record outstanding blockers, who handles support, when to pause and the owner's decision to proceed or hold before inviting regular riders.
<!-- AC:END -->

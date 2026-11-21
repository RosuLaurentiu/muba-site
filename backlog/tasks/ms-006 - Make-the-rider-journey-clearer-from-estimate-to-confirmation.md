---
id: MS-006
title: Make the rider journey clearer from estimate to confirmation
status: To Do
assignee: []
created_date: '2026-11-21 14:42'
labels: []
dependencies:
  - MS-004
  - MS-005
references:
  - backlog/evidence/MS-002.03/review.md
  - src/App.jsx
priority: high
type: enhancement
ordinal: 13000
---

## Description

<!-- SECTION:DESCRIPTION:BEGIN -->
Today the rider completes passenger details before the review screen can show a fare. The receipt and private status are separate screens. Let riders understand the trip and estimated price earlier and keep the next action and booking state clear throughout.
<!-- SECTION:DESCRIPTION:END -->

## Acceptance Criteria
<!-- AC:BEGIN -->
- [ ] #1 A rider can use pickup, destination and pickup time to see an estimate or its unavailable state before supplying a name or phone number. Passenger details are still validated before the request is saved.
- [ ] #2 Entry and review have distinct primary actions. Riders can edit a trip without re-entering passenger details. Changing language or theme preserves the draft. One-way and return journeys show the applicable Paris dates and times clearly.
- [ ] #3 Receipt and private status make the reference, current status and next action easy to find. A received request is clearly pending until the driver confirms. An ambiguous save can be retried without a duplicate booking.
- [ ] #4 Exercise the full journey on phone and desktop in EN and FR, including keyboard-only input, invalid fields, unavailable fare, edit, retry, receipt and private status. Verify long addresses and status text in both themes.
<!-- AC:END -->

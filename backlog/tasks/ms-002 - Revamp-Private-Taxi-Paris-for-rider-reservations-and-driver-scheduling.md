---
id: MS-002
title: Revamp Private Taxi Paris for rider reservations and driver scheduling
status: To Do
assignee: []
created_date: '2026-11-21 11:52'
labels: []
dependencies: []
references:
  - backlog/evidence/MS-001/review.md
priority: high
type: feature
ordinal: 2000
---

## Description

<!-- SECTION:DESCRIPTION:BEGIN -->
The current site prepares messages. The owner wants clients to request rides and one driver to manage all rides in the app, including phone and WhatsApp bookings. His Google Calendar displays confirmed rides. The app owns all changes and cancellations.
<!-- SECTION:DESCRIPTION:END -->

## Acceptance Criteria
<!-- AC:BEGIN -->
- [ ] #1 In the accepted bilingual rider flow a customer submits an advance ride request and can distinguish receipt from driver confirmation.
- [ ] #2 On a phone the signed-in driver handles online requests and manually recorded rides in the same schedule, with trip details and passenger contact available.
- [ ] #3 A confirmed ride appears once in the selected Google Calendar. Rescheduling and cancellation from the app update that event. Product acceptance covers one-way calendar sync.
- [ ] #4 The owner can walk through the agreed end-to-end journey on a test environment before a separate release decision.
<!-- AC:END -->

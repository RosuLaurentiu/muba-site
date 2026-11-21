---
id: MS-007
title: Make the driver agenda and ride actions easier to use on a phone
status: To Do
assignee: []
created_date: '2026-11-21 14:42'
labels: []
dependencies:
  - MS-004
references:
  - backlog/evidence/MS-002.04/review.md
  - backlog/evidence/MS-002.05/review.md
  - src/DriverWorkspace.jsx
priority: high
type: enhancement
ordinal: 14000
---

## Description

<!-- SECTION:DESCRIPTION:BEGIN -->
The driver already has sign-in, an agenda, requests, manual rides and calendar sync. On narrow screens the day list precedes pending requests, and calendar controls appear before the working view. Improve how quickly the driver finds the next pickup, a waiting request or a passenger contact on a busy day.
<!-- SECTION:DESCRIPTION:END -->

## Acceptance Criteria
<!-- AC:BEGIN -->
- [ ] #1 With a full day of rides, the first phone screen identifies the next pickup and provides direct access to pending requests, with a count, without scrolling through the day. Routine calendar settings stay secondary and sync failures remain visible.
- [ ] #2 From the agenda the driver can reach the next passenger's call and directions actions with at most one intervening screen. Ride detail distinguishes pickup, drop-off, Paris times, passenger contact and notes at a glance.
- [ ] #3 Recording a phone or WhatsApp ride, accepting or declining a request, rescheduling, cancelling and blocking time each give clear feedback. Conflict warnings appear before saving and the selected day is retained on return. Destructive actions are visually distinct from routine actions.
- [ ] #4 Use fictional rides to verify a busy day, empty day, overlap, return leg and failed refresh on phone and desktop. Check EN and FR, Light and Dark, keyboard focus and touch controls. Preserve driver-only access and one-way Google Calendar behavior.
<!-- AC:END -->

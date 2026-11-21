---
id: MS-007
title: Make the driver agenda and ride actions easier to use on a phone
status: Done
assignee:
  - '@codex'
created_date: '2026-11-21 14:42'
updated_date: '2026-11-21 16:53'
completed_date: '2026-11-21T16:53:28.079Z'
labels: []
dependencies:
  - MS-004
references:
  - backlog/evidence/MS-002.04/review.md
  - backlog/evidence/MS-002.05/review.md
  - src/DriverWorkspace.jsx
documentation:
  - backlog/evidence/MS-007/review.md
priority: high
type: enhancement
ordinal: 14000
---

## Description

<!-- SECTION:DESCRIPTION:BEGIN -->
The driver already has sign-in, an agenda, requests, manual rides and calendar sync. On narrow screens the day list precedes pending requests, and calendar controls appear before the working view. Improve how quickly the driver finds the next pickup, a waiting request or a passenger contact on a busy day.
<!-- SECTION:DESCRIPTION:END -->

## Current Checkpoint

<!-- SECTION:CURRENT_CHECKPOINT:BEGIN -->
```yaml
done: >-
  Verified next pickup and pending access above the fold, correct return-leg
  directions, all agenda actions, failed refresh, selected day, keyboard and
  touch controls, and unassigned denial.
next: Use the verified agenda for pilot preparation.
latestChange: >-
  Mobile and desktop browser checks passed for the busy and empty agenda,
  Calendar indicator, links, actions, failed refresh, overlap and access denial.
resultAt: '2026-11-21T16:53:28.070Z'
```
<!-- SECTION:CURRENT_CHECKPOINT:END -->

## Acceptance Criteria
<!-- AC:BEGIN -->
- [x] #1 With a full day of rides, the first phone screen identifies the next pickup and provides direct access to pending requests, with a count, without scrolling through the day. Routine calendar settings stay secondary and sync failures remain visible.
- [x] #2 From the agenda the driver can reach the next passenger's call and directions actions with at most one intervening screen. Ride detail distinguishes pickup, drop-off, Paris times, passenger contact and notes at a glance.
- [x] #3 Recording a phone or WhatsApp ride, accepting or declining a request, rescheduling, cancelling and blocking time each give clear feedback. Conflict warnings appear before saving and the selected day is retained on return. Destructive actions are visually distinct from routine actions.
- [x] #4 Use fictional rides to verify a busy day, empty day, overlap, return leg and failed refresh on phone and desktop. Check EN and FR, Light and Dark, keyboard focus and touch controls. Preserve driver-only access and one-way Google Calendar behavior.
<!-- AC:END -->

## Implementation Plan

<!-- SECTION:PLAN:BEGIN -->
Put next pickup and pending requests at the top; make contact and ride actions easy to reach. Improve explicit destructive states and verify bilingual layouts and full driver interactions.
<!-- SECTION:PLAN:END -->

## Implementation Notes

<!-- SECTION:NOTES:BEGIN -->
2026-11-21T16:47:17.108Z: Confirmed the approved design and existing agenda, driver actions and Calendar controls.

2026-11-21T16:53:28.071Z: Prior current facts: {"done":"The redesigned workspace is approved. Its current next-ride card can be below navigation and Calendar on a busy phone view.","resultAt":"2026-11-21T16:47:17.107Z"}

2026-11-21T16:53:28.071Z: Mobile and desktop browser checks passed for the busy and empty agenda, Calendar indicator, links, actions, failed refresh, overlap and access denial.
<!-- SECTION:NOTES:END -->

## Final Summary

<!-- SECTION:FINAL_SUMMARY:BEGIN -->
Next pickup, contact actions and pending requests are available on the first phone screen. Return leg actions use the correct pickup and saves preserve selected day context.
<!-- SECTION:FINAL_SUMMARY:END -->

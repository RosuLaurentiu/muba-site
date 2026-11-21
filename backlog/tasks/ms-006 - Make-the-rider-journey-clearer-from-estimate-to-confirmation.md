---
id: MS-006
title: Make the rider journey clearer from estimate to confirmation
status: Done
assignee:
  - '@codex'
created_date: '2026-11-21 14:42'
updated_date: '2026-11-21 16:44'
completed_date: '2026-11-21T16:44:22.421Z'
labels: []
dependencies:
  - MS-004
  - MS-005
references:
  - backlog/evidence/MS-002.03/review.md
  - src/App.jsx
documentation:
  - backlog/evidence/MS-006/review.md
priority: high
type: enhancement
ordinal: 13000
---

## Description

<!-- SECTION:DESCRIPTION:BEGIN -->
Today the rider completes passenger details before the review screen can show a fare. The receipt and private status are separate screens. Let riders understand the trip and estimated price earlier and keep the next action and booking state clear throughout.
<!-- SECTION:DESCRIPTION:END -->

## Current Checkpoint

<!-- SECTION:CURRENT_CHECKPOINT:BEGIN -->
```yaml
done: >-
  Verified fare-first review, passenger validation before save, draft
  preservation, identical retry payload and pending-to-confirmed private status
  in both languages and themes.
next: Use the current rider flow for the remaining driver and pilot checks.
latestChange: >-
  Rider flow passed mobile and desktop browser checks in English and French,
  both themes, plus lint, build, rider input and fare tests.
resultAt: '2026-11-21T16:44:22.415Z'
```
<!-- SECTION:CURRENT_CHECKPOINT:END -->

## Acceptance Criteria
<!-- AC:BEGIN -->
- [x] #1 A rider can use pickup, destination and pickup time to see an estimate or its unavailable state before supplying a name or phone number. Passenger details are still validated before the request is saved.
- [x] #2 Entry and review have distinct primary actions. Riders can edit a trip without re-entering passenger details. Changing language or theme preserves the draft. One-way and return journeys show the applicable Paris dates and times clearly.
- [x] #3 Receipt and private status make the reference, current status and next action easy to find. A received request is clearly pending until the driver confirms. An ambiguous save can be retried without a duplicate booking.
- [x] #4 Exercise the full journey on phone and desktop in EN and FR, including keyboard-only input, invalid fields, unavailable fare, edit, retry, receipt and private status. Verify long addresses and status text in both themes.
<!-- AC:END -->

## Implementation Plan

<!-- SECTION:PLAN:BEGIN -->
Validate trip details for estimate review, validate passenger details before save, and preserve the same booking retry key. Verify both screen sizes, languages and themes.
<!-- SECTION:PLAN:END -->

## Implementation Notes

<!-- SECTION:NOTES:BEGIN -->
2026-11-21T16:41:26.183Z: Started the rider flow after its design and Maps prerequisites passed.

2026-11-21T16:44:22.416Z: Prior current facts: {"done":"Both required design and Maps tasks are Done.","resultAt":"2026-11-21T16:41:26.182Z"}

2026-11-21T16:44:22.416Z: Rider flow passed mobile and desktop browser checks in English and French, both themes, plus lint, build, rider input and fare tests.
<!-- SECTION:NOTES:END -->

## Final Summary

<!-- SECTION:FINAL_SUMMARY:BEGIN -->
Riders review the trip and fare before contact details. Editing and language or theme changes preserve the draft. The receipt and private status distinguish pending from confirmed and lost-response retry reuses the same request.
<!-- SECTION:FINAL_SUMMARY:END -->

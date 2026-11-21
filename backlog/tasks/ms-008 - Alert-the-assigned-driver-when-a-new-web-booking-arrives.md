---
id: MS-008
title: Alert the assigned driver when a new web booking arrives
status: Done
assignee:
  - '@codex'
created_date: '2026-11-21 14:49'
updated_date: '2026-11-21 15:00'
completed_date: '2026-11-21T15:00:44.134Z'
labels: []
dependencies:
  - MS-003
  - MS-002.07
documentation:
  - README.md#driver-booking-alerts
type: feature
ordinal: 15000
---

## Description

<!-- SECTION:DESCRIPTION:BEGIN -->
Tell the assigned driver about incoming requests in the open workspace and at the verified email linked to their Google identity. Test with fictional data locally. Live email setup requires owner approval.
<!-- SECTION:DESCRIPTION:END -->

## Current Checkpoint

<!-- SECTION:CURRENT_CHECKPOINT:BEGIN -->
```yaml
done: >-
  Verified in the local browser that the open driver workspace shows a new
  booking and opens it directly, with English and French copy. Verified
  driver-only access, delivery to the assigned verified Google email,
  duplicate-safe retry and suppression after assignment removal.
next: Request owner approval before configuring or testing a live email sender.
latestChange: >-
  Verified open-workspace and Google-address alerts locally, with fictional
  addresses and no live email. Manual rides do not produce alerts. Unassigned
  users cannot view requests.
resultAt: '2026-11-21T15:00:44.126Z'
```
<!-- SECTION:CURRENT_CHECKPOINT:END -->

## Acceptance Criteria
<!-- AC:BEGIN -->
- [x] #1 New web bookings appear in the open assigned driver workspace without a manual refresh and can be opened directly.
- [x] #2 New web bookings produce one email to the assigned driver verified Google address. Manual rides do not generate alerts.
- [x] #3 Verify authorized and unauthorized workspace access, duplicate suppression and failure visibility locally. Live email setup requires owner approval.
<!-- AC:END -->

## Implementation Plan

<!-- SECTION:PLAN:BEGIN -->
Add a driver-only pending-booking alert to the open workspace. Queue one email on web booking creation for the currently assigned verified Google identity. Reuse the local capture and delivery failure flow and verify access and deduplication.
<!-- SECTION:PLAN:END -->

## Implementation Notes

<!-- SECTION:NOTES:BEGIN -->
Distinct outcome: MS-003 covers authentication. This follow-up delivers booking alerts.

2026-11-21T14:55:41.954Z: Started the owner-approved driver notification follow-up after completing the rider email outbox.

2026-11-21T15:00:44.127Z: Prior current facts: {"done":"Confirmed the driver alerts depend on the completed booking email worker and assigned-driver Google identity.","resultAt":"2026-11-21T14:55:41.953Z"}

2026-11-21T15:00:44.127Z: Verified open-workspace and Google-address alerts locally, with fictional addresses and no live email. Manual rides do not produce alerts. Unassigned users cannot view requests.
<!-- SECTION:NOTES:END -->

## Final Summary

<!-- SECTION:FINAL_SUMMARY:BEGIN -->
New web requests show in the open driver workspace and queue one email to the verified Google address for the assigned account. Local tests passed for authorization, deduplicated retry, and the driver failure notice.
<!-- SECTION:FINAL_SUMMARY:END -->

---
id: MS-024
title: Keep the driver agenda and booking retry current
status: Done
assignee:
  - '@codex'
created_date: '2026-11-22 15:31'
updated_date: '2026-11-22 15:46'
completed_date: '2026-11-22T15:46:02.050Z'
labels: []
dependencies: []
references:
  - backlog/evidence/MS-022/review.md
  - backlog/evidence/MS-022/local-repairs.md
ordinal: 38000
---

## Description

<!-- SECTION:DESCRIPTION:BEGIN -->
Local repairs for MS-022. Finding numbers match backlog/evidence/MS-022/review.md. Publication requires owner approval.
<!-- SECTION:DESCRIPTION:END -->

## Current Checkpoint

<!-- SECTION:CURRENT_CHECKPOINT:BEGIN -->
```yaml
done: >-
  The exact staged frontend passed the cross-session cancellation and block
  changes, failed list read recovery, after-pickup manual retry, Paris midnight
  default and explicit agenda dates, and date-picker Today in Edge. Storage
  regression checks passed.
next: >-
  The frontend and schedule revision migration are local. Deployment awaits the
  owner.
latestChange: >-
  The exact staged frontend passed the cross-session cancellation and block
  changes, failed list read recovery, after-pickup manual retry, Paris midnight
  default and explicit agenda dates, and date-picker Today in Edge. Storage
  regression checks passed.
resultAt: '2026-11-22T15:46:02.041Z'
evidence:
  - backlog/evidence/MS-022/local-repairs.md
remainingChecks: []
```
<!-- SECTION:CURRENT_CHECKPOINT:END -->

## Acceptance Criteria
<!-- AC:BEGIN -->
- [x] #1 3. Another device changing a confirmed ride or time block updates the open driver workspace.
- [x] #2 5. Retrying a committed manual ride after pickup returns the original booking.
- [x] #3 9. The workspace and date controls follow the Paris date across midnight while preserving explicit dates.
<!-- AC:END -->

## Implementation Plan

<!-- SECTION:PLAN:BEGIN -->
[100%] Check the reported cases. [100%] Repair the affected behavior. [100%] Verify locally and record evidence.
<!-- SECTION:PLAN:END -->

## Implementation Notes

<!-- SECTION:NOTES:BEGIN -->
2026-11-22T15:46:02.042Z: The exact staged frontend passed the cross-session cancellation and block changes, failed list read recovery, after-pickup manual retry, Paris midnight default and explicit agenda dates, and date-picker Today in Edge. Storage regression checks passed.
<!-- SECTION:NOTES:END -->

## Final Summary

<!-- SECTION:FINAL_SUMMARY:BEGIN -->
The exact staged frontend passed the cross-session cancellation and block changes, failed list read recovery, after-pickup manual retry, Paris midnight default and explicit agenda dates, and date-picker Today in Edge. Storage regression checks passed. The frontend and schedule revision migration are local. Deployment awaits the owner.
<!-- SECTION:FINAL_SUMMARY:END -->

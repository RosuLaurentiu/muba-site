---
id: MS-025
title: Align local booking retention and Calendar cleanup with temporary data
status: Done
assignee:
  - '@codex'
created_date: '2026-11-22 15:31'
updated_date: '2026-11-22 15:45'
completed_date: '2026-11-22T15:45:08.594Z'
labels: []
dependencies: []
references:
  - backlog/evidence/MS-022/review.md
  - backlog/evidence/MS-022/local-repairs.md
ordinal: 39000
---

## Description

<!-- SECTION:DESCRIPTION:BEGIN -->
Local repairs for MS-022. Finding numbers match backlog/evidence/MS-022/review.md. Publication requires owner approval.
<!-- SECTION:DESCRIPTION:END -->

## Current Checkpoint

<!-- SECTION:CURRENT_CHECKPOINT:BEGIN -->
```yaml
done: >-
  Verified the bilingual 90-day notice and owner decision against separate
  booking backups. A real local purge detected two outstanding Calendar removals
  and verified their deletion after provider recovery.
next: >-
  The authorized production operator must configure the purge and post-purge
  follow-up after deployment approval.
latestChange: >-
  Verified the bilingual 90-day notice and owner decision against separate
  booking backups. A real local purge detected two outstanding Calendar removals
  and verified their deletion after provider recovery.
resultAt: '2026-11-22T15:45:08.586Z'
evidence:
  - backlog/evidence/MS-022/local-repairs.md
remainingChecks: []
```
<!-- SECTION:CURRENT_CHECKPOINT:END -->

## Acceptance Criteria
<!-- AC:BEGIN -->
- [x] #1 1. Both rider notices and operating instructions reflect the owner decision to omit project-managed backups and retain the 90-day purge.
- [x] #2 7. Operations can complete and verify removal of expired Calendar copies independently of an open workspace or use a verified manual procedure.
<!-- AC:END -->

## Implementation Plan

<!-- SECTION:PLAN:BEGIN -->
[100%] Check the reported cases. [100%] Repair the affected behavior. [100%] Verify locally and record evidence.
<!-- SECTION:PLAN:END -->

## Implementation Notes

<!-- SECTION:NOTES:BEGIN -->
2026-11-22T15:45:08.586Z: Verified the bilingual 90-day notice and owner decision against separate booking backups. A real local purge detected two outstanding Calendar removals and verified their deletion after provider recovery.
<!-- SECTION:NOTES:END -->

## Final Summary

<!-- SECTION:FINAL_SUMMARY:BEGIN -->
Verified the bilingual 90-day notice and owner decision against separate booking backups. A real local purge detected two outstanding Calendar removals and verified their deletion after provider recovery. The authorized production operator must configure the purge and post-purge follow-up after deployment approval.
<!-- SECTION:FINAL_SUMMARY:END -->

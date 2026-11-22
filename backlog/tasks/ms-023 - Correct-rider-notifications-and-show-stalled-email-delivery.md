---
id: MS-023
title: Correct rider notifications and show stalled email delivery
status: Done
assignee:
  - '@codex'
created_date: '2026-11-22 15:31'
updated_date: '2026-11-22 15:45'
completed_date: '2026-11-22T15:45:04.832Z'
labels: []
dependencies: []
references:
  - backlog/evidence/MS-022/review.md
  - backlog/evidence/MS-022/local-repairs.md
ordinal: 37000
---

## Description

<!-- SECTION:DESCRIPTION:BEGIN -->
Local repairs for MS-022. Finding numbers match backlog/evidence/MS-022/review.md. Publication requires owner approval.
<!-- SECTION:DESCRIPTION:END -->

## Current Checkpoint

<!-- SECTION:CURRENT_CHECKPOINT:BEGIN -->
```yaml
done: >-
  Verified mail ordering under failed and active leases, both address-only
  updates, overdue count and age, and confirmed manual receipts in English and
  French. Simulated delivery and Deno checks passed.
next: >-
  Apply the worker and database changes only after deployment approval. Hosted
  delivery is tracked by MS-011.
latestChange: >-
  Verified mail ordering under failed and active leases, both address-only
  updates, overdue count and age, and confirmed manual receipts in English and
  French. Simulated delivery and Deno checks passed.
resultAt: '2026-11-22T15:45:04.824Z'
evidence:
  - backlog/evidence/MS-022/local-repairs.md
remainingChecks: []
```
<!-- SECTION:CURRENT_CHECKPOINT:END -->

## Acceptance Criteria
<!-- AC:BEGIN -->
- [x] #1 2. A failed or leased older rider update cannot follow a newer decision and the receipt remains deliverable.
- [x] #2 4. Pickup-only and destination-only edits send clear localized updates.
- [x] #3 6. The driver sees the count and age of overdue never-claimed mail and has a missed-alert procedure.
- [x] #4 8. Confirmed phone and WhatsApp receipts have correct English and French wording and the private link.
<!-- AC:END -->

## Implementation Plan

<!-- SECTION:PLAN:BEGIN -->
[100%] Check the reported cases. [100%] Repair the affected behavior. [100%] Verify locally and record evidence.
<!-- SECTION:PLAN:END -->

## Implementation Notes

<!-- SECTION:NOTES:BEGIN -->
2026-11-22T15:45:04.825Z: Verified mail ordering under failed and active leases, both address-only updates, overdue count and age, and confirmed manual receipts in English and French. Simulated delivery and Deno checks passed.
<!-- SECTION:NOTES:END -->

## Final Summary

<!-- SECTION:FINAL_SUMMARY:BEGIN -->
Verified mail ordering under failed and active leases, both address-only updates, overdue count and age, and confirmed manual receipts in English and French. Simulated delivery and Deno checks passed. Apply the worker and database changes only after deployment approval. Hosted delivery is tracked by MS-011.
<!-- SECTION:FINAL_SUMMARY:END -->

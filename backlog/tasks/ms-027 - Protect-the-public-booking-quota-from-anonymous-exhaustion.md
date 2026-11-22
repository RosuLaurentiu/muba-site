---
id: MS-027
title: Protect the public booking quota from anonymous exhaustion
status: Done
assignee:
  - '@codex'
created_date: '2026-11-22 22:18'
updated_date: '2026-11-22 22:33'
completed_date: '2026-11-22T22:33:23.160Z'
labels: []
dependencies: []
priority: medium
type: bug
ordinal: 41000
---

## Description

<!-- SECTION:DESCRIPTION:BEGIN -->
Deep security scan 450ca0d3 on c6de1a7 reported two medium findings in the quota used by save_ride. A visitor can consume the shared booking allowance or another mailbox allowance.
<!-- SECTION:DESCRIPTION:END -->

## Current Checkpoint

<!-- SECTION:CURRENT_CHECKPOINT:BEGIN -->
```yaml
done: >-
  Both medium findings are fixed and verified locally. English and French
  browser bookings passed against the release candidate and local API, including
  invalid proof and retry after a lost response. The strict mailbox cap,
  independent network limits, site ceilings and driver paths passed.
next: >-
  Await separate deployment approval. On release verify code delivery to a
  controlled inbox and the hosted gateway source header.
latestChange: >-
  Fresh migrations, local worker capture, four integration suites, four fast
  rule suites, working-hours SQL, retention rehearsal, database advisors, worker
  type check, lint, build and bilingual browser flows passed. No production
  changes.
resultAt: '2026-11-22T22:33:23.151Z'
remainingChecks: []
```
<!-- SECTION:CURRENT_CHECKPOINT:END -->

## Acceptance Criteria
<!-- AC:BEGIN -->
- [x] #1 One source cannot consume the entire shared hourly or daily allowance and another eligible source can book.
- [x] #2 An unverified email supplied by another source cannot exhaust the mailbox owner booking allowance.
- [x] #3 Serial and concurrent saves, idempotent retries, receipts, global ceilings and driver bookings pass local checks.
<!-- AC:END -->

## Implementation Plan

<!-- SECTION:PLAN:BEGIN -->
[100%] Match both scan findings to the booking admission rules.
[100%] Enforce the limits at the booking boundary.
[100%] Verify local booking and receipt behavior and commit.
<!-- SECTION:PLAN:END -->

## Implementation Notes

<!-- SECTION:NOTES:BEGIN -->
2026-11-22T22:28:33.929Z: Verified the core booking, email and concurrency checks with fictional data and a simulated email provider.

2026-11-22T22:33:23.151Z: Prior current facts: {"done":"The local API rejected missing, expired, wrong-mailbox and consumed codes. Concurrent retries produced one booking. Source, mailbox and both emergency limits passed on an isolated local stack.","resultAt":"2026-11-22T22:28:33.928Z"}

2026-11-22T22:33:23.151Z: Fresh migrations, local worker capture, four integration suites, four fast rule suites, working-hours SQL, retention rehearsal, database advisors, worker type check, lint, build and bilingual browser flows passed. No production changes.
<!-- SECTION:NOTES:END -->

## Final Summary

<!-- SECTION:FINAL_SUMMARY:BEGIN -->
Closed both medium findings from scan 450ca0d3 locally with mailbox ownership proof and a network limit. Production rollout and hosted sender verification require separate approval.
<!-- SECTION:FINAL_SUMMARY:END -->

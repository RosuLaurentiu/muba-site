---
id: MS-014
title: Finish the rider booking journey for release
status: To Do
assignee: []
created_date: '2026-11-21 21:47'
updated_date: '2026-11-21 21:57'
labels: []
dependencies:
  - MS-010
references:
  - MS-006
  - MS-015
priority: high
type: enhancement
ordinal: 21000
---

## Description

<!-- SECTION:DESCRIPTION:BEGIN -->
Apply the approved booking and privacy wording to the existing bilingual rider experience before public release.
<!-- SECTION:DESCRIPTION:END -->

## Current Checkpoint

<!-- SECTION:CURRENT_CHECKPOINT:BEGIN -->
```yaml
done: >-
  Local Chromium fixtures passed one-way and return requests, editing, manual
  addresses without Maps, retry through a lost response and an intake pause, and
  private status. Local Supabase confirmed same-key idempotency, denied
  unassigned access, and rejected stale decisions and overlaps.
next: >-
  Apply approved EN and FR policy and privacy wording after MS-010. Recheck the
  final candidate on the hosted test site.
latestChange: >-
  Local rehearsal passed the bilingual rider flow and same-request retry. Final
  copy still needs owner decisions.
resultAt: '2026-11-21T21:57:26.774Z'
remainingChecks:
  - MS-010 approved booking and privacy wording
  - Hosted release candidate rider walkthrough
```
<!-- SECTION:CURRENT_CHECKPOINT:END -->

## Acceptance Criteria
<!-- AC:BEGIN -->
- [ ] #1 The current visual design is retained. Rider screens make the estimate, saved request, later confirmation and approved service and privacy terms clear in English and French.
- [ ] #2 Verify one-way and return, edits, manual addresses without Maps, a lost-response retry creating one request, and private status after a driver decision.
<!-- AC:END -->

## Implementation Notes

<!-- SECTION:NOTES:BEGIN -->
2026-11-21T21:57:26.775Z: Local rehearsal passed the bilingual rider flow and same-request retry. Final copy still needs owner decisions.
<!-- SECTION:NOTES:END -->

---
id: MS-031
title: Protect reserved web booking and verification capacity
status: Done
assignee:
  - '@codex'
created_date: '2026-11-27 23:38'
updated_date: '2026-11-27 23:48'
completed_date: '2026-11-27T23:48:32.405Z'
labels: []
dependencies: []
type: bug
ordinal: 45000
---

## Description

<!-- SECTION:DESCRIPTION:BEGIN -->
The 27 November security report found shared quota exhaustion and an email activity disclosure in the booking flow after MS-027.
<!-- SECTION:DESCRIPTION:END -->

## Current Checkpoint

<!-- SECTION:CURRENT_CHECKPOINT:BEGIN -->
```yaml
done: >-
  All three findings fixed and verified on a fresh isolated database and through
  the English and French browser flows.
next: >-
  Hosted rollout requires owner approval. Apply the migration before publishing
  the rider and driver screens.
latestChange: >-
  Verified protected booking and code capacity and indistinguishable public code
  replies on a local Supabase stack. Production was not changed.
resultAt: '2026-11-27T23:48:32.383Z'
remainingChecks: []
```
<!-- SECTION:CURRENT_CHECKPOINT:END -->

## Time & Usage

<!-- SECTION:TIME_USAGE:BEGIN -->
```json
{
  "sessions": [
    {
      "id": "codex-01a21f5d-aee8-7d53-bdb5-dcbae7a63c53-activity",
      "actor": "agent",
      "label": "Codex (estimate)",
      "state": "stopped",
      "intervals": [
        {
          "start": "2026-11-27T23:38:56.846Z",
          "end": "2026-11-27T23:40:04.133Z"
        },
        {
          "start": "2026-11-27T23:47:13.398Z",
          "end": "2026-11-27T23:48:28.401Z"
        }
      ]
    }
  ],
  "usage": [
    {
      "source": "codex-task-estimate",
      "runId": "01a21f5d-aee8-7d53-bdb5-dcbae7a63c53",
      "segmentId": "auto-1795822736848",
      "mode": "cumulative",
      "shared": true,
      "model": "gpt-6.2-astra",
      "scope": "task",
      "attribution": {
        "taskId": "MS-031",
        "planningRoot": "C:\\Users\\rosu_\\Desktop\\Development\\Muba Site",
        "start": "2026-11-27T23:38:56.848Z",
        "end": "2026-11-27T23:39:56.368Z"
      },
      "tokens": {
        "input": 335564,
        "output": 1946,
        "cachedInput": 329216,
        "reasoningOutput": 300,
        "total": 337510
      },
      "evidence": [
        "codex-session:01a21f5d-aee8-7d53-bdb5-dcbae7a63c53"
      ],
      "recordedAt": "2026-11-27T23:39:56.368Z"
    },
    {
      "source": "codex-task-estimate",
      "runId": "01a21f5d-aee8-7d53-bdb5-dcbae7a63c53",
      "segmentId": "auto-1795823233400",
      "mode": "cumulative",
      "shared": true,
      "model": "gpt-6.2-astra",
      "scope": "task",
      "attribution": {
        "taskId": "MS-031",
        "planningRoot": "C:\\Users\\rosu_\\Desktop\\Development\\Muba Site",
        "start": "2026-11-27T23:47:13.400Z",
        "end": "2026-11-27T23:48:10.384Z"
      },
      "tokens": {
        "input": 361033,
        "output": 1288,
        "cachedInput": 355328,
        "reasoningOutput": 314,
        "total": 362321
      },
      "evidence": [
        "codex-session:01a21f5d-aee8-7d53-bdb5-dcbae7a63c53"
      ],
      "recordedAt": "2026-11-27T23:48:10.384Z"
    }
  ],
  "corrections": []
}
```
<!-- SECTION:TIME_USAGE:END -->

## Acceptance Criteria
<!-- AC:BEGIN -->
- [x] #1 Public requests cannot consume driver-assisted capacity for a fresh rider or exceed the existing code and ride ceilings.
- [x] #2 Public responses conceal pending mailbox state and repeated requests preserve the original proof.
- [x] #3 Local checks cover protected admission, ordinary bookings, limits, and the bilingual flow.
<!-- AC:END -->

## Implementation Plan

<!-- SECTION:PLAN:BEGIN -->
[100%] Trace the three reported paths.
[100%] Protect admission and mailbox privacy.
[100%] Verify database and browser flows and review the change.
<!-- SECTION:PLAN:END -->

## Implementation Notes

<!-- SECTION:NOTES:BEGIN -->
Distinct outcome: MS-027 limited individual networks. This follow-up covers combined traffic and mailbox privacy.

2026-11-27T23:48:32.383Z: Verified protected booking and code capacity and indistinguishable public code replies on a local Supabase stack. Production was not changed.
<!-- SECTION:NOTES:END -->

## Final Summary

<!-- SECTION:FINAL_SUMMARY:BEGIN -->
Verified the driver-assisted reserve within existing limits, uniform public responses and one-time proof. English and French browser bookings, intake, storage, email, archive and restore, advisors, lint, fast tests and build passed. Production gateway and external email delivery were not tested.
<!-- SECTION:FINAL_SUMMARY:END -->

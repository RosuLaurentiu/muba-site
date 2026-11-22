---
id: MS-020
title: Allow a second Google login for driver testing
status: In Progress
assignee:
  - '@codex'
created_date: '2026-11-22 01:20'
updated_date: '2026-11-22 02:14'
labels: []
dependencies: []
references:
  - MS-003
  - MS-008
modified_files:
  - README.md
  - src/CalendarPanel.jsx
  - supabase/migrations/20261122012000_allow_driver_tester.sql
  - supabase/functions/calendar-sync/handler.mjs
  - supabase/tests/booking-email.mjs
  - supabase/tests/calendar-sync.mjs
priority: high
type: enhancement
ordinal: 27000
---

## Description

<!-- SECTION:DESCRIPTION:BEGIN -->
Let the primary driver and one named tester use the same workspace. Preserve the primary recipient of web booking alerts and control of the shared Google Calendar.
<!-- SECTION:DESCRIPTION:END -->

## Current Checkpoint

<!-- SECTION:CURRENT_CHECKPOINT:BEGIN -->
```yaml
done: >-
  Local authorization, Calendar restrictions, and driver workspace checks
  passed. Saved the exact driver OAuth redirect and installed hosted migration
  20261122015111 from commit 4d3a3ff. Verified the public driver build uses the
  saved redirect and hosted Supabase returns 302 to Google. The primary driver
  and Calendar assignment were preserved.
next: >-
  Provision and assign the business Auth account, then complete Google sign-in
  and driver workspace checks for both approved accounts.
latestChange: >-
  Google provider is enabled and redirects to Google. The primary account
  exists. The business Auth user and tester assignment are pending, and no
  primary Google sign-in is recorded yet.
resultAt: '2026-11-22T02:14:58.012Z'
remainingChecks:
  - Business account provisioned and assigned
  - Both Google accounts open the hosted driver workspace
```
<!-- SECTION:CURRENT_CHECKPOINT:END -->

## Time & Usage

<!-- SECTION:TIME_USAGE:BEGIN -->
```json
{
  "sessions": [
    {
      "id": "codex-01a2000a-86d0-7722-9349-886d24da4f86-activity",
      "actor": "agent",
      "label": "Codex (estimate)",
      "state": "stopped",
      "intervals": [
        {
          "start": "2026-11-22T01:52:32.035Z",
          "end": "2026-11-22T01:52:49.678Z"
        },
        {
          "start": "2026-11-22T02:13:56.537Z",
          "end": "2026-11-22T02:14:54.936Z"
        }
      ]
    }
  ],
  "usage": [
    {
      "source": "codex-task-estimate",
      "runId": "01a2000a-86d0-7722-9349-886d24da4f86",
      "segmentId": "auto-1795312357830",
      "mode": "cumulative",
      "shared": true,
      "model": "gpt-6.2-sol",
      "scope": "task",
      "attribution": {
        "taskId": "MS-020",
        "planningRoot": "C:\\Users\\rosu_\\Desktop\\Development\\Muba Site",
        "start": "2026-11-22T01:52:37.830Z",
        "end": "2026-11-22T01:52:42.855Z"
      },
      "tokens": {
        "input": 42040,
        "output": 67,
        "cachedInput": 41088,
        "reasoningOutput": 0,
        "total": 42107
      },
      "evidence": [
        "codex-session:01a2000a-86d0-7722-9349-886d24da4f86"
      ],
      "recordedAt": "2026-11-22T01:52:42.855Z"
    },
    {
      "source": "codex-task-estimate",
      "runId": "01a2000a-86d0-7722-9349-886d24da4f86",
      "segmentId": "auto-1795313639960",
      "mode": "cumulative",
      "shared": true,
      "model": "gpt-6.2-sol",
      "scope": "task",
      "attribution": {
        "taskId": "MS-020",
        "planningRoot": "C:\\Users\\rosu_\\Desktop\\Development\\Muba Site",
        "start": "2026-11-22T02:13:59.960Z",
        "end": "2026-11-22T02:14:48.002Z"
      },
      "tokens": {
        "input": 457503,
        "output": 1175,
        "cachedInput": 449664,
        "reasoningOutput": 49,
        "total": 458678
      },
      "evidence": [
        "codex-session:01a2000a-86d0-7722-9349-886d24da4f86"
      ],
      "recordedAt": "2026-11-22T02:14:48.002Z"
    }
  ],
  "corrections": []
}
```
<!-- SECTION:TIME_USAGE:END -->

## Acceptance Criteria
<!-- AC:BEGIN -->
- [x] #1 The primary driver and assigned tester can access the same schedule and booking records. Other accounts have no access and removal takes effect for an active tester session.
- [x] #2 Only the primary driver receives new-booking email alerts and can manage the shared Calendar connection.
- [ ] #3 Google sign-in works for both approved accounts in the hosted test environment.
<!-- AC:END -->

## Implementation Notes

<!-- SECTION:NOTES:BEGIN -->
Distinct outcome: MS-003 delivered Google sign-in for one driver; this adds a separately assigned login for the owner to test.

2026-11-22T01:24:18.701Z: Shared workspace access and primary-only integrations passed locally. Hosted Google setup requires dashboard access and provisioning the business account.

2026-11-22T01:52:53.540Z: Prior current facts: {"done":"Added a separately assigned tester login. Local checks proved shared ride access, tester writes, active-session revocation, primary-only alerts and Calendar restriction. Both roles passed the EN/FR mobile workspace checks. Lint, build, Calendar type check and database regressions passed.","resultAt":"2026-11-22T01:24:18.700Z"}

2026-11-22T02:14:58.013Z: Prior current facts: {"latestChange":"Hosted second-login slot is ready. Google is disabled with a blank OAuth secret. The business Auth account is absent and the tester slot is empty.","done":"Local authorization, Calendar restrictions, and driver workspace checks passed. Saved the exact driver OAuth redirect and installed hosted migration 20261122015111 from commit 4d3a3ff. Verified the primary driver and Calendar connection remain assigned to the existing owner.","resultAt":"2026-11-22T01:52:53.539Z"}
<!-- SECTION:NOTES:END -->

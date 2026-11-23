---
id: MS-015
title: Prepare production operations for booking
status: In Progress
assignee:
  - '@codex'
created_date: '2026-11-21 21:47'
updated_date: '2026-11-22 15:34'
labels: []
dependencies: []
references:
  - README.md
  - MS-011
  - MS-017
modified_files:
  - README.md
  - supabase/booking-archive.ps1
  - supabase/tests/pilot-retention.ps1
priority: high
type: task
ordinal: 22000
---

## Description

<!-- SECTION:DESCRIPTION:BEGIN -->
The public booking service needs a tested operating and recovery procedure and named ownership for missed requests.
<!-- SECTION:DESCRIPTION:END -->

## Current Checkpoint

<!-- SECTION:CURRENT_CHECKPOINT:BEGIN -->
```yaml
done: >-
  Verified the retention cutoff, intake pause and purge locally. The owner chose
  temporary booking storage without project-managed backups. Historical
  fictional restore evidence remains recorded.
next: >-
  After separate deployment approval, verify hosted driver access, limits, daily
  purge and intake pause. Verify Calendar deletion for purged rides when
  mirrored.
latestChange: >-
  Removed the backup rollout and restore requirement from active scope.
  Production retention and access checks still require approval.
resultAt: '2026-11-22T15:34:08.246Z'
evidence:
  - >-
    netcup SSH, PostgreSQL port reachability, official pg_dump and pg_restore
    17.12
  - >-
    VPS AES-256-GCM backup envelope and fictional PostgreSQL restore verified
    without exporting passenger data.
remainingChecks:
  - Hosted access and intake limits
  - Hosted daily retention purge and Calendar follow-up where applicable
  - Hosted intake pause and resume
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
          "start": "2026-11-21T23:43:57.959Z",
          "end": "2026-11-21T23:44:54.871Z"
        }
      ]
    },
    {
      "id": "codex-01a2011c-48f4-77f3-a974-7f8036e91ba3-activity",
      "actor": "agent",
      "label": "Codex (estimate)",
      "state": "stopped",
      "intervals": [
        {
          "start": "2026-11-22T14:36:00.782Z",
          "end": "2026-11-22T14:36:37.024Z"
        }
      ]
    }
  ],
  "usage": [
    {
      "source": "codex-task-estimate",
      "runId": "01a2000a-86d0-7722-9349-886d24da4f86",
      "segmentId": "auto-1795304642437",
      "mode": "cumulative",
      "shared": true,
      "model": "gpt-6.2-sol",
      "scope": "task",
      "attribution": {
        "taskId": "MS-015",
        "planningRoot": "C:\\Users\\rosu_\\Desktop\\Development\\Muba Site",
        "start": "2026-11-21T23:44:02.437Z",
        "end": "2026-11-21T23:44:30.946Z"
      },
      "tokens": {
        "input": 412908,
        "output": 756,
        "cachedInput": 402944,
        "reasoningOutput": 450,
        "total": 413664
      },
      "evidence": [
        "codex-session:01a2000a-86d0-7722-9349-886d24da4f86"
      ],
      "recordedAt": "2026-11-21T23:44:30.946Z"
    },
    {
      "source": "codex-task-estimate",
      "runId": "01a2011c-48f4-77f3-a974-7f8036e91ba3",
      "segmentId": "auto-1795358164446",
      "mode": "cumulative",
      "shared": true,
      "model": "gpt-6.2-sol",
      "scope": "task",
      "attribution": {
        "taskId": "MS-015",
        "planningRoot": "C:\\Users\\rosu_\\Desktop\\Development\\Muba Site",
        "start": "2026-11-22T14:36:04.446Z",
        "end": "2026-11-22T14:36:16.117Z"
      },
      "tokens": {
        "input": 299482,
        "output": 362,
        "cachedInput": 294400,
        "reasoningOutput": 82,
        "total": 299844
      },
      "evidence": [
        "codex-session:01a2011c-48f4-77f3-a974-7f8036e91ba3"
      ],
      "recordedAt": "2026-11-22T14:36:16.117Z"
    }
  ],
  "corrections": []
}
```
<!-- SECTION:TIME_USAGE:END -->

## Acceptance Criteria
<!-- AC:BEGIN -->
- [ ] #1 Verify assigned-driver access, private status, passenger data protection and public booking and email limits for the approved environment.
- [ ] #2 Verify the approved 90-day purge and confirm deletion of expired mirrored bookings when Calendar is used.
- [ ] #3 Rehearse pausing new web requests while private status, driver operations, and phone or WhatsApp contact remain available.
<!-- AC:END -->

## Implementation Plan

<!-- SECTION:PLAN:BEGIN -->
[100%] Rehearse retention, intake pause and access locally. [10%] Prepare production checks under the approved temporary-data policy. [0%] Verify hosted behavior after separate owner approval.
<!-- SECTION:PLAN:END -->

## Implementation Notes

<!-- SECTION:NOTES:BEGIN -->
2026-11-21T21:57:24.954Z: The disposable SQL rehearsal and browser fixtures verified local intake pause and rider fallback. Hosted operations and production scheduling are pending approval and verification.

2026-11-21T23:47:44.219Z: Prior current facts: {"done":"Locally verified the anonymous intake pause and resume, private status and signed-in driver operations. The disposable rehearsal passed 90-day purge, seven encrypted daily copies and a private booking restore. Existing local Auth, booking, email and Calendar integration tests passed.","resultAt":"2026-11-21T21:57:24.953Z"}

2026-11-21T23:47:44.219Z: The maintained recovery rehearsal now exercises the reusable archive functions. It rejects a wrong key and preserves good archives on export failure. Local operations checks passed. Candidate scheduling and hosted verification are still open.

2026-11-22T00:14:21.093Z: Prior current facts: {"done":"The reusable archive script exports and restores an authenticated encrypted dump. Disposable local databases passed the 90-day purge, seven-day archive window, incorrect-key rejection, failed-export preservation, private-status recovery and intake pause and resume. The local API passed approved intake and receipt limits, same-key retry, manual ride exemption and return rescheduling. Lint, build and fare, rider-input and schedule tests passed.","resultAt":"2026-11-21T23:47:44.219Z"}

2026-11-22T00:14:21.093Z: Recorded operational ownership for missed requests, delivery failures, the first export and the intake pause decision.

2026-11-22T00:17:45.089Z: Prior current facts: {"done":"The reusable archive script exports and restores an authenticated encrypted dump. Disposable local databases passed the 90-day purge, seven-day archive window, incorrect-key rejection, failed-export preservation, private-status recovery and intake pause and resume. The local API passed approved intake and receipt limits, same-key retry, manual ride exemption and return rescheduling. Lint, build and fare, rider-input and schedule tests passed. The driver owns the booking inbox and follows up on missed alerts by phone or WhatsApp. The owner checks delivery failures and the first scheduled export, and decides whether to pause web intake.","resultAt":"2026-11-22T00:14:21.093Z"}

2026-11-22T00:17:45.089Z: Recorded the planned VPS runner and permission to create a dedicated private archive location off the VPS. No storage account was specified.

2026-11-22T14:36:42.722Z: Prior current facts: {"done":"Local checks passed for the 90-day purge, seven-day encrypted archives, isolated restore, intake pause, access and approved intake limits. Owner approved driver inbox coverage and owner recovery checks. Plan to use the existing VPS as the backup runner, with a dedicated private archive location off the VPS and separate key storage.","resultAt":"2026-11-22T00:17:45.089Z"}

2026-11-22T14:36:42.723Z: Recorded the existing VPS as the single encrypted backup destination. The VPS connection and restore have yet to be verified.

2026-11-22T14:51:16.485Z: Prior current facts: {"done":"Local checks passed for the 90-day purge, seven-day encrypted archives, isolated restore, intake pause, access and approved intake limits. Owner approved launch with Muba Booking as the live database and the existing VPS as the single encrypted backup destination.","resultAt":"2026-11-22T14:36:42.722Z"}

2026-11-22T14:51:16.485Z: Verified the netcup VPS, PostgreSQL 17 tools and an isolated encrypted restore with fictional data. The first live archive awaits dedicated backup access.

2026-11-22T14:57:28.672Z: Removed backup as a launch prerequisite and verified that the dedicated login was not created.

2026-11-22T15:34:08.247Z: Prior current facts: {"done":"Local checks passed for the 90-day purge, seven-day encrypted archives, isolated restore, intake pause, access and approved intake limits. Owner approved launch with Muba Booking as the live database and the existing VPS as the single encrypted backup destination. Confirmed netcup SSH access and direct TCP connectivity to the PostgreSQL 17 service. Prepared a private archive directory and verified the official PostgreSQL 17 clients. An encrypted fictional archive was restored into an isolated VPS database and the fixture was removed.","resultAt":"2026-11-22T14:51:16.484Z"}

2026-11-22T15:34:08.247Z: Removed the backup rollout and restore requirement from active scope. Production retention and access checks still require approval.
<!-- SECTION:NOTES:END -->

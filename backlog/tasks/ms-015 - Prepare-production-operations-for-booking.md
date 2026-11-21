---
id: MS-015
title: Prepare production operations for booking
status: In Progress
assignee:
  - '@codex'
created_date: '2026-11-21 21:47'
updated_date: '2026-11-21 23:47'
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
  The reusable archive script exports and restores an authenticated encrypted
  dump. Disposable local databases passed the 90-day purge, seven-day archive
  window, incorrect-key rejection, failed-export preservation, private-status
  recovery and intake pause and resume. The local API passed approved intake and
  receipt limits, same-key retry, manual ride exemption and return rescheduling.
  Lint, build and fare, rider-input and schedule tests passed.
next: >-
  Confirm the hosted candidate, privileged purge connection, scheduler, archive
  directory, key custody and first-day operator. Rehearse with the candidate
  before public release.
latestChange: >-
  The maintained recovery rehearsal now exercises the reusable archive
  functions. It rejects a wrong key and preserves good archives on export
  failure. Local operations checks passed. Candidate scheduling and hosted
  verification are still open.
resultAt: '2026-11-21T23:47:44.219Z'
remainingChecks:
  - 'Hosted authorization, access and approved intake limits'
  - >-
    Hosted scheduled 90-day purge and daily encrypted export with a verified
    isolated restore
  - Hosted intake pause and resume with rider fallback and driver access
  - Named operator and alert destination
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
    }
  ],
  "corrections": []
}
```
<!-- SECTION:TIME_USAGE:END -->

## Acceptance Criteria
<!-- AC:BEGIN -->
- [ ] #1 Verify assigned-driver access, private status, passenger data protection and public booking and email limits for the approved environment.
- [ ] #2 Verify the approved 90-day purge, seven daily encrypted exports, and a local restore of a fictional booking.
- [ ] #3 Rehearse pausing new web requests while private status, driver operations, and phone or WhatsApp contact remain available.
<!-- AC:END -->

## Implementation Notes

<!-- SECTION:NOTES:BEGIN -->
2026-11-21T21:57:24.954Z: The disposable SQL rehearsal and browser fixtures verified local intake pause and rider fallback. Hosted operations and production scheduling are pending approval and verification.

2026-11-21T23:47:44.219Z: Prior current facts: {"done":"Locally verified the anonymous intake pause and resume, private status and signed-in driver operations. The disposable rehearsal passed 90-day purge, seven encrypted daily copies and a private booking restore. Existing local Auth, booking, email and Calendar integration tests passed.","resultAt":"2026-11-21T21:57:24.953Z"}

2026-11-21T23:47:44.219Z: The maintained recovery rehearsal now exercises the reusable archive functions. It rejects a wrong key and preserves good archives on export failure. Local operations checks passed. Candidate scheduling and hosted verification are still open.
<!-- SECTION:NOTES:END -->

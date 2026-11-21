---
id: MS-011
title: Verify hosted booking email delivery and recovery
status: In Progress
assignee:
  - '@codex'
created_date: '2026-11-21 15:23'
updated_date: '2026-11-21 21:48'
labels: []
dependencies: []
references:
  - README.md
  - >-
    backlog/tasks/ms-002 -
    Revamp-Private-Taxi-Paris-for-rider-reservations-and-driver-scheduling.md
  - backlog/tasks/ms-008 - Alert-the-assigned-driver-to-new-web-bookings.md
  - backlog/tasks/ms-002.07 - Keep-riders-informed-when-a-booking-changes.md
documentation:
  - backlog/evidence/MS-011/review.md
priority: high
type: task
ordinal: 18000
---

## Description

<!-- SECTION:DESCRIPTION:BEGIN -->
Use the existing hosted test site with fictional bookings and controlled inboxes before the separate public release decision. Retain the local retention and recovery evidence.
<!-- SECTION:DESCRIPTION:END -->

## Current Checkpoint

<!-- SECTION:CURRENT_CHECKPOINT:BEGIN -->
```yaml
done: >-
  Passed an isolated fictional-data test for the 90-day purge, Calendar removal
  queue, seven dated encrypted archives and private booking recovery.
next: >-
  Verify real phone alert, rider update and delivery recovery with controlled
  inboxes after sender approval.
latestChange: >-
  Replaced the regular-rider pilot with the owner-selected controlled hosted
  test. Existing local retention and restore evidence still applies.
resultAt: '2026-11-21T17:00:25.543Z'
remainingChecks:
  - 'Approval for test sender, provider and cost ceiling'
  - Driver alert with workspace closed and opted-in rider update
  - Visible failed delivery and verified recovery
  - Link the release-candidate rehearsal and hand over to MS-016
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
          "start": "2026-11-21T21:46:57.109Z",
          "end": "2026-11-21T21:48:06.321Z"
        }
      ]
    }
  ],
  "usage": [
    {
      "source": "codex-task-estimate",
      "runId": "01a2000a-86d0-7722-9349-886d24da4f86",
      "segmentId": "auto-1795297625600",
      "mode": "cumulative",
      "shared": true,
      "model": "gpt-6.2-sol",
      "scope": "task",
      "attribution": {
        "taskId": "MS-011",
        "planningRoot": "C:\\Users\\rosu_\\Desktop\\Development\\Muba Site",
        "start": "2026-11-21T21:47:05.600Z",
        "end": "2026-11-21T21:48:06.321Z"
      },
      "tokens": {
        "input": 404950,
        "output": 2151,
        "cachedInput": 397952,
        "reasoningOutput": 753,
        "total": 407101
      },
      "evidence": [
        "codex-session:01a2000a-86d0-7722-9349-886d24da4f86"
      ],
      "recordedAt": "2026-11-21T21:48:06.321Z"
    }
  ],
  "corrections": []
}
```
<!-- SECTION:TIME_USAGE:END -->

## Acceptance Criteria
<!-- AC:BEGIN -->
- [ ] #1 With the approved test setup, show that one fictional web booking alerts the driver on his phone while the workspace is closed and that an opted-in rider receives an update after the ride changes. Verify that a failed delivery is visible and can be recovered without duplicating the ride.
- [x] #2 Demonstrate the approved data safeguards with test records: passenger data is removed after the 90-day retention period, daily encrypted exports are kept for seven days, and a local restore recovers a usable test booking.
- [ ] #3 Record test environment, sender, provider and delivery cost limit, controlled recipients, and the missed-alert fallback.
- [ ] #4 Link the release-candidate walkthrough and report go-or-hold evidence for all delivery checks to MS-016.
<!-- AC:END -->

## Implementation Plan

<!-- SECTION:PLAN:BEGIN -->
Prove retention and encrypted recovery using fictional data locally. Record pilot scope and outstanding approvals. A real phone delivery check requires an approved environment and sender.
<!-- SECTION:PLAN:END -->

## Implementation Notes

<!-- SECTION:NOTES:BEGIN -->
2026-11-21T16:55:17.858Z: Started local retention and recovery work without sending email or provisioning a pilot environment.

2026-11-21T17:00:25.544Z: Prior current facts: {"done":"The rider and driver flows are locally verified. Owner approval is still required for deployment and live sender setup.","resultAt":"2026-11-21T16:55:17.857Z"}

2026-11-21T17:00:25.544Z: Verified the 90-day retention boundary, seven dated encrypted copies and private link restore with fictional data. Ride, email and Calendar regressions passed. Live pilot approval is still pending.

2026-11-21T21:48:11.388Z: Replaced the regular-rider pilot with the owner-selected controlled hosted test. Existing local retention and restore evidence still applies.
<!-- SECTION:NOTES:END -->

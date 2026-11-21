---
id: MS-002
title: Revamp Private Taxi Paris for rider reservations and driver scheduling
status: To Do
assignee: []
created_date: '2026-11-21 11:52'
updated_date: '2026-11-21 15:23'
labels: []
dependencies: []
references:
  - backlog/evidence/MS-001/review.md
  - >-
    backlog/tasks/ms-009 -
    Allow-travel-time-between-consecutive-driver-pickups.md
  - backlog/tasks/ms-010 - Agree-the-booking-rules-for-the-Paris-taxi-service.md
  - >-
    backlog/tasks/ms-011 -
    Prepare-a-small-pilot-with-the-driver-and-regular-riders.md
priority: high
type: feature
ordinal: 2000
---

## Description

<!-- SECTION:DESCRIPTION:BEGIN -->
The current site prepares messages. The owner wants clients to request rides and one driver to manage all rides in the app, including phone and WhatsApp bookings. His Google Calendar displays confirmed rides. The app owns all changes and cancellations.
<!-- SECTION:DESCRIPTION:END -->

## Current Checkpoint

<!-- SECTION:CURRENT_CHECKPOINT:BEGIN -->
```yaml
done: >-
  All seven child tasks are marked Done. The parent walkthrough is still
  pending.
next: >-
  Run the existing acceptance walkthrough with the owner and driver on the
  driver's phone using the two fictional rides described in the task notes.
latestChange: >-
  Kept the driver rehearsal on MS-002 acceptance criterion 4 and recorded its
  two fictional rides. MS-009, MS-010 and MS-011 track the travel buffer,
  booking rules and pilot preparation. Driver and owner acceptance is pending.
resultAt: '2026-11-21T15:23:39.094Z'
remainingChecks:
  - >-
    Observe the driver walkthrough, record findings and check the parent
    acceptance criteria against the evidence.
```
<!-- SECTION:CURRENT_CHECKPOINT:END -->

## Time & Usage

<!-- SECTION:TIME_USAGE:BEGIN -->
```json
{
  "sessions": [
    {
      "id": "codex-01a1fde1-3b60-7c32-b412-7a77e7eff39c-activity",
      "actor": "agent",
      "label": "Codex (estimate)",
      "state": "stopped",
      "intervals": [
        {
          "start": "2026-11-21T15:20:35.898Z",
          "end": "2026-11-21T15:21:00.909Z"
        }
      ]
    }
  ],
  "usage": [
    {
      "source": "codex-task-estimate",
      "runId": "01a1fde1-3b60-7c32-b412-7a77e7eff39c",
      "segmentId": "auto-1795274439115",
      "mode": "cumulative",
      "shared": true,
      "model": "gpt-6.2-astra",
      "scope": "task",
      "attribution": {
        "taskId": "MS-002",
        "planningRoot": "C:\\Users\\rosu_\\Desktop\\Development\\Muba Site",
        "start": "2026-11-21T15:20:39.115Z",
        "end": "2026-11-21T15:21:00.213Z"
      },
      "tokens": {
        "input": 156619,
        "output": 615,
        "cachedInput": 154496,
        "reasoningOutput": 112,
        "total": 157234
      },
      "evidence": [
        "codex-session:01a1fde1-3b60-7c32-b412-7a77e7eff39c"
      ],
      "recordedAt": "2026-11-21T15:21:00.213Z"
    }
  ],
  "corrections": []
}
```
<!-- SECTION:TIME_USAGE:END -->

## Acceptance Criteria
<!-- AC:BEGIN -->
- [ ] #1 In the accepted bilingual rider flow a customer submits an advance ride request and can distinguish receipt from driver confirmation.
- [ ] #2 On a phone the signed-in driver handles online requests and manually recorded rides in the same schedule, with trip details and passenger contact available.
- [ ] #3 A confirmed ride appears once in the selected Google Calendar. Rescheduling and cancellation from the app update that event. Product acceptance covers one-way calendar sync.
- [ ] #4 The owner can walk through the agreed end-to-end journey on a test environment before a separate release decision.
<!-- AC:END -->

## Implementation Notes

<!-- SECTION:NOTES:BEGIN -->
Walkthrough for existing acceptance criterion 4. On the driver's phone in the test environment, use two fictional consecutive bookings: an airport pickup requested on the website and a return ride agreed over WhatsApp. Have the driver accept the web request, enter the manual ride, find the passenger and pickup details, reschedule a leg and cancel a ride. Check that the rider status reflects the decision and the one-way test calendar reflects the changes. At the handoff between trips, ask whether the driver can reach the next pickup and how much time he would allow if the first ride has no finish estimate. Record observed friction, missing information and the owner's acceptance or outstanding items here. Use this result for MS-009 and MS-011; discuss policy questions under MS-010.

2026-11-21T15:23:39.095Z: Kept the driver rehearsal on MS-002 acceptance criterion 4 and recorded its two fictional rides. MS-009, MS-010 and MS-011 track the travel buffer, booking rules and pilot preparation. Driver and owner acceptance is pending.
<!-- SECTION:NOTES:END -->

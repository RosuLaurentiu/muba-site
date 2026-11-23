---
id: MS-002
title: Revamp Private Taxi Paris for rider reservations and driver scheduling
status: In Progress
assignee:
  - '@codex'
created_date: '2026-11-21 11:52'
updated_date: '2026-11-21 20:35'
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
  All seven children are Done. A 390-by-740 browser rehearsal on local Supabase
  passed the fictional airport request and WhatsApp ride, driver contact
  details, acceptance, rescheduling and cancellation. Rider status matched the
  saved decisions. Hosted Paris test database provisioned, six migration entries
  verified, current save and change functions matched source, and assigned
  driver verified. Local test bundle points to this backend. Separate test site
  published with driver-restricted access. Hosted test booking 1 appeared in
  Muba Calendar Test on 4 December at 11:25 Paris, moved to 12:25 with the same
  event ID, and disappeared after driver cancellation. Final sync completed.
next: >-
  Continue the remaining driver phone walkthrough with a manual ride and record
  owner and driver feedback.
latestChange: >-
  Confirmed the same Google event moved, then disappeared on cancellation in the
  app. Unknown-duration fix verified on the hosted test project.
resultAt: '2026-11-21T20:35:42.154Z'
remainingChecks:
  - Driver and owner walkthrough on the driver phone
  - Record friction and acceptance
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
        },
        {
          "start": "2026-11-21T19:55:27.659Z",
          "end": "2026-11-21T19:55:56.765Z"
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
    },
    {
      "source": "codex-task-estimate",
      "runId": "01a1fde1-3b60-7c32-b412-7a77e7eff39c",
      "segmentId": "auto-1795290931483",
      "mode": "cumulative",
      "shared": true,
      "model": "gpt-6.2-astra",
      "scope": "task",
      "attribution": {
        "taskId": "MS-002",
        "planningRoot": "C:\\Users\\rosu_\\Desktop\\Development\\Muba Site",
        "start": "2026-11-21T19:55:31.483Z",
        "end": "2026-11-21T19:55:45.681Z"
      },
      "tokens": {
        "input": 100597,
        "output": 423,
        "cachedInput": 98944,
        "reasoningOutput": 110,
        "total": 101020
      },
      "evidence": [
        "codex-session:01a1fde1-3b60-7c32-b412-7a77e7eff39c"
      ],
      "recordedAt": "2026-11-21T19:55:45.681Z"
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
- [x] #3 A confirmed ride appears once in the selected Google Calendar. Rescheduling and cancellation from the app update that event. Product acceptance covers one-way calendar sync.
- [ ] #4 The owner can walk through the agreed end-to-end journey on a test environment before a separate release decision.
<!-- AC:END -->

## Implementation Notes

<!-- SECTION:NOTES:BEGIN -->
Walkthrough for existing acceptance criterion 4. On the driver's phone in the test environment, use two fictional consecutive bookings: an airport pickup requested on the website and a return ride agreed over WhatsApp. Have the driver accept the web request, enter the manual ride, find the passenger and pickup details, reschedule a leg and cancel a ride. Check that the rider status reflects the decision and the one-way test calendar reflects the changes. At the handoff between trips, ask whether the driver can reach the next pickup and how much time he would allow if the first ride has no finish estimate. Record observed friction, missing information and the owner's acceptance or outstanding items here. Use this result for MS-009 and MS-011; discuss policy questions under MS-010.

2026-11-21T15:23:39.095Z: Kept the driver rehearsal on MS-002 acceptance criterion 4 and recorded its two fictional rides. MS-009, MS-010 and MS-011 track the travel buffer, booking rules and pilot preparation. Driver and owner acceptance is pending.

2026-11-21T15:29:31.813Z: Prior current facts: {"done":"All seven child tasks are marked Done. The parent walkthrough is still pending.","resultAt":"2026-11-21T15:23:39.094Z"}

2026-11-21T15:29:31.813Z: Local app and Calendar preflight passed. The phone walkthrough awaits the driver and a reachable test setup.

2026-11-21T15:31:33.630Z: Prior current facts: {"done":"All seven children are Done. The local site and Calendar gateway are running. The fictional booking and Calendar simulation preflight passed.","resultAt":"2026-11-21T15:29:31.812Z"}

2026-11-21T15:31:33.630Z: Passed the two-ride mobile browser rehearsal against local services. Driver phone feedback and test Calendar observation are still required.

2026-11-21T15:51:44.600Z: Owner confirmed that the driver phone walkthrough requires a deployed test app. Local browser evidence remains preflight only.

2026-11-21T19:56:20.260Z: Prepared the Pages build configuration and verified its guard locally. Hosted provisioning awaits organization selection.

2026-11-21T20:02:33.824Z: Prior current facts: {"done":"All seven children are Done. A 390-by-740 browser rehearsal on local Supabase passed the fictional airport request and WhatsApp ride, driver contact details, acceptance, rescheduling and cancellation. Rider status matched the saved decisions.","resultAt":"2026-11-21T15:31:33.629Z"}

2026-11-21T20:02:33.824Z: Hosted booking backend, restricted signup, assigned driver and configured local bundle verified. Frontend is not published.

2026-11-21T20:02:33.824Z: Hold lifted (decision): Owner authorized hosted test setup. Supabase organization choice and driver email are pending.

2026-11-21T20:05:34.115Z: Prior current facts: {"done":"All seven children are Done. A 390-by-740 browser rehearsal on local Supabase passed the fictional airport request and WhatsApp ride, driver contact details, acceptance, rescheduling and cancellation. Rider status matched the saved decisions. Hosted Paris test database provisioned, six migration entries verified, current save and change functions matched source, and assigned driver verified. Local test bundle points to this backend.","resultAt":"2026-11-21T20:02:33.823Z"}

2026-11-21T20:05:34.115Z: Published the separate test link with restricted driver access. Phone booking and driver acceptance remain open.

2026-11-21T20:35:42.155Z: Prior current facts: {"done":"All seven children are Done. A 390-by-740 browser rehearsal on local Supabase passed the fictional airport request and WhatsApp ride, driver contact details, acceptance, rescheduling and cancellation. Rider status matched the saved decisions. Hosted Paris test database provisioned, six migration entries verified, current save and change functions matched source, and assigned driver verified. Local test bundle points to this backend. Separate test site published with driver-restricted access.","resultAt":"2026-11-21T20:05:34.114Z"}

2026-11-21T20:35:42.155Z: Confirmed the same Google event moved, then disappeared on cancellation in the app. Unknown-duration fix verified on the hosted test project.
<!-- SECTION:NOTES:END -->

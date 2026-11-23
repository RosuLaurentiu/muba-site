---
id: MS-021
title: >-
  Keep booking usable without Maps and share fare estimates with driver and
  rider
status: Done
assignee:
  - '@claude'
created_date: '2026-11-22 04:40'
updated_date: '2026-11-22 14:08'
completed_date: '2026-11-22T14:08:10.658Z'
labels: []
dependencies: []
references:
  - src/App.jsx
  - src/DriverWorkspace.jsx
modified_files:
  - src/App.jsx
  - src/DriverWorkspace.jsx
  - src/fare.js
  - src/App.css
  - src/i18n.js
  - supabase/migrations/20261122050000_share_rider_fare_estimate.sql
  - supabase/tests/ride-storage.mjs
priority: high
type: enhancement
ordinal: 35000
---

## Description

<!-- SECTION:DESCRIPTION:BEGIN -->
Follow-up to the 2026-11-22 UX audit, priorities 1-3. A Google Maps key rejection disabled both rider address fields (follow-up to MS-002.03). The driver quoted without the estimate the rider saw, the disabled Confirm gave no reason, quotes were typed by hand, the decision sat far down on phones and riders never saw a fare after sending.
<!-- SECTION:DESCRIPTION:END -->

## Current Checkpoint

<!-- SECTION:CURRENT_CHECKPOINT:BEGIN -->
```yaml
done: >-
  Implemented the Maps fallback, shared estimates and localized quote controls.
  Committed the exact tested changes as 72394f3; unrelated worktree edits were
  excluded. The latest schema is already present in Muba Booking.
next: Hosted worker rehearsal and public launch are tracked in MS-011 and MS-016.
latestChange: >-
  Committed the independently reviewed and tested fare-estimate candidate
  locally. Hosted email and public launch remain separate.
action: null
resultAt: '2026-11-22T14:08:10.642Z'
evidence:
  - >-
    Hosted history lists 20261121224500, 20261122002638, 20261122004449,
    20261122005750, 20261122025614 and 20261122050000 by repo version
  - >-
    Hosted read-only checks: agreed_fare_cents, estimated_fare_cents,
    receipt_key present; save_ride has notice rule and estimate; get_work_hours
    and save_work_hours exist; anon can run only save_ride and get_ride
  - >-
    Hosted RPC smoke test without writes: get_ride unknown key 200 null;
    save_ride string estimate 400 INVALID_FARE_ESTIMATE; get_work_hours as anon
    401
  - 72394f37f6934073897e52637b46225059992260
  - Isolated Chromium with Maps available and unavailable at 1280 and 390 pixels
  - >-
    Isolated local web and driver-entered bookings, receipt outbox, Calendar
    queue and backup restore
remainingChecks: []
affectedFiles:
  - src/App.jsx
  - src/DriverWorkspace.jsx
  - src/fare.js
  - src/App.css
  - src/i18n.js
  - supabase/migrations/20261122050000_share_rider_fare_estimate.sql
  - supabase/tests/ride-storage.mjs
```
<!-- SECTION:CURRENT_CHECKPOINT:END -->

## Time & Usage

<!-- SECTION:TIME_USAGE:BEGIN -->
```json
{
  "sessions": [
    {
      "id": "claude-5f10e85b-95a7-4b35-a0d6-ab8822af6300-activity",
      "actor": "agent",
      "label": "Claude Code (estimate)",
      "state": "stopped",
      "intervals": [
        {
          "start": "2026-11-22T04:46:09.036Z",
          "end": "2026-11-22T04:46:37.805Z"
        },
        {
          "start": "2026-11-22T04:48:54.740Z",
          "end": "2026-11-22T04:49:06.594Z"
        },
        {
          "start": "2026-11-22T04:52:46.935Z",
          "end": "2026-11-22T04:53:09.917Z"
        }
      ]
    }
  ],
  "usage": [
    {
      "source": "claude-task-estimate",
      "runId": "5f10e85b-95a7-4b35-a0d6-ab8822af6300",
      "segmentId": "auto-1795322769036",
      "mode": "cumulative",
      "shared": true,
      "model": "claude-opus-5-5",
      "scope": "task",
      "attribution": {
        "taskId": "MS-021",
        "planningRoot": "C:\\Users\\rosu_\\Desktop\\Development\\Muba Site",
        "start": "2026-11-22T04:46:09.036Z",
        "end": "2026-11-22T04:46:37.805Z"
      },
      "tokens": {
        "input": 891043,
        "output": 2354,
        "cachedInput": 887576,
        "reasoningOutput": null,
        "total": 893397
      },
      "evidence": [
        "claude-session:5f10e85b-95a7-4b35-a0d6-ab8822af6300"
      ],
      "recordedAt": "2026-11-22T04:46:37.805Z"
    },
    {
      "source": "claude-task-estimate",
      "runId": "5f10e85b-95a7-4b35-a0d6-ab8822af6300",
      "segmentId": "auto-1795322934740",
      "mode": "cumulative",
      "shared": true,
      "model": "claude-opus-5-5",
      "scope": "task",
      "attribution": {
        "taskId": "MS-021",
        "planningRoot": "C:\\Users\\rosu_\\Desktop\\Development\\Muba Site",
        "start": "2026-11-22T04:48:54.740Z",
        "end": "2026-11-22T04:49:06.594Z"
      },
      "tokens": {
        "input": 622474,
        "output": 882,
        "cachedInput": 620487,
        "reasoningOutput": null,
        "total": 623356
      },
      "evidence": [
        "claude-session:5f10e85b-95a7-4b35-a0d6-ab8822af6300"
      ],
      "recordedAt": "2026-11-22T04:49:06.594Z"
    },
    {
      "source": "claude-task-estimate",
      "runId": "5f10e85b-95a7-4b35-a0d6-ab8822af6300",
      "segmentId": "auto-1795323166935",
      "mode": "cumulative",
      "shared": true,
      "model": "claude-opus-5-5",
      "scope": "task",
      "attribution": {
        "taskId": "MS-021",
        "planningRoot": "C:\\Users\\rosu_\\Desktop\\Development\\Muba Site",
        "start": "2026-11-22T04:52:46.935Z",
        "end": "2026-11-22T04:53:09.917Z"
      },
      "tokens": {
        "input": 1282920,
        "output": 1849,
        "cachedInput": 1279795,
        "reasoningOutput": null,
        "total": 1284769
      },
      "evidence": [
        "claude-session:5f10e85b-95a7-4b35-a0d6-ab8822af6300"
      ],
      "recordedAt": "2026-11-22T04:53:09.917Z"
    }
  ],
  "corrections": []
}
```
<!-- SECTION:TIME_USAGE:END -->

## Acceptance Criteria
<!-- AC:BEGIN -->
- [x] #1 After a Google Maps failure both rider address fields stay enabled and editable, and the rider is told suggestions are unavailable.
- [x] #2 Web requests store the estimate shown to the rider; the driver sees it in the booking decision.
- [x] #3 The driver can open a prefilled quote email or WhatsApp message in the rider's language that includes the entered fare.
- [x] #4 When Confirm ride is disabled, the decision panel states what is missing.
- [x] #5 On phones the booking decision appears before the trip and passenger panels, with a trip summary.
- [x] #6 The rider receipt and status show the estimate, and the agreed fare once the driver records it.
- [x] #7 EN and FR copy for every new string; lint, build and local tests pass.
<!-- AC:END -->

## Implementation Notes

<!-- SECTION:NOTES:BEGIN -->
2026-11-22T04:46:22.308Z: Rider address fields stay editable after a Google Maps key rejection, and the rider sees a note that suggestions are unavailable. Web requests now store the whole-euro estimate the rider saw (new migration). The driver sees it in Booking decision, opens a pre-filled quote by email or WhatsApp in the rider's language, and sees what is still missing while Confirm is disabled. On phones the decision panel comes first, with a trip summary. The rider receipt and status show the estimate, and the agreed fare after confirmation. Not committed. The hosted migration still needs the owner's approval.

2026-11-22T04:48:55.216Z: Prior current facts: {"done":"All seven criteria implemented and checked locally in headless Chromium (EN/FR, desktop and phone). Migration 20261122050000 applied to the local stack only.","resultAt":"2026-11-22T04:46:22.307Z","evidence":["npm run lint and npm run build pass","rider-input, schedule, fare, work-hours, ride-storage and intake-limits tests pass","Browser: on 127.0.0.1 both address fields stay enabled, keep typed text and show the unavailable note","Browser: receipt shows Estimated fare EUR 20; driver sees the estimate; quote links carry the entered fare; Confirm help updates; after confirm the rider status shows Agreed fare EUR 52.50"]}

2026-11-22T04:48:55.216Z: The owner approved the hosted migration. Read-only checks show that the hosted Muba Booking Test project lacks five earlier repo migrations: web_intake_limits, require_accepted_web_fare, send_tracking_receipt_for_every_booking, enforce_web_notice_and_driver_quote_email and driver_work_hours. They are not in its history, and its schema has no agreed_fare_cents column. The new migration depends on two of them and was not applied. Hosted versions also differ from repo versions, so db push is unsafe. Nothing hosted changed.

2026-11-22T04:52:56.419Z: Prior current facts: {"done":"Hosted state inspected read-only; no hosted change made.","resultAt":"2026-11-22T04:48:55.216Z","evidence":["supabase migration list and read-only db query against the hosted test project: 7 hosted migrations, no agreed_fare_cents column, no get_work_hours function"]}

2026-11-22T04:52:56.419Z: With owner approval, six migrations were applied to the hosted Muba Booking Test project in repo order: web_intake_limits, require_accepted_web_fare, send_tracking_receipt_for_every_booking, enforce_web_notice_and_driver_quote_email, driver_work_hours and share_rider_fare_estimate. Each ran in its own transaction with a history row under its repo version. The hosted ride table now has agreed_fare_cents and estimated_fare_cents. save_ride enforces the 2-hour notice and validates the estimate. rider_fields returns both fares. Grants match the repo. The frontend changes are still uncommitted.

2026-11-22T04:52:56.419Z: Hold lifted (decision, release): Hosted test project lacks five prerequisite migrations; owner approval covered only the new one. Why: Owner approved applying all six migrations to the hosted test project.

2026-11-22T14:08:10.643Z: Prior current facts: {"done":"Code verified locally; six migrations applied and verified on the hosted test project.","resultAt":"2026-11-22T04:52:56.419Z"}

2026-11-22T14:08:10.643Z: Committed the independently reviewed and tested fare-estimate candidate locally. Hosted email and public launch remain separate.
<!-- SECTION:NOTES:END -->

## Final Summary

<!-- SECTION:FINAL_SUMMARY:BEGIN -->
MS-021 is implemented and verified in local release commit 72394f3. The associated schema was previously verified in Muba Booking. Public release remains in MS-016.
<!-- SECTION:FINAL_SUMMARY:END -->

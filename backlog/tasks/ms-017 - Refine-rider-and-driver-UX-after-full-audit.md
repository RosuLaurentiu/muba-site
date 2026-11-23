---
id: MS-017
title: Refine rider and driver UX after full audit
status: Done
assignee:
  - '@claude'
created_date: '2026-11-21 22:28'
updated_date: '2026-11-21 22:47'
completed_date: '2026-11-21T22:42:11.598Z'
labels: []
dependencies: []
modified_files:
  - src/App.jsx
  - src/DriverWorkspace.jsx
  - src/App.css
  - src/i18n.js
  - supabase/migrations/20261121224500_web_intake_limits.sql
  - supabase/tests/intake-limits.mjs
  - supabase/tests/rider-input.mjs
  - src/booking.js
  - src/DriverSchedule.jsx
  - README.md
  - src/schedule.js
  - supabase/tests/schedule.mjs
  - src/config.js
priority: medium
type: enhancement
ordinal: 24000
---

## Description

<!-- SECTION:DESCRIPTION:BEGIN -->
Audit and design critique on 2026-11-21 found small UX gaps in the rider receipt and status pages and the driver phone workflow.
<!-- SECTION:DESCRIPTION:END -->

## Current Checkpoint

<!-- SECTION:CURRENT_CHECKPOINT:BEGIN -->
```yaml
done: >-
  Cleaned up audit findings 3 to 5. The driver calendar and the schedule test
  now share one entriesByDay helper in schedule.js, which replaces the test-only
  entriesOnDay. i18n.js dropped from 636 to 352 lines by removing keys no code
  reads; EN and FR keys still match. config.js dropped the unused vehicleLabel,
  responsePromise, businessHours and calendlyUrl, so the Calendly link no longer
  ships in the bundle. Lint, build and unit tests pass. A browser check showed
  the rider copy in EN and FR with no missing keys, and the driver month and day
  views matched the earlier run. The throwaway driver data was removed. Not
  committed yet.
next: >-
  Owner approves the limit values (10/hour, 30/day, 3 receipts per address per
  day) and reviews the diff before commit.
latestChange: >-
  Cleaned up audit findings 3 to 5. The driver calendar and the schedule test
  now share one entriesByDay helper in schedule.js, which replaces the test-only
  entriesOnDay. i18n.js dropped from 636 to 352 lines by removing keys no code
  reads; EN and FR keys still match. config.js dropped the unused vehicleLabel,
  responsePromise, businessHours and calendlyUrl, so the Calendly link no longer
  ships in the bundle. Lint, build and unit tests pass. A browser check showed
  the rider copy in EN and FR with no missing keys, and the driver month and day
  views matched the earlier run. The throwaway driver data was removed. Not
  committed yet.
resultAt: '2026-11-21T22:47:35.669Z'
evidence:
  - npm run lint and npm run build pass
  - 'rider-input, schedule and fare tests pass'
  - >-
    Browser check: receipt copy link success and fallback, status page footer,
    decline confirm cancels without change, pending first on phone
  - supabase/migrations/20261121224500_web_intake_limits.sql
  - supabase/tests/intake-limits.mjs
  - supabase/tests/rider-input.mjs
  - src/booking.js
  - src/DriverSchedule.jsx
  - src/i18n.js
  - README.md
  - commit 4bbe61f
  - src/schedule.js
  - supabase/tests/schedule.mjs
  - src/config.js
affectedFiles:
  - supabase/migrations/20261121224500_web_intake_limits.sql
  - supabase/tests/intake-limits.mjs
  - supabase/tests/rider-input.mjs
  - src/booking.js
  - src/DriverSchedule.jsx
  - src/i18n.js
  - README.md
  - src/schedule.js
  - supabase/tests/schedule.mjs
  - src/config.js
ownedPaths:
  - src/App.jsx
  - src/DriverWorkspace.jsx
  - src/App.css
  - src/i18n.js
```
<!-- SECTION:CURRENT_CHECKPOINT:END -->

## Time & Usage

<!-- SECTION:TIME_USAGE:BEGIN -->
```json
{
  "sessions": [
    {
      "id": "claude-ac4356a7-1567-426b-ac5d-358b0e7ead43-activity",
      "actor": "agent",
      "label": "Claude Code (estimate)",
      "state": "stopped",
      "intervals": [
        {
          "start": "2026-11-21T22:32:36.361Z",
          "end": "2026-11-21T22:33:47.430Z"
        },
        {
          "start": "2026-11-21T22:40:35.412Z",
          "end": "2026-11-21T22:40:40.034Z"
        },
        {
          "start": "2026-11-21T22:42:10.225Z",
          "end": "2026-11-21T22:42:24.675Z"
        }
      ]
    }
  ],
  "usage": [
    {
      "source": "claude-task-estimate",
      "runId": "ac4356a7-1567-426b-ac5d-358b0e7ead43",
      "segmentId": "auto-1795300356361",
      "mode": "cumulative",
      "shared": true,
      "model": "claude-opus-5-5",
      "scope": "task",
      "attribution": {
        "taskId": "MS-017",
        "planningRoot": "C:\\Users\\rosu_\\Desktop\\Development\\Muba Site",
        "start": "2026-11-21T22:32:36.361Z",
        "end": "2026-11-21T22:33:47.430Z"
      },
      "tokens": {
        "input": 800925,
        "output": 6294,
        "cachedInput": 794663,
        "reasoningOutput": null,
        "total": 807219
      },
      "evidence": [
        "claude-session:ac4356a7-1567-426b-ac5d-358b0e7ead43"
      ],
      "recordedAt": "2026-11-21T22:33:47.430Z"
    },
    {
      "source": "claude-task-estimate",
      "runId": "ac4356a7-1567-426b-ac5d-358b0e7ead43",
      "segmentId": "auto-1795300930225",
      "mode": "cumulative",
      "shared": true,
      "model": "claude-opus-5-5",
      "scope": "task",
      "attribution": {
        "taskId": "MS-017",
        "planningRoot": "C:\\Users\\rosu_\\Desktop\\Development\\Muba Site",
        "start": "2026-11-21T22:42:10.225Z",
        "end": "2026-11-21T22:42:24.675Z"
      },
      "tokens": {
        "input": 625931,
        "output": 668,
        "cachedInput": 624677,
        "reasoningOutput": null,
        "total": 626599
      },
      "evidence": [
        "claude-session:ac4356a7-1567-426b-ac5d-358b0e7ead43"
      ],
      "recordedAt": "2026-11-21T22:42:24.675Z"
    }
  ],
  "corrections": []
}
```
<!-- SECTION:TIME_USAGE:END -->

## Acceptance Criteria
<!-- AC:BEGIN -->
- [x] #1 Receipt shows the trip time and lets the rider copy the private booking link
- [x] #2 Booking status page offers Call, WhatsApp and Email
- [x] #3 Driver ride detail labels the passenger, asks before declining, and lists pending requests before the agenda on a phone
- [x] #4 Lint and build pass and both languages are checked in the browser
<!-- AC:END -->

## Implementation Notes

<!-- SECTION:NOTES:BEGIN -->
Distinct outcome: MS-014 covers policy wording after MS-010; this is independent layout and copy polish.

2026-11-21T22:32:47.963Z: Prior current facts: {"latestChange":"Task created from audit findings.","done":"Audit and critique complete."}

2026-11-21T22:32:47.963Z: Receipt now lists the trip and has Copy private link with a bookmark fallback. The status page has Call, WhatsApp and Email. The passenger form uses the same panel and action bar as the trip form, and Edit trip replaces Edit details. The driver sees Passenger instead of Your name, a confirm before Decline, pending requests above the agenda on a phone, and equal-width action buttons. Address errors match the date wording. Autocomplete styling follows Light and Dark, and the unused pac-container helpers are gone. Lint, build and offline tests pass. Checked EN and FR, phone and desktop, on the local stack with fictional data, which was removed afterwards.

2026-11-21T22:40:35.737Z: Prior current facts: {"done":"UX refinements applied and verified locally in EN and FR on phone and desktop.","resultAt":"2026-11-21T22:32:47.963Z"}

2026-11-21T22:40:35.737Z: Fixed audit findings 1 and 2. A new migration limits anonymous web requests to 10 per hour and 30 per day (WEB_INTAKE_LIMIT, shown to riders as the phone fallback) and automatic receipts to 3 per address per day. Same-key retries and driver rides are not affected. change_ride now lets a confirmed round trip keep an outbound pickup that already happened while the return moves; moved legs must be in the future. The client editor matches. New intake-limits test, an extra rider-input case, and all local integration tests, advisors, lint and build pass. The owner still needs to approve the limit values.

2026-11-21T22:42:11.591Z: Prior current facts: {"done":"Fixed audit findings 1 and 2. A new migration limits anonymous web requests to 10 per hour and 30 per day (WEB_INTAKE_LIMIT, shown to riders as the phone fallback) and automatic receipts to 3 per address per day. Same-key retries and driver rides are not affected. change_ride now lets a confirmed round trip keep an outbound pickup that already happened while the return moves; moved legs must be in the future. The client editor matches. New intake-limits test, an extra rider-input case, and all local integration tests, advisors, lint and build pass. The owner still needs to approve the limit values.","resultAt":"2026-11-21T22:40:35.736Z"}

2026-11-21T22:42:11.591Z: Owner approved the limit values (10 web requests per hour, 30 per day, 3 receipts per address per day) and the commit. Committed as 4bbe61f on codex/muba-release-readiness. Not pushed. The hosted backend still needs this migration applied, which requires separate owner approval under MS-015.

2026-11-21T22:47:35.669Z: Prior current facts: {"done":"Owner approved the limit values (10 web requests per hour, 30 per day, 3 receipts per address per day) and the commit. Committed as 4bbe61f on codex/muba-release-readiness. Not pushed. The hosted backend still needs this migration applied, which requires separate owner approval under MS-015.","resultAt":"2026-11-21T22:42:11.591Z"}

2026-11-21T22:47:35.669Z: Cleaned up audit findings 3 to 5. The driver calendar and the schedule test now share one entriesByDay helper in schedule.js, which replaces the test-only entriesOnDay. i18n.js dropped from 636 to 352 lines by removing keys no code reads; EN and FR keys still match. config.js dropped the unused vehicleLabel, responsePromise, businessHours and calendlyUrl, so the Calendly link no longer ships in the bundle. Lint, build and unit tests pass. A browser check showed the rider copy in EN and FR with no missing keys, and the driver month and day views matched the earlier run. The throwaway driver data was removed. Not committed yet.
<!-- SECTION:NOTES:END -->

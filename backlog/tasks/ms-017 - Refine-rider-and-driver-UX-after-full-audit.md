---
id: MS-017
title: Refine rider and driver UX after full audit
status: In Progress
assignee:
  - '@claude'
created_date: '2026-11-21 22:28'
updated_date: '2026-11-21 22:40'
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
  Fixed audit findings 1 and 2. A new migration limits anonymous web requests to
  10 per hour and 30 per day (WEB_INTAKE_LIMIT, shown to riders as the phone
  fallback) and automatic receipts to 3 per address per day. Same-key retries
  and driver rides are not affected. change_ride now lets a confirmed round trip
  keep an outbound pickup that already happened while the return moves; moved
  legs must be in the future. The client editor matches. New intake-limits test,
  an extra rider-input case, and all local integration tests, advisors, lint and
  build pass. The owner still needs to approve the limit values.
next: >-
  Owner approves the limit values (10/hour, 30/day, 3 receipts per address per
  day) and reviews the diff before commit.
latestChange: >-
  Fixed audit findings 1 and 2. A new migration limits anonymous web requests to
  10 per hour and 30 per day (WEB_INTAKE_LIMIT, shown to riders as the phone
  fallback) and automatic receipts to 3 per address per day. Same-key retries
  and driver rides are not affected. change_ride now lets a confirmed round trip
  keep an outbound pickup that already happened while the return moves; moved
  legs must be in the future. The client editor matches. New intake-limits test,
  an extra rider-input case, and all local integration tests, advisors, lint and
  build pass. The owner still needs to approve the limit values.
resultAt: '2026-11-21T22:40:35.736Z'
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
affectedFiles:
  - supabase/migrations/20261121224500_web_intake_limits.sql
  - supabase/tests/intake-limits.mjs
  - supabase/tests/rider-input.mjs
  - src/booking.js
  - src/DriverSchedule.jsx
  - src/i18n.js
  - README.md
ownedPaths:
  - src/App.jsx
  - src/DriverWorkspace.jsx
  - src/App.css
  - src/i18n.js
ownerInput: 'Approve the web request and receipt limit values, then approve the commit.'
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
<!-- SECTION:NOTES:END -->

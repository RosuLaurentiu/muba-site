---
id: MS-029
title: Fix the remaining first-audit findings for riders and the driver
status: In Progress
assignee:
  - '@claude'
created_date: '2026-11-23 13:52'
updated_date: '2026-11-23 14:08'
labels: []
dependencies: []
references:
  - src/App.jsx
  - src/DriverWorkspace.jsx
  - src/DriverSchedule.jsx
  - src/i18n.js
modified_files:
  - src/App.jsx
  - src/App.css
  - src/DateTimeFields.jsx
  - src/DriverSchedule.jsx
  - src/DriverWorkspace.jsx
  - src/timeText.js
  - src/i18n.js
  - src/config.js
  - README.md
  - AGENTS.md
priority: medium
type: enhancement
ordinal: 43000
---

## Description

<!-- SECTION:DESCRIPTION:BEGIN -->
The owner asked to fix the eight findings still open from the first full UX audit (MS-021 fixed priorities 1-3; MS-028 fixed the phone audit).
<!-- SECTION:DESCRIPTION:END -->

## Current Checkpoint

<!-- SECTION:CURRENT_CHECKPOINT:BEGIN -->
```yaml
done: >-
  All eight open first-audit findings are fixed and verified in headless
  Chromium in EN and FR; lint, npm test (4/4) and build pass.
next: >-
  Owner reviews the diff and decides whether to commit; booking emails from
  supabase/functions/booking-email still use unaccented French until that
  function is updated and deployed.
latestChange: >-
  Fixed the eight remaining first-audit findings: past dates blocked, header
  Call and WhatsApp buttons on rider screens, theme-matched desktop map fitted
  to the route, pending status page checking every minute with a last-checked
  time, pending list with arrival time and passenger count, Next pickup with
  Today/Tomorrow and a countdown, Block time presets, in-page confirms for
  decline, cancel and remove, and accented French copy. Lint, tests, build and
  EN/FR browser checks pass. Nothing is committed.
resultAt: '2026-11-23T14:08:11.807Z'
evidence:
  - >-
    Header stays 61 px tall at 320, 360, 375 and 390 px in EN and FR with 38x44
    buttons; driver screens have no header contact.
  - Rider calendar disables all 28 days before today.
  - >-
    Desktop map is 1144 px wide inside a 1144 px frame and switches between dark
    and default styles with the theme.
  - >-
    Stubbed status page: Last checked text in EN/FR, one automatic check after
    60 s while pending, none after the ride is confirmed.
  - >-
    Pending list shows Received 2 hours ago and 1 passenger; Next pickup shows
    Today 17:30, in 2 h 23 min, finish 18:25.
  - >-
    Decline asks in the page (EN and FR), Escape closes and returns focus; Rest
    of today and All day fill the block times.
  - No console errors.
approach: >-
  Small changes in the existing components; new strings in i18n.js with EN/FR
  parity; time helpers in src/timeText.js.
remainingChecks:
  - >-
    A live booking through the status page was not possible because the local
    30-per-day web intake limit is used up by test rides.
affectedFiles:
  - src/App.jsx
  - src/App.css
  - src/DateTimeFields.jsx
  - src/DriverSchedule.jsx
  - src/DriverWorkspace.jsx
  - src/timeText.js
  - src/i18n.js
  - src/config.js
  - README.md
  - AGENTS.md
ownedPaths:
  - src/App.jsx
  - src/App.css
  - src/DateTimeFields.jsx
  - src/DriverSchedule.jsx
  - src/DriverWorkspace.jsx
  - src/timeText.js
  - src/i18n.js
  - src/config.js
  - README.md
  - AGENTS.md
ownerInput: Review the diff and decide whether to commit.
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
          "start": "2026-11-23T14:07:57.629Z",
          "end": "2026-11-23T14:08:11.327Z"
        }
      ]
    }
  ],
  "usage": [
    {
      "source": "claude-task-estimate",
      "runId": "5f10e85b-95a7-4b35-a0d6-ab8822af6300",
      "segmentId": "auto-1795442877629",
      "mode": "cumulative",
      "shared": true,
      "model": "claude-opus-5-5",
      "scope": "task",
      "attribution": {
        "taskId": "MS-029",
        "planningRoot": "C:\\Users\\rosu_\\Desktop\\Development\\Muba Site",
        "start": "2026-11-23T14:07:57.629Z",
        "end": "2026-11-23T14:08:11.327Z"
      },
      "tokens": {
        "input": 256286,
        "output": 1317,
        "cachedInput": 254894,
        "reasoningOutput": null,
        "total": 257603
      },
      "evidence": [
        "claude-session:5f10e85b-95a7-4b35-a0d6-ab8822af6300"
      ],
      "recordedAt": "2026-11-23T14:08:11.327Z"
    }
  ],
  "corrections": []
}
```
<!-- SECTION:TIME_USAGE:END -->

## Acceptance Criteria
<!-- AC:BEGIN -->
- [x] #1 The rider date pickers do not offer days before today in Paris.
- [x] #2 Riders can call or message on WhatsApp from the header on every screen.
- [x] #3 The desktop route map matches the light or dark theme and fills its frame without a grey strip.
- [x] #4 A pending rider status page refreshes itself and shows when it was last checked.
- [x] #5 The driver pending list shows when each request arrived and the passenger count, and Next pickup says Today or Tomorrow with time remaining.
- [x] #6 Block time offers Rest of today and All day presets.
- [x] #7 Decline, cancel and remove ask for confirmation inside the page in the site language.
- [x] #8 French copy uses accents; lint, tests, build and EN/FR browser checks pass.
<!-- AC:END -->

## Implementation Notes

<!-- SECTION:NOTES:BEGIN -->
2026-11-23T14:08:11.807Z: Fixed the eight remaining first-audit findings: past dates blocked, header Call and WhatsApp buttons on rider screens, theme-matched desktop map fitted to the route, pending status page checking every minute with a last-checked time, pending list with arrival time and passenger count, Next pickup with Today/Tomorrow and a countdown, Block time presets, in-page confirms for decline, cancel and remove, and accented French copy. Lint, tests, build and EN/FR browser checks pass. Nothing is committed.
<!-- SECTION:NOTES:END -->

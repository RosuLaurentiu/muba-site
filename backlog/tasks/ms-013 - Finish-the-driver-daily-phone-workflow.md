---
id: MS-013
title: Finish the driver daily phone workflow
status: Done
assignee:
  - '@codex'
created_date: '2026-11-21 21:47'
updated_date: '2026-11-21 21:52'
completed_date: '2026-11-21T21:52:09.781Z'
labels: []
dependencies: []
references:
  - MS-007
  - MS-012
modified_files:
  - src/DriverSchedule.jsx
  - src/DriverWorkspace.jsx
  - src/CalendarPanel.jsx
  - src/App.css
  - src/i18n.js
  - README.md
priority: high
type: enhancement
ordinal: 20000
---

## Description

<!-- SECTION:DESCRIPTION:BEGIN -->
The month calendar now precedes the actions the driver needs during the day. Prepare the existing assigned-driver workspace for the public release and the phone walkthrough in MS-002.
<!-- SECTION:DESCRIPTION:END -->

## Current Checkpoint

<!-- SECTION:CURRENT_CHECKPOINT:BEGIN -->
```yaml
done: >-
  Moved the daily controls and agenda before the month calendar. Added stale
  refresh and integration recovery controls. Local Chromium passed EN/FR,
  Light/Dark, 320/390/1440 px, busy and empty agendas, WhatsApp and block save
  context, and mocked failures.
next: Use the release build for the actual driver phone walkthrough in MS-002.
latestChange: >-
  Local bilingual browser checks, schedule tests, lint and build passed. Actual
  driver phone and hosted checks remain under MS-002 and MS-011.
resultAt: '2026-11-21T21:52:09.771Z'
remainingChecks: []
```
<!-- SECTION:CURRENT_CHECKPOINT:END -->

## Acceptance Criteria
<!-- AC:BEGIN -->
- [x] #1 On a phone, next pickup and the pending shortcut lead into the selected day controls, Add ride, Block time and agenda before the monthly calendar. Contact and directions use the right pickup.
- [x] #2 A failed schedule refresh identifies stale data and permits retry. Calendar and email failures show a recovery action.
- [x] #3 Ride and time-block saves preserve the selected Paris day. Verify busy, empty and failed-refresh states in English and French, Light and Dark.
<!-- AC:END -->

## Implementation Notes

<!-- SECTION:NOTES:BEGIN -->
2026-11-21T21:52:09.772Z: Local bilingual browser checks, schedule tests, lint and build passed. Actual driver phone and hosted checks remain under MS-002 and MS-011.
<!-- SECTION:NOTES:END -->

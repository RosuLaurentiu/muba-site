---
id: MS-028
title: 'Refine mobile screens, copy and driver navigation after the phone audit'
status: In Progress
assignee:
  - '@claude'
created_date: '2026-11-23 11:07'
updated_date: '2026-11-23 11:17'
labels: []
dependencies: []
modified_files:
  - src/App.jsx
  - src/App.css
  - src/DriverWorkspace.jsx
  - src/DriverSchedule.jsx
  - src/i18n.js
  - src/config.js
  - src/schedule.js
  - index.html
  - README.md
  - supabase/tests/schedule.mjs
priority: medium
type: enhancement
ordinal: 42000
---

## Description

<!-- SECTION:DESCRIPTION:BEGIN -->
Owner request 2026-11-23: audit the rider and driver screens on phones, add a way back to the booking page from the driver workspace, remove development leftovers (unused copy, config and code), and refine the text and information on every page in EN and FR.
<!-- SECTION:DESCRIPTION:END -->

## Current Checkpoint

<!-- SECTION:CURRENT_CHECKPOINT:BEGIN -->
```yaml
done: All five criteria met and verified locally at phone widths in EN and FR.
next: >-
  Owner reviews the diff and commits. The diff also contains earlier uncommitted
  cleanup in config.js, i18n.js, schedule.js, DriverSchedule.jsx and
  supabase/tests/schedule.mjs that removes unused landing-page copy, Calendly
  config and entriesOnDay.
latestChange: >-
  Audited every rider and driver screen at 390 px (EN) and 361 px (FR). Below
  375 px the header no longer wraps: one moon theme button replaces Light/Dark.
  The header name links back to the booking page. Signed-in driver screens have
  a Booking page button. The email code field is styled and its resend button is
  labelled. The route map is hidden on phones. Touch screens no longer keep
  hover colours. Removed unused copy, config and code, the old scheduling-widget
  noscript text and a setup comment. Refined EN/FR copy: round-trip hint, status
  title, sign-in button, driver pending badge, email delay in hours, validation
  messages. Not committed.
action: acceptance
resultAt: '2026-11-23T11:17:22.676Z'
evidence:
  - 'npm run lint, npm run build and npm test (4/4) pass'
  - EN/FR key parity checked; no unused keys remain from the scan
  - >-
    Phone check at 360 px: header 61 px single row in EN and FR; theme toggle
    switches and reports aria-pressed; code field 289x46 with resend button; map
    hidden; status title Votre reservation
  - >-
    Driver at 360 px FR: Page de reservation button returns to the booking page
    from Working hours; pending badge En attente de votre decision; email delay
    shown as 30 h 46 min
affectedFiles:
  - src/App.jsx
  - src/App.css
  - src/DriverWorkspace.jsx
  - src/DriverSchedule.jsx
  - src/i18n.js
  - src/config.js
  - src/schedule.js
  - index.html
  - README.md
  - supabase/tests/schedule.mjs
ownedPaths:
  - src/App.jsx
  - src/App.css
  - src/DriverWorkspace.jsx
  - src/DriverSchedule.jsx
  - src/i18n.js
  - src/config.js
  - index.html
  - README.md
ownerInput: Review the diff before commit.
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
          "start": "2026-11-23T11:17:10.176Z",
          "end": "2026-11-23T11:17:10.434Z"
        }
      ]
    }
  ],
  "usage": [],
  "corrections": []
}
```
<!-- SECTION:TIME_USAGE:END -->

## Acceptance Criteria
<!-- AC:BEGIN -->
- [x] #1 Every rider and driver screen is checked at phone widths in EN and FR, and the findings are reported.
- [x] #2 Signed-in driver screens have a visible link back to the booking page.
- [x] #3 Unused copy, config values, code and developer-facing wording are removed from the app.
- [x] #4 Rider and driver copy is clear and consistent in EN and FR, with no hard-coded UI text.
- [x] #5 Lint, build and npm test pass; affected flows are verified in the browser on a phone width.
<!-- AC:END -->

## Implementation Notes

<!-- SECTION:NOTES:BEGIN -->
2026-11-23T11:17:22.676Z: Audited every rider and driver screen at 390 px (EN) and 361 px (FR). Below 375 px the header no longer wraps: one moon theme button replaces Light/Dark. The header name links back to the booking page. Signed-in driver screens have a Booking page button. The email code field is styled and its resend button is labelled. The route map is hidden on phones. Touch screens no longer keep hover colours. Removed unused copy, config and code, the old scheduling-widget noscript text and a setup comment. Refined EN/FR copy: round-trip hint, status title, sign-in button, driver pending badge, email delay in hours, validation messages. Not committed.
<!-- SECTION:NOTES:END -->

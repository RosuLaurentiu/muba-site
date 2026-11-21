---
id: MS-004
title: Give Private Taxi Paris a professional booking page
status: In Progress
assignee:
  - '@codex'
created_date: '2026-11-21 14:42'
updated_date: '2026-11-21 16:15'
labels: []
dependencies: []
references:
  - backlog/evidence/MS-002.01/review.md
  - src/App.css
  - backlog/evidence/MS-004/review.md
priority: high
type: enhancement
ordinal: 11000
---

## Description

<!-- SECTION:DESCRIPTION:BEGIN -->
The owner wants the service to feel more professional. The current header gives four language and theme buttons similar prominence, and trip and passenger sections share the same panel treatment. Build on the Light and Dark directions accepted in MS-002.01. This task owns shared visual styling and the public first screen.
<!-- SECTION:DESCRIPTION:END -->

## Current Checkpoint

<!-- SECTION:CURRENT_CHECKPOINT:BEGIN -->
```yaml
done: >-
  Implemented the black-led rider and driver screens using the selected low rear
  three-quarter fleet image. Local bilingual and responsive checks passed.
next: >-
  Owner reviews the phone and desktop comparison in
  backlog/evidence/MS-004/review.md.
latestChange: >-
  Implemented and browser-checked the rider and driver redesign with both fleet
  vehicles. Owner visual review remains.
resultAt: '2026-11-21T16:15:40.064Z'
remainingChecks:
  - Owner visual acceptance of the implemented rider and driver screens.
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
          "start": "2026-11-21T15:59:03.423Z",
          "end": "2026-11-21T15:59:19.109Z"
        },
        {
          "start": "2026-11-21T16:00:15.038Z",
          "end": "2026-11-21T16:00:31.965Z"
        },
        {
          "start": "2026-11-21T16:14:32.345Z",
          "end": "2026-11-21T16:14:51.083Z"
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
- [x] #1 The implemented first screen identifies the Paris transfer service, explains how confirmation works and gives booking clear visual priority over preferences and contact links. The pickup field or a direct action focusing it is visible at 390 x 740.
- [x] #2 Use a consistent type hierarchy, spacing, surfaces, form and button states across the rider entry and driver home. Keep the rider and driver theme preferences independent. Use only verified business details and make no unsupported service or fare promises.
- [ ] #3 Review before-and-after captures of the actual app with the owner at phone and desktop sizes. Check English and French, Light and Dark, visible keyboard focus, readable contrast and no horizontal scrolling. Record the selected treatment and evidence.
<!-- AC:END -->

## Implementation Plan

<!-- SECTION:PLAN:BEGIN -->
[100%] Inspect current screens and capture the baseline. [100%] Apply the black-led rider and driver design. [90%] Verify both roles and present the comparison.
<!-- SECTION:PLAN:END -->

## Implementation Notes

<!-- SECTION:NOTES:BEGIN -->
2026-11-21T16:00:40.165Z: Selected the existing visual redesign task and recorded the owner direction for a more black-led interface.

2026-11-21T16:15:40.065Z: Prior current facts: {"done":"Confirmed the existing Light and Dark designs, booking screens and driver workspace. The owner requested a black-led visual redesign.","resultAt":"2026-11-21T16:00:40.164Z"}

2026-11-21T16:15:40.065Z: Implemented and browser-checked the rider and driver redesign with both fleet vehicles. Owner visual review remains.
<!-- SECTION:NOTES:END -->

---
id: MS-005
title: Restore live Google Maps routes and fare estimates
status: To Do
assignee: []
created_date: '2026-11-21 14:42'
labels: []
dependencies: []
references:
  - backlog/evidence/MS-002.03/review.md
  - src/App.jsx
  - >-
    https://developers.google.com/maps/documentation/javascript/legacy/places-migration-autocomplete
priority: high
type: enhancement
ordinal: 12000
---

## Description

<!-- SECTION:DESCRIPTION:BEGIN -->
The owner has put the previously deferred Maps update back in scope. Rider booking still has address autocomplete, directions and a configured fare calculator. Prior fare checks used simulated routes. Identify which part of the live path needs updating, reuse the working fare policy, and keep the no-map booking path.
<!-- SECTION:DESCRIPTION:END -->

## Acceptance Criteria
<!-- AC:BEGIN -->
- [ ] #1 From the normal rider flow, select suggested pickup and destination addresses or enter them manually. A successful route shows the correct endpoints on a map, driving distance, duration and a clearly labeled EUR estimate for the chosen Paris departure time.
- [ ] #2 Verify deterministic fare examples against the configured short and long rates, threshold, minimums, hourly floor and round-trip multiplier. Changing an address, departure or trip type cannot leave a stale price or route on screen.
- [ ] #3 When Maps is unavailable, slow or returns no route, keep the entered addresses and allow the request without a fare. Explain the failure in rider language in EN and FR. A failed lookup must not become a zero fare.
- [ ] #4 Verify one real route using public Paris landmarks on an authorized origin and record the outcome separately from simulated fare tests. Keep browser key restrictions intact and credentials out of evidence. Update setup instructions and retire the old deferral once verified.
<!-- AC:END -->

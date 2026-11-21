---
id: MS-005
title: Restore live Google Maps routes and fare estimates
status: Done
assignee:
  - '@codex'
created_date: '2026-11-21 14:42'
updated_date: '2026-11-21 16:41'
completed_date: '2026-11-21T16:41:08.091Z'
labels: []
dependencies: []
references:
  - backlog/evidence/MS-002.03/review.md
  - src/App.jsx
  - >-
    https://developers.google.com/maps/documentation/javascript/legacy/places-migration-autocomplete
documentation:
  - backlog/evidence/MS-005/review.md
priority: high
type: enhancement
ordinal: 12000
---

## Description

<!-- SECTION:DESCRIPTION:BEGIN -->
The owner has put the previously deferred Maps update back in scope. Rider booking still has address autocomplete, directions and a configured fare calculator. Prior fare checks used simulated routes. Identify which part of the live path needs updating, reuse the working fare policy, and keep the no-map booking path.
<!-- SECTION:DESCRIPTION:END -->

## Current Checkpoint

<!-- SECTION:CURRENT_CHECKPOINT:BEGIN -->
```yaml
done: >-
  Verified the new route handling and fare examples with simulated Maps, and the
  one authorized public-landmark route on the published origin. Local key
  restrictions stayed in place.
next: Use the verified route and no-fare states in the rider journey task.
latestChange: >-
  Local success, replacement and bilingual fallback checks passed. Authorized
  live route passed on the currently published build. Local key restriction is
  documented separately.
resultAt: '2026-11-21T16:41:08.087Z'
```
<!-- SECTION:CURRENT_CHECKPOINT:END -->

## Acceptance Criteria
<!-- AC:BEGIN -->
- [x] #1 From the normal rider flow, select suggested pickup and destination addresses or enter them manually. A successful route shows the correct endpoints on a map, driving distance, duration and a clearly labeled EUR estimate for the chosen Paris departure time.
- [x] #2 Verify deterministic fare examples against the configured short and long rates, threshold, minimums, hourly floor and round-trip multiplier. Changing an address, departure or trip type cannot leave a stale price or route on screen.
- [x] #3 When Maps is unavailable, slow or returns no route, keep the entered addresses and allow the request without a fare. Explain the failure in rider language in EN and FR. A failed lookup must not become a zero fare.
- [x] #4 Verify one real route using public Paris landmarks on an authorized origin and record the outcome separately from simulated fare tests. Keep browser key restrictions intact and credentials out of evidence. Update setup instructions and retire the old deferral once verified.
<!-- AC:END -->

## Implementation Plan

<!-- SECTION:PLAN:BEGIN -->
Keep the working route surface and independent manual entry. Verify price boundaries and route replacement locally before the authorized live check and setup documentation.
<!-- SECTION:PLAN:END -->

## Implementation Notes

<!-- SECTION:NOTES:BEGIN -->
2026-11-21T16:35:27.466Z: Confirmed the Maps scope, existing provider path and authorization for one real route without key or billing changes.

2026-11-21T16:41:08.087Z: Prior current facts: {"done":"MS-004 is approved. The owner authorized one real Google Maps route between public Paris landmarks on an already allowed origin.","resultAt":"2026-11-21T16:35:27.465Z"}

2026-11-21T16:41:08.087Z: Local success, replacement and bilingual fallback checks passed. Authorized live route passed on the currently published build. Local key restriction is documented separately.
<!-- SECTION:NOTES:END -->

## Final Summary

<!-- SECTION:FINAL_SUMMARY:BEGIN -->
Verified fare behavior and address fallback locally. Verified the existing live provider on its permitted origin. The newly committed build has not been deployed.
<!-- SECTION:FINAL_SUMMARY:END -->

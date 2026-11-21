# Maps route and fare verification

## Local implementation

- Browser checks with simulated Maps responses used suggested Places IDs and
  manually typed addresses through the rider form. The route and estimate
  used the chosen Paris departure, displayed distance, duration, and EUR,
  and replaced the route after editing the pickup and departure and switching
  to a return trip.
- With Maps blocked, missing suggestions, no route, invalid distance or
  duration, or a hanging request, the rider retained both addresses. English
  and French fallback copy allowed submission without an estimated fare.
- The fare unit test covers the short and long rates, both minimums, the
  threshold boundary, the hourly floor, round-trip totals, and invalid data.

## Authorized live provider check

The owner approved one route between public landmarks. The existing key
rejected the local origin with `RefererNotAllowedMapError`, so no local live
route was submitted. The currently published app on the permitted production
origin accepted Gare de Lyon to Tour Eiffel and showed “Live route ready.”
This checked the existing key and live route service on the published build.
The new local code was verified with simulated Maps responses. No booking,
key change, billing change, or deployment was made.

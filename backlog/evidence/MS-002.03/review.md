# Rider booking verification

The rider form uses the approved Light and Dark designs. The first screen puts
the service description and pickup field above the fold. Review shows the trip,
Paris times, passenger details and the estimate or its unavailable state.
Call, WhatsApp and email remain separate contact links.

- **1. Input and keyboard** — Chromium exercised blank pickup, past pickup,
  invalid phone and return before pickup. Focus moved to the first invalid
  control, which identified its error through `aria-describedby`. The Tab
  key moved from pickup to destination. The input test covers passenger limits,
  Paris time and both daylight-saving transitions.
- **2. Review and manual addresses** — Chromium exercised EN and FR at
  390 × 740 and 1440 × 900, with a browser time zone outside Paris.
  With Maps blocked, riders could type both addresses, keep them through
  language and layout changes, review the trip and send it without an estimate.
- **3. Receipt and retries** — Each browser run saved to local Supabase. The
  first response was dropped after the database committed. The review retained
  the entries, a rapid retry used the original key and payload, and the
  database contained one ride for that key. The receipt showed a reference and
  pending status. The private link loaded the saved ride with no passenger
  contact in the response view.
- **4. Fare, responsive layout and contact** — Browser checks covered one-way
  and return requests, both languages and both layouts. Mocked Maps routes
  covered the EUR 20 short minimum, EUR 55 distance fare, EUR 140 long minimum
  at 100 km, EUR 168 long-trip rate, and a EUR 240 return estimate with the
  hourly floor. Both viewport widths had no horizontal overflow. On mobile
  the pickup field was visible without scrolling. Contact shortcuts carried
  no entered data. No contact link was opened.

`npm run lint`, `npm run build`, and `node supabase/tests/rider-input.mjs`
passed. The Maps API update remains deferred. Live Google Maps, hosted
Supabase, physical mobile devices and a screen reader were outside these checks.

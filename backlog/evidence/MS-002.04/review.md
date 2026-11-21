# Driver inbox verification

Chromium opened the local driver workspace at a 390 × 740 viewport with
Supabase Auth and the local Data API. The test used fictional accounts and rides.

1. A signed-out visitor saw sign-in for a direct ride URL. An authenticated
   unassigned account could see no rides. The assigned driver saw a new
   web request once after refresh, in the pending list. Confirmed work had a
   separate list.
2. The detail showed the two addresses, pickup and return in Paris time,
   passenger count, name, phone and notes. The phone, WhatsApp and directions
   links used the passenger number or pickup address as expected. The browser
   exercised EN and FR and checked the mobile layout for overflow.
3. The driver accepted one ride and declined another. A rapid double click
   sent one decision. A second tab with an old version could not replace the
   accepted decision. Both changes survived reload and appeared on the private
   rider links. Only the accepted ride entered the confirmed list.

The tests removed their local fixtures. No Google Maps request, contact
message, or live account change was made. Lint and the production build passed.

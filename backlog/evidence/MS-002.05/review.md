# Driver schedule verification

Chromium used the local Supabase stack, a 390 × 740 viewport and a browser
time zone outside Paris. All accounts, rides and blocks were fictional.

1. The driver saw the next pickup, its two addresses, passenger contact, and
   a known finish time. The day selector and previous and next controls
   displayed Paris dates. The return leg appeared on the following day with
   reversed addresses. The driver added, viewed and removed a time block.
2. Phone and WhatsApp rides entered the same schedule as accepted web rides.
   The phone save committed before the response was lost. Retrying with the
   same details returned the same record after a refresh.
3. Rescheduling from 14:00 to 15:30 persisted across reload and changed the
   displayed estimated finish. Cancellation persisted in the driver detail
   and appeared on the rider's private status page.
4. The browser displayed overlaps and disabled the save action before
   accepting a blocked request, recording a ride during blocked time, or
   rescheduling into an active ride. The preview showed adjacent addresses
   and finish times. API tests rejected conflicts for each write path and
   allowed only one of two concurrent overlapping writes.

Lint, build, input and schedule unit checks, the local API integration test,
and Supabase advisors passed. No Google Maps calls or live changes were made.
Unknown ride lengths reserve the scheduled pickup minute. Travel time between
rides is a driver check.

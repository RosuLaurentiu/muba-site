# Driver agenda verification

Chromium checks used 390 × 740 and 1440 × 900 viewports in English and French
and both themes, with fictional Supabase fixtures and external calls blocked.

- On a busy day the next pickup, call, directions, and pending-request count
  and link appeared in the first phone viewport. The link was keyboard
  focusable with a visible outline and a 44-pixel touch target.
- Return-leg detail showed the return pickup and correct directions. A day
  without scheduled work showed its empty state. A failed refresh retained
  the last good schedule and offered refresh again.
- Tests exercised overlap blocking, accepting and declining a request,
  rescheduling, cancelling, saving a manual WhatsApp ride, and blocking time.
  Saves returned to the selected day context. Destructive actions used the
  existing distinct button treatment.
- An unassigned session received no ride details. A closed Calendar panel
  showed pending sync status. The task changed no Calendar worker or
  database permissions.

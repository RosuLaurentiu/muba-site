# Private Taxi Paris booking design

The owner reviewed the [two directions](directions.png) and selected both for riders and drivers on 21 November 2026. Each surface has a Light and Dark switch. The preview starts in Light and keeps the current screen and entered trip details when the layout changes. In the live app, remember the visitor’s layout choice on their device.

Open [preview.html](preview.html) locally in a browser. It uses fictional bookings and works without a network connection.

## Rider walkthrough

1. Select Rider and EN or FR. The first screen explains the service and says the driver decides whether to confirm. Type in the pickup and destination fields.
2. Try reviewing the empty form. The first invalid field takes focus and the message appears below it. Enter a future pickup in Paris time and passenger details. If you add a return, try a return before the pickup to see the inline error.
3. Review the trip, times, passenger details and fare status. The demo shows the fare-unavailable state. Simulate a save failure, then edit or retry with the same details.
4. Send the demo request. The receipt shows a reference and pending driver confirmation.

## Driver walkthrough

1. Select Driver. The Light agenda highlights the next pickup. Dark separates it from the remaining rides. Pending requests have their own section in both views.
2. Open a pending request to see the trip and passenger details. Call, WhatsApp and pickup directions are shown as disabled demo controls. Accept or decline to see a result and the updated request list.
3. Browse to an empty day, then select Add ride. Try an empty save and then enter a future trip with a phone or WhatsApp source. The demo shows the saved result and the ride in the agenda.

## Checks and limits

- Chromium via Playwright passed the rider walkthrough and driver checks at 390 × 740 and 1440 × 900 in EN and FR. Both layouts exposed the pickup field in the first viewport with no horizontal overflow. Checks covered focus on invalid pickup and return time, values preserved across language changes and retries, pending receipt, driver detail, request acceptance, empty schedule and manual save.
- The preview preserves the concept palettes and form-first hierarchy. Desktop places trip and passenger fields side by side. The driver preview shows contact on the detail screen, and the toolbar adds switches to compare roles, languages and layouts.
- Measured contrast for the primary text, muted text, next-pickup text, primary buttons and inline errors against their backgrounds was 6.73:1 or higher. The preview uses native controls, sequential headings and a visible keyboard focus outline.
- Production build passed. Repository lint reported two existing unused variables in the untouched `src/App.jsx`. This design task changes no Vite sources.
- The design preview uses in-memory state. Real ride storage, driver sign-in, contact actions, pricing, delivery and screen-reader checks are outside this design verification.

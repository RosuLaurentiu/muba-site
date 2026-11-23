---
id: MS-010
title: Agree the booking rules for the Paris taxi service
status: In Progress
assignee:
  - '@codex'
created_date: '2026-11-21 15:23'
updated_date: '2026-11-22 00:42'
labels: []
dependencies: []
references:
  - >-
    backlog/tasks/ms-002 -
    Revamp-Private-Taxi-Paris-for-rider-reservations-and-driver-scheduling.md
  - backlog/tasks/ms-005 - Restore-live-Google-Maps-routes-and-fare-estimates.md
  - >-
    backlog/tasks/ms-006 -
    Make-the-rider-journey-clearer-from-estimate-to-confirmation.md
priority: high
type: task
ordinal: 17000
---

## Description

<!-- SECTION:DESCRIPTION:BEGIN -->
Riders and the driver need a consistent answer about short-notice requests, when a fare is agreed, airport delays and cancellations. The owner makes these business choices. The outcome is an agreed set of rules and wording the rider and driver tasks can use.
<!-- SECTION:DESCRIPTION:END -->

## Current Checkpoint

<!-- SECTION:CURRENT_CHECKPOINT:BEGIN -->
```yaml
done: >-
  Owner confirmed one VTC booking flow. All bookings require an email, including
  mobile requests and trips the driver enters after a call or WhatsApp message.
  Every rider gets the same confirmation flow, emailed receipt, reservation
  number and private tracking link. WhatsApp is a contact option. The online
  fare is an estimate, and the driver records the accepted final fare before
  confirming. Earlier notice, change, waiting and retention defaults remain
  recorded.
next: >-
  Apply the shared email, receipt and private tracking rules to both entry
  points under MS-014. Update bilingual copy and verify the same rider outcome
  for each entry point.
latestChange: >-
  Recorded the approved single booking flow. Every booking requires email and
  sends the same receipt and tracking link. WhatsApp remains a communication
  channel.
resultAt: '2026-11-22T00:42:05.977Z'
remainingChecks:
  - >-
    Review the bilingual booking and privacy wording with the required email
    field
  - >-
    Verify emailed receipt and private tracking for web and driver-entered
    bookings
  - Review the agreed booking examples with the driver
```
<!-- SECTION:CURRENT_CHECKPOINT:END -->

## Acceptance Criteria
<!-- AC:BEGIN -->
- [ ] #1 The owner records the minimum booking notice, how short-notice requests are handled, when the displayed estimate becomes an agreed fare and who confirms it if Maps cannot provide an estimate.
- [ ] #2 The owner records how delayed flights, waiting time, rescheduling, cancellation and no-shows are handled, including any exceptions or charges the owner chooses.
- [ ] #3 Review representative examples with the driver: a short-notice pickup, a delayed airport arrival and a cancellation after confirmation. Record the expected driver action and rider message for each.
- [ ] #4 Save the approved rules with concise English and French rider wording. Identify which existing booking, fare and driver screens should show or apply each rule.
<!-- AC:END -->

## Implementation Plan

<!-- SECTION:PLAN:BEGIN -->
Agree notice, fare, delays and waiting, changes, cancellation and no-shows with the owner. Review representative cases with the driver. Save approved English and French wording and the screen mapping.
<!-- SECTION:PLAN:END -->

## Implementation Notes

<!-- SECTION:NOTES:BEGIN -->
2026-11-21T15:55:05.391Z: Started MS-010 with the owner-approved order change and identified the existing estimate and confirmation behavior.

### Driver review examples (fictional)

| Example | Driver decision to confirm | Rider message to confirm |
| --- | --- | --- |
| Pickup in 45 minutes, with no Maps estimate. | Say whether the rider should submit the form or call, who checks availability, and how the rider learns the applicable fare. | Give the correct contact path and say whether the ride has been confirmed. |
| Airport arrival moves from 14:00 to 15:15. | Say when waiting starts, whether the pickup can move, and when the driver contacts the rider or releases the slot. | State the agreed pickup time and meeting point, or say that a new pickup is not yet available. |
| Rider cancels a confirmed 09:00 pickup at 08:15. | Say how the driver confirms the cancellation, frees the slot, and handles any fee or exception. | Confirm the cancellation and state the approved fee or exception if applicable. |

### Wording and screen placement for review

- Fare review: “Estimated fare. Your driver will confirm the ride.” / “Tarif estime. Votre chauffeur vous confirmera la course.”
- Receipt and private status: “Request received. Waiting for driver confirmation.” / “Demande recue. En attente de confirmation du chauffeur.”
- Rider entry: place the approved notice rule next to the pickup time. Display the short-notice contact option at the point it applies.
- Fare review and driver ride detail: show or apply the approved fare rule. Use the driver contact path when the site has no estimate.
- Private status, driver ride detail, and booking emails: use the approved wording when a pickup changes or a booking is cancelled. Review delay, waiting and no-show wording before applying it.

2026-11-21T23:56:52.362Z: Prior current facts: {"done":"The owner approved starting MS-010 before the MS-002 driver walkthrough. Current rider wording says a fare is an estimate and a saved request awaits driver confirmation.","resultAt":"2026-11-21T15:55:05.391Z"}

2026-11-21T23:56:52.362Z: Saved the owner-accepted working defaults. The transport licence, fare wording and privacy notice operator details remain open.

2026-11-22T00:04:45.185Z: Prior current facts: {"done":"Owner accepted working defaults: web requests at least 2 hours before pickup in Paris time, Call or WhatsApp for shorter notice, manual driver confirmation, 15-minute standard and 30-minute airport contact windows from the agreed pickup, manual handling of delays and changes, and no separate change, cancellation or no-show fees. Keep email optional and use a short bilingual privacy notice with a link to the full notice. Existing 90-day retention and seven-day encrypted backup terms apply.","resultAt":"2026-11-21T23:56:52.361Z"}

2026-11-22T00:04:45.185Z: Recorded the VTC fare rule. The online fare is an estimate. The rider accepts the driver quote before the driver confirms. The delivery and acceptance workflow remains open.

2026-11-22T00:08:20.869Z: Prior current facts: {"done":"Owner accepted working defaults: web requests at least 2 hours before pickup in Paris time, Call or WhatsApp for shorter notice, manual driver confirmation, 15-minute standard and 30-minute airport contact windows from the agreed pickup, manual handling of delays and changes, and no separate change, cancellation or no-show fees. Keep email optional and use a short bilingual privacy notice with a link to the full notice. Existing 90-day retention and seven-day encrypted backup terms apply. Owner confirmed VTC operation. Keep the online fare estimate. The driver sends the final quote and waits for the rider to accept it before confirming the ride. A request can still be submitted when an online estimate is unavailable.","resultAt":"2026-11-22T00:04:45.184Z"}

2026-11-22T00:08:20.869Z: Recorded the approved VTC quote flow: send the final fare on WhatsApp, wait for the rider to reply accepting it, record the agreed fare, then confirm the ride.

2026-11-22T00:42:05.978Z: Prior current facts: {"done":"Owner accepted working defaults: web requests at least 2 hours before pickup in Paris time, Call or WhatsApp for shorter notice, manual driver confirmation, 15-minute standard and 30-minute airport contact windows from the agreed pickup, manual handling of delays and changes, and no separate change, cancellation or no-show fees. Keep email optional and use a short bilingual privacy notice with a link to the full notice. Existing 90-day retention and seven-day encrypted backup terms apply. Owner confirmed VTC operation. Keep the online fare estimate. The driver sends the final quote and waits for the rider to accept it before confirming the ride. A request can still be submitted when an online estimate is unavailable. Owner approved WhatsApp for the final written quote. The rider replies to accept. The driver then records the agreed fare and confirms the ride. Until then the request stays pending.","resultAt":"2026-11-22T00:08:20.868Z"}

2026-11-22T00:42:05.978Z: Recorded the approved single booking flow. Every booking requires email and sends the same receipt and tracking link. WhatsApp remains a communication channel.
<!-- SECTION:NOTES:END -->

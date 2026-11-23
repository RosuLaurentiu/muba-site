---
id: MS-016
title: Publish and verify the public booking release
status: In Progress
assignee:
  - '@codex'
created_date: '2026-11-21 21:48'
updated_date: '2026-11-22 15:58'
labels: []
dependencies:
  - MS-002
  - MS-009
  - MS-011
  - MS-013
  - MS-014
  - MS-015
priority: high
type: task
ordinal: 23000
---

## Description

<!-- SECTION:DESCRIPTION:BEGIN -->
The owner selected a controlled hosted test before public launch. The driver and opted-in rider email delivery and recovery are launch gates.
<!-- SECTION:DESCRIPTION:END -->

## Current Checkpoint

<!-- SECTION:CURRENT_CHECKPOINT:BEGIN -->
```yaml
done: >-
  Published approved commit 72394f37f6934073897e52637b46225059992260. The exact
  GitHub Pages run succeeded. The custom domain returned 200 and served the new
  bundle for both rider and driver entry points, configured for Muba Booking.
  Browser smoke verified rider form and driver Google sign-in entry in English
  and French, and the rider theme switch. The netcup timer continued succeeding
  after publication. Verified the new approved commit c6de1a7, remote main,
  production backend identity, active timer, empty outbox and existing migration
  names.
next: >-
  Use the production migration history in a disposable release directory, deploy
  the worker and two migrations, resume dispatch, publish c6de1a7 then verify a
  fictional live booking.
latestChange: >-
  Owner approved c6de1a7, its two migrations and email worker on Muba Booking,
  plus one live rider and driver smoke booking. Production identity verified.
resultAt: '2026-11-22T15:58:27.542Z'
evidence:
  - Supabase project name Muba Booking and API URL verified after rename
  - 'Hosted aggregate check and Edge Functions inventory, no booking writes'
  - >-
    Local isolated SQL rehearsal of web and manual rides, user acceptance,
    outbox and Calendar queue
  - >-
    Local pause and resume, 90-day purge, seven-day encrypted archive and
    restore
  - >-
    Isolated MS-021 candidate lint, build, fare, rider-input, schedule and
    work-hours checks
  - 72394f37f6934073897e52637b46225059992260
  - MS-011 hosted worker and Resend evidence
  - MS-021 exact candidate checks
  - >-
    Clean exact-candidate build, lint, rider validation, schedule, weekly hours
    and fare checks passed.
  - MS-011 hosted email delivery and netcup timer result.
  - 'https://github.com/RosuLaurentiu/muba-site/actions/runs/45035664136'
  - 'https://privatetaxiparis.com/'
  - 'https://privatetaxiparis.com/?driver'
  - >-
    Read-only live verification: new asset assets/index-DVBBOxOb.js targets Muba
    Booking. Netcup timer remained enabled and successful.
remainingChecks:
  - >-
    Verify a production booking decision, private status, rider email update and
    Calendar mirror in the approved smoke scope.
  - >-
    Confirm first-day ownership of missed requests, delivery failures and
    retention checks; no project-managed export is required.
```
<!-- SECTION:CURRENT_CHECKPOINT:END -->

## Time & Usage

<!-- SECTION:TIME_USAGE:BEGIN -->
```json
{
  "sessions": [
    {
      "id": "codex-01a2011c-48f4-77f3-a974-7f8036e91ba3-activity",
      "actor": "agent",
      "label": "Codex (estimate)",
      "state": "stopped",
      "intervals": [
        {
          "start": "2026-11-22T12:46:17.576Z",
          "end": "2026-11-22T12:46:46.466Z"
        }
      ]
    }
  ],
  "usage": [
    {
      "source": "codex-task-estimate",
      "runId": "01a2011c-48f4-77f3-a974-7f8036e91ba3",
      "segmentId": "auto-1795351578598",
      "mode": "cumulative",
      "shared": true,
      "model": "gpt-6.2-sol",
      "scope": "task",
      "attribution": {
        "taskId": "MS-016",
        "planningRoot": "C:\\Users\\rosu_\\Desktop\\Development\\Muba Site",
        "start": "2026-11-22T12:46:18.598Z",
        "end": "2026-11-22T12:46:46.466Z"
      },
      "tokens": {
        "input": 596950,
        "output": 1103,
        "cachedInput": 593664,
        "reasoningOutput": 333,
        "total": 598053
      },
      "evidence": [
        "codex-session:01a2011c-48f4-77f3-a974-7f8036e91ba3"
      ],
      "recordedAt": "2026-11-22T12:46:46.466Z"
    }
  ],
  "corrections": []
}
```
<!-- SECTION:TIME_USAGE:END -->

## Acceptance Criteria
<!-- AC:BEGIN -->
- [x] #1 Owner approval names the release build, production backend, and smoke-booking scope before GitHub Pages publication.
- [ ] #2 The authorized public smoke booking proves driver alert and decision, rider status and the Calendar mirror.
- [ ] #3 Name the first-day operator for missed requests, delivery failures and retention checks. Record pause criteria.
<!-- AC:END -->

## Implementation Plan

<!-- SECTION:PLAN:BEGIN -->
[100%] Verify exact commit, backend and dispatch state. [15%] Deploy worker and both migrations and verify dispatch. [0%] Publish the exact commit and verify the live bundle. [0%] Verify one live booking and record results.
<!-- SECTION:PLAN:END -->

## Implementation Notes

<!-- SECTION:NOTES:BEGIN -->
2026-11-22T00:14:21.983Z: Owner approved the first-day split between driver inbox coverage and owner delivery and recovery checks.

2026-11-22T12:46:50.438Z: Prior current facts: {"done":"Owner agreed that the driver monitors bookings during service hours and follows up by phone or WhatsApp. The owner reviews delivery failures, verifies the first scheduled encrypted export and decides whether to pause web intake.","resultAt":"2026-11-22T00:14:21.982Z"}

2026-11-22T12:46:50.438Z: Owner selected the existing Supabase backend and its name is now Muba Booking. Local booking and recovery rehearsals passed. Hosted email delivery is blocked by the missing booking-email function and sender and controlled recipient details; hosted backup destination and public release approval are pending.

2026-11-22T14:08:12.091Z: Prior current facts: {"done":"Owner agreed that the driver monitors bookings during service hours and follows up by phone or WhatsApp. The owner reviews delivery failures, verifies the first scheduled encrypted export and decides whether to pause web intake. Owner chose to keep the existing Supabase project. Its dashboard display name is Muba Booking, with the same project reference and API URL. Isolated local checks passed for both booking paths, fare acceptance, private tracking, email and Calendar queue entries, pause and resume, and encrypted archive and restore.","resultAt":"2026-11-22T12:46:50.437Z"}

2026-11-22T14:08:12.091Z: The exact candidate 72394f3 is ready for hosted rehearsal. Live worker credentials and verified off-VPS recovery still block publication.

2026-11-22T14:36:43.702Z: Prior current facts: {"done":"Muba Booking is the approved backend. Resend verified the domain and delivered the template test. The hosted booking-email worker is deployed and rejects unauthenticated calls. Local candidate 72394f3 passed lint, build, bilingual browser checks and fictional booking, pause and encrypted restore rehearsals.","resultAt":"2026-11-22T14:08:12.089Z"}

2026-11-22T14:36:43.702Z: Aligned the release gate with the owner-approved Supabase and VPS setup. Hosted delivery and the VPS restore remain open.

2026-11-22T14:57:50.703Z: Prior current facts: {"done":"Muba Booking is the approved backend. Resend verified the domain and delivered the template test. The hosted booking-email worker is deployed and rejects unauthenticated calls. Local candidate 72394f3 passed lint, build, bilingual browser checks and fictional booking, pause and encrypted restore rehearsals. The owner saved the mail credentials, and the hosted fictional booking queued the rider receipt and driver alert in a transaction that was rolled back.","resultAt":"2026-11-22T14:36:43.701Z"}

2026-11-22T14:57:50.703Z: Recorded release authorization and verified the exact candidate and email timer before publication.

2026-11-22T15:00:17.658Z: Prior current facts: {"done":"The owner approved deployment of the tested booking app against Muba Booking after the scheduled email verification. Candidate 72394f37f6934073897e52637b46225059992260 passed a fresh build, lint and rider, schedule, working hours and fare tests. The hosted email test delivered both messages, and the netcup timer invoked the worker successfully.","resultAt":"2026-11-22T14:57:50.702Z"}

2026-11-22T15:00:17.658Z: Published the checked booking app and verified the live rider and driver entry points. A production booking-to-Calendar rehearsal remains open.

2026-11-22T15:42:39.134Z: Removed first-export ownership from release scope. Operational ownership covers retention, missed requests and failed deliveries. The hosted smoke remains subject to separate approval.

2026-11-22T15:58:27.543Z: Prior current facts: {"done":"Published approved commit 72394f37f6934073897e52637b46225059992260. The exact GitHub Pages run succeeded. The custom domain returned 200 and served the new bundle for both rider and driver entry points, configured for Muba Booking. Browser smoke verified rider form and driver Google sign-in entry in English and French, and the rider theme switch. The netcup timer continued succeeding after publication.","resultAt":"2026-11-22T15:00:17.657Z"}

2026-11-22T15:58:27.543Z: Owner approved c6de1a7, its two migrations and email worker on Muba Booking, plus one live rider and driver smoke booking. Production identity verified.
<!-- SECTION:NOTES:END -->

---
id: MS-016
title: Publish and verify the public booking release
status: In Progress
assignee:
  - '@codex'
created_date: '2026-11-21 21:48'
updated_date: '2026-11-24 01:55'
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
  Published d2a6b7f (MS-027–MS-030) to the custom domain. The fresh CI run
  passed all checks, and Pages attempt 2 succeeded. The production database has
  both migrations. Booking-email v5 matches the release and a scheduled
  invocation exited successfully. Headless Edge reached the live rider
  verification form and Google driver sign-in in English and French.
next: >-
  The release is live. Complete the operator walkthrough for a real verification
  email, signed-in decision and Calendar mirror, and record first-day ownership
  under the remaining acceptance criteria.
latestChange: >-
  Verified HTTP 200, bundle index-r1EO0O60.js, the Muba backend configuration,
  both source files of the active email worker, the live database grants and
  trigger, and bilingual browser entry paths. No live test ride was created.
resultAt: '2026-11-24T01:55:10.786Z'
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
  - 'https://github.com/RosuLaurentiu/muba-site/actions/runs/45307805602'
  - >-
    https://github.com/RosuLaurentiu/muba-site/actions/runs/45307805602/attempts/2
  - >-
    Production asset assets/index-r1EO0O60.js and live EN/FR browser smoke;
    scheduled dispatch exited 0 after v5 deployment.
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
[100%] Verify exact production baseline and dispatch state.
[100%] Resolve the release scope and verify the candidate.
[100%] Publish the selected site, database and worker changes.
[100%] Verify production and save the release evidence.
<!-- SECTION:PLAN:END -->

## Implementation Notes

<!-- SECTION:NOTES:BEGIN -->
2026-11-22T15:42:39.134Z: Removed first-export ownership from release scope. Operational ownership covers retention, missed requests and failed deliveries. The hosted smoke remains subject to separate approval.

2026-11-22T15:58:27.543Z: Prior current facts: {"done":"Published approved commit 72394f37f6934073897e52637b46225059992260. The exact GitHub Pages run succeeded. The custom domain returned 200 and served the new bundle for both rider and driver entry points, configured for Muba Booking. Browser smoke verified rider form and driver Google sign-in entry in English and French, and the rider theme switch. The netcup timer continued succeeding after publication.","resultAt":"2026-11-22T15:00:17.657Z"}

2026-11-22T15:58:27.543Z: Owner approved c6de1a7, its two migrations and email worker on Muba Booking, plus one live rider and driver smoke booking. Production identity verified.

2026-11-24T01:46:33.287Z: Prior current facts: {"done":"Published approved commit 72394f37f6934073897e52637b46225059992260. The exact GitHub Pages run succeeded. The custom domain returned 200 and served the new bundle for both rider and driver entry points, configured for Muba Booking. Browser smoke verified rider form and driver Google sign-in entry in English and French, and the rider theme switch. The netcup timer continued succeeding after publication. Verified the new approved commit c6de1a7, remote main, production backend identity, active timer, empty outbox and existing migration names.","resultAt":"2026-11-22T15:58:27.542Z"}

2026-11-24T01:46:33.287Z: Confirmed production at c6de1a7 and found two later committed UI updates and one uncommitted email feature alongside MS-027.

2026-11-24T01:48:07.410Z: Owner selected all app changes through MS-030 for publication.

2026-11-24T01:52:58.031Z: Prior current facts: {"done":"Production main is c6de1a7. The custom domain serves its bundle. Muba Booking is healthy, migration history ends at driver_schedule_revision, booking-email v4 is active, dispatch is enabled and the pending and in-flight counts are zero.","resultAt":"2026-11-24T01:46:33.286Z"}

2026-11-24T01:52:58.031Z: CI passed all tests and the build. The first Pages publish could not find its artifact. GitHub now lists the artifact and the exact commit is retrying.

2026-11-24T01:55:10.787Z: Prior current facts: {"done":"Both production migrations are recorded. The verification RPC and private queue permissions, all five email fields, and the enabled snapshot trigger were checked. Hosted booking-email v5 matches both files at d2a6b7f; a post-update timer invocation exited successfully.","resultAt":"2026-11-24T01:52:58.029Z"}

2026-11-24T01:55:10.787Z: Verified HTTP 200, bundle index-r1EO0O60.js, the Muba backend configuration, both source files of the active email worker, the live database grants and trigger, and bilingual browser entry paths. No live test ride was created.
<!-- SECTION:NOTES:END -->

---
id: MS-030
title: Put ride details in booking emails and write French emails with accents
status: Done
assignee:
  - '@claude'
created_date: '2026-11-23 14:45'
updated_date: '2026-11-24 01:53'
completed_date: '2026-11-24T01:53:24.504Z'
labels: []
dependencies: []
references:
  - supabase/functions/booking-email/handler.mjs
  - supabase/tests/booking-email.mjs
modified_files:
  - supabase/migrations/20261123150000_booking_email_trip_details.sql
  - supabase/functions/booking-email/handler.mjs
  - supabase/tests/email-message.mjs
  - supabase/tests/booking-email.mjs
  - supabase/tests/intake-limits.mjs
  - package.json
  - README.md
priority: medium
type: enhancement
ordinal: 44000
---

## Description

<!-- SECTION:DESCRIPTION:BEGIN -->
The owner asked for accented French in the booking emails and for ride details in each email. MS-029 accented the site copy only.
<!-- SECTION:DESCRIPTION:END -->

## Current Checkpoint

<!-- SECTION:CURRENT_CHECKPOINT:BEGIN -->
```yaml
done: >-
  The fresh CI runner passed the email worker and intake suites, lint, nine fast
  checks and the production build at d2a6b7f. Production now has the trip
  snapshot trigger and five snapshot fields. Both booking-email v5 source files
  match that commit, and scheduled dispatch succeeded.
next: Operational monitoring continues under MS-016.
latestChange: >-
  Approved MS-030 changes deployed to the production database and email worker
  after the two integration suites passed on a clean CI database. Delivery to an
  actual recipient was not tested in this release.
resultAt: '2026-11-24T01:53:24.486Z'
evidence:
  - >-
    npm test 9/9 including five email-message tests (EN receipt, FR confirmed
    with 72,50 €, update and decline, driver alert without contact, legacy row).
  - >-
    Rolled-back local transaction: a cancellation email copied pickup,
    destination, passengers and both fares from its ride.
  - >-
    All unsent, never-attempted local emails were backfilled; anon cannot
    execute the trigger function.
  - 'supabase db advisors: no issues. Lint and build pass.'
  - supabase/tests/booking-email.mjs
  - supabase/tests/intake-limits.mjs
  - 'https://github.com/RosuLaurentiu/muba-site/actions/runs/45307805602'
  - d2a6b7fe1848d75df1603daaea4e06683264a28b
approach: >-
  BEFORE INSERT trigger on booking_email copies pickup, destination, passengers
  and fares from the ride; the handler renders them. Passenger contact stays
  out.
remainingChecks: []
affectedFiles:
  - supabase/migrations/20261123150000_booking_email_trip_details.sql
  - supabase/functions/booking-email/handler.mjs
  - supabase/tests/email-message.mjs
  - supabase/tests/booking-email.mjs
  - supabase/tests/intake-limits.mjs
  - package.json
  - README.md
ownedPaths:
  - supabase/migrations/20261123150000_booking_email_trip_details.sql
  - supabase/functions/booking-email/handler.mjs
  - supabase/tests/email-message.mjs
  - supabase/tests/booking-email.mjs
  - supabase/tests/intake-limits.mjs
  - package.json
  - README.md
```
<!-- SECTION:CURRENT_CHECKPOINT:END -->

## Time & Usage

<!-- SECTION:TIME_USAGE:BEGIN -->
```json
{
  "sessions": [
    {
      "id": "claude-5f10e85b-95a7-4b35-a0d6-ab8822af6300-activity",
      "actor": "agent",
      "label": "Claude Code (estimate)",
      "state": "stopped",
      "intervals": [
        {
          "start": "2026-11-23T14:48:50.429Z",
          "end": "2026-11-23T14:49:22.813Z"
        },
        {
          "start": "2026-11-23T15:11:35.191Z",
          "end": "2026-11-23T15:11:45.742Z"
        }
      ]
    }
  ],
  "usage": [
    {
      "source": "claude-task-estimate",
      "runId": "5f10e85b-95a7-4b35-a0d6-ab8822af6300",
      "segmentId": "auto-1795445330429",
      "mode": "cumulative",
      "shared": true,
      "model": "claude-opus-5-5",
      "scope": "task",
      "attribution": {
        "taskId": "MS-030",
        "planningRoot": "C:\\Users\\rosu_\\Desktop\\Development\\Muba Site",
        "start": "2026-11-23T14:48:50.429Z",
        "end": "2026-11-23T14:49:22.813Z"
      },
      "tokens": {
        "input": 944416,
        "output": 2507,
        "cachedInput": 940557,
        "reasoningOutput": null,
        "total": 946923
      },
      "evidence": [
        "claude-session:5f10e85b-95a7-4b35-a0d6-ab8822af6300"
      ],
      "recordedAt": "2026-11-23T14:49:22.813Z"
    },
    {
      "source": "claude-task-estimate",
      "runId": "5f10e85b-95a7-4b35-a0d6-ab8822af6300",
      "segmentId": "auto-1795446695191",
      "mode": "cumulative",
      "shared": true,
      "model": "claude-opus-5-5",
      "scope": "task",
      "attribution": {
        "taskId": "MS-030",
        "planningRoot": "C:\\Users\\rosu_\\Desktop\\Development\\Muba Site",
        "start": "2026-11-23T15:11:35.191Z",
        "end": "2026-11-23T15:11:45.742Z"
      },
      "tokens": {
        "input": 953238,
        "output": 432,
        "cachedInput": 951798,
        "reasoningOutput": null,
        "total": 953670
      },
      "evidence": [
        "claude-session:5f10e85b-95a7-4b35-a0d6-ab8822af6300"
      ],
      "recordedAt": "2026-11-23T15:11:45.742Z"
    }
  ],
  "corrections": []
}
```
<!-- SECTION:TIME_USAGE:END -->

## Acceptance Criteria
<!-- AC:BEGIN -->
- [x] #1 Rider and driver booking emails list pickup, destination, pickup and return times, passengers and the fare when one is known.
- [x] #2 French booking and verification-code emails use standard accents.
- [x] #3 Queued emails keep the trip details from the moment they were queued, and the details are deleted with the ride.
- [x] #4 The local booking email suite, lint, tests and build pass; hosted changes wait for the owner.
<!-- AC:END -->

## Implementation Notes

<!-- SECTION:NOTES:BEGIN -->
2026-11-23T14:49:08.924Z: Booking emails now list Paris times, pickup address, destination, passengers and the estimated or agreed fare. French booking and code emails use accents. A trigger copies the trip onto each queued email without passenger contact details, and the copy is deleted with its ride. Unit tests, lint, build and database advisors pass, and the migration is applied locally. The database email suites still need an empty local outbox. The hosted deploy is waiting for the owner.

2026-11-23T15:11:35.519Z: Prior current facts: {"done":"Emails list the trip and fare, French emails and the code email use accents, and a trigger copies the trip onto each queued email. Unit tests, lint, build and advisors pass; the migration is applied locally.","resultAt":"2026-11-23T14:49:08.924Z"}

2026-11-23T15:11:35.519Z: The owner chose to skip the local database email suites and rely on CI. CI runs booking-email.mjs and intake-limits.mjs on a fresh stack before deployment. The 9 waiting local test emails stay as they are.

2026-11-24T01:53:24.486Z: Prior current facts: {"done":"The owner chose to skip the local database email suites and rely on CI. CI runs booking-email.mjs and intake-limits.mjs on a fresh stack before deployment. The 9 waiting local test emails stay as they are.","resultAt":"2026-11-23T15:11:35.519Z"}

2026-11-24T01:53:24.486Z: Approved MS-030 changes deployed to the production database and email worker after the two integration suites passed on a clean CI database. Delivery to an actual recipient was not tested in this release.
<!-- SECTION:NOTES:END -->

## Final Summary

<!-- SECTION:FINAL_SUMMARY:BEGIN -->
Rider and driver emails now include the queued trip details and localized amounts. The CI email and intake suites passed. The production trigger and worker version were verified.
<!-- SECTION:FINAL_SUMMARY:END -->

---
id: MS-011
title: Verify hosted booking email delivery and recovery
status: In Progress
assignee:
  - '@codex'
created_date: '2026-11-21 15:23'
updated_date: '2026-11-22 15:42'
labels: []
dependencies: []
references:
  - README.md
  - >-
    backlog/tasks/ms-002 -
    Revamp-Private-Taxi-Paris-for-rider-reservations-and-driver-scheduling.md
  - backlog/tasks/ms-008 - Alert-the-assigned-driver-to-new-web-bookings.md
  - backlog/tasks/ms-002.07 - Keep-riders-informed-when-a-booking-changes.md
  - MS-023
documentation:
  - backlog/evidence/MS-011/review.md
priority: high
type: task
ordinal: 18000
---

## Description

<!-- SECTION:DESCRIPTION:BEGIN -->
Use the existing hosted test site with fictional bookings and controlled inboxes before the separate public release decision. Retain the local retention and recovery evidence.
<!-- SECTION:DESCRIPTION:END -->

## Current Checkpoint

<!-- SECTION:CURRENT_CHECKPOINT:BEGIN -->
```yaml
done: >-
  The hosted worker delivered one fictional rider receipt and one driver alert
  through Resend. The test booking was removed. Installed and enabled dispatch
  every minute on netcup using the existing worker token. A timer-triggered
  invocation succeeded with an empty queue. MS-023 verified the local overdue
  indicator and documented the missed-alert response in README.
next: >-
  After separate approval, verify hosted retries and rider updates, then confirm
  missed-alert handling on the driver's phone.
latestChange: >-
  Linked the MS-023 overdue-mail check and missed-alert procedure. Local
  verification passed. Hosted delivery and phone acceptance remain open.
resultAt: '2026-11-22T15:42:59.367Z'
evidence:
  - >-
    Resend domain setup:
    https://resend.com/domains/add/455a8705-2010-4c29-828c-2e6bd59d9656
  - >-
    Network Solutions authoritative nameservers and unused Resend DNS names
    verified without edits
  - Deno check and local mocked Resend worker checks passed
  - DNS checked at ns37.worldnic.com and ns38.worldnic.com
  - 'https://resend.com/domains/455a8705-2010-4c29-828c-2e6bd59d9656'
  - 'https://resend.com/emails/01a20371-9296-74f9-a3f2-c3a1b50edfa7'
  - >-
    Hosted booking-email Edge Function v1 in Muba Booking (active; custom bearer
    authentication)
  - >-
    Read-only outbox and RPC grants check, Deno check, hosted 405 and unsigned
    401
  - >-
    Resend approved key creation verified through its one-time key dialog
    without exposing the credential.
  - >-
    Muba Booking Edge Function Secrets lists the three expected email settings.
    No values read. Read-only outbox aggregate: zero jobs and pg_cron not
    installed.
  - >-
    Hosted PostgreSQL boolean probe: pending ride, exactly two intended jobs and
    rollback of the ride and both jobs verified. Read-only inventory found one
    linked driver inbox and no unsent jobs before the rehearsal.
  - 'https://resend.com/emails/01a203ba-1f19-7b68-800a-cde05d8ed28d'
  - 'https://resend.com/emails/01a203ba-1e38-7e23-983b-daf9afd81c48'
  - >-
    VPS invocation of the hosted booking-email worker reported sent=2 and
    failed=0. A targeted database cleanup removed the fictional ride.
  - >-
    netcup muba-booking-email.timer enabled and active. Automatic service
    invocation exited with status 0.
remainingChecks:
  - Verify hosted retry and rider update after a decision.
  - >-
    Confirm the documented missed-alert procedure and driver phone notification
    on the hosted service.
```
<!-- SECTION:CURRENT_CHECKPOINT:END -->

## Time & Usage

<!-- SECTION:TIME_USAGE:BEGIN -->
```json
{
  "sessions": [
    {
      "id": "codex-01a2000a-86d0-7722-9349-886d24da4f86-activity",
      "actor": "agent",
      "label": "Codex (estimate)",
      "state": "stopped",
      "intervals": [
        {
          "start": "2026-11-21T21:46:57.109Z",
          "end": "2026-11-21T21:48:58.936Z"
        }
      ]
    },
    {
      "id": "codex-01a2011c-48f4-77f3-a974-7f8036e91ba3-activity",
      "actor": "agent",
      "label": "Codex (estimate)",
      "state": "stopped",
      "intervals": [
        {
          "start": "2026-11-22T12:51:42.926Z",
          "end": "2026-11-22T12:52:46.968Z"
        },
        {
          "start": "2026-11-22T13:21:22.413Z",
          "end": "2026-11-22T13:21:33.336Z"
        },
        {
          "start": "2026-11-22T13:29:31.724Z",
          "end": "2026-11-22T13:30:18.101Z"
        },
        {
          "start": "2026-11-22T13:47:46.989Z",
          "end": "2026-11-22T13:52:48.734Z"
        },
        {
          "start": "2026-11-22T14:14:23.373Z",
          "end": "2026-11-22T14:15:29.793Z"
        },
        {
          "start": "2026-11-22T14:15:38.948Z",
          "end": "2026-11-22T14:16:28.210Z"
        },
        {
          "start": "2026-11-22T14:30:28.333Z",
          "end": "2026-11-22T14:31:43.620Z"
        }
      ]
    }
  ],
  "usage": [
    {
      "source": "codex-task-estimate",
      "runId": "01a2000a-86d0-7722-9349-886d24da4f86",
      "segmentId": "auto-1795297625600",
      "mode": "cumulative",
      "shared": true,
      "model": "gpt-6.2-sol",
      "scope": "task",
      "attribution": {
        "taskId": "MS-011",
        "planningRoot": "C:\\Users\\rosu_\\Desktop\\Development\\Muba Site",
        "start": "2026-11-21T21:47:05.600Z",
        "end": "2026-11-21T21:48:16.147Z"
      },
      "tokens": {
        "input": 543165,
        "output": 2477,
        "cachedInput": 535040,
        "reasoningOutput": 1049,
        "total": 545642
      },
      "evidence": [
        "codex-session:01a2000a-86d0-7722-9349-886d24da4f86"
      ],
      "recordedAt": "2026-11-21T21:48:16.147Z"
    },
    {
      "source": "codex-task-estimate",
      "runId": "01a2011c-48f4-77f3-a974-7f8036e91ba3",
      "segmentId": "auto-1795351907590",
      "mode": "cumulative",
      "shared": true,
      "model": "gpt-6.2-sol",
      "scope": "task",
      "attribution": {
        "taskId": "MS-011",
        "planningRoot": "C:\\Users\\rosu_\\Desktop\\Development\\Muba Site",
        "start": "2026-11-22T12:51:47.590Z",
        "end": "2026-11-22T12:52:46.500Z"
      },
      "tokens": {
        "input": 1307409,
        "output": 1174,
        "cachedInput": 1303808,
        "reasoningOutput": 397,
        "total": 1308583
      },
      "evidence": [
        "codex-session:01a2011c-48f4-77f3-a974-7f8036e91ba3"
      ],
      "recordedAt": "2026-11-22T12:52:46.500Z"
    },
    {
      "source": "codex-task-estimate",
      "runId": "01a2011c-48f4-77f3-a974-7f8036e91ba3",
      "segmentId": "auto-1795353687050",
      "mode": "cumulative",
      "shared": true,
      "model": "gpt-6.2-sol",
      "scope": "task",
      "attribution": {
        "taskId": "MS-011",
        "planningRoot": "C:\\Users\\rosu_\\Desktop\\Development\\Muba Site",
        "start": "2026-11-22T13:21:27.050Z",
        "end": "2026-11-22T13:21:32.764Z"
      },
      "tokens": {
        "input": 349545,
        "output": 100,
        "cachedInput": 348672,
        "reasoningOutput": 21,
        "total": 349645
      },
      "evidence": [
        "codex-session:01a2011c-48f4-77f3-a974-7f8036e91ba3"
      ],
      "recordedAt": "2026-11-22T13:21:32.764Z"
    },
    {
      "source": "codex-task-estimate",
      "runId": "01a2011c-48f4-77f3-a974-7f8036e91ba3",
      "segmentId": "auto-1795354176774",
      "mode": "cumulative",
      "shared": true,
      "model": "gpt-6.2-sol",
      "scope": "task",
      "attribution": {
        "taskId": "MS-011",
        "planningRoot": "C:\\Users\\rosu_\\Desktop\\Development\\Muba Site",
        "start": "2026-11-22T13:29:36.774Z",
        "end": "2026-11-22T13:29:49.829Z"
      },
      "tokens": {
        "input": 377654,
        "output": 309,
        "cachedInput": 376576,
        "reasoningOutput": 61,
        "total": 377963
      },
      "evidence": [
        "codex-session:01a2011c-48f4-77f3-a974-7f8036e91ba3"
      ],
      "recordedAt": "2026-11-22T13:29:49.829Z"
    },
    {
      "source": "codex-task-estimate",
      "runId": "01a2011c-48f4-77f3-a974-7f8036e91ba3",
      "segmentId": "auto-1795354189829",
      "mode": "cumulative",
      "shared": true,
      "scope": "task",
      "attribution": {
        "taskId": "MS-011",
        "planningRoot": "C:\\Users\\rosu_\\Desktop\\Development\\Muba Site",
        "start": "2026-11-22T13:29:49.829Z",
        "end": "2026-11-22T13:30:17.523Z"
      },
      "tokens": {
        "input": 757045,
        "output": 866,
        "cachedInput": 755200,
        "reasoningOutput": 169,
        "total": 757911
      },
      "evidence": [
        "codex-session:01a2011c-48f4-77f3-a974-7f8036e91ba3"
      ],
      "recordedAt": "2026-11-22T13:30:17.523Z"
    },
    {
      "source": "codex-task-estimate",
      "runId": "01a2011c-48f4-77f3-a974-7f8036e91ba3",
      "segmentId": "auto-1795355271545",
      "mode": "cumulative",
      "shared": true,
      "model": "gpt-6.2-sol",
      "scope": "task",
      "attribution": {
        "taskId": "MS-011",
        "planningRoot": "C:\\Users\\rosu_\\Desktop\\Development\\Muba Site",
        "start": "2026-11-22T13:47:51.545Z",
        "end": "2026-11-22T13:52:48.252Z"
      },
      "tokens": {
        "input": 10092524,
        "output": 6528,
        "cachedInput": 10055424,
        "reasoningOutput": 3096,
        "total": 10099052
      },
      "evidence": [
        "codex-session:01a2011c-48f4-77f3-a974-7f8036e91ba3"
      ],
      "recordedAt": "2026-11-22T13:52:48.252Z"
    },
    {
      "source": "codex-task-estimate",
      "runId": "01a2011c-48f4-77f3-a974-7f8036e91ba3",
      "segmentId": "auto-1795356867339",
      "mode": "cumulative",
      "shared": true,
      "model": "gpt-6.2-sol",
      "scope": "task",
      "attribution": {
        "taskId": "MS-011",
        "planningRoot": "C:\\Users\\rosu_\\Desktop\\Development\\Muba Site",
        "start": "2026-11-22T14:14:27.339Z",
        "end": "2026-11-22T14:15:19.130Z"
      },
      "tokens": {
        "input": 401843,
        "output": 481,
        "cachedInput": 392576,
        "reasoningOutput": 164,
        "total": 402324
      },
      "evidence": [
        "codex-session:01a2011c-48f4-77f3-a974-7f8036e91ba3"
      ],
      "recordedAt": "2026-11-22T14:15:19.130Z"
    },
    {
      "source": "codex-task-estimate",
      "runId": "01a2011c-48f4-77f3-a974-7f8036e91ba3",
      "segmentId": "auto-1795356941868",
      "mode": "cumulative",
      "shared": true,
      "model": "gpt-6.2-sol",
      "scope": "task",
      "attribution": {
        "taskId": "MS-011",
        "planningRoot": "C:\\Users\\rosu_\\Desktop\\Development\\Muba Site",
        "start": "2026-11-22T14:15:41.868Z",
        "end": "2026-11-22T14:16:27.694Z"
      },
      "tokens": {
        "input": 172977,
        "output": 538,
        "cachedInput": 170752,
        "reasoningOutput": 171,
        "total": 173515
      },
      "evidence": [
        "codex-session:01a2011c-48f4-77f3-a974-7f8036e91ba3"
      ],
      "recordedAt": "2026-11-22T14:16:27.694Z"
    },
    {
      "source": "codex-task-estimate",
      "runId": "01a2011c-48f4-77f3-a974-7f8036e91ba3",
      "segmentId": "auto-1795357831715",
      "mode": "cumulative",
      "shared": true,
      "model": "gpt-6.2-sol",
      "scope": "task",
      "attribution": {
        "taskId": "MS-011",
        "planningRoot": "C:\\Users\\rosu_\\Desktop\\Development\\Muba Site",
        "start": "2026-11-22T14:30:31.715Z",
        "end": "2026-11-22T14:31:07.250Z"
      },
      "tokens": {
        "input": 616422,
        "output": 588,
        "cachedInput": 596608,
        "reasoningOutput": 198,
        "total": 617010
      },
      "evidence": [
        "codex-session:01a2011c-48f4-77f3-a974-7f8036e91ba3"
      ],
      "recordedAt": "2026-11-22T14:31:07.250Z"
    }
  ],
  "corrections": []
}
```
<!-- SECTION:TIME_USAGE:END -->

## Acceptance Criteria
<!-- AC:BEGIN -->
- [ ] #1 With the approved test setup, show that one fictional web booking alerts the driver on his phone while the workspace is closed and that an opted-in rider receives an update after the ride changes. Verify that a failed delivery is visible and can be recovered without duplicating the ride.
- [x] #2 Demonstrate the approved data safeguards with test records: passenger data is removed after the 90-day retention period, daily encrypted exports are kept for seven days, and a local restore recovers a usable test booking.
- [ ] #3 Record test environment, sender, provider and delivery cost limit, controlled recipients, and the missed-alert fallback.
- [ ] #4 Link the release-candidate walkthrough and report go-or-hold evidence for all delivery checks to MS-016.
<!-- AC:END -->

## Implementation Plan

<!-- SECTION:PLAN:BEGIN -->
Prove retention and encrypted recovery using fictional data locally. Record pilot scope and outstanding approvals. A real phone delivery check requires an approved environment and sender.
<!-- SECTION:PLAN:END -->

## Implementation Notes

<!-- SECTION:NOTES:BEGIN -->
2026-11-22T13:52:41.235Z: Prior current facts: {"done":"Passed an isolated fictional-data test for the 90-day purge, Calendar removal queue, seven dated encrypted archives and private booking recovery. Owner approved Resend, a verified sender on privatetaxiparis.com, a EUR 0 test budget, and fictional bookings. Recipients are the assigned driver verified inbox and an owner-controlled rider inbox. Added privatetaxiparis.com as a sending domain in Resend Ireland. The owner selected bookings@privatetaxiparis.com and confirmed a controlled Gmail inbox. The local email worker passed Deno check and a mocked Resend test for token authentication, private links and repeated idempotency keys. Owner approved the four proposed DNS records and one fictional receipt to the controlled Gmail inbox. Added the four approved DNS records in Network Solutions. Both authoritative nameservers published them and Resend verified privatetaxiparis.com. One fictional receipt from bookings@privatetaxiparis.com was marked Delivered in Resend after a single template test to the owner-approved inbox.","resultAt":"2026-11-22T13:30:09.994Z"}

2026-11-22T13:52:41.235Z: Deployed booking-email v1 and verified the hosted endpoint rejects unauthorized requests. The approved app URL is already in place. Credential creation and storage await action-time confirmation, and automatic dispatch remains pending.

2026-11-22T14:15:34.328Z: Prior current facts: {"done":"Resend verified privatetaxiparis.com and delivered one fictional template receipt. Deployed booking-email v1 from the committed worker source to Muba Booking. The current app URL matches the public site. The hosted endpoint rejected unsigned POST with 401 and GET with 405. The outbox was empty before deployment.","resultAt":"2026-11-22T13:52:41.234Z"}

2026-11-22T14:15:34.328Z: Created the domain-scoped sending key. Prepared the worker token and sender and handed off the one-time key transfer because the browser clipboard could not complete it.

2026-11-22T14:19:30.977Z: Prior current facts: {"done":"Resend verified privatetaxiparis.com and delivered one fictional template receipt. Deployed booking-email v1 from the committed worker source to Muba Booking. The current app URL matches the public site. The hosted endpoint rejected unsigned POST with 401 and GET with 405. The outbox was empty before deployment. Created the owner-approved Sending access key in Resend, restricted to privatetaxiparis.com.","resultAt":"2026-11-22T14:15:34.327Z"}

2026-11-22T14:19:30.977Z: Verified all three email secrets are saved in Muba Booking and the outbox was empty. Hosted delivery and scheduling remain unverified.

2026-11-22T14:32:53.199Z: Prior current facts: {"done":"Resend verified privatetaxiparis.com and delivered one fictional template receipt. Deployed booking-email v1 from the committed worker source to Muba Booking. The current app URL matches the public site. The hosted endpoint rejected unsigned POST with 401 and GET with 405. The outbox was empty before deployment. Created the owner-approved Sending access key in Resend, restricted to privatetaxiparis.com. After the owner saved the secrets, verified that MUBA_EMAIL_API_KEY, MUBA_EMAIL_WORKER_TOKEN and MUBA_EMAIL_FROM are listed in Muba Booking. A read-only aggregate check found no mail jobs and no pg_cron extension.","resultAt":"2026-11-22T14:19:30.976Z"}

2026-11-22T14:32:53.199Z: Verified hosted rider and driver email queue generation with one fictional web booking. The booking and jobs were rolled back. Delivery still needs a secure authenticated caller and isolation from other live queue entries.

2026-11-22T14:51:15.451Z: Prior current facts: {"done":"Resend verified privatetaxiparis.com and delivered one fictional template receipt. Deployed booking-email v1 from the committed worker source to Muba Booking. The current app URL matches the public site. The hosted endpoint rejected unsigned POST with 401 and GET with 405. The outbox was empty before deployment. Created the owner-approved Sending access key in Resend, restricted to privatetaxiparis.com. After the owner saved the secrets, verified that MUBA_EMAIL_API_KEY, MUBA_EMAIL_WORKER_TOKEN and MUBA_EMAIL_FROM are listed in Muba Booking. A read-only aggregate check found no mail jobs and no pg_cron extension. With owner approval for a hosted fictional booking, verified in Muba Booking that the normal web booking RPC created a pending ride and exactly two jobs: the fictional rider receipt and the assigned driver alert. Verified the ride and both jobs were rolled back.","resultAt":"2026-11-22T14:32:53.198Z"}

2026-11-22T14:51:15.451Z: Verified Resend delivery for the hosted rider receipt and driver alert from one approved fictional booking. Removed the test booking afterward.

2026-11-22T14:57:27.676Z: Prior current facts: {"done":"Resend verified privatetaxiparis.com and delivered one fictional template receipt. Deployed booking-email v1 from the committed worker source to Muba Booking. The current app URL matches the public site. The hosted endpoint rejected unsigned POST with 401 and GET with 405. The outbox was empty before deployment. Created the owner-approved Sending access key in Resend, restricted to privatetaxiparis.com. After the owner saved the secrets, verified that MUBA_EMAIL_API_KEY, MUBA_EMAIL_WORKER_TOKEN and MUBA_EMAIL_FROM are listed in Muba Booking. A read-only aggregate check found no mail jobs and no pg_cron extension. With owner approval for a hosted fictional booking, verified in Muba Booking that the normal web booking RPC created a pending ride and exactly two jobs: the fictional rider receipt and the assigned driver alert. Verified the ride and both jobs were rolled back. Synchronized the worker token to Edge Functions and a restricted caller location on netcup. The live worker sent exactly one fictional rider receipt and one driver alert, with zero failures. Resend marked both Delivered. No other emails were queued during dispatch and the fictional ride was removed.","resultAt":"2026-11-22T14:51:15.450Z"}

2026-11-22T14:57:27.676Z: Enabled the one-minute VPS email timer and verified an automatic authenticated worker run succeeded.

2026-11-22T15:42:59.368Z: Prior current facts: {"done":"The hosted worker delivered one fictional rider receipt and one driver alert through Resend. The test booking was removed. Installed and enabled dispatch every minute on netcup using the existing worker token. A timer-triggered invocation succeeded with an empty queue.","resultAt":"2026-11-22T14:57:27.676Z"}

2026-11-22T15:42:59.368Z: Linked the MS-023 overdue-mail check and missed-alert procedure. Local verification passed. Hosted delivery and phone acceptance remain open.
<!-- SECTION:NOTES:END -->

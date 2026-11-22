---
id: MS-020
title: Allow a second Google login for driver testing
status: In Progress
assignee:
  - '@codex'
created_date: '2026-11-22 01:20'
updated_date: '2026-11-22 01:24'
labels: []
dependencies: []
references:
  - MS-003
  - MS-008
modified_files:
  - README.md
  - src/CalendarPanel.jsx
  - supabase/migrations/20261122012000_allow_driver_tester.sql
  - supabase/functions/calendar-sync/handler.mjs
  - supabase/tests/booking-email.mjs
  - supabase/tests/calendar-sync.mjs
priority: high
type: enhancement
ordinal: 27000
---

## Description

<!-- SECTION:DESCRIPTION:BEGIN -->
Let the primary driver and one named tester use the same workspace. Preserve the primary recipient of web booking alerts and control of the shared Google Calendar.
<!-- SECTION:DESCRIPTION:END -->

## Current Checkpoint

<!-- SECTION:CURRENT_CHECKPOINT:BEGIN -->
```yaml
done: >-
  Added a separately assigned tester login. Local checks proved shared ride
  access, tester writes, active-session revocation, primary-only alerts and
  Calendar restriction. Both roles passed the EN/FR mobile workspace checks.
  Lint, build, Calendar type check and database regressions passed.
next: >-
  Enable Google Auth for the two named accounts on the hosted test project while
  preserving the existing primary assignment and Calendar. The business address
  needs its own Auth account.
latestChange: >-
  Shared workspace access and primary-only integrations passed locally. Hosted
  Google setup requires dashboard access and provisioning the business account.
resultAt: '2026-11-22T01:24:18.700Z'
remainingChecks:
  - Authenticated Supabase dashboard and Google Cloud OAuth setup
  - >-
    Provision business account and assign the second hosted slot with the
    current primary and Calendar preserved
  - Verify real Google sign-in from both approved accounts
```
<!-- SECTION:CURRENT_CHECKPOINT:END -->

## Acceptance Criteria
<!-- AC:BEGIN -->
- [x] #1 The primary driver and assigned tester can access the same schedule and booking records. Other accounts have no access and removal takes effect for an active tester session.
- [x] #2 Only the primary driver receives new-booking email alerts and can manage the shared Calendar connection.
- [ ] #3 Google sign-in works for both approved accounts in the hosted test environment.
<!-- AC:END -->

## Implementation Notes

<!-- SECTION:NOTES:BEGIN -->
Distinct outcome: MS-003 delivered Google sign-in for one driver; this adds a separately assigned login for the owner to test.

2026-11-22T01:24:18.701Z: Shared workspace access and primary-only integrations passed locally. Hosted Google setup requires dashboard access and provisioning the business account.
<!-- SECTION:NOTES:END -->

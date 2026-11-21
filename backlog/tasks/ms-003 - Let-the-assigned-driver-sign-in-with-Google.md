---
id: MS-003
title: Let the assigned driver sign in with Google
status: Done
assignee:
  - '@codex'
created_date: '2026-11-21 14:10'
updated_date: '2026-11-21 14:35'
completed_date: '2026-11-21T14:35:00.868Z'
labels: []
dependencies:
  - MS-002.04
references:
  - MS-002.06
documentation:
  - backlog/evidence/MS-003/review.md
modified_files:
  - README.md
  - src/DriverWorkspace.jsx
  - src/i18n.js
  - supabase/config.toml
type: feature
ordinal: 10000
---

## Description

<!-- SECTION:DESCRIPTION:BEGIN -->
Add Google as a local-testable sign-in option for the single assigned driver. Keep email/password available, preserve the existing user-ID access check, and keep Google Calendar consent and rider notifications separate.
<!-- SECTION:DESCRIPTION:END -->

## Current Checkpoint

<!-- SECTION:CURRENT_CHECKPOINT:BEGIN -->
```yaml
done: >-
  Verified real Google sign-in to the assigned local Supabase account, denial
  after removal of its driver assignment, and password fallback in browser
  testing. Removed the test account and preserved the ride count.
next: >-
  No remaining local acceptance work. Hosted setup requires separate owner
  approval.
latestChange: >-
  Real Google sign-in linked the existing assigned test account and opened its
  ride views. The same session was denied after assignment removal. Lint and
  build passed.
resultAt: '2026-11-21T14:35:00.861Z'
```
<!-- SECTION:CURRENT_CHECKPOINT:END -->

## Acceptance Criteria
<!-- AC:BEGIN -->
- [x] #1 The driver can use Google sign-in locally with a Supabase session for the assigned driver account.
- [x] #2 An unassigned Google identity cannot access rides, and password sign-in still works for the assigned driver.
- [x] #3 Google sign-in requests identity scopes only. Calendar authorization remains a separate action and rider notifications stay deferred.
<!-- AC:END -->

## Implementation Plan

<!-- SECTION:PLAN:BEGIN -->
1. [70%] Confirm the local configuration and access rules.
2. [0%] Implement identity-only Google sign-in and keep password sign-in.
3. [0%] Verify locally and record results.
<!-- SECTION:PLAN:END -->

## Implementation Notes

<!-- SECTION:NOTES:BEGIN -->
Distinct outcome: The completed driver inbox added password sign-in. This follow-up adds Google identity to the existing account without reopening the inbox task.

2026-11-21T14:10:51.043Z: Started the Google identity follow-up. Keep the assigned driver check, disabled signup and separate Calendar consent.

2026-11-21T14:23:10.491Z: Prior current facts: {"done":"Confirmed the existing driver is authorized by Supabase user ID and public signup is disabled.","resultAt":"2026-11-21T14:10:51.043Z"}

2026-11-21T14:23:10.491Z: Simulated browser checks and build passed. Real Google reached the identity-only consent screen and awaits the test account owner.

2026-11-21T14:35:00.862Z: Prior current facts: {"done":"Implemented local driver Google sign-in. Browser simulation passed for assigned access, unassigned denial, cancelled consent, disabled provider, and password. The real Google consent screen requested basic identity only.","resultAt":"2026-11-21T14:23:10.490Z"}

2026-11-21T14:35:00.862Z: Real Google sign-in linked the existing assigned test account and opened its ride views. The same session was denied after assignment removal. Lint and build passed.
<!-- SECTION:NOTES:END -->

## Final Summary

<!-- SECTION:FINAL_SUMMARY:BEGIN -->
Added identity-only Google sign-in for the assigned driver. Verified locally with real Google OAuth and the existing Supabase ride authorization. Browser checks also covered password sign-in and cancellation. No hosted deployment or rider notifications.
<!-- SECTION:FINAL_SUMMARY:END -->

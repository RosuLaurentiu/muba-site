# Rider and driver design review

## Before and after

| Screen | Before | After |
| --- | --- | --- |
| Rider, 390 × 740 | [Before](before-rider-mobile.jpg) | [After](after-rider-mobile.jpg) |
| Rider, 1440 × 900 | [Before](before-rider-desktop.jpg) | [After](after-rider-desktop.jpg) |
| Driver, 390 × 740 | [Before](before-driver-mobile.jpg) | [After](after-driver-mobile.jpg) |
| Driver, 1440 × 900 | [Before](before-driver-desktop.jpg) | [After](after-driver-desktop.jpg) |

[Rider in French and Light](after-rider-fr-light.jpg) · [Driver in French and Light](after-driver-fr-light.jpg) · [Driver sign-in](after-driver-signin.jpg)

## What changed

Two independent reviewers found that preferences competed with booking, schedule actions sat behind account controls, and long addresses could overflow on phones. The booking page now leads with the Paris transfer service, explains who confirms the ride and puts the pickup field within the first phone screen. The generated fleet image uses the owner's preferred low rear three-quarter angle with a white Tesla and a black Mercedes van.

The driver workspace puts pending requests and the day's schedule above account settings. The next ride on the selected day shows the passenger phone link and directions for that pickup. Both views share the charcoal and light palettes and remember their appearance separately.

## Local verification

- Chromium rendered both home screens in English and French, in both themes, at widths of 320, 390 and 1440 pixels without horizontal scrolling. A synthetic 300-character unbroken pickup address also fit the driver screen at 390 pixels.
- The pickup shortcut and empty-form validation focused the pickup field. Keyboard tabbing showed a visible focus ring. Text, secondary text, error text and primary button label colors met a 4.5:1 contrast ratio on the tested surfaces in both themes.
- A passenger could enter addresses manually, switch language while preserving input, review the trip, submit a synthetic request and refresh its private status. A link without a valid key offered a new request. Driver checks covered sign-in rendering, the populated schedule, pickup directions, ride details, manual entry and blocked-time entry.
- Lint, production build, rider input checks and schedule checks passed. The browser used synthetic rides and local responses with external requests blocked, including Google Maps and web fonts.

The owner selected the fleet and camera angle, reviewed the phone and desktop captures, and approved the implemented rider and driver screens on 21 November 2026.

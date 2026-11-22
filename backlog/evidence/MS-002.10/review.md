# Passenger-count UI SDK pilot

The pilot uses `@ui-sdk/react` and `@ui-sdk/core` at `0.1.0-beta.13`, React and React DOM at `19.2.4`, and Vite `8.0.0`. It imports the [React Select component](https://ui-sdk.dev/docs/react/components/select) and uses Muba's CSS tokens.

| Sample | Before | After |
| --- | --- | --- |
| Rider, English, desktop, Dark | [Native dropdown](before-rider-en.png) | [Shared field](after-rider-en.png) · [Open options](after-rider-en-open.png) |
| Driver, English, desktop, Dark | [Number input](before-driver-en.png) | [Shared field](after-driver-en.png) · [Validation error](after-driver-en-error.png) |
| Rider, French, phone, Dark | [Native dropdown](before-rider-fr.png) | [Shared field](after-rider-fr.png) |
| Driver, French, phone, Dark | [Number input](before-driver-fr.png) | [Shared field](after-driver-fr.png) · [Open options](after-driver-fr-open.png) |
| Driver, English, phone, Light | | [Shared field](after-driver-light.png) |

In local Chromium, both forms passed at 1366 px in English/Dark and French/Light and at 390 px in English/Light and 320 px in French/Dark with emulated touch. The pilot kept the default of 1, offered values 1 through 8, and sent numeric `8` in the same `save_ride` payload as the baseline. It kept the rider's value through review and edit. The checks covered label and error associations, clicking the label, selecting by keyboard and touch, Escape returning focus, clearing errors, and the saving state. An invalid starting value was seeded in the test to exercise validation and focus. Every booking was intercepted locally. Safari, physical touch devices, screen readers, and hosted services were outside verification.

Production assets were measured from the same build command with Node gzip. Initial assets are the entry JavaScript and CSS. Sizes are decimal kB, rounded to two places.

| Asset | Before gzip | After gzip | Change |
| --- | ---: | ---: | ---: |
| Initial JavaScript | 75.26 kB | 122.93 kB | +47.67 kB |
| Initial CSS | 3.92 kB | 4.20 kB | +0.28 kB |
| Initial total | 79.18 kB | 127.13 kB | +47.95 kB |
| Lazy driver JavaScript | 66.58 kB | 66.63 kB | +0.06 kB |
| Optional popup sheet chunk | | 13.74 kB | Emitted as a separate lazy chunk |

The initial total grew from 252.88 kB to 389.12 kB before gzip. The npm advisory comparison reported 13 in each lockfile, with identical affected package names. Lint, build, rider input, schedule, and fare checks passed.

The driver now chooses from valid values instead of typing or stepping a number, and both forms use the same styling and interactions. The native rider dropdown already offered the same range at substantially lower cost. Keep the pilot local for review. For another app, reuse the pattern of an app-owned wrapper, controlled values, existing validation, and local theme tokens. Measure the added bytes and repeat the keyboard, touch, and assistive-technology checks against that app's needs before choosing the primitive.

The broader findings are tracked in [MS-002.11](../../tasks/ms-002.11%20-%20Preserve-rider-return-details-when-toggling-round-trip.md) for lost rider return inputs and [MS-002.12](../../tasks/ms-002.12%20-%20Clarify-passenger-details-in-manual-driver-entry.md) for the driver name label and single-line notes.

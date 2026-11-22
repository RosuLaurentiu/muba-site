# Muba Site UX critique

Two independent reviews covered the current rider and driver screens and used the existing Light and Dark themes. The design reviewer inspected the rider entry, review, receipt and private status screens, and the driver workspace, ride details and four schedule editors. Sign-in initially used source and earlier evidence because the local preview restores a driver session. The implementation checks used an isolated browser context to exercise the signed-out screen directly.

## Design assessment

The serif headings, restrained palette and real fleet photo give the rider screens a recognisable Paris taxi identity. The forms support manual address entry and make the pending state explicit. The driver screens shared that visual identity while giving routine utilities, directions and the quote workflow similar emphasis.

| Nielsen heuristic | Starting score |
| --- | ---: |
| Status visibility | 3/4 |
| Match with real-world tasks | 3/4 |
| User control and freedom | 2/4 |
| Consistency and standards | 2/4 |
| Error prevention | 3/4 |
| Recognition over recall | 3/4 |
| Flexibility and efficiency | 2/4 |
| Aesthetic and minimalist design | 3/4 |
| Error recognition and recovery | 3/4 |
| Help and documentation | 2/4 |
| **Total** | **26/40** |

## Priorities

1. **P1 · Decision hierarchy.** Directions competed with confirmation on pending requests, while optional schedule context pushed the decision down. The pending detail now groups the quote, rider acceptance, duration and confirmation. Directions use primary emphasis for confirmed rides. Hard conflicts remain visible and advisory travel detail opens on demand.
2. **P2 · Driver workspace and editors.** Creating a ride required passing the next pickup and queue on a phone. The dashboard, agenda and month also differed in visual and keyboard order. Add ride and Refresh now sit near the top. The queue leads the agenda when it has requests. Editor groups, save and discard actions follow the same order for add, reschedule, time blocks and weekly hours.
3. **P2 · Rider review and follow-up.** A first-time rider needs to know when the estimate becomes a final fare. Fare and trip details now sit together with the edit action. The receipt and status use the same summary structure. A failed status refresh leaves the previous information visible and explains how to retry. A new private link clears the previous booking state.
4. **P2 · Shared controls and access.** Date controls displayed two icons because the SDK included one and CSS drew another. The app now uses one icon. Keyboard users can skip the header, and focus remains visible when the app moves it to the next screen or an error.

## Browser and detector evidence

The Impeccable 0.1.5 source scan initially found three 3px side borders on booking status, the request alert and next pickup. Those were visual findings. The follow-up source scan found zero. Injected browser scans ran on rider entry, the driver day, Add ride and Working hours. The final pass reported zero browser anti-patterns across the four surfaces. Chromium was isolated from the user’s preview and the overlay server was stopped.

For a driver working from a phone, action placement matters more than showing every schedule detail at once. For keyboard users, the page order should follow the job. For a first-time rider, the receipt should make it clear what the driver will do next and where to return. The owner chose all screens and the existing theme, so these priorities were addressed together under MS-002.14.

## Local verification

Chromium exercised the same fourteen screen states at each width. The checks used fictional accounts and bookings, mocked APIs and emulated touch at 320 and 390 pixels. Browser requests to live services were blocked.

| Width | Language | Theme |
| --- | --- | --- |
| 320 px | French | Dark |
| 390 px | English | Light |
| 1024 px | French | Light |
| 1440 px | English | Dark |

- Rider entry, review, receipt, valid status and missing link. Checked validation focus, edit retention, the passenger count in the request, clipboard, private-link navigation and refresh recovery.
- Driver sign-in, dashboard, pending and confirmed rides, reschedule, add, time block, weekly hours and a missing ride. Checked failed sign-in, calendar disclosure, schedule refresh recovery, quote and conflict rules, discard navigation and save payloads.
- All widths showed one calendar icon per trigger, the complete date text, an English or French heading, and no horizontal overflow or page errors. The palettes and font declarations match the starting revision.
- Lint, production build, translation-key parity, and rider-input, schedule, working-hours and fare checks passed. The browser coverage uses a headless Chromium instance. Live authentication, Google services, screen readers and physical devices were outside this run.

[Desktop pending request](driver-pending-desktop.png) · [Mobile time block](driver-block-mobile.png)

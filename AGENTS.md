# AGENTS.md

Instructions for coding agents working in this repository.

## What this is

Bilingual booking site for Private Taxi Paris. Vite and React render the trip
request and private rider status. The signed-in driver uses `?driver` for the
inbox and schedule. Supabase Auth and PostgreSQL store rides and enforce access
and schedule rules. The production URL lives in `src/config.js`.

## Commands

- `npm install` — install dependencies (CI uses `npm ci`)
- `npm run dev` — Vite dev server (default http://localhost:5173)
- `npm run build` — production build into `dist/`
- `npm run preview` — serve the built `dist/`
- `npm run lint` — ESLint over the repo (flat config, `dist` ignored)
- `npm test` — rider input, fare, schedule and working-hours checks

For booking, auth, or database changes, see [Local booking database](README.md#local-booking-database)
for the Supabase setup and checks. For UI changes, verify the affected flow in
the browser in both languages. Run lint and build before committing.

## Layout

- `src/App.jsx` renders the rider form, fare review, receipt and private status.
- `src/booking.js` handles rider validation, Paris time and the Data API.
- `src/DriverWorkspace.jsx` handles sign-in, the inbox and ride details.
- `src/DriverSchedule.jsx` renders the schedule and editors. `src/schedule.js`
  computes day entries, conflicts and adjacent rides.
- `src/App.css` contains the Light and Dark layouts. `src/i18n.js` contains EN/FR copy.
- `supabase/migrations/` contains storage and authorization rules.
  `supabase/tests/` verifies the booking API and time rules locally.

## How the pieces fit

- **Config drives behaviour.** Business facts, vehicles and prices live in `src/config.js`, not in components. Localized config values are `{ en, fr }` objects read with `getLocalizedConfigValue(value, language)`.
- **All UI text goes through i18n.** Use `getText(language, "section.key")`.
  Keep status and error keys in state so they re-render on language switch.
- **Rider SEO** updates the English defaults from `index.html` when the visitor
  changes language.
- **Google Maps** provides autocomplete and fare estimates on the rider form.
  Keep both addresses manually editable and allow requests without a fare
  estimate. See [Google Maps setup](README.md#google-maps-setup) before changing the provider or its allowed origins.
- **Fare estimate** (`routeEstimate` in `src/fare.js`) is computed client-side from route distance and duration using `appConfig.pricing` (short-trip vs long-trip rate, minimum fares, an hourly floor); round trips double the totals.

## Deployment

`.github/workflows/deploy.yml` deploys `dist/` to GitHub Pages on every push to `main` and on manual dispatch. **Pushing to `main` publishes the live site** — do not push without the owner's go-ahead. Deployment requires lint, the fast booking rules, the local database and worker suites, database advisors and a production build. CI applies the project's migrations on a fresh runner.

`vite.config.js` sets `base: "./"` for both GitHub Pages and the custom domain.
Keep asset and navigation links relative-safe. Ask the owner before any hosted
Supabase provisioning or change.

## Conventions

- Every user-visible string needs both an `en` and an `fr` entry under the same key in `src/i18n.js`; do not hard-code text in JSX.
- Match the existing French copy convention of spelling without accents unless the owner requests a change.
- Keep business data and pricing in `src/config.js`.
- `src/App.jsx` uses double quotes and semicolons, two-space indent, function declarations for helpers. There is no Prettier config; follow the file you are editing.
- ESLint's `no-unused-vars` is an error, except for names starting with a capital letter or underscore.

## Things to avoid

- Do not commit `dist/`, `node_modules/` or `*.log` files (all gitignored).
- Keep the existing Google Maps browser key restricted by HTTP referrer. Do
  not replace it or print it. Only the Supabase publishable key belongs in the
  browser bundle. Keep private access keys, service keys and passenger
  information out of logs and evidence.
- Use the existing query-based screens and React state for small changes.
- The phone number, email and Calendly URL in `src/config.js` are the owner's real contact details — change them only when asked.

## Backlog

Tasks live in this project's own Backlog; task IDs start with MS. Use
`.\Backlog.ps1` from this folder, or the Backlog MCP tools when they are bound
to this folder. Read `.\Backlog.ps1 instructions overview` before the first task
change in a session.

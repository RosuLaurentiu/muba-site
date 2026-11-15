# AGENTS.md

Instructions for coding agents working in this repository.

## What this is

Single-page marketing and booking site for a private taxi business in Paris ("Private Taxi Paris", production URL in `src/config.js` → `siteUrl`). Vite 8 + React 19, plain JavaScript (no TypeScript), no router, no backend, no test suite. A visitor enters a trip, gets a Google Maps route and a fare estimate, then sends the request by `mailto:` link, WhatsApp (`wa.me`) link, or books a slot in the embedded Calendly widget.

## Commands

- `npm install` — install dependencies (CI uses `npm ci`)
- `npm run dev` — Vite dev server (default http://localhost:5173)
- `npm run build` — production build into `dist/`
- `npm run preview` — serve the built `dist/`
- `npm run lint` — ESLint over the repo (flat config, `dist` ignored)

There are no tests. Verify changes with `npm run lint`, `npm run build`, and a look at the page in the browser in both languages.

## Layout

- `index.html` — static head (default English meta/OG tags, Google Fonts, Calendly widget CSS) and the `#root` mount.
- `src/main.jsx` — mounts `<App />`.
- `src/App.jsx` — the whole app: one `App` component plus module-level helpers above it (validation, fare calculation, number/duration formatting, mailto/WhatsApp link builders, map styles, SEO tag updates).
- `src/App.css` — all styling (dark minimalist theme); `src/index.css` only sets root min-height.
- `src/config.js` — `appConfig`: business details, contact info, Calendly URL, Google Maps key, map defaults, vehicle types and capacities, pricing rules.
- `src/i18n.js` — `translations` for `en` and `fr`, plus language detection and persistence helpers.
- `public/favicon.svg` — the only static asset.

## How the pieces fit

- **Config drives behaviour.** Business facts, vehicles and prices live in `src/config.js`, not in components. Localized config values are `{ en, fr }` objects read with `getLocalizedConfigValue(value, language)`.
- **All UI text goes through i18n.** `App` calls `translate("section.key")`, which wraps `getText(language, key)` (dot-path lookup). Status messages are stored in state as translation keys (`statusKey`), not as strings, so they re-render on language switch. Initial language comes from a stored choice (`localStorage` key `muba-site-language`), then the browser language, then English.
- **SEO is updated at runtime.** An effect on `language` rewrites `<html lang>`, title, description, OG/Twitter tags, canonical link and JSON-LD structured data. `index.html` only holds the English defaults.
- **Google Maps is loaded on demand** by injecting the Maps JS script (`libraries=places`) when `googleMapsApiKey` is set; Places Autocomplete binds to the pickup and destination inputs and a `DirectionsService` computes the route. With no key, or on load/auth failure, the app falls back to a placeholder (`mapState`: `missingKey | loading | ready | error`) and the email/WhatsApp paths still work. Keep that fallback working.
- **Fare estimate** (`calculateEstimate`) is computed client-side from route distance and duration using `appConfig.pricing` (short-trip vs long-trip rate, minimum fares, an hourly floor); round trips double the totals.

## Deployment

`.github/workflows/deploy.yml` builds and deploys `dist/` to GitHub Pages on every push to `main` (and on manual dispatch). **Pushing to `main` publishes the live site** — do not push without the owner's go-ahead. The workflow runs `npm ci` and `npm run build` only; it does not lint.

`vite.config.js` sets `base: "./"` so the same build works at the GitHub Pages project URL and at the custom domain root. Keep asset references relative-safe; do not change `base` without checking both.

## Conventions

- Every user-visible string needs both an `en` and an `fr` entry under the same key in `src/i18n.js`; do not hard-code text in JSX.
- French copy in this repo is currently written without accents (source files are pure ASCII). Match the surrounding text unless the owner asks for accented French.
- Keep business data and pricing in `src/config.js`.
- `src/App.jsx` uses double quotes and semicolons, two-space indent, function declarations for helpers. There is no Prettier config; follow the file you are editing.
- ESLint's `no-unused-vars` is an error, except for names starting with a capital letter or underscore.

## Things to avoid

- Do not commit `dist/`, `node_modules/` or `*.log` files (all gitignored).
- The Google Maps key in `src/config.js` is a browser key that ships in the bundle by design; it must be protected by an HTTP-referrer restriction in Google Cloud, not by secrecy. Do not replace it, print it in logs or chat, or add any server-side secret to this client-only repo.
- Do not add dependencies, a router, or a state library for small changes; the site is intentionally a single component with two runtime dependencies.
- The phone number, email and Calendly URL in `src/config.js` are the owner's real contact details — change them only when asked.

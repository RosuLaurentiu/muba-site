# Muba Site React App

This project is now a Vite + React app for a private taxi booking website.

## Commands

- `npm install`
- `npm run dev`
- `npm run build`
- `npm run preview`

## Main files

- `src/App.jsx` contains the page layout and booking logic.
- `src/App.css` contains the dark minimalist UI styles.
- `src/i18n.js` contains the English and French translations.
- `src/config.js` contains your business details and integration settings.

## Configuration

Update `src/config.js` with your real:

- business name
- phone number
- email
- service area
- Calendly URL
- Google Maps API key
- pricing values

## Language behavior

The app supports English and French.

- On first load, it defaults to the device/browser language when available.
- If the visitor manually switches language, that choice is saved locally.

## Integrations

- Google Maps powers autocomplete, map display, and route calculation if you add an API key.
- Calendly is embedded automatically if you add a `calendlyUrl`.

If you want to avoid Google Maps costs later, the app can be switched to another routing provider.

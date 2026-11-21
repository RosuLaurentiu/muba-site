# Rider booking flow verification

- A 390 × 740 or 1440 × 900 Chromium viewport showed the trip and unavailable
  estimate before passenger details. The check exercised English, French,
  Light and Dark, one-way and return trips and a 280-character address.
- Keyboard submission focused the first invalid trip or passenger field.
  Editing the trip and switching language and theme preserved both sections.
  Review and private status showed the applicable Paris leg times.
- A simulated lost response locked the original details. Retry sent the same
  key and payload. The receipt showed a pending reference, and refresh on the
  private booking page showed the subsequent driver confirmation. Neither
  view overflowed horizontally.
- Lint, build, rider input and fare unit tests passed. The browser used
  fictional addresses and intercepted Maps and booking API calls. The booking
  API duplicate-key behavior was verified separately by its local integration
  test in MS-002.02.

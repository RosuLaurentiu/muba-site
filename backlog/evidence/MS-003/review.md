# Local driver Google sign-in

- A browser simulation used local Supabase Auth and the booking database. The
  assigned account reached the driver day view. An unassigned account was
  denied. Password sign-in and the French and English sign-in labels worked.
- The simulation verified the PKCE challenge and exchange, a cancelled consent
  return, and the password form when the Google provider is disabled.
- Local Supabase reported that Google was enabled and public signup was
  disabled. The real Google authorization request used the loopback Supabase
  callback and only `openid`, `email`, and `profile`. The consent screen
  listed name, profile picture, and email.
- The first callback arrived after OAuth state expired. A fresh Google sign-in
  linked to the existing assigned Supabase user. The signed-in driver saw the
  day schedule and pending requests.
- After the temporary driver assignment was removed, the same signed-in
  Google account received the driver access denial and no ride views. The
  test session was signed out, the temporary local account was removed, and
  the local ride count stayed the same.
- The app still uses its separate Calendar connection and driver assignment.
  Rider notifications are deferred.
- `npm run lint`, `npm run build`, and `git diff --check` passed.

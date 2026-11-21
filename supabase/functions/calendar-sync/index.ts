import { calendarHandler } from "./handler.mjs";

Deno.serve(calendarHandler({
  supabaseUrl: Deno.env.get("SUPABASE_URL"),
  publishableKey: Deno.env.get("SUPABASE_ANON_KEY"),
  serviceKey: Deno.env.get("SUPABASE_SERVICE_ROLE_KEY"),
  appUrl: Deno.env.get("MUBA_APP_URL"),
  redirectUri: Deno.env.get("GOOGLE_CALENDAR_REDIRECT_URI"),
  clientId: Deno.env.get("GOOGLE_CALENDAR_CLIENT_ID"),
  clientSecret: Deno.env.get("GOOGLE_CALENDAR_CLIENT_SECRET"),
  encryptionKey: Deno.env.get("MUBA_CALENDAR_ENCRYPTION_KEY")
}));

import { bookingEmailHandler } from "./handler.mjs";

Deno.serve(bookingEmailHandler({
  supabaseUrl: Deno.env.get("SUPABASE_URL"),
  serviceKey: Deno.env.get("SUPABASE_SERVICE_ROLE_KEY"),
  workerToken: Deno.env.get("MUBA_EMAIL_WORKER_TOKEN"),
  from: Deno.env.get("MUBA_EMAIL_FROM"),
  apiKey: Deno.env.get("MUBA_EMAIL_API_KEY"),
  emailApiUrl: Deno.env.get("MUBA_EMAIL_API_URL")
}));

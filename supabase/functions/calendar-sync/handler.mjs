const scope = "https://www.googleapis.com/auth/calendar.events.owned";
const encoder = new TextEncoder();
const decoder = new TextDecoder();

const toUrlKey = (bytes) => btoa(String.fromCharCode(...bytes)).replaceAll("+", "-").replaceAll("/", "_").replace(/=+$/, "");
const newSecret = () => toUrlKey(crypto.getRandomValues(new Uint8Array(32)));
const digest = async (value) => toUrlKey(new Uint8Array(await crypto.subtle.digest("SHA-256", encoder.encode(value))));

async function aesKey(secret) {
  if (!/^[a-f\d]{64}$/i.test(secret)) throw new Error("CALENDAR_KEY_MISSING");
  const bytes = Uint8Array.from(secret.match(/../g), (pair) => parseInt(pair, 16));
  return crypto.subtle.importKey("raw", bytes, "AES-GCM", false, ["encrypt", "decrypt"]);
}

async function encryptToken(token, secret, calendar) {
  const iv = crypto.getRandomValues(new Uint8Array(12));
  const data = await crypto.subtle.encrypt(
    { name: "AES-GCM", iv, additionalData: encoder.encode(calendar) }, await aesKey(secret), encoder.encode(token)
  );
  return btoa(String.fromCharCode(...iv, ...new Uint8Array(data)));
}

async function decryptToken(ciphertext, secret, calendar) {
  const bytes = Uint8Array.from(atob(ciphertext), (char) => char.charCodeAt(0));
  const data = await crypto.subtle.decrypt(
    { name: "AES-GCM", iv: bytes.slice(0, 12), additionalData: encoder.encode(calendar) }, await aesKey(secret), bytes.slice(12)
  );
  return decoder.decode(data);
}

function eventBody(job, appUrl) {
  const rideUrl = new URL(appUrl);
  rideUrl.search = new URLSearchParams({ driver: "", ride: String(job.reference) }).toString();
  rideUrl.hash = "";
  const start = Date.parse(job.starts_at);
  if (!job.pickup || !Number.isFinite(start)) throw new Error("CALENDAR_JOB_INCOMPLETE");
  return {
    summary: "Private Taxi Paris · " + job.reference,
    location: job.pickup,
    description: rideUrl.href,
    start: { dateTime: new Date(start).toISOString(), timeZone: "Europe/Paris" },
    end: { dateTime: new Date(start + (job.estimated_minutes ?? 1) * 60000).toISOString(), timeZone: "Europe/Paris" },
    endTimeUnspecified: job.estimated_minutes == null,
    visibility: "private"
  };
}

export function calendarHandler(config, fetcher = fetch) {
  const appOrigin = config.appUrl ? new URL(config.appUrl).origin : null;
  const headers = {
    "Access-Control-Allow-Origin": appOrigin ?? "null",
    "Access-Control-Allow-Headers": "authorization, apikey, content-type, x-client-info",
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    "Cache-Control": "no-store",
    "Referrer-Policy": "no-referrer"
  };
  const json = (body, status = 200) => Response.json(body, { headers, status });
  const withTimeout = (url, options) => fetcher(url, { ...options, redirect: "error", signal: AbortSignal.timeout(8000) });
  const serviceAuthorization = "Bearer " + config.serviceKey;
  const rpc = async (name, args, authorization, key) => {
    const result = await withTimeout(config.supabaseUrl + "/rest/v1/rpc/" + name, {
      method: "POST", headers: { apikey: key, authorization, "content-type": "application/json" },
      body: JSON.stringify(args)
    });
    if (!result.ok) throw new Error("CALENDAR_DATABASE_REQUEST_FAILED");
    return result.json();
  };
  const service = (action, args) => rpc("calendar_service", { action, args }, serviceAuthorization, config.serviceKey);
  const ready = config.supabaseUrl && config.publishableKey && config.serviceKey && config.appUrl &&
    config.clientId && config.clientSecret && config.redirectUri && /^[a-f\d]{64}$/i.test(config.encryptionKey);

  async function googleToken(grant) {
    const response = await withTimeout("https://oauth2.googleapis.com/token", {
      method: "POST",
      body: new URLSearchParams({ ...grant, client_id: config.clientId, client_secret: config.clientSecret })
    });
    if (!response.ok) throw new Error("CALENDAR_GOOGLE_CONNECTION_FAILED");
    return response.json();
  }

  function googleEvents(calendar) {
    return "https://www.googleapis.com/calendar/v3/calendars/" + encodeURIComponent(calendar) + "/events";
  }

  async function callback(url) {
    let outcome = "failed";
    try {
      const state = url.searchParams.get("state");
      const code = url.searchParams.get("code");
      if (!state || !/^[\w-]{43}$/.test(state)) throw new Error("CALENDAR_STATE_INVALID");
      const attempt = await service("consume_oauth", { state_hash: await digest(state) });
      if (!attempt || !code) throw new Error("CALENDAR_AUTH_FAILED");
      const token = await googleToken({
        grant_type: "authorization_code", code, code_verifier: attempt.verifier, redirect_uri: config.redirectUri
      });
      if (!token.refresh_token || !token.access_token) throw new Error("CALENDAR_REFRESH_TOKEN_MISSING");
      const selected = await withTimeout(googleEvents(attempt.calendar_id) + "?fields=kind&maxResults=1", {
        headers: { authorization: "Bearer " + token.access_token }
      });
      if (!selected.ok) throw new Error("CALENDAR_NOT_ACCESSIBLE");
      await service("connect", {
        owner_id: attempt.owner_id, calendar_id: attempt.calendar_id,
        encrypted_token: await encryptToken(token.refresh_token, config.encryptionKey, attempt.calendar_id)
      });
      outcome = "connected";
    } catch {
      // The booking application still works after a rejected connection.
    }
    const destination = new URL(config.appUrl);
    destination.search = new URLSearchParams({ driver: "", calendar: outcome }).toString();
    destination.hash = "";
    return new Response(null, { status: 303, headers: { ...headers, Location: destination.href } });
  }

  async function authorize(owner, calendar) {
    if (typeof calendar !== "string" || !/^[\w.@#-]{3,300}$/.test(calendar) || calendar.toLowerCase() === "primary") {
      return json({ error: "CALENDAR_ID_INVALID" }, 400);
    }
    const state = newSecret();
    const verifier = newSecret();
    await service("begin_oauth", { owner_id: owner, calendar_id: calendar, verifier, state_hash: await digest(state) });
    const url = new URL("https://accounts.google.com/o/oauth2/v2/auth");
    url.search = new URLSearchParams({
      client_id: config.clientId, redirect_uri: config.redirectUri, response_type: "code", scope,
      state, code_challenge: await digest(verifier), code_challenge_method: "S256",
      access_type: "offline", prompt: "consent select_account"
    }).toString();
    return json({ url: url.href });
  }

  async function applyJob(job, calendar, token) {
    const collection = googleEvents(calendar);
    const resource = collection + "/" + encodeURIComponent(job.event_id);
    const request = (url, method, body) => withTimeout(url, {
      method,
      headers: { authorization: "Bearer " + token, "content-type": "application/json" },
      body: body && JSON.stringify(body)
    });
    if (!job.active) {
      const deleted = await request(resource, "DELETE");
      return deleted.ok || deleted.status === 404 || deleted.status === 410;
    }
    const fields = eventBody(job, config.appUrl);
    const changed = await request(resource, "PATCH", fields);
    if (changed.ok) return true;
    if (changed.status !== 404 && changed.status !== 410) return false;
    const inserted = await request(collection, "POST", { id: job.event_id, ...fields });
    return inserted.ok || (inserted.status === 409 && (await request(resource, "PATCH", fields)).ok);
  }

  async function synchronize(owner) {
    const connection = await service("connection", { owner_id: owner });
    if (!connection) return json({ error: "CALENDAR_CONNECTION_REQUIRED" }, 409);
    const calendar = connection.calendar_id;
    const token = await googleToken({
      grant_type: "refresh_token", refresh_token: await decryptToken(connection.encrypted_token, config.encryptionKey, calendar)
    });
    if (!token.access_token) throw new Error("CALENDAR_ACCESS_TOKEN_MISSING");
    let processed = 0;
    for (let pass = 0; pass < 2; pass++) {
      const lease = crypto.randomUUID();
      const batch = await service("claim", { owner_id: owner, calendar_id: calendar, lease_id: lease });
      const results = await Promise.all(batch.map(async (job) => {
        let ok = false;
        try {
          ok = await applyJob(job, calendar, token.access_token);
        } catch {
          // Leave the job pending so a later run can reconcile the same event ID.
        }
        await service("finish", { event_id: job.event_id, revision: job.revision, lease_id: lease, ok });
        return ok;
      }));
      processed += batch.length;
      if (results.includes(false) || (batch.length < 8 && !batch.some((job) => !job.active))) break;
    }
    return json({ processed });
  }

  return async (request) => {
    if (request.method === "OPTIONS") return new Response(null, { headers });
    if (!ready) return json({ error: "CALENDAR_NOT_CONFIGURED" }, 503);
    if (request.method === "GET") return callback(new URL(request.url));
    if (request.method !== "POST") return json({ error: "METHOD_NOT_ALLOWED" }, 405);
    const token = request.headers.get("authorization");
    if (!token?.startsWith("Bearer ")) return json({ error: "DRIVER_REQUIRED" }, 401);
    let owner;
    try {
      const auth = await withTimeout(config.supabaseUrl + "/auth/v1/user", {
        headers: { apikey: config.publishableKey, authorization: token }
      });
      if (!auth.ok) return json({ error: "DRIVER_REQUIRED" }, 403);
      owner = (await auth.json()).id;
      await rpc("calendar_status", {}, token, config.publishableKey);
    } catch {
      return json({ error: "DRIVER_REQUIRED" }, 403);
    }
    try {
      const body = await request.json();
      if (body.action === "authorize") return await authorize(owner, body.calendar_id);
      if (body.action === "sync") return await synchronize(owner);
      return json({ error: "CALENDAR_ACTION_INVALID" }, 400);
    } catch {
      return json({ error: "CALENDAR_SYNC_FAILED" }, 502);
    }
  };
}

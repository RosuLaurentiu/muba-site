import assert from "node:assert/strict";
import { execFileSync } from "node:child_process";
import { randomBytes, randomUUID } from "node:crypto";
import { readFileSync } from "node:fs";
import { calendarHandler } from "../functions/calendar-sync/handler.mjs";
import { clearVerifiedTrips, verifiedTrip } from "./verified-trip.mjs";

const local = JSON.parse(readFileSync(0, "utf8"));
const origin = "http://127.0.0.1:54321";
assert.equal(local.API_URL, origin, "Use the Muba Site local stack");
const appUrl = "http://127.0.0.1:5173/";
const redirectUri = origin + "/functions/v1/calendar-sync";
const calendarId = "fixture@group.calendar.google.com";
const userIds = [];
const keys = [];
const events = new Map();
const refreshToken = randomUUID();
let probeAvailable = false;
let refreshAvailable = true;
let loseResponse = false;
let exchangeCount = 0;
let afterPatch;

function sql(statement) {
  return execFileSync("docker", ["exec", "-i", "supabase_db_muba-site", "psql", "-U", "postgres", "-d", "postgres",
    "-At", "-v", "ON_ERROR_STOP=1"], { input: statement, encoding: "utf8", stdio: ["pipe", "pipe", "pipe"] }).trim();
}

async function simulatedFetch(input, options = {}) {
  const url = new URL(input);
  if (url.origin === origin) return fetch(url, options);
  if (url.hostname === "oauth2.googleapis.com") {
    if (options.body.get("grant_type") === "authorization_code") {
      exchangeCount++;
      assert.equal(options.body.get("redirect_uri"), redirectUri);
      assert.match(options.body.get("code_verifier"), /^[\w-]{43}$/);
      return Response.json({ access_token: "test-access", refresh_token: refreshToken });
    }
    assert.equal(options.body.get("refresh_token") === refreshToken, true, "Wrong fixture refresh token");
    return Response.json({ access_token: "test-access" }, { status: refreshAvailable ? 200 : 400 });
  }
  assert.equal(url.origin, "https://www.googleapis.com", "Unexpected provider endpoint");
  assert.ok(url.pathname.startsWith("/calendar/v3/calendars/" + encodeURIComponent(calendarId) + "/events"));
  assert.equal(options.headers.authorization, "Bearer test-access");
  const method = options.method ?? "GET";
  if (method === "GET") {
    assert.equal(url.searchParams.get("fields"), "kind");
    return Response.json({ kind: "calendar#events" }, { status: probeAvailable ? 200 : 404 });
  }
  const id = url.pathname.split("/").at(-1);
  if (method === "DELETE") return new Response(null, { status: events.delete(id) ? 204 : 404 });
  const body = JSON.parse(options.body);
  if (method === "PATCH") {
    if (!events.has(id)) return Response.json({}, { status: 404 });
    events.set(id, { id, ...body });
    if (afterPatch) await afterPatch(id);
    return Response.json({});
  }
  assert.equal(method, "POST");
  assert.match(body.id, /^[0-9a-v]{5,1024}$/);
  if (events.has(body.id)) return Response.json({}, { status: 409 });
  events.set(body.id, body);
  if (loseResponse) {
    loseResponse = false;
    throw new Error("Simulated network loss after Google committed the event");
  }
  return Response.json({});
}

const handler = calendarHandler({
  supabaseUrl: origin, publishableKey: local.PUBLISHABLE_KEY, serviceKey: local.SERVICE_ROLE_KEY,
  appUrl, redirectUri, clientId: "local-simulation", clientSecret: "local-simulation",
  encryptionKey: randomBytes(32).toString("hex")
}, simulatedFetch);

async function api(path, body, { token, admin = false, method = "POST", expected = 200 } = {}) {
  const headers = { apikey: admin ? local.SECRET_KEY : local.PUBLISHABLE_KEY, "Content-Type": "application/json" };
  if (token) headers.Authorization = "Bearer " + token;
  const response = await fetch(origin + path, { method, headers, body: body && JSON.stringify(body) });
  const text = await response.text();
  assert.equal(response.status, expected, path);
  return text ? JSON.parse(text) : null;
}

async function account() {
  const email = `${randomUUID()}@example.test`, password = randomUUID();
  const { id } = await api("/auth/v1/admin/users", { email, password, email_confirm: true }, { admin: true });
  userIds.push(id);
  const { access_token: token } = await api("/auth/v1/token?grant_type=password", { email, password });
  return { id, token };
}

async function action(token, body, expected = 200) {
  const headers = token ? { authorization: "Bearer " + token } : {};
  const response = await handler(new Request(redirectUri, { method: "POST", body: JSON.stringify(body), headers }));
  assert.equal(response.status, expected);
  return response.json();
}

async function begin(token) {
  const { url } = await action(token, { action: "authorize", calendar_id: calendarId });
  const auth = new URL(url);
  assert.equal(auth.origin, "https://accounts.google.com");
  assert.equal(auth.searchParams.get("scope"), "https://www.googleapis.com/auth/calendar.events.owned");
  assert.equal(auth.searchParams.get("code_challenge_method"), "S256");
  return auth.searchParams.get("state");
}

async function callback(state, expected) {
  const url = new URL(redirectUri);
  url.search = new URLSearchParams({ state, code: "fictional-code" });
  const response = await handler(new Request(url));
  assert.equal(response.status, 303);
  const target = new URL(response.headers.get("location"));
  assert.equal(target.origin, new URL(appUrl).origin);
  assert.equal(target.searchParams.get("calendar"), expected);
}

function rpc(name, body, token, expected) {
  if (name === "save_ride" && body.p_source === "web") body = verifiedTrip(sql, body);
  return api("/rest/v1/rpc/" + name, body, { token, expected });
}

function createRide(token, source, pickup, starts, returning = null, minutes = null) {
  const key = randomUUID();
  keys.push(key);
  return rpc("save_ride", {
    p_request_key: key, p_source: source,
    p_trip: {
      language: "en", pickup, destination: "Paris-Orly", pickup_time: starts, return_time: returning,
      passengers: 2, passenger_name: "PRIVATE-FIXTURE-NAME", passenger_phone: "0600000000",
      passenger_notes: "PRIVATE-FIXTURE-NOTE", passenger_email: "calendar-rider@example.test", estimated_minutes: minutes
    }
  }, token);
}

const change = (token, ride, version, state, schedule = null) => rpc("change_ride", {
  p_reference: ride.reference, p_version: version, p_status: state, p_schedule: schedule,
  p_driver_notes: "PRIVATE-DRIVER-FIXTURE"
}, token);
const eventFor = (location) => [...events.values()].find((event) => event.location === location);

try {
  assert.equal(sql(`select (select count(*) from booking_private.driver) + (select count(*) from booking_private.driver_tester)
    + (select count(*) from booking_private.ride) + (select count(*) from booking_private.calendar_job)`),
    "0", "Run the purge rehearsal on a fresh, unassigned local stack with no rides or Calendar jobs");
  const driver = await account(), other = await account();
  assert.match(driver.id, /^[\da-f-]{36}$/);
  sql(`insert into booking_private.driver(user_id) values ('${driver.id}');`);

  const authorize = { action: "authorize", calendar_id: calendarId };
  await action(null, authorize, 401);
  await action(other.token, authorize, 403);
  sql(`insert into booking_private.driver_tester(user_id) values ('${other.id}');`);
  const testerStatus = await rpc("calendar_status", {}, other.token);
  assert.deepEqual(testerStatus, { can_manage: false, calendar_id: null, outstanding: [] });
  await action(other.token, authorize, 403);
  await action(other.token, { action: "sync" }, 403);
  await rpc("calendar_service", { action: "connection", args: {} }, driver.token, 403);
  await callback(await begin(driver.token), "failed");
  probeAvailable = true;
  const state = await begin(driver.token);
  await callback(state, "connected");
  await callback(state, "failed");
  assert.equal(exchangeCount, 2);
  assert.equal(sql(`select (encrypted_token <> '${refreshToken}')::text from booking_private.calendar_connection;`), "true");
  console.log("PASS authorized driver, OAuth state replay, calendar selection, and encrypted connection");

  const web = await createRide(null, "web", "Gare de Lyon", "2090-10-29T02:30", "2090-10-29T09:30", 45);
  const declined = await createRide(null, "web", "Declined pickup", "2090-10-30T09:30");
  await change(driver.token, declined, 1, "declined");
  assert.deepEqual((await rpc("calendar_status", {}, driver.token)).outstanding, []);
  await change(driver.token, web, 1, "confirmed", { agreed_fare_cents: 7250, fare_accepted: true });
  const phone = await createRide(driver.token, "phone", "Phone pickup", "2090-10-29T12:30");
  const whatsapp = await createRide(driver.token, "whatsapp", "WhatsApp pickup", "2090-10-29T14:30", null, 20);
  refreshAvailable = false;
  await action(driver.token, { action: "sync" }, 502);
  assert.equal((await rpc("calendar_status", {}, driver.token)).outstanding.length, 3);
  refreshAvailable = true;
  loseResponse = true;
  await action(driver.token, { action: "sync" });
  assert.ok((await rpc("calendar_status", {}, driver.token)).outstanding.some((job) => job.failed));
  assert.equal(events.size, 4);
  await Promise.all([action(driver.token, { action: "sync" }), action(driver.token, { action: "sync" })]);
  assert.equal(events.size, 4);
  assert.deepEqual((await rpc("calendar_status", {}, driver.token)).outstanding, []);
  const outbound = eventFor("Gare de Lyon");
  const returnEvent = eventFor("Paris-Orly");
  assert.equal(outbound.start.dateTime, "2090-10-29T01:30:00.000Z");
  assert.equal(outbound.end.dateTime, "2090-10-29T02:15:00.000Z");
  assert.equal(outbound.start.timeZone, "Europe/Paris");
  const pickupOnly = eventFor("Phone pickup");
  assert.match(pickupOnly.description, /Finish time unknown/);
  assert.equal(Date.parse(pickupOnly.end.dateTime) - Date.parse(pickupOnly.start.dateTime), 60000);
  assert.ok(!("endTimeUnspecified" in pickupOnly));
  assert.equal(new URL(outbound.description).searchParams.get("ride"), web.reference);
  assert.doesNotMatch(JSON.stringify([...events.values()]), /PRIVATE-|0600000000|Declined pickup/);
  console.log("PASS per-leg web, phone and WhatsApp events, DST, private payload, and ambiguous retry without duplication");

  await change(driver.token, web, 2, "confirmed", {
    pickup: "Bastille", pickup_time: "2090-10-29T04:30", return_time: "2090-10-29T09:30"
  });
  afterPatch = async (id) => {
    if (id !== outbound.id) return;
    afterPatch = null;
    await change(driver.token, web, 3, "confirmed", { pickup: "Nation" });
  };
  await action(driver.token, { action: "sync" });
  assert.equal((await rpc("calendar_status", {}, driver.token)).outstanding.length, 1);
  await action(driver.token, { action: "sync" });
  assert.equal(eventFor("Nation").id, outbound.id);
  assert.equal(eventFor("Nation").start.dateTime, "2090-10-29T03:30:00.000Z");
  await change(driver.token, web, 4, "confirmed", { pickup_time: "2090-10-29T04:30", return_time: null });
  await change(driver.token, web, 5, "confirmed", { pickup_time: "2090-10-29T04:30", return_time: "2090-10-29T09:30" });
  await action(driver.token, { action: "sync" });
  assert.equal(events.has(returnEvent.id), false);
  assert.notEqual(eventFor("Paris-Orly").id, returnEvent.id);
  assert.equal(events.size, 4);
  await change(driver.token, web, 6, "cancelled");
  await change(driver.token, phone, 1, "cancelled");
  await change(driver.token, whatsapp, 1, "cancelled");
  await action(driver.token, { action: "sync" });
  assert.equal(events.size, 0);
  assert.deepEqual((await rpc("calendar_status", {}, driver.token)).outstanding, []);
  console.log("PASS latest revision after concurrent change, pickup update, return replacement, and cancellation");

  const purgeCheck = readFileSync(new URL("../check-calendar-purge.sql", import.meta.url), "utf8");
  const expired = await createRide(driver.token, "phone", "Expired pickup", "2091-01-20T09:00", "2091-01-20T12:00");
  assert.match(expired.reference, /^\d+$/);
  // Age only this fixture so the real retention job removes both legs.
  sql(`update booking_private.ride set pickup_at=now()-interval '92 days', return_at=now()-interval '91 days'
    where reference=${expired.reference}`);
  await action(driver.token, { action: "sync" });
  assert.equal(events.size, 2);
  assert.equal(sql("select booking_private.purge_expired_rides()"), "1");
  try {
    assert.throws(() => sql(purgeCheck), /Calendar deletions awaiting confirmation after booking purge: 2/);
    refreshAvailable = false;
    await action(driver.token, { action: "sync" }, 502);
    assert.equal(events.size, 2);
    refreshAvailable = true;
    await action(driver.token, { action: "sync" });
    assert.equal(events.size, 0);
    sql(purgeCheck);
    console.log("PASS post-purge alert, interrupted cleanup, both external deletions and verified retry");
  } finally {
    sql(`delete from booking_private.calendar_job where ride_reference=${expired.reference}`);
  }
} finally {
  clearVerifiedTrips(sql);
  if (keys.length) {
    const hashes = keys.map((key) => `sha256(uuid_send('${key}'::uuid))`).join(",");
    sql(`delete from booking_private.calendar_job where ride_reference in (
      select reference from booking_private.ride where request_key_hash in (${hashes})
    );
    delete from booking_private.ride where request_key_hash in (${hashes});`);
  }
  for (const id of userIds) await api("/auth/v1/admin/users/" + id, null, { admin: true, method: "DELETE" });
}

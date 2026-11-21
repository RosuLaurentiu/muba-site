import assert from "node:assert/strict";
import { execFileSync } from "node:child_process";
import { randomUUID } from "node:crypto";
import { readFileSync } from "node:fs";

// Read the local CLI status on stdin so test credentials never reach the terminal.
const { API_URL: apiUrl, PUBLISHABLE_KEY: publishableKey, SECRET_KEY: secretKey } =
  JSON.parse(readFileSync(0, "utf8"));
const endpoint = new URL(apiUrl);
assert.ok(["127.0.0.1", "localhost"].includes(endpoint.hostname), "Use a local stack");
assert.ok(publishableKey && secretKey, "Use the local Supabase CLI status JSON");

function sql(statement) {
  return execFileSync("docker", [
    "exec", "-i", "supabase_db_muba-site", "psql", "-U", "postgres", "-d", "postgres",
    "-At", "-v", "ON_ERROR_STOP=1",
  ], { input: statement, encoding: "utf8" }).trim();
}

async function request(path, { body, token, admin = false, method = "POST", expected = 200 } = {}) {
  const headers = { apikey: admin ? secretKey : publishableKey, "Content-Type": "application/json" };
  if (token) headers.Authorization = "Bearer " + token;
  const response = await fetch(new URL(path, endpoint), {
    method, headers, body: body === undefined ? undefined : JSON.stringify(body),
    redirect: "error", signal: AbortSignal.timeout(10000),
  });
  const content = await response.text();
  const data = content ? JSON.parse(content) : null;
  assert.equal(response.status, expected, `${path}: ${data?.code ?? response.status}`);
  return data;
}

function rpc(name, args, token, expected) {
  return request("/rest/v1/rpc/" + name, { body: args, token, expected });
}

const users = [];
const references = new Set();
const password = randomUUID();
const trip = {
  language: "fr", pickup: "Gare de Lyon", destination: "Paris-Orly",
  pickup_time: "2090-05-21T10:00", return_time: "2090-05-21T17:00",
  passengers: 2, passenger_name: "Local Test", passenger_phone: "+33 0 00 00 00 00",
  passenger_notes: "Hall 2",
};
const key = randomUUID();
const secondKey = randomUUID();
const manualKey = randomUUID();

async function createAccount(role) {
  const email = `${role}-${randomUUID()}@example.test`;
  const { id } = await request("/auth/v1/admin/users", {
    body: { email, password, email_confirm: true, user_metadata: { role: "driver" } },
    admin: true,
  });
  assert.match(id, /^[0-9a-f-]{36}$/);
  users.push(id);
  return { id, email };
}

async function signIn(email) {
  const data = await request("/auth/v1/token?grant_type=password", { body: { email, password } });
  assert.ok(data.access_token);
  return data.access_token;
}

try {
  assert.equal(sql("select count(*) from booking_private.driver;"), "0", "Use an unassigned test stack");
  const driver = await createAccount("driver");
  const other = await createAccount("other");
  sql(`insert into booking_private.driver (user_id) values ('${driver.id}');`);
  const driverToken = await signIn(driver.email);
  const otherToken = await signIn(other.email);

  const booking = { p_request_key: key, p_trip: trip };
  const first = await Promise.all([rpc("save_ride", booking), rpc("save_ride", booking)]);
  assert.match(first[0].reference, /^\d+$/);
  references.add(first[0].reference);
  assert.deepEqual(first[0], first[1]);
  const pending = first[0];
  assert.equal(pending.status, "pending");
  assert.equal(pending.pickup_at, "2090-05-21T08:00:00+00:00");
  assert.equal(pending.return_at, "2090-05-21T15:00:00+00:00");
  assert.equal(pending.passenger_phone, undefined);
  const changedPayload = { ...booking, p_trip: { ...trip, passengers: 3 } };
  assert.equal((await rpc("save_ride", changedPayload, null, 409)).message, "REQUEST_KEY_REUSED");
  console.log("PASS same-key concurrent save, payload mismatch, and Paris return times");

  const second = await rpc("save_ride", {
    p_request_key: secondKey, p_trip: { ...trip, pickup: "Bastille", return_time: null },
  });
  references.add(second.reference);
  assert.notEqual(second.reference, pending.reference);
  assert.equal(await rpc("get_ride", { p_request_key: randomUUID() }), null);
  assert.deepEqual(await rpc("get_ride", { p_request_key: key }), pending);
  assert.equal((await rpc("get_ride", { p_request_key: secondKey })).pickup, "Bastille");
  await request("/rest/v1/ride", { method: "GET", expected: 404 });
  assert.equal((await rpc("list_rides", {}, null, 401)).code, "42501");
  assert.equal((await rpc("list_rides", {}, otherToken, 403)).message, "DRIVER_REQUIRED");
  const change = { p_reference: pending.reference, p_version: 1, p_status: "confirmed" };
  await rpc("change_ride", change, otherToken, 403);
  await rpc("save_ride", { ...booking, p_source: "phone" }, null, 401);
  console.log("PASS rider-scoped access, hidden tables and non-driver denial");

  const listed = (await rpc("list_rides", {}, driverToken)).find(ride => String(ride.reference) === pending.reference);
  assert.equal(listed.passenger_name, trip.passenger_name);
  assert.equal(listed.passenger_phone, trip.passenger_phone);
  assert.equal(listed.passenger_notes, trip.passenger_notes);
  assert.equal(listed.request_key_hash, undefined);
  assert.equal(listed.request_hash, undefined);
  assert.equal((await rpc("change_ride", { ...change, p_status: "cancelled" }, driverToken, 409)).message, "INVALID_RIDE_TRANSITION");
  const decision = { ...change, p_driver_notes: "Internal only" };
  const attempts = await Promise.allSettled([
    rpc("change_ride", decision, driverToken),
    rpc("change_ride", decision, driverToken),
  ]);
  assert.equal(attempts.filter(result => result.status === "fulfilled").length, 1);
  assert.match(attempts.find(result => result.status === "rejected").reason.message, /PT409/);
  assert.equal((await rpc("change_ride", change, driverToken, 409)).message, "STALE_RIDE");
  const accepted = await rpc("get_ride", { p_request_key: key });
  assert.equal(accepted.status, "confirmed");
  assert.equal(accepted.driver_notes, undefined);

  const newToken = await signIn(driver.email);
  assert.notEqual(newToken, driverToken);
  const reloaded = (await rpc("list_rides", {}, newToken)).filter(ride => String(ride.reference) === pending.reference);
  assert.equal(reloaded.length, 1);
  assert.equal(reloaded[0].version, 2);
  assert.equal(reloaded[0].driver_notes, "Internal only");
  const rescheduled = await rpc("change_ride", {
    ...change, p_version: 2, p_schedule: { pickup_time: "2090-05-21T11:00", return_time: trip.return_time },
  }, newToken);
  assert.equal(rescheduled.pickup_at, "2090-05-21T09:00:00+00:00");
  const cancelled = await rpc("change_ride", { ...change, p_version: 3, p_status: "cancelled" }, newToken);
  assert.equal(cancelled.status, "cancelled");
  assert.equal((await rpc("get_ride", { p_request_key: key })).status, "cancelled");
  await rpc("change_ride", { ...change, p_version: 4 }, newToken, 409);
  console.log("PASS transitions, competing decisions, reschedule, cancellation, and persistence across sign-ins");

  const manual = await rpc("save_ride", { p_request_key: manualKey, p_trip: trip, p_source: "whatsapp" }, newToken);
  references.add(manual.reference);
  assert.equal(manual.status, "confirmed");
  assert.equal(await rpc("get_ride", { p_request_key: manualKey }), null);
  const privateRows = (await rpc("list_rides", {}, newToken)).filter(ride => references.has(String(ride.reference)));
  assert.equal(privateRows.length, 3);
  assert.equal(privateRows.find(ride => String(ride.reference) === manual.reference).source, "whatsapp");
  assert.equal((await rpc("save_ride", {
    p_request_key: randomUUID(), p_trip: { ...trip, pickup_time: "2090-03-26T02:30" },
  }, null, 400)).message, "INVALID_PARIS_TIME");
  console.log("PASS manual source, restricted rider access, and spring clock-change validation");
} finally {
  // Use hashes so cleanup also covers a save that committed before the test observed its reply.
  const keys = [key, secondKey, manualKey].map(value => `sha256(uuid_send('${value}'::uuid))`);
  sql(`delete from booking_private.ride where request_key_hash in (${keys.join(",")});`);
  for (const id of users) await request("/auth/v1/admin/users/" + id, { method: "DELETE", admin: true });
}

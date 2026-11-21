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
  assert.equal(response.status, expected, `${path}: ${data?.message ?? data?.code ?? response.status}`);
  return data;
}

const rpc = (name, args, token, expected) => request("/rest/v1/rpc/" + name, { body: args, token, expected });
const users = [];
const keys = [];
const password = randomUUID();
const address = `limit-${randomUUID()}@example.test`;
const trip = {
  language: "en", pickup: "Gare du Nord", destination: "Paris-Orly", pickup_time: "2090-06-10T09:00",
  return_time: null, passengers: 1, passenger_name: "Limit Test", passenger_phone: "+33 0 00 00 00 00",
  passenger_notes: "",
};
const newKey = () => {
  const key = randomUUID();
  keys.push(key);
  return key;
};
const parisMinute = (expression) =>
  sql(`select to_char((${expression}) at time zone 'Europe/Paris', 'YYYY-MM-DD"T"HH24:MI');`);

try {
  assert.equal(sql("select count(*) from booking_private.driver;"), "0", "Use an unassigned test stack");
  const email = `driver-${randomUUID()}@example.test`;
  const { id } = await request("/auth/v1/admin/users", { body: { email, password, email_confirm: true }, admin: true });
  users.push(id);
  sql(`insert into booking_private.driver (user_id) values ('${id}');`);
  const { access_token: token } = await request("/auth/v1/token?grant_type=password", { body: { email, password } });

  // A round trip whose outbound pickup already happened today.
  const roundKey = newKey();
  const round = await rpc("save_ride", {
    p_request_key: roundKey, p_source: "phone", p_trip: { ...trip, return_time: "2090-06-10T18:00" },
  }, token);
  sql(`update booking_private.ride set pickup_at = date_trunc('minute', now()) - interval '2 hours',
    return_at = date_trunc('minute', now()) + interval '6 hours' where reference = ${round.reference};`);
  const pastPickup = parisMinute("date_trunc('minute', now()) - interval '2 hours'");
  const change = { p_reference: round.reference, p_status: "confirmed" };
  const moved = await rpc("change_ride", {
    ...change, p_version: 1,
    p_schedule: { pickup_time: pastPickup, return_time: parisMinute("date_trunc('minute', now()) + interval '7 hours'") },
  }, token);
  assert.equal(moved.version, 2);
  assert.equal(sql(`select return_at = date_trunc('minute', now()) + interval '7 hours'
    from booking_private.ride where reference = ${round.reference};`), "t");
  assert.equal((await rpc("change_ride", {
    ...change, p_version: 2,
    p_schedule: { pickup_time: parisMinute("date_trunc('minute', now()) - interval '3 hours'"), return_time: null },
  }, token, 400)).message, "PICKUP_MUST_BE_FUTURE");
  assert.equal((await rpc("change_ride", {
    ...change, p_version: 2,
    p_schedule: { pickup_time: pastPickup, return_time: parisMinute("date_trunc('minute', now()) - interval '1 hour'") },
  }, token, 400)).message, "RETURN_MUST_BE_FUTURE");
  console.log("PASS return leg moves after the outbound pickup; moved legs must be in the future");

  const [hourly, daily] = sql(`select count(*) filter (where created_at > now() - interval '1 hour'), count(*)
    from booking_private.ride where source = 'web' and created_at > now() - interval '1 day';`).split("|").map(Number);
  const room = Math.min(10 - hourly, 30 - daily);
  assert.ok(room >= 4, "Remove recent local web requests before running this test");
  let firstKey;
  for (let index = 0; index < room; index++) {
    const key = newKey();
    firstKey ??= key;
    await rpc("save_ride", {
      p_request_key: key,
      p_trip: { ...trip, pickup_time: `2090-06-${String(11 + index).padStart(2, "0")}T09:00`, passenger_email: address },
    });
  }
  assert.equal(sql(`select count(*) from booking_private.booking_email
    where kind = 'receipt' and recipient = '${address}';`), "3");
  assert.equal(sql(`select count(*) from booking_private.rider_email where address = '${address}';`), String(room));
  const refused = await rpc("save_ride", { p_request_key: newKey(), p_trip: { ...trip, pickup_time: "2090-07-01T09:00" } }, null, 401);
  assert.equal(refused.message, "WEB_INTAKE_LIMIT");
  await rpc("save_ride", {
    p_request_key: firstKey, p_trip: { ...trip, pickup_time: "2090-06-11T09:00", passenger_email: address },
  });
  assert.equal((await rpc("save_ride", {
    p_request_key: newKey(), p_source: "phone", p_trip: { ...trip, pickup_time: "2090-07-02T09:00" },
  }, token)).status, "confirmed");
  console.log("PASS web intake limit, same-key retry at the limit, receipt limit per address, driver rides unaffected");
} finally {
  const hashes = keys.map((value) => `sha256(uuid_send('${value}'::uuid))`).join(",");
  if (hashes) {
    sql(`delete from booking_private.calendar_job where ride_reference in (
      select reference from booking_private.ride where request_key_hash in (${hashes}));
      delete from booking_private.ride where request_key_hash in (${hashes});`);
  }
  for (const id of users) await request("/auth/v1/admin/users/" + id, { method: "DELETE", admin: true });
}

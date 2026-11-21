import assert from "node:assert/strict";
import { execFileSync } from "node:child_process";
import { randomUUID } from "node:crypto";
import { readFileSync } from "node:fs";
import { createServer } from "node:http";
import { bookingEmailHandler } from "../functions/booking-email/handler.mjs";

const { API_URL: apiUrl, PUBLISHABLE_KEY: key, SECRET_KEY: serviceKey } = JSON.parse(readFileSync(0, "utf8"));
assert.equal(new URL(apiUrl).hostname, "127.0.0.1");
assert.ok(key && serviceKey);

function sql(statement) {
  return execFileSync("docker", [
    "exec", "-i", "supabase_db_muba-site", "psql", "-U", "postgres", "-d", "postgres", "-At",
    "-v", "ON_ERROR_STOP=1"
  ], { input: statement, encoding: "utf8" }).trim();
}

async function request(path, body, { token, admin, method = "POST", status = 200 } = {}) {
  const headers = { apikey: admin ? serviceKey : key, "Content-Type": "application/json" };
  if (token) headers.Authorization = "Bearer " + token;
  const res = await fetch(apiUrl + path, {
    method, headers, body: JSON.stringify(body), signal: AbortSignal.timeout(10000)
  });
  assert.equal(res.status, status, path);
  return res.status === 204 ? null : res.json();
}

function rpc(name, body, token, status) {
  return request("/rest/v1/rpc/" + name, body, { token, status });
}

const keys = Array.from({ length: 9 }, () => randomUUID());
const users = [];
const password = randomUUID();
async function account() {
  const email = randomUUID() + "@example.test";
  const user = await request("/auth/v1/admin/users", { email, password, email_confirm: true }, { admin: true });
  assert.match(user.id, /^[0-9a-f-]{36}$/);
  users.push(user.id);
  const { access_token: token } = await request("/auth/v1/token?grant_type=password", { email, password });
  return { id: user.id, token };
}

const delivered = new Map();
const attempts = new Map();
let loseResponse = true;
const server = createServer(async (req, res) => {
  const buffers = [];
  for await (const chunk of req) buffers.push(chunk);
  const message = JSON.parse(Buffer.concat(buffers).toString());
  const id = req.headers["idempotency-key"];
  if (req.url !== "/emails" || req.method !== "POST" || req.headers.authorization !== "Bearer local-test" ||
      !/^[a-f0-9-]{36}$/.test(id) || !message.to.every(email => email.endsWith("@example.test"))) {
    res.writeHead(400).end();
    return;
  }
  attempts.set(id, (attempts.get(id) ?? 0) + 1);
  if (!delivered.has(id)) delivered.set(id, message);
  if (JSON.stringify(delivered.get(id)) !== JSON.stringify(message)) {
    res.writeHead(409).end();
  } else if (loseResponse) {
    loseResponse = false;
    req.socket.destroy();
  } else {
    res.writeHead(200).end();
  }
});

assert.equal(sql("select count(*) from booking_private.driver;"), "0", "Use an unassigned local stack");
assert.equal(sql("select count(*) from booking_private.booking_email where sent_at is null;"), "0", "Use an empty local outbox");
await new Promise((resolve) => server.listen(0, "127.0.0.1", resolve));

const transport = bookingEmailHandler({
  supabaseUrl: apiUrl, serviceKey, workerToken: "fixture-worker", apiKey: "local-test",
  from: "test@example.test", emailApiUrl: "http://127.0.0.1:" + server.address().port + "/emails",
  appUrl: "http://127.0.0.1:5173/"
});
async function runWorker(auth = "fixture-worker") {
  return transport(new Request("http://127.0.0.1/booking-email", {
    method: "POST", headers: { Authorization: "Bearer " + auth }
  }));
}
const trip = { language: "en", pickup: "Gare de Lyon", destination: "Paris-Orly",
  pickup_time: "2091-05-21T10:00", passengers: 2, passenger_name: "Local Test", passenger_phone: "+33 0 00 00 00 00" };

async function save(index, overrides = {}, status = 200) {
  return rpc("save_ride", { p_request_key: keys[index], p_trip: { ...trip, ...overrides } }, null, status);
}

try {
  const driver = await account();
  const other = await account();
  sql(`insert into booking_private.driver (user_id) values ('${driver.id}');`);
  assert.equal((await runWorker("wrong")).status, 401);
  await rpc("claim_booking_email", {}, other.token, 403);
  await rpc("booking_email_failures", {}, other.token, 403);
  await rpc("retry_booking_email", {}, other.token, 403);

  const [booking, duplicate] = await Promise.all([save(0, { passenger_email: "rider@example.test" }),
    save(0, { passenger_email: "rider@example.test" })]);
  assert.deepEqual(booking, duplicate);
  assert.equal(booking.passenger_email, undefined);
  const pending = await rpc("get_ride", { p_request_key: keys[0] });
  const [attempt, competing] = await Promise.all([runWorker(), runWorker()]);
  assert.equal(attempt.status, 200);
  assert.equal(competing.status, 200);
  assert.equal((await attempt.json()).failed + (await competing.json()).failed, 1);
  assert.deepEqual(await rpc("booking_email_failures", {}, driver.token), { retryable: 1, expired: 0 });
  await rpc("retry_booking_email", {}, driver.token, 204);
  assert.equal((await (await runWorker()).json()).sent, 1);
  assert.equal(delivered.size, 1);
  assert.equal([...attempts.values()][0], 2);
  assert.deepEqual(await rpc("get_ride", { p_request_key: keys[0] }), pending);
  assert.deepEqual(await rpc("booking_email_failures", {}, driver.token), { retryable: 0, expired: 0 });

  await save(4);
  await save(5, { passenger_email: "bad@example.test\nBcc: attacker@example.test" }, 400);
  for (const [language, index, declineIndex] of [["en", 0, 1], ["fr", 2, 3]]) {
    const primary = index ? await save(index, { language, passenger_email: "fr@example.test" }) : booking;
    const secondary = await save(declineIndex, { language, passenger_email: language + "-decline@example.test" });
    const change = (booking, version, status, schedule) => rpc("change_ride", {
      p_reference: booking.reference, p_version: version, p_status: status, p_schedule: schedule
    }, driver.token);
    await change(primary, 1, "confirmed");
    const fallback = (await rpc("get_ride", { p_request_key: keys[index] })).pickup_at;
    await change(primary, 2, "confirmed", { pickup_time: "2091-05-21T12:30", return_time: null });
    const changed = await rpc("get_ride", { p_request_key: keys[index] });
    assert.equal(changed.pickup_at, "2091-05-21T10:30:00+00:00");
    assert.notEqual(changed.pickup_at, fallback);
    await change(primary, 3, "confirmed");
    await change(primary, 4, "cancelled");
    assert.equal((await rpc("get_ride", { p_request_key: keys[index] })).status, "cancelled");
    await change(secondary, 1, "declined");
  }

  for (let index = 0; index < 2; index++) assert.equal((await runWorker()).status, 200);
  assert.equal(delivered.size, 12);
  const texts = [...delivered.values()];
  for (const title of ["Ride request received", "Ride confirmed", "Ride time changed", "Ride request declined",
    "Ride cancelled", "Demande de trajet recue", "Trajet confirme", "Horaire du trajet modifie",
    "Demande de trajet refusee", "Trajet annule"]) {
    const email = texts.find(({ subject }) => subject.startsWith(title));
    assert.ok(email, title);
    assert.match(email.text, /Reference #\d+\n.*\(Paris\)/);
  }
  assert.ok(texts.some(({ subject, text }) => subject.startsWith("Ride time changed") && text.includes("12:30")));
  assert.ok(texts.every(({ to }) => to[0].endsWith("@example.test")));
  console.log("PASS optional guest email, five localized messages, private status, and duplicate-safe delivery retry");

  function googleIdentity(user, address, verified) {
    const subject = randomUUID();
    const data = JSON.stringify({ sub: subject, email: address, email_verified: verified });
    sql(`insert into auth.identities (provider_id, user_id, provider, identity_data, created_at, updated_at)
      values ('${subject}', '${user.id}', 'google', '${data}'::jsonb, now(), now());`);
  }
  googleIdentity(driver, "unverified@example.test", false);
  googleIdentity(other, "unassigned@example.test", true);
  await rpc("driver_booking_alerts", {}, null, 401);
  await rpc("driver_booking_alerts", {}, other.token, 403);
  const baseline = await rpc("driver_booking_alerts", {}, driver.token);
  assert.equal((await (await runWorker()).json()).sent, 0);

  googleIdentity(driver, "assigned-google@example.test", true);
  const [newRide, sameRide] = await Promise.all([save(6), save(6)]);
  assert.deepEqual(newRide, sameRide);
  assert.deepEqual(await rpc("driver_booking_alerts", {}, driver.token), {
    count: baseline.count + 1, latest: newRide.reference
  });
  await rpc("save_ride", { p_request_key: keys[7], p_source: "phone", p_trip: trip }, driver.token);
  assert.deepEqual(await rpc("driver_booking_alerts", {}, driver.token), {
    count: baseline.count + 1, latest: newRide.reference
  });
  loseResponse = true;
  assert.equal((await (await runWorker()).json()).failed, 1);
  assert.equal((await rpc("booking_email_failures", {}, driver.token)).retryable, 1);
  await rpc("retry_booking_email", {}, driver.token, 204);
  assert.equal((await (await runWorker()).json()).sent, 1);
  const driverMail = [...delivered.entries()].filter(([, mail]) => mail.subject.startsWith("New booking request"));
  assert.equal(driverMail.length, 1);
  const [[deliveryId, email]] = driverMail;
  assert.equal(attempts.get(deliveryId), 2);
  assert.deepEqual(email.to, ["assigned-google@example.test"]);
  assert.ok(email.text.includes("ride=" + newRide.reference));
  assert.ok(!email.text.includes("Local Test"));

  await save(8);
  sql(`delete from booking_private.driver where user_id = '${driver.id}';`);
  await rpc("driver_booking_alerts", {}, driver.token, 403);
  assert.equal((await (await runWorker()).json()).sent, 0);
  console.log("PASS driver-only alerts, verified Google recipient, no manual ride alert, revocation and duplicate-safe delivery");
} finally {
  const hashes = keys.map(value => `sha256(uuid_send('${value}'::uuid))`).join(",");
  sql(`delete from booking_private.calendar_job where ride_reference in
    (select reference from booking_private.ride where request_key_hash in (${hashes}));
    delete from booking_private.ride where request_key_hash in (${hashes});`);
  for (const id of users) await request("/auth/v1/admin/users/" + id, undefined, { method: "DELETE", admin: true });
  await new Promise((resolve) => server.close(resolve));
}

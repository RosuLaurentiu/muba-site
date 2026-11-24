import assert from "node:assert/strict";
import { execFileSync } from "node:child_process";
import { randomUUID } from "node:crypto";
import { readFileSync } from "node:fs";
import { bookingEmailHandler } from "../functions/booking-email/handler.mjs";
import { clearVerifiedTrips, verifiedTrip } from "./verified-trip.mjs";

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

async function request(path, { body, token, network, admin = false, method = "POST", expected = 200 } = {}) {
  const headers = { apikey: admin ? secretKey : publishableKey, "Content-Type": "application/json" };
  if (token) headers.Authorization = "Bearer " + token;
  if (network) headers["cf-connecting-ip"] = network;
  const response = await fetch(new URL(path, endpoint), {
    method, headers, body: body === undefined ? undefined : JSON.stringify(body),
    redirect: "error", signal: AbortSignal.timeout(10000),
  });
  const content = await response.text();
  const data = content ? JSON.parse(content) : null;
  assert.ok([expected].flat().includes(response.status), `${path}: ${data?.message ?? data?.code ?? response.status}`);
  return data;
}

const rpc = (name, args, token, expected, network) => request("/rest/v1/rpc/" + name, { body: args, token, expected, network });
const users = [];
const keys = [];
const password = randomUUID();
const address = `limit-${randomUUID()}@example.test`;
const trip = {
  language: "en", pickup: "Gare du Nord", destination: "Paris-Orly", pickup_time: "2090-06-10T09:00",
  return_time: null, passengers: 1, passenger_name: "Limit Test", passenger_phone: "+33 0 00 00 00 00",
  passenger_notes: "", passenger_email: address,
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
  const web = (mailbox = address) => ({ p_request_key: newKey(), p_trip: { ...trip, passenger_email: mailbox } });
  const save = (args, source, expected = 200) => rpc("save_ride", args, null, expected, source);
  const source = "2001:db8:1::1";
  let code;
  const worker = bookingEmailHandler({ supabaseUrl: apiUrl, serviceKey: secretKey, workerToken: "fixture",
    from: "test@example.test", apiKey: "fixture", appUrl: "http://127.0.0.1:5173", emailApiUrl: "http://mail.test/" },
    async (url, options) => {
      if (new URL(url).origin === endpoint.origin) return fetch(url, options);
      assert.equal(url, "http://mail.test/");
      const message = JSON.parse(options.body);
      assert.ok(message.to.every(recipient => recipient.endsWith("@example.test")));
      if (message.subject === "Code de vérification Private Taxi Paris") {
        assert.deepEqual(message.to, [address]);
        code = message.text.match(/\b[a-f0-9]{32}\b/)?.[0];
      }
      return Response.json({});
    });
  for (const mailbox of [address, address.toUpperCase()]) {
    assert.equal(await rpc("request_booking_code", { p_email: mailbox, p_language: "fr" }, null, 200, source), true);
  }
  assert.equal(sql(`select count(*) from booking_private.booking_code where address = '${address}';`), "1");
  const first = web();
  assert.equal((await save(first, source, 403)).message, "BOOKING_EMAIL_PROOF_REQUIRED");
  await rpc("claim_booking_codes", {}, null, 401);
  const dispatched = await worker(new Request("http://127.0.0.1/", { method: "POST", headers: { Authorization: "Bearer fixture" } }));
  assert.equal(dispatched.status, 200);
  assert.match(code ?? "", /^[a-f0-9]{32}$/);
  assert.equal(sql(`select delivery_code is null from booking_private.booking_code where address = '${address}';`), "t");
  const wrong = web("different@example.test");
  wrong.p_trip.email_code = code;
  assert.equal((await save(wrong, source, 403)).message, "BOOKING_EMAIL_PROOF_REQUIRED");
  first.p_trip.email_code = code;
  const [one, duplicate] = await Promise.all([save(first, source), save(first, source)]);
  assert.equal(one.reference, duplicate.reference);
  assert.equal((await save({ ...first, p_request_key: newKey() }, source, 403)).message, "BOOKING_EMAIL_PROOF_REQUIRED");
  const expired = verifiedTrip(sql, web());
  sql(`update booking_private.booking_code set created_at = now() - interval '16 minutes' where id = '${expired.p_request_key}';`);
  assert.equal((await save(expired, source, 403)).message, "BOOKING_EMAIL_PROOF_REQUIRED");
  const sendSource = "192.0.2.40";
  const issueFixtures = Array.from({ length: 6 }, () => newKey());
  const issuanceRows = issueFixtures.map(id => `('${id}'::uuid)`).join(",");
  sql(`insert into booking_private.booking_code (id,address,language,source_hash,code_hash,used)
    select id,'${address}','en',sha256(uuid_send(id) || convert_to('${sendSource}', 'UTF8')),'',true
    from (values ${issuanceRows}) as fixture(id);`);
  assert.equal((await rpc("request_booking_code", { p_email: address, p_language: "en" },
    null, 429, sendSource)).message, "BOOKING_CODE_LIMIT");
  await rpc("finish_booking_code", { p_id: newKey() }, null, 401);
  console.log("PASS French verification email, duplicate send, wrong mailbox, expired and consumed proof, concurrent retry");

  await save(verifiedTrip(sql, web()), source);
  const race = await Promise.all(["2001:db8:1::2", "2001:db8:1::3"].map((peer, i) =>
    save(verifiedTrip(sql, web(`race-${i}@example.test`)), peer, [200,401])));
  assert.equal(race.filter(result => result.status === "pending").length, 1);
  assert.equal(race.filter(result => result.message === "WEB_INTAKE_LIMIT").length, 1);
  await save(verifiedTrip(sql, web()), "192.0.2.1");
  assert.equal((await save(verifiedTrip(sql, web(address.toUpperCase())), "192.0.2.2", 401)).message, "WEB_INTAKE_LIMIT");
  assert.equal(sql(`select count(*) from booking_private.booking_email as email
    join booking_private.ride as ride using (reference)
    where email.kind = 'receipt' and email.recipient = '${address}' and ride.source = 'web';`), "3");
  assert.equal(sql(`select count(*) from booking_private.rider_email where address = '${address}';`), "4");
  // Seed the emergency ceiling directly in the test database.
  function seed(count, age) {
    if (!count) return;
    const hashes = Array.from({ length: count }, () => `(sha256(uuid_send('${newKey()}'::uuid)))`).join(",");
    sql(`insert into booking_private.ride (request_key_hash,request_hash,source,status,language,pickup,destination,
      pickup_at,passengers,passenger_name,passenger_phone,created_at)
      select k.hash,'','web','pending','en','Fixture','Fixture',now()+interval '3 days',1,'Fixture','0000000000',
        now()-interval '${age}' from (values ${hashes}) as k(hash);`);
  }
  seed(room - 4, "1 minute");
  const reserve = verifiedTrip(sql, web("global-limit@example.test"));
  const refused = await save(reserve, "192.0.2.3", 401);
  assert.equal(refused.message, "WEB_INTAKE_LIMIT");
  const own = keys.map(key => `sha256(uuid_send('${key}'::uuid))`).join(",");
  sql(`update booking_private.ride set created_at = now()-interval '2 hours' where source='web' and request_key_hash in (${own});`);
  seed(30 - daily - room, "2 hours");
  assert.equal((await save(reserve, "192.0.2.3", 401)).message, "WEB_INTAKE_LIMIT");
  delete first.p_trip.email_code;
  assert.equal((await save(first, source)).reference, one.reference);
  assert.equal((await rpc("save_ride", {
    p_request_key: newKey(), p_source: "phone", p_trip: { ...trip, pickup_time: "2090-07-02T09:00" },
  }, token)).status, "confirmed");
  console.log("PASS source concurrency, independent visitor, hourly and daily ceilings, mailbox cap, retries and driver rides");
} finally {
  clearVerifiedTrips(sql);
  sql(`delete from booking_private.booking_code where address = '${address}';`);
  const hashes = keys.map((value) => `sha256(uuid_send('${value}'::uuid))`).join(",");
  if (hashes) {
    sql(`delete from booking_private.calendar_job where ride_reference in (
      select reference from booking_private.ride where request_key_hash in (${hashes}));
      delete from booking_private.ride where request_key_hash in (${hashes});`);
  }
  for (const id of users) await request("/auth/v1/admin/users/" + id, { method: "DELETE", admin: true });
}

import assert from "node:assert/strict";
import { randomUUID } from "node:crypto";

const issued = new Map();
// Other integration suites start with a verified fictional mailbox. The intake
// suite exercises issuance, delivery and consumption through the public API.
export function verifiedTrip(sql, args) {
  const email = args.p_trip.passenger_email;
  if (!/^[a-z0-9.-]+@example\.test$/i.test(email)) return args;
  assert.match(args.p_request_key, /^[0-9a-f-]{36}$/);
  if (!issued.has(args.p_request_key)) {
    const code = randomUUID().replaceAll("-", "");
    sql(`insert into booking_private.booking_code (id,address,language,source_hash,code_hash)
      values ('${args.p_request_key}',lower('${email}'),'en','',sha256(convert_to('${code}','UTF8')));`);
    issued.set(args.p_request_key, code);
  }
  return { ...args, p_trip: { ...args.p_trip, email_code: issued.get(args.p_request_key) } };
}

export function clearVerifiedTrips(sql) {
  if (issued.size) sql(`delete from booking_private.booking_code where id in (${[...issued.keys()].map(id => `'${id}'`).join(",")});`);
  issued.clear();
}

import assert from "node:assert/strict";
import { test } from "node:test";
import { bookingEmailMessage } from "../functions/booking-email/handler.mjs";

const config = { from: "test@example.test", appUrl: "http://127.0.0.1:5173/" };
const job = {
  reference: 41, kind: "receipt", template: null, recipient: "rider@example.test", language: "en",
  pickup_at: "2091-05-21T08:00:00Z", return_at: null, receipt_key: "6f1c2a4e-1b2c-4d3e-8f4a-1234567890ab",
  pickup: "Gare de Lyon", destination: "Paris-Orly", passengers: 2, agreed_fare_cents: null, estimated_fare_cents: 4700
};

test("the rider receipt lists the trip, the estimate and the private link", () => {
  const { subject, text } = bookingEmailMessage(job, config);
  assert.equal(subject, "Ride request received #41");
  assert.deepEqual(text.split("\n"), [
    "Ride request received", "Reference #41", "Pickup: 21 May 2091, 10:00 (Paris)",
    "Pickup address: Gare de Lyon", "Destination: Paris-Orly", "Passengers: 2", "Estimated fare: €47",
    "Private tracking link: http://127.0.0.1:5173/?booking#key=" + job.receipt_key
  ]);
});

test("French emails use accents and the agreed fare", () => {
  const { subject, text } = bookingEmailMessage({ ...job, kind: "confirmed", language: "fr", receipt_key: null,
    return_at: "2091-05-22T16:30:00Z", agreed_fare_cents: 7250 }, config);
  assert.equal(subject, "Trajet confirmé #41");
  assert.match(text, /^Trajet confirmé\nRéférence #41\nDépart: .*\(Paris\)\nRetour: .*18:30 \(Paris\)\n/);
  assert.match(text, /Adresse de départ: Gare de Lyon\nDestination: Paris-Orly\nPassagers: 2\nTarif convenu: 72,50\s€$/);
});

test("updates explain the new details and decisions leave out the fare", () => {
  const updated = bookingEmailMessage({ ...job, kind: "changed", template: "trip_changed", receipt_key: null,
    pickup: "New pickup", agreed_fare_cents: 7250 }, config).text;
  assert.ok(updated.includes("Pickup address: New pickup\n"));
  assert.ok(updated.endsWith("These are the updated details of your confirmed ride."));
  const declined = bookingEmailMessage({ ...job, kind: "declined", language: "fr", receipt_key: null }, config);
  assert.equal(declined.subject, "Demande de trajet refusée #41");
  assert.ok(!declined.text.includes("Tarif"));
});

test("the driver alert has the trip and the ride link but no passenger contact", () => {
  const { subject, text } = bookingEmailMessage({ ...job, kind: "driver_new", receipt_key: null,
    passenger_name: "Local Test", passenger_phone: "+33 0 00 00 00 00" }, config);
  assert.equal(subject, "New booking request #41");
  assert.ok(text.includes("Pickup address: Gare de Lyon\nDestination: Paris-Orly\nPassengers: 2\nEstimated fare: €47\n"));
  assert.ok(text.endsWith("http://127.0.0.1:5173/?driver=&ride=41"));
  assert.ok(!text.includes("Local Test") && !text.includes("+33"));
});

test("emails queued before the trip copy still send without it", () => {
  const legacy = { ...job, pickup: null, destination: null, passengers: null, estimated_fare_cents: null, receipt_key: null };
  assert.deepEqual(bookingEmailMessage(legacy, config).text.split("\n"),
    ["Ride request received", "Reference #41", "Pickup: 21 May 2091, 10:00 (Paris)"]);
});

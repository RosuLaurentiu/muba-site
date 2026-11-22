import assert from "node:assert/strict";
import { bookingPayload, getParisInstant, validateBooking, validatePassenger, validateTrip } from "../../src/booking.js";

const now = new Date("2090-05-21T07:00:00Z");
const trip = {
  pickup: " Gare de Lyon ", destination: "Paris-Orly", pickupDate: "2090-05-21", pickupTime: "10:00",
  roundTrip: true, returnDate: "2090-05-21", returnTime: "17:00", passengers: "2",
  customerName: "Camille Test", customerPhone: "+33 0 00 00 00 00", customerEmail: "rider@example.test", notes: ""
};

assert.deepEqual(validateBooking(trip, 8, now), {});
assert.equal(validatePassenger({ ...trip, customerEmail: "" }).customerEmail, "booking.emailRequired");
assert.deepEqual(validateTrip({ ...trip, customerEmail: "" }, 8, now), {});
const withoutContact = { ...trip, customerName: "", customerPhone: "" };
assert.deepEqual(validateTrip(withoutContact, 8, now), {});
assert.deepEqual(validatePassenger(withoutContact), {
  customerName: "status.nameRequired", customerPhone: "booking.validPhoneRequired"
});
assert.deepEqual(validateBooking({ ...trip, passengers: "9", customerPhone: "123", returnTime: "09:00" }, 8, now), {
  returnTime: "booking.laterReturn",
  passengers: "booking.passengersRequired",
  customerPhone: "booking.validPhoneRequired"
});
assert.equal(validateBooking({ ...trip, pickupTime: "09:00" }, 8, now).pickupTime, "booking.futurePickup");
// At 12:00 Paris the 10:00 outbound is past. Moving only the return keeps the outbound valid.
const noon = new Date("2090-05-21T10:00:00Z");
const kept = { pickup: "2090-05-21T10:00", return: "2090-05-21T17:00" };
assert.deepEqual(validateTrip({ ...trip, returnTime: "19:00" }, 8, noon, kept), {});
assert.equal(validateTrip({ ...trip, returnTime: "19:00" }, 8, noon).pickupTime, "booking.futurePickup");
assert.equal(validateTrip({ ...trip, pickupTime: "09:00" }, 8, noon, kept).pickupTime, "booking.futurePickup");
assert.equal(validateTrip({ ...trip, returnTime: "11:00" }, 8, noon, kept).returnTime, "booking.futureReturn");
assert.equal(getParisInstant("2090-03-26T02:30"), null);
assert.equal(getParisInstant("2090-10-29T02:30").toISOString(), "2090-10-29T01:30:00.000Z");
assert.deepEqual(bookingPayload({ ...trip, roundTrip: false }, "fr"), {
  language: "fr", pickup: "Gare de Lyon", destination: "Paris-Orly", pickup_time: "2090-05-21T10:00",
  return_time: null, passengers: 2, passenger_name: "Camille Test", passenger_phone: "+33 0 00 00 00 00",
  passenger_notes: "", passenger_email: "rider@example.test"
});
console.log("PASS required booking email, rider input validation and Paris clock changes");

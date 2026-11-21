import assert from "node:assert/strict";
import { bookingPayload, getParisInstant, validateBooking, validatePassenger, validateTrip } from "../../src/booking.js";

const now = new Date("2090-05-21T07:00:00Z");
const trip = {
  pickup: " Gare de Lyon ", destination: "Paris-Orly", pickupDate: "2090-05-21", pickupTime: "10:00",
  roundTrip: true, returnDate: "2090-05-21", returnTime: "17:00", passengers: "2",
  customerName: "Camille Test", customerPhone: "+33 0 00 00 00 00", notes: ""
};

assert.deepEqual(validateBooking(trip, 8, now), {});
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
assert.equal(getParisInstant("2090-03-26T02:30"), null);
assert.equal(getParisInstant("2090-10-29T02:30").toISOString(), "2090-10-29T01:30:00.000Z");
assert.deepEqual(bookingPayload({ ...trip, roundTrip: false }, "fr"), {
  language: "fr", pickup: "Gare de Lyon", destination: "Paris-Orly", pickup_time: "2090-05-21T10:00",
  return_time: null, passengers: 2, passenger_name: "Camille Test", passenger_phone: "+33 0 00 00 00 00",
  passenger_notes: ""
});
console.log("PASS rider input validation and Paris clock changes");

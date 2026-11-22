import assert from "node:assert/strict";
import { getRouteTotals, parseAgreedFare, routeEstimate } from "../../src/fare.js";

for (const [input, cents] of [["72,50", 7250], ["72.5", 7250], ["72", 7200], ["0,01", 1], ["21474836.47", 2147483647]]) {
  assert.equal(parseAgreedFare(input), cents);
}
for (const input of ["", "0", "-1", "1e2", "1,001", "21474836.48"]) {
  assert.equal(parseAgreedFare(input), null);
}

function leg(km, minutes, trafficMinutes) {
  return {
    distance: { value: km * 1000 },
    duration: { value: minutes * 60 },
    ...(trafficMinutes === undefined ? {} : { duration_in_traffic: { value: trafficMinutes * 60 } })
  };
}

assert.equal(routeEstimate(leg(5, 10)).fareOneWay, 20);
assert.equal(routeEstimate(leg(35, 15)).fareOneWay, 35);
assert.equal(routeEstimate(leg(99, 60)).fareOneWay, 99);
assert.equal(routeEstimate(leg(100, 60)).fareOneWay, 140);
assert.equal(routeEstimate(leg(150, 120)).fareOneWay, 210);
assert.equal(routeEstimate(leg(5, 10, 90)).fareOneWay, 45);
assert.deepEqual(getRouteTotals(routeEstimate(leg(30, 40)), true), {
  distanceKm: 60, durationMinutes: 80, fare: 60
});
assert.equal(routeEstimate(leg(0, 0)), null);
assert.equal(routeEstimate(leg(5, 0)), null);
assert.equal(routeEstimate(leg(NaN, 5)), null);
assert.equal(routeEstimate(leg(1, Infinity)), null);
assert.equal(routeEstimate(undefined), null);
assert.equal(getRouteTotals(null, true), null);
console.log("PASS fare rates, minimums, threshold, hourly floor, return multiplier and invalid routes");

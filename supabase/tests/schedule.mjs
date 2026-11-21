import assert from "node:assert/strict";
import { draftBlock, draftLegs, entriesOnDay, plannedSchedule, scheduleContext } from "../../src/schedule.js";

const ride = {
  reference: 1, status: "confirmed", pickup: "Gare de Lyon", destination: "Paris-Orly",
  pickup_at: "2090-03-25T23:30:00Z", return_at: "2090-03-26T22:15:00Z", estimated_minutes: 45
};
const block = { id: "block", starts_at: "2090-03-25T22:30:00Z", ends_at: "2090-03-25T23:15:00Z" };
const schedule = plannedSchedule([ride, { ...ride, reference: 2, status: "declined" }], [block]);
const springDay = entriesOnDay(schedule, "2090-03-26");
assert.deepEqual(springDay.map((entry) => entry.id), ["block", "1-out"]);
assert.equal(entriesOnDay(schedule, "2090-03-27")[0].pickup, "Paris-Orly");
assert.equal(entriesOnDay(schedule, "2090-03-27")[0].returning, true);

const startsInside = draftLegs("2090-03-26T01:00", null, 30);
assert.deepEqual(scheduleContext(startsInside, schedule).conflicts.map((entry) => entry.id), ["1-out"]);
assert.equal(scheduleContext(startsInside, schedule, 1).conflicts.length, 0);
const startsAtEnd = draftLegs("2090-03-26T01:15", null, null);
assert.equal(scheduleContext(startsAtEnd, schedule).conflicts.length, 0);
assert.equal(scheduleContext(startsAtEnd, schedule).neighbors.length, 2);
assert.equal(scheduleContext(draftLegs("2090-03-26T04:00", "2090-03-26T04:30", 60), []).legsOverlap, true);
assert.deepEqual(draftBlock("2090-03-26T02:30", "2090-03-26T04:00"), []);
const gapRide = { ...ride, pickup_at: "2090-03-26T12:00:00Z", return_at: null, estimated_minutes: 30 };
const gapBlock = { id: "travel-block", starts_at: "2090-03-26T12:35:00Z", ends_at: "2090-03-26T12:45:00Z" };
const gapSchedule = plannedSchedule([gapRide], [gapBlock]);
assert.deepEqual(scheduleContext(draftLegs("2090-03-26T14:55", "2090-03-26T15:30", 20), gapSchedule)
  .gaps.map(({ minutes }) => minutes), [15, 15]);
assert.equal(scheduleContext(draftLegs("2090-03-26T14:54", null, 20), gapSchedule).gaps[0].minutes, 14);
assert.equal(scheduleContext(draftLegs("2090-03-26T14:55", null, 20),
  plannedSchedule([{ ...gapRide, estimated_minutes: null }], [])).gaps[0].minutes, null);
assert.deepEqual(scheduleContext(draftBlock("2090-03-26T14:45", "2090-03-26T14:55"), gapSchedule).gaps, []);
console.log("PASS schedule leg order, Paris spring day, boundaries and conflicts");

import assert from "node:assert/strict";
import { isOutsideWorkHours, workPeriods } from "../../src/workingHours.js";

const hours = [["09:00", "18:00"], null, ["20:00", "00:00"], null, null, null, ["22:00", "02:00"]];

assert.deepEqual(workPeriods(hours, "2026-11-22"), [["22:00", "24:00"]]);
assert.deepEqual(workPeriods(hours, "2026-11-23"), [["00:00", "02:00"], ["09:00", "18:00"]]);
assert.deepEqual(workPeriods(hours, "2026-11-26"), []);
assert.deepEqual(workPeriods([["01:00", "04:00"], ...hours.slice(1)], "2026-11-23"), [["00:00", "04:00"]]);
assert.equal(isOutsideWorkHours(hours, "2026-11-23T00:59:00Z"), false);
assert.equal(isOutsideWorkHours(hours, "2026-11-23T01:00:00Z"), true);
assert.equal(isOutsideWorkHours(hours, "2026-11-23T08:00:00Z"), false);
assert.equal(isOutsideWorkHours(hours, "2026-11-24T09:00:00Z"), true);
assert.equal(isOutsideWorkHours(null, "2026-11-24T09:00:00Z"), false);

const autumnHours = [null, null, null, null, null, ["22:00", "03:00"], null];
assert.equal(isOutsideWorkHours(autumnHours, "2026-10-25T00:30:00Z"), false);
assert.equal(isOutsideWorkHours(autumnHours, "2026-10-25T01:30:00Z"), false);
assert.equal(isOutsideWorkHours(autumnHours, "2026-10-25T02:00:00Z"), true);
console.log("PASS weekly hours, midnight and Paris clock change boundaries");

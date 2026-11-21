import { getParisInstant, parisMinute } from "./booking.js";

export function driverLink(day, options = {}) {
  return "?" + new URLSearchParams({ driver: "", day, ...options }).toString();
}

export function moveDay(day, difference) {
  const date = new Date(day + "T12:00:00Z");
  date.setUTCDate(date.getUTCDate() + difference);
  return date.toISOString().slice(0, 10);
}

export function monthDays(day) {
  const first = day.slice(0, 7) + "-01";
  const date = new Date(first + "T12:00:00Z");
  date.setUTCMonth(date.getUTCMonth() + 1, 0);
  return Array.from({ length: date.getUTCDate() }, (_, index) => first.slice(0, 8) + String(index + 1).padStart(2, "0"));
}

function leg(id, startValue, minutes, extra = {}) {
  const start = new Date(startValue).getTime();
  const end = start + (minutes ?? 1) * 60000;
  return { id, start, end, endKnown: minutes != null, ...extra };
}

export function rideLegs(ride, minutes = ride.estimated_minutes) {
  const outbound = leg(ride.reference + "-out", ride.pickup_at, minutes, {
    ride, pickup: ride.pickup, destination: ride.destination, returning: false
  });
  if (!ride.return_at) return [outbound];
  return [outbound, leg(ride.reference + "-return", ride.return_at, minutes, {
    ride, pickup: ride.destination, destination: ride.pickup, returning: true
  })];
}

export function plannedSchedule(rides, blocks) {
  const confirmed = rides.filter((ride) => ride.status === "confirmed").flatMap((ride) => rideLegs(ride));
  const paused = blocks.map((block) => ({
    id: block.id, start: Date.parse(block.starts_at), end: Date.parse(block.ends_at), endKnown: true
  }));
  return [...confirmed, ...paused].sort((a, b) => a.start - b.start);
}

export function draftLegs(pickupTime, returnTime, minutes) {
  const pickup = getParisInstant(pickupTime);
  const returning = returnTime && getParisInstant(returnTime);
  if (!pickup || (returnTime && !returning)) return [];
  return [
    leg("draft-out", pickup, minutes, { rideDraft: true }),
    ...(returning ? [leg("draft-return", returning, minutes, { rideDraft: true, returning: true })] : [])
  ];
}

export function draftBlock(startTime, endTime) {
  const start = getParisInstant(startTime)?.getTime();
  const end = getParisInstant(endTime)?.getTime();
  return start < end ? [{ id: "draft-block", start, end, endKnown: true }] : [];
}

export function scheduleContext(drafts, schedule, excludedReference) {
  const other = schedule.filter((entry) => !entry.ride || entry.ride.reference !== excludedReference);
  const conflicts = new Map();
  const neighbors = new Map();
  const overlaps = (a, b) => a.start < b.end && b.start < a.end;
  for (const draft of drafts) {
    for (const entry of other) {
      if (overlaps(draft, entry)) conflicts.set(entry.id, entry);
    }
    const before = other.findLast((entry) => entry.ride && entry.start < draft.start);
    const after = other.find((entry) => entry.ride && entry.start > draft.start);
    for (const entry of [before, after]) {
      if (entry) neighbors.set(entry.id, entry);
    }
  }
  const rideDrafts = drafts.filter((entry) => entry.ride || entry.rideDraft);
  const rides = [...other.filter((entry) => entry.ride), ...rideDrafts].sort((a, b) => a.start - b.start);
  const blocks = other.filter((entry) => !entry.ride);
  const gaps = rides.slice(1).flatMap((next, index) => {
    const prior = rides[index];
    if (!rideDrafts.includes(prior) && !rideDrafts.includes(next)) return [];
    if (!prior.endKnown) return [{ prior, next, minutes: null }];
    const unavailable = blocks.reduce((time, block) =>
      time + Math.max(0, Math.min(next.start, block.end) - Math.max(prior.end, block.start)), 0);
    const minutes = Math.max(0, Math.floor((next.start - prior.end - unavailable) / 60000));
    return [{ prior, next, minutes }];
  });
  return {
    conflicts: [...conflicts.values()],
    neighbors: [...neighbors.values()],
    gaps,
    legsOverlap: drafts.length === 2 && overlaps(drafts[0], drafts[1])
  };
}

export function entriesOnDay(schedule, day) {
  const start = getParisInstant(day + "T00:00").getTime();
  const end = getParisInstant(moveDay(day, 1) + "T00:00").getTime();
  return schedule.filter((entry) =>
    entry.ride ? entry.start >= start && entry.start < end : entry.start < end && entry.end > start
  );
}

export function parisDay(date) {
  return parisMinute(date).slice(0, 10);
}

import { parisMinute } from "./booking.js";

export function workPeriods(hours, day) {
  const weekday = (new Date(day + "T12:00:00Z").getUTCDay() + 6) % 7;
  const previous = hours[(weekday + 6) % 7];
  const current = hours[weekday];
  const overnightEnd = previous && previous[1] < previous[0] && previous[1] !== "00:00" ? previous[1] : null;
  if (!current) return overnightEnd ? [["00:00", overnightEnd]] : [];

  const [start, end] = current;
  const dayEnd = end < start ? "24:00" : end;
  if (!overnightEnd) return [[start, dayEnd]];
  if (start > overnightEnd) return [["00:00", overnightEnd], [start, dayEnd]];
  return [["00:00", dayEnd > overnightEnd ? dayEnd : overnightEnd]];
}

export function isOutsideWorkHours(hours, instant) {
  if (!hours) return false;
  const [day, time] = parisMinute(instant).split("T");
  return !workPeriods(hours, day).some(([start, end]) => start <= time && time < end);
}

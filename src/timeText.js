import { formatParisTime, parisMinute } from "./booking";
import { getText } from "./i18n";
import { moveDay, parisDay } from "./schedule";

// "2 h 5 min" style durations for waiting times and countdowns.
export function durationText(minutes, language) {
  const total = Math.max(1, Math.round(Number(minutes) || 0));
  const hours = Math.floor(total / 60);
  return [...(hours ? [hours + " " + getText(language, "units.hourShort")] : []),
    ...(total % 60 ? [(total % 60) + " " + getText(language, "units.minuteShort")] : [])].join(" ");
}

// Today 18:30, Tomorrow 07:15, or the full Paris date for later days.
export function pickupDayTime(instant, now, language) {
  const [date, time] = parisMinute(instant).split("T");
  const today = parisDay(now);
  if (date === today) return getText(language, "schedule.todayAt").replace("{time}", time);
  if (date === moveDay(today, 1)) return getText(language, "schedule.tomorrowAt").replace("{time}", time);
  return formatParisTime(instant, language);
}

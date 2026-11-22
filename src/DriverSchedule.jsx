import { useEffect, useRef, useState } from "react";
import BookingDetails from "./BookingDetails";
import PassengerCountField from "./PassengerCountField";
import { isOutsideWorkHours, workPeriods } from "./workingHours";
import { bookingPayload, formatParisTime, parisMinute, validateBooking, validateTrip } from "./booking";
import { appConfig } from "./config";
import { getText } from "./i18n";
import { draftBlock, draftLegs, driverLink, monthDays, moveDay, parisDay, rideLegs, scheduleContext } from "./schedule";

const capacity = Math.max(...Object.values(appConfig.vehicles).map((vehicle) => vehicle.capacity));

function EntryText({ entry, language }) {
  const t = (key) => getText(language, key);
  return (
    <div className="schedule-entry">
      <strong>{formatParisTime(entry.start, language)}</strong>
      {entry.ride ? (
        <>
          {entry.returning && <span>{t("schedule.returnLeg")}</span>}
          <span>{entry.pickup} → {entry.destination}</span>
          <span className="muted">
            {entry.endKnown ? t("schedule.finish") + " " + formatParisTime(entry.end, language) : t("schedule.finishUnknown")}
          </span>
        </>
      ) : <span>{t("schedule.blocked")} · {formatParisTime(entry.end, language)}</span>}
    </div>
  );
}

export function SchedulePreview({ context, language }) {
  const [travelTarget, setTravelTarget] = useState("60");
  const t = (key) => getText(language, key);
  const target = travelTarget === "" ? 60 : Number(travelTarget);
  if (!context.legsOverlap && !context.conflicts.length && !context.neighbors.length && !context.gaps.length) return null;
  return (
    <div className="panel stack schedule-preview">
      {(context.legsOverlap || context.conflicts.length > 0) && (
        <>
          <h2 className="field-error">{t("schedule.conflict")}</h2>
          {context.legsOverlap && <p>{t("schedule.legsOverlap")}</p>}
          {context.conflicts.map((entry) => <EntryText key={entry.id} entry={entry} language={language} />)}
        </>
      )}
      {context.gaps.length > 0 && (
        <>
          <h2>{t("schedule.travelBetween")}</h2>
          <label className="field schedule-duration">
            {t("schedule.travelTarget")}
            <input type="number" min="0" max="1440" value={travelTarget} onChange={(event) => {
              const value = event.target.value;
              if (value === "" || (/^\d+$/.test(value) && Number(value) <= 1440)) setTravelTarget(value);
            }} />
          </label>
          <p className="muted">{t("schedule.travelAdvisory")}</p>
          <ul className="stack">
            {context.gaps.map(({ prior, next, minutes }) => (
              <li key={prior.id + "-" + next.id}>
                {prior.endKnown && <>{formatParisTime(prior.end, language)} → </>}
                {formatParisTime(next.start, language)} ·{" "}
                {minutes === null ? <span className="field-error">{t("schedule.travelUnknown")}</span> : <>
                  {minutes} {t("units.minuteShort")} {t("schedule.travelAvailable")}
                  {minutes < target && <> · <span className="field-error">{t("schedule.travelShort")}</span></>}
                </>}
              </li>
            ))}
          </ul>
        </>
      )}
      {!context.gaps.length && context.neighbors.length > 0 && (
        <>
          <h2>{t("schedule.neighbors")}</h2>
          <p className="muted">{t("schedule.checkTravel")}</p>
          {context.neighbors.map((entry) => <EntryText key={entry.id} entry={entry} language={language} />)}
        </>
      )}
    </div>
  );
}

export function NextPickup({ schedule, day, language }) {
  const [now, setNow] = useState(() => Date.now());
  const t = (key) => getText(language, key);
  useEffect(() => {
    const timer = window.setInterval(() => setNow(Date.now()), 60000);
    return () => window.clearInterval(timer);
  }, []);
  const next = schedule.find((entry) => entry.ride && entry.start >= now);

  return (
    <section className="panel next-ride" aria-labelledby="next-pickup">
      <div className="next-ride-time">
        <h2 id="next-pickup">{t("schedule.nextPickup")}</h2>
        {next ? (
          <>
            <strong>{formatParisTime(next.start, language)}</strong>
            <span className="muted">
              {next.endKnown ? t("schedule.finish") + " " + formatParisTime(next.end, language) : t("schedule.finishUnknown")}
            </span>
            {next.returning && <span>{t("schedule.returnLeg")}</span>}
          </>
        ) : <p className="muted">{t("schedule.noUpcoming")}</p>}
      </div>
      {next && (
        <div className="next-ride-route">
          <BookingDetails rows={[
            [t("planner.labels.pickup"), next.pickup],
            [t("planner.labels.destination"), next.destination]
          ]} />
          <div className="actions">
            <a className="button primary" href={"https://www.google.com/maps/dir/?api=1&destination=" + encodeURIComponent(next.pickup)}
              target="_blank" rel="noreferrer">{t("driver.directions")}</a>
            <a className="button" href={"tel:" + next.ride.passenger_phone.replace(/[^+\d]/g, "")}>{t("driver.call")}</a>
            <a className="button" href={driverLink(day, { ride: next.ride.reference, ...(next.returning ? { leg: "return" } : {}) })}>
              {t("driver.detail")} {next.ride.reference}
            </a>
          </div>
        </div>
      )}
    </section>
  );
}

export function DriverDay({ schedule, rides, day, today, language, onRemove, workHours }) {
  const [removing, setRemoving] = useState("");
  const t = (key) => getText(language, key);
  const calendar = [...schedule, ...rides.filter(ride => ride.status !== "confirmed").flatMap(ride => rideLegs(ride))]
    .sort((a, b) => a.start - b.start);
  const dates = monthDays(day);
  const first = dates[0];
  const last = dates[dates.length - 1];
  const weekdayOffset = (new Date(first + "T12:00:00Z").getUTCDay() + 6) % 7;
  const byDay = new Map(dates.filter(date => date <= "9999-12-30").map(date => [date, []]));
  for (const entry of calendar) {
    const start = parisDay(entry.start);
    if (entry.ride) {
      byDay.get(start)?.push(entry);
    } else {
      const end = parisDay(entry.end - 1);
      for (const [date, items] of byDay) {
        if (date >= start && date <= end) items.push(entry);
      }
    }
  }
  const entries = byDay.get(day);
  const locale = language === "fr" ? "fr-FR" : "en-GB";
  const dateLabel = (value, options) => new Date(value + "T12:00:00Z").toLocaleDateString(locale, { ...options, timeZone: "UTC" });
  const periods = workHours?.hours ? workPeriods(workHours.hours, day) : null;

  function agendaTime(instant) {
    const [date, time] = parisMinute(instant).split("T");
    return date === day ? time : formatParisTime(instant, language);
  }

  async function remove(id) {
    if (!window.confirm(t("schedule.confirmRemove"))) return;
    setRemoving(id);
    try {
      await onRemove(id);
    } finally {
      setRemoving("");
    }
  }

  function card(entry) {
    const { ride } = entry;
    const pending = ride?.status === "pending";
    return (
      <li className="agenda-entry" key={entry.id}>
        <div className="agenda-clock">
          <strong>{agendaTime(entry.start)}</strong>
          <span className="muted">{entry.endKnown
            ? (ride ? t("schedule.finish") : t("schedule.blocked")) + " " + agendaTime(entry.end)
            : t("schedule.finishUnknown")}</span>
        </div>
        <div className="agenda-summary">
          {ride ? (
            <>
              <span className="calendar-status">{t("booking.state." + ride.status)}{entry.returning && " · " + t("schedule.returnLeg")}</span>
              <p>{entry.pickup} → {entry.destination}</p>
              {pending && isOutsideWorkHours(workHours?.hours, entry.start) && <p className="field-error">{t("schedule.outsideWorkHours")}</p>}
              <div className="agenda-links">
                <a href={driverLink(day, { ride: ride.reference, ...(entry.returning ? { leg: "return" } : {}) })}>
                  {t(pending ? "driver.reviewRequest" : "driver.detail")} #{ride.reference}
                </a>
                <a href={"tel:" + ride.passenger_phone.replace(/[^+\d]/g, "")} aria-label={t("driver.call") + " · " + ride.passenger_name}>
                  {ride.passenger_name}
                </a>
              </div>
            </>
          ) : (
            <>
              <strong>{t("schedule.timeBlocked")}</strong>
              <button className="button destructive" type="button" disabled={Boolean(removing)} onClick={() => remove(entry.id)}>{t("schedule.removeBlock")}</button>
            </>
          )}
        </div>
      </li>
    );
  }

  return (
    <>
      <section className="panel driver-agenda" aria-labelledby="day-heading">
        <h2 id="day-heading">{dateLabel(day, { weekday: "long", day: "numeric", month: "long", year: "numeric" })}</h2>
        <p className="day-work-hours muted">{periods ? (
          <>{t("schedule.workHours")} · {periods.length ? periods.map(([start, end]) => start + "–" + end).join(" / ") : t("schedule.dayOff")}</>
        ) : t(workHours === undefined ? "schedule.workHoursLoading" : workHours === false ? "schedule.workHoursUnavailable" : "schedule.workHoursNotSet")}</p>
        <div className="schedule-date schedule-controls">
          {day > "0001-01-01" && <a className="button" href={driverLink(moveDay(day, -1)) + "#day-heading"} aria-label={t("schedule.previous")}>‹</a>}
          <label className="field">
            {t("schedule.parisDay")}
            <input type="date" value={day} max="9999-12-30" onChange={(event) => {
              if (event.currentTarget.validity.valid && event.currentTarget.value) {
                window.location.assign(driverLink(event.currentTarget.value) + "#day-heading");
              }
            }} />
          </label>
          {day < "9999-12-30" && <a className="button" href={driverLink(moveDay(day, 1)) + "#day-heading"} aria-label={t("schedule.nextDay")}>›</a>}
        </div>
        <div className="actions schedule-controls">
          {day >= today && <>
            <a className="button primary" href={driverLink(day, { new: "" })}>{t("schedule.addRide")}</a>
            <a className="button" href={driverLink(day, { block: "" })}>{t("schedule.addBlock")}</a>
          </>}
          <a className="button" href={driverLink(day, { hours: "" })}>{t("schedule.workHours")}</a>
        </div>
        {entries.length > 0 && <ul className="ride-list">{entries.map(card)}</ul>}
        {entries.length === 0 && <p className="driver-empty">{t("schedule.dayEmpty")}</p>}
      </section>
      <section id="reservation-calendar" className="panel month-panel" aria-labelledby="calendar-heading">
        <h2 id="calendar-heading">{t("schedule.calendar")}</h2>
        <div className="month-nav">
          <strong>{dateLabel(day, { month: "long", year: "numeric" })}</strong>
          <div className="month-actions">
            <a className="button" href={driverLink(today) + "#reservation-calendar"}>{t("schedule.today")}</a>
            {first > "0001-01-01" && <a className="button" aria-label={t("schedule.prevMonth")} href={driverLink(moveDay(first, -1).slice(0, 7) + "-01") + "#reservation-calendar"}>‹</a>}
            {last < "9999-12-31" && <a className="button" aria-label={t("schedule.nextMonth")} href={driverLink(moveDay(last, 1)) + "#reservation-calendar"}>›</a>}
          </div>
        </div>
        <div className="month-grid">
          {Array.from({ length: 7 }, (_, i) => <span className="weekday" key={i}>{dateLabel(moveDay("2024-01-01", i), { weekday: "short" })}</span>)}
          {Array.from({ length: weekdayOffset }, (_, i) => <span aria-hidden="true" key={"blank" + i} />)}
          {[...byDay].map(([date, items]) => (
            <a className="month-day" key={date} aria-current={date === day ? "date" : undefined} data-today={date === today ? "" : undefined}
              href={driverLink(date) + "#day-heading"} aria-label={dateLabel(date, { dateStyle: "full" }) +
                (date === today ? " · " + t("schedule.today") : "") + " · " + t("schedule.entries") + " " + items.length}>
              {Number(date.slice(-2))}{items.length > 0 && <small>{items.length}</small>}
            </a>
          ))}
        </div>
        <p className="calendar-count muted">{t("schedule.calendarCount")}</p>
      </section>
    </>
  );
}

function initialDraft(day, ride) {
  const [pickupDate, pickupTime] = ride ? parisMinute(ride.pickup_at).split("T") : [day, ""];
  const [returnDate, returnTime] = ride?.return_at ? parisMinute(ride.return_at).split("T") : ["", ""];
  return {
    pickup: ride?.pickup ?? "", destination: ride?.destination ?? "",
    pickupDate, pickupTime, returnDate, returnTime, roundTrip: Boolean(ride?.return_at),
    passengers: String(ride?.passengers ?? 1), customerName: ride?.passenger_name ?? "",
    customerPhone: ride?.passenger_phone ?? "", customerEmail: "", notes: ride?.passenger_notes ?? "",
    estimatedMinutes: ride?.estimated_minutes ?? "", source: "phone"
  };
}

function DraftField({ name, label, error, children, ...options }) {
  return (
    <div className="field">
      <label htmlFor={name}>{label}</label>
      {children || <input id={name} name={name} aria-invalid={error ? true : undefined}
        aria-describedby={error ? name + "-error" : undefined} {...options} />}
      {error && <span className="field-error" id={name + "-error"}>{error}</span>}
    </div>
  );
}

export function ScheduleEditor({ ride, returning, schedule, day, language, rpc, refresh, refreshed }) {
  const [draft, setDraft] = useState(() => initialDraft(day, ride));
  const [errors, setErrors] = useState({});
  const [notice, setNotice] = useState("");
  const [busy, setBusy] = useState(false);
  const attempt = useRef(null);
  const writing = useRef(false);
  const [initialVersion] = useState(ride?.version);
  const t = (key) => getText(language, key);
  const payload = bookingPayload(draft, language);
  const minutes = draft.estimatedMinutes === "" ? null : Number(draft.estimatedMinutes);
  const durationValid = minutes === null || (Number.isInteger(minutes) && minutes >= 1 && minutes <= 1440);
  const context = scheduleContext(draftLegs(payload.pickup_time, payload.return_time, durationValid ? minutes : null), schedule, ride?.reference);
  const hasConflict = context.legsOverlap || context.conflicts.length > 0;
  const frozen = busy || notice === "schedule.retrySame";
  const stale = Boolean(ride && ride.version !== initialVersion);
  const prevented = (hasConflict && notice !== "schedule.retrySame") || !refreshed || stale;

  function update(event) {
    const { name, value, checked, type } = event.target;
    updateField(name, type === "checkbox" ? checked : value);
  }

  function updateField(name, value) {
    setDraft((current) => ({ ...current, [name]: value }));
    setErrors((current) => ({ ...current, [name]: "" }));
    setNotice("");
  }

  async function save(event) {
    event.preventDefault();
    if (prevented || writing.current) return;
    const validation = ride ? validateTrip(draft, capacity, new Date(), {
      pickup: parisMinute(ride.pickup_at), return: ride.return_at && parisMinute(ride.return_at)
    }) : validateBooking(draft, capacity);
    if (!durationValid) validation.estimatedMinutes = "schedule.durationInvalid";
    setErrors(validation);
    const invalid = [...event.currentTarget.elements].find((field) => validation[field.name]);
    if (invalid) {
      window.requestAnimationFrame(() => invalid.focus());
      return;
    }
    writing.current = true;
    setBusy(true);
    try {
      if (ride) {
        await rpc("change_ride", {
          p_reference: ride.reference, p_version: initialVersion, p_status: "confirmed",
          p_schedule: {
            pickup_time: payload.pickup_time, return_time: payload.return_time, estimated_minutes: minutes,
            pickup: payload.pickup, destination: payload.destination
          }
        });
        window.location.assign(driverLink(day, { ride: ride.reference, saved: "", ...(returning && payload.return_time ? { leg: "return" } : {}) }));
      } else {
        attempt.current ??= { p_request_key: crypto.randomUUID(), p_source: draft.source, p_trip: { ...payload, estimated_minutes: minutes } };
        const saved = await rpc("save_ride", attempt.current);
        window.location.assign(driverLink(day, { ride: saved.reference, saved: "" }));
      }
    } catch (error) {
      if (error.code === "PT409") {
        attempt.current = null;
        setNotice(error.message === "SCHEDULE_CONFLICT" ? "schedule.conflictChanged" : "driver.staleDecision");
        refresh();
      } else if (ride || /^(22\d{3}|23502|23514)$/.test(error.code)) {
        attempt.current = null;
        setNotice("schedule.saveFailed");
        refresh();
      } else {
        setNotice("schedule.retrySame");
      }
      writing.current = false;
      setBusy(false);
    }
  }

  function field(name, label, options = {}) {
    return <DraftField name={name} label={t(label)} error={errors[name] && t(errors[name])}
      value={draft[name]} onChange={update} {...options} />;
  }

  return (
    <>
      <h1>{t(ride ? "schedule.reschedule" : "schedule.addRide")}</h1>
      <form onSubmit={save} noValidate>
        <fieldset className="booking-grid schedule-fieldset" disabled={frozen}>
          <legend className="sr-only">{t("planner.tripTitle")}</legend>
          <div className="panel stack">
            {field("pickup", "planner.labels.pickup", { maxLength: 300, required: true })}
            {field("destination", "planner.labels.destination", { maxLength: 300, required: true })}
            <div className="time-pair">
              {field("pickupDate", "planner.labels.date", { type: "date" })}
              {field("pickupTime", "planner.labels.time", { type: "time" })}
            </div>
            <label className="check">
              <input name="roundTrip" type="checkbox" checked={draft.roundTrip} onChange={update} />
              {t("planner.labels.roundTrip")}
            </label>
            {draft.roundTrip && (
              <div className="time-pair">
                {field("returnDate", "planner.labels.returnDate", { type: "date" })}
                {field("returnTime", "planner.labels.returnTime", { type: "time" })}
              </div>
            )}
            {field("estimatedMinutes", "schedule.duration", { type: "number", min: 1, max: 1440 })}
          </div>
          {!ride && (
            <div className="panel stack">
              {field("customerName", "planner.labels.name", { maxLength: 150 })}
              {field("customerPhone", "planner.labels.phone", { type: "tel", maxLength: 40 })}
              {field("customerEmail", "planner.labels.email", { type: "email", autoComplete: "email", maxLength: 254, required: true })}
              <PassengerCountField capacity={capacity} label={t("planner.labels.passengers")} value={draft.passengers}
                onChange={(value) => updateField("passengers", value)} error={errors.passengers && t(errors.passengers)} disabled={frozen} />
              {field("notes", "planner.labels.notes", { maxLength: 1500 })}
              <DraftField name="source" label={t("schedule.source")}>
                <select id="source" name="source" value={draft.source} onChange={update}>
                  <option value="phone">{t("schedule.phone")}</option>
                  <option value="whatsapp">{t("nav.whatsApp")}</option>
                </select>
              </DraftField>
            </div>
          )}
        </fieldset>
        <SchedulePreview context={context} language={language} />
        {(notice || stale) && <p className="field-error form-submit" role="alert">{t(stale ? "schedule.reopenEdit" : notice)}</p>}
        <button className="button primary form-submit" type="submit" disabled={busy || prevented}>
          {t(notice === "schedule.retrySame" ? "schedule.retry" : "schedule.saveRide")}
        </button>
      </form>
    </>
  );
}

export function BlockEditor({ schedule, day, language, rpc, refresh, refreshed }) {
  const [times, setTimes] = useState({ start: day + "T09:00", end: day + "T10:00" });
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const attempt = useRef(null);
  const t = (key) => getText(language, key);
  const draft = draftBlock(times.start, times.end);
  const context = scheduleContext(draft, schedule);
  const frozen = busy || error === "schedule.retrySame";
  const prevented = (context.conflicts.length > 0 && error !== "schedule.retrySame") || !refreshed;

  async function save(event) {
    event.preventDefault();
    if (busy || prevented) return;
    if (!attempt.current && !draft.length) {
      setError("schedule.invalidBlock");
      return;
    }
    setBusy(true);
    try {
      attempt.current ??= { p_id: crypto.randomUUID(), p_start: times.start, p_end: times.end };
      await rpc("save_block", attempt.current);
      window.location.assign(driverLink(day, { saved: "" }));
    } catch (err) {
      if (err.code === "PT409" || /^(22\d{3}|23514)$/.test(err.code)) {
        attempt.current = null;
        setError(err.code === "PT409" ? "schedule.conflictChanged" : "schedule.invalidBlock");
        refresh();
      } else {
        setError("schedule.retrySame");
      }
      setBusy(false);
    }
  }

  return (
    <>
      <h1>{t("schedule.addBlock")}</h1>
      <form onSubmit={save}>
        <div className="panel stack">
          {["start", "end"].map((name) => (
            <DraftField key={name} name={name} label={t("schedule." + name)} type="datetime-local" value={times[name]}
              disabled={frozen} required onChange={(event) => {
                setTimes({ ...times, [name]: event.target.value });
                setError("");
              }} />
          ))}
        </div>
        <SchedulePreview context={context} language={language} />
        {error && <p className="field-error form-submit" role="alert">{t(error)}</p>}
        <button className="button primary form-submit" type="submit" disabled={busy || prevented}>
          {t(error === "schedule.retrySame" ? "schedule.retry" : "schedule.saveBlock")}
        </button>
      </form>
    </>
  );
}

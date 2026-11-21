import { useEffect, useRef, useState } from "react";
import { bookingPayload, formatParisTime, parisMinute, validateBooking } from "./booking";
import { appConfig } from "./config";
import { getText } from "./i18n";
import { draftBlock, draftLegs, driverLink, entriesOnDay, moveDay, parisDay, scheduleContext } from "./schedule";

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
  const t = (key) => getText(language, key);
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
          <ul className="stack">
            {context.gaps.map(({ prior, next, minutes }) => (
              <li key={prior.id + "-" + next.id}>
                {prior.endKnown && <>{formatParisTime(prior.end, language)} → </>}
                {formatParisTime(next.start, language)} ·{" "}
                {minutes === null ? t("schedule.travelUnknown") :
                  minutes + " " + t("units.minuteShort") + " " + t("schedule.travelAvailable")}
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

export function DriverDay({ schedule, day, today, language, layout, onRemove }) {
  const [now, setNow] = useState(() => Date.now());
  const [removing, setRemoving] = useState("");
  const t = (key) => getText(language, key);

  useEffect(() => {
    const timer = window.setInterval(() => setNow(Date.now()), 60000);
    return () => window.clearInterval(timer);
  }, []);

  const entries = entriesOnDay(schedule, day);
  const next = schedule.find((entry) => entry.ride && entry.start >= now);
  const separateNext = layout === "dark" && entries.includes(next);
  const remaining = separateNext ? entries.filter((entry) => entry !== next) : entries;
  async function remove(id) {
    if (!window.confirm(t("schedule.confirmRemove"))) return;
    setRemoving(id);
    try {
      await onRemove(id);
    } finally {
      setRemoving("");
    }
  }

  function card(entry, highlighted) {
    return (
      <li className={"panel stack" + (highlighted ? " next-ride" : "")} key={entry.id}>
        {highlighted && <strong>{t("schedule.nextPickup")}</strong>}
        <EntryText entry={entry} language={language} />
        {entry.ride ? (
          <>
            <span>{entry.ride.passenger_name} · <a href={"tel:" + entry.ride.passenger_phone.replace(/[^+\d]/g, "")}>{entry.ride.passenger_phone}</a></span>
            <div className="actions">
              <a className="button" href={driverLink(day, { ride: entry.ride.reference })}>{t("driver.detail")} {entry.ride.reference}</a>
              {highlighted && <a className="button" href={"https://www.google.com/maps/dir/?api=1&destination=" + encodeURIComponent(entry.pickup)}
                target="_blank" rel="noreferrer">{t("driver.directions")}</a>}
            </div>
          </>
        ) : (
          <button className="button" type="button" disabled={Boolean(removing)} onClick={() => remove(entry.id)}>{t("schedule.removeBlock")}</button>
        )}
      </li>
    );
  }

  return (
    <section className="driver-list" aria-labelledby="day-heading">
      <h2 id="day-heading">{t("schedule.dayView")}</h2>
      <div className="schedule-date schedule-controls">
        {day > today && <a className="button" href={driverLink(moveDay(day, -1))} aria-label={t("schedule.previous")}>‹</a>}
        <label className="field">
          {t("schedule.parisDay")}
          <input type="date" value={day} min={today} max="9999-12-30" onChange={(event) => {
            if (event.currentTarget.validity.valid && event.currentTarget.value) {
              window.location.assign(driverLink(event.currentTarget.value));
            }
          }} />
        </label>
        {day < "9999-12-30" && <a className="button" href={driverLink(moveDay(day, 1))} aria-label={t("schedule.nextDay")}>›</a>}
      </div>
      <div className="actions schedule-controls">
        <a className="button primary" href={driverLink(day, { new: "" })}>{t("schedule.addRide")}</a>
        <a className="button" href={driverLink(day, { block: "" })}>{t("schedule.addBlock")}</a>
      </div>
      {next && !entries.includes(next) && (
        <div className="panel stack next-ride schedule-controls">
          <strong>{t("schedule.nextPickup")}</strong>
          <EntryText entry={next} language={language} />
          <a className="button" href={driverLink(parisDay(next.start))}>{t("schedule.openDay")}</a>
        </div>
      )}
      {separateNext && <ul className="ride-list">{card(next, true)}</ul>}
      {separateNext && remaining.length > 0 && <h3 className="schedule-controls">{t("schedule.otherEntries")}</h3>}
      {remaining.length > 0 && <ul className="ride-list">{remaining.map((entry) => card(entry, entry === next))}</ul>}
      {entries.length === 0 && <p>{t("schedule.dayEmpty")}</p>}
    </section>
  );
}

function initialDraft(day, ride) {
  const [pickupDate, pickupTime] = ride ? parisMinute(ride.pickup_at).split("T") : [day, ""];
  const [returnDate, returnTime] = ride?.return_at ? parisMinute(ride.return_at).split("T") : ["", ""];
  return {
    pickup: ride?.pickup ?? "", destination: ride?.destination ?? "",
    pickupDate, pickupTime, returnDate, returnTime, roundTrip: Boolean(ride?.return_at),
    passengers: String(ride?.passengers ?? 1), customerName: ride?.passenger_name ?? "",
    customerPhone: ride?.passenger_phone ?? "", notes: ride?.passenger_notes ?? "",
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

export function ScheduleEditor({ ride, schedule, day, language, rpc, refresh, refreshed }) {
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
    setDraft((current) => ({ ...current, [name]: type === "checkbox" ? checked : value }));
    setErrors((current) => ({ ...current, [name]: "" }));
    setNotice("");
  }

  async function save(event) {
    event.preventDefault();
    if (prevented || writing.current) return;
    const validation = validateBooking(draft, capacity);
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
        window.location.assign(driverLink(payload.pickup_time.slice(0, 10), { ride: ride.reference, saved: "" }));
      } else {
        attempt.current ??= { p_request_key: crypto.randomUUID(), p_source: draft.source, p_trip: { ...payload, estimated_minutes: minutes } };
        const saved = await rpc("save_ride", attempt.current);
        window.location.assign(driverLink(payload.pickup_time.slice(0, 10), { ride: saved.reference, saved: "" }));
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
              {field("passengers", "planner.labels.passengers", { type: "number", min: 1, max: capacity })}
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
      window.location.assign(driverLink(times.start.slice(0, 10), { saved: "" }));
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

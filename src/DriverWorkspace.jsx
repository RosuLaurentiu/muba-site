import { createClient } from "@supabase/supabase-js";
import { useEffect, useRef, useState } from "react";
import BookingDetails from "./BookingDetails";
import { BlockEditor, DriverDay, ScheduleEditor, SchedulePreview } from "./DriverSchedule";
import { formatParisTime, getBookingConfig, getParisInstant } from "./booking";
import { getText } from "./i18n";
import { driverLink, parisDay, plannedSchedule, rideLegs, scheduleContext } from "./schedule";

const config = getBookingConfig();
const client = config && createClient(config.url, config.key, {
  auth: { storageKey: "muba-driver-session", detectSessionInUrl: false }
});
const pageSize = 100;

async function driverRpc(name, args) {
  const { data, error } = await client.rpc(name, args);
  if (error) throw error;
  return data;
}

async function loadRows(name, signal) {
  const rows = new Map();
  for (let from = 0; ; from += pageSize) {
    const { data, error } = await client.rpc(name).range(from, from + pageSize - 1).abortSignal(signal);
    if (error) throw error;
    for (const row of data) rows.set(row.reference ?? row.id, row);
    if (data.length < pageSize) return [...rows.values()];
  }
}

function toWhatsAppNumber(phone) {
  const digits = phone.replace(/\D/g, "");
  if (digits.startsWith("00")) return digits.slice(2);
  if (digits.length === 10 && digits.startsWith("0")) return "33" + digits.slice(1);
  return digits;
}

function PendingList({ rides, language, day }) {
  const t = (key) => getText(language, key);
  return (
    <section className="driver-list" id="pending" aria-labelledby="pending-heading">
      <h2 id="pending-heading">{t("driver.pending")}</h2>
      {rides.length ? (
        <ul className="ride-list">
          {rides.map((ride) => (
            <li className="panel stack" key={ride.reference}>
              <strong>{formatParisTime(ride.pickup_at, language)}</strong>
              <p>{ride.pickup} → {ride.destination}</p>
              <a className="button" href={driverLink(day, { ride: ride.reference })}>
                {t("driver.detail")} {ride.reference}
              </a>
            </li>
          ))}
        </ul>
      ) : <p>{t("driver.pendingEmpty")}</p>}
    </section>
  );
}

function RideDetail({ ride, language, onChanged, notice, setNotice, refreshing, schedule, day }) {
  const [busy, setBusy] = useState(false);
  const [estimate, setEstimate] = useState(ride.estimated_minutes ?? "");
  const changing = useRef(false);
  const heading = useRef(null);
  const t = (key) => getText(language, key);
  const minutes = estimate === "" ? null : Number(estimate);
  const durationValid = minutes === null || (Number.isInteger(minutes) && minutes >= 1 && minutes <= 1440);
  const context = scheduleContext(rideLegs(ride, durationValid ? minutes : null), schedule, ride.reference);
  const hasConflict = context.legsOverlap || context.conflicts.length > 0;

  useEffect(() => {
    if (ride.status !== "pending" && notice) heading.current?.focus();
  }, [ride.status, notice]);

  async function decide(status) {
    if (changing.current) return;
    if (status === "confirmed" && (hasConflict || !durationValid)) return;
    if (status === "cancelled" && !window.confirm(t("schedule.confirmCancel"))) return;
    changing.current = true;
    setBusy(true);
    setNotice("");
    try {
      const saved = await driverRpc("change_ride", {
        p_reference: ride.reference, p_version: ride.version, p_status: status,
        ...(status === "confirmed" ? { p_schedule: { estimated_minutes: minutes } } : {})
      });
      onChanged(saved);
      setNotice("driver.decisionSaved");
    } catch (error) {
      setNotice(error.message === "SCHEDULE_CONFLICT" ? "schedule.conflictChanged" :
        error.code === "PT409" ? "driver.staleDecision" : "driver.decisionFailed");
      onChanged();
    } finally {
      changing.current = false;
      setBusy(false);
    }
  }

  return (
    <>
      <h1 ref={heading} tabIndex={-1}>{t("driver.detail")} {ride.reference}</h1>
      <div className="panel stack">
        <strong>{t("booking.state." + ride.status)}</strong>
        <BookingDetails rows={[
          [t("planner.labels.pickup"), ride.pickup],
          [t("planner.labels.destination"), ride.destination],
          [t("booking.pickupAt"), formatParisTime(ride.pickup_at, language)],
          ...(ride.return_at ? [[t("booking.returnAt"), formatParisTime(ride.return_at, language)]] : []),
          [t("planner.labels.passengers"), ride.passengers],
          [t("planner.labels.name"), ride.passenger_name],
          [t("planner.labels.phone"), ride.passenger_phone],
          ...(ride.passenger_notes ? [[t("planner.labels.notes"), ride.passenger_notes]] : []),
          ...(ride.driver_notes ? [[t("driver.notes"), ride.driver_notes]] : [])
        ]} />
        <div className="actions">
          <a className="button" href={"tel:" + ride.passenger_phone.replace(/[^+\d]/g, "")}>{t("driver.call")}</a>
          <a className="button" href={"https://wa.me/" + toWhatsAppNumber(ride.passenger_phone)} target="_blank" rel="noreferrer">
            {t("nav.whatsApp")}
          </a>
          <a className="button" href={"https://www.google.com/maps/dir/?api=1&destination=" + encodeURIComponent(ride.pickup)}
            target="_blank" rel="noreferrer">{t("driver.directions")}</a>
        </div>
      </div>
      {ride.status === "pending" && (
        <>
          <div className="field form-submit schedule-duration">
            <label htmlFor="accept-duration">{t("schedule.duration")}</label>
            <input id="accept-duration" type="number" min="1" max="1440" value={estimate}
              onChange={(event) => setEstimate(event.target.value)} disabled={busy}
              aria-invalid={durationValid ? undefined : true} aria-describedby={durationValid ? undefined : "accept-duration-error"} />
            {!durationValid && <span id="accept-duration-error" className="field-error">{t("schedule.durationInvalid")}</span>}
          </div>
          <SchedulePreview context={context} language={language} />
          <div className="actions form-submit">
            <button className="button primary" type="button" disabled={busy || refreshing || hasConflict || !durationValid}
              onClick={() => decide("confirmed")}>{t("driver.accept")}</button>
            <button className="button" type="button" disabled={busy || refreshing} onClick={() => decide("declined")}>{t("driver.decline")}</button>
          </div>
        </>
      )}
      {ride.status === "confirmed" && (
        <div className="actions form-submit">
          <a className="button" href={driverLink(day, { ride: ride.reference, edit: "" })}>{t("schedule.reschedule")}</a>
          <button className="button" type="button" disabled={busy || refreshing} onClick={() => decide("cancelled")}>{t("schedule.cancelRide")}</button>
        </div>
      )}
      <p className="driver-feedback" role="status">{notice && t(notice)}</p>
    </>
  );
}

function DriverRides({ session, language, layout }) {
  const [load, setLoad] = useState({ status: "loading", snapshot: false, rides: [], blocks: [] });
  const [revision, setRevision] = useState(0);
  const [notice, setNotice] = useState("");
  const t = (key) => getText(language, key);
  const [today] = useState(() => parisDay(new Date()));
  const query = new URLSearchParams(window.location.search);
  const date = query.get("day");
  const day = date && date >= today && date <= "9999-12-30" && getParisInstant(date + "T00:00") ? date : today;
  const selectedReference = query.get("ride");
  const editing = query.has("edit");
  const adding = query.has("new");
  const blocking = query.has("block");
  const subpage = Boolean(selectedReference || adding || blocking);
  const selected = load.rides.find((ride) => String(ride.reference) === selectedReference);
  const schedule = plannedSchedule(load.rides, load.blocks);
  const token = session.access_token;

  useEffect(() => {
    if (!token) return;
    const controller = new AbortController();
    Promise.all(["list_rides", "list_blocks"].map((name) => loadRows(name, controller.signal))).then(
      ([rides, blocks]) => { if (!controller.signal.aborted) setLoad({ status: "ready", snapshot: true, rides, blocks }); },
      (error) => {
        if (!controller.signal.aborted) {
          if (error.code === "42501") setLoad({ status: "denied", snapshot: false, rides: [], blocks: [] });
          else setLoad((current) => ({ ...current, status: "loadFailed" }));
        }
      }
    );
    return () => controller.abort();
  }, [revision, token]);

  function refresh() {
    setLoad((current) => ({ ...current, status: "loading" }));
    setRevision((current) => current + 1);
  }

  function onChanged(ride) {
    if (ride) {
      setLoad((current) => ({
        ...current,
        rides: current.rides.map((entry) => entry.reference === ride.reference ? ride : entry)
      }));
    } else {
      refresh();
    }
  }

  async function removeBlock(id) {
    try {
      await driverRpc("remove_block", { p_id: id });
      setLoad((current) => ({ ...current, blocks: current.blocks.filter((block) => block.id !== id) }));
      setNotice("schedule.removed");
    } catch {
      setNotice("schedule.saveFailed");
      refresh();
    }
  }

  const ready = load.status === "ready";
  const haveData = load.snapshot;
  const editor = { schedule, day, language, rpc: driverRpc, refresh, refreshed: ready };
  return (
    <>
      <div className="actions driver-nav">
        {subpage && <a className="button" href={driverLink(day)}>{t("driver.back")}</a>}
        <button className="button" type="button" disabled={load.status === "loading"} onClick={refresh}>{t("booking.refresh")}</button>
      </div>
      {load.status === "loadFailed" && haveData && <p role="status">{t("driver.loadFailed")}</p>}
      {haveData && blocking ? (
        <BlockEditor {...editor} />
      ) : haveData && adding ? (
        <ScheduleEditor {...editor} />
      ) : selected && editing && selected.status === "confirmed" ? (
        <ScheduleEditor {...editor} ride={selected} />
      ) : selected ? (
        <RideDetail ride={selected} language={language} onChanged={onChanged} setNotice={setNotice}
          notice={notice || (query.has("saved") ? "schedule.saved" : "")} refreshing={!ready} schedule={schedule} day={day} />
      ) : (
        <>
          <h1>{t("driver.title")}</h1>
          {haveData && !subpage ? (
            <>
              <p className="driver-feedback" role="status">{notice ? t(notice) : query.has("saved") ? t("schedule.saved") : ""}</p>
              <div className="booking-grid">
                <DriverDay schedule={schedule} day={day} today={today} language={language} layout={layout} onRemove={removeBlock} />
                <PendingList rides={load.rides.filter((ride) => ride.status === "pending")} language={language} day={day} />
              </div>
            </>
          ) : <p role="status">{t("driver." + (ready ? "notFound" : load.status))}</p>}
        </>
      )}
    </>
  );
}

export default function DriverWorkspace({ language, layout }) {
  const [session, setSession] = useState(undefined);
  const [busy, setBusy] = useState(false);
  const [errorKey, setErrorKey] = useState("");
  const t = (key) => getText(language, key);

  useEffect(() => {
    if (!client) return;
    const { data } = client.auth.onAuthStateChange((_event, nextSession) => setSession(nextSession));
    return () => data.subscription.unsubscribe();
  }, []);

  async function signIn(event) {
    event.preventDefault();
    setBusy(true);
    setErrorKey("");
    const form = event.currentTarget;
    const values = new FormData(form);
    try {
      const { error } = await client.auth.signInWithPassword({
        email: String(values.get("email")).trim(), password: String(values.get("password"))
      });
      if (error) throw error;
      form.reset();
    } catch {
      setErrorKey("driver.signInFailed");
    } finally {
      setBusy(false);
    }
  }

  async function signOut() {
    setBusy(true);
    setErrorKey("");
    try {
      const { error } = await client.auth.signOut({ scope: "local" });
      if (error) throw error;
    } catch {
      setErrorKey("driver.signOutFailed");
    } finally {
      setBusy(false);
    }
  }

  return (
    <main className="site-main">
      {!client || session === undefined ? (
        <>
          <h1>{t("driver.title")}</h1>
          <p role="status">{t(client ? "driver.loading" : "driver.unavailable")}</p>
        </>
      ) : session ? (
        <>
          <button className="button driver-sign-out" type="button" onClick={signOut} disabled={busy}>{t("driver.signOut")}</button>
          <DriverRides key={session.user.id} session={session} language={language} layout={layout} />
        </>
      ) : (
        <>
          <h1>{t("driver.signIn")}</h1>
          <form className="panel stack driver-auth" onSubmit={signIn}>
            <div className="field"><label htmlFor="driver-email">{t("footer.email")}</label>
              <input id="driver-email" name="email" type="email" autoComplete="username" required />
            </div>
            <div className="field"><label htmlFor="driver-password">{t("driver.password")}</label>
              <input id="driver-password" name="password" type="password" autoComplete="current-password" required />
            </div>
            <button className="button primary" type="submit" disabled={busy}>{t("driver.signIn")}</button>
          </form>
        </>
      )}
      {errorKey && <p className="field-error form-submit" role="alert">{t(errorKey)}</p>}
    </main>
  );
}

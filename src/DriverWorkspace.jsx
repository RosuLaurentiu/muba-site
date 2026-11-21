import { createClient } from "@supabase/supabase-js";
import { useEffect, useRef, useState } from "react";
import BookingDetails from "./BookingDetails";
import { formatParisTime, getBookingConfig } from "./booking";
import { getText } from "./i18n";

const config = getBookingConfig();
const client = config && createClient(config.url, config.key, {
  auth: { storageKey: "muba-driver-session", detectSessionInUrl: false }
});
const pageSize = 100;

async function loadRides(signal) {
  const rides = new Map();
  for (let from = 0; ; from += pageSize) {
    const { data, error } = await client.rpc("list_rides").range(from, from + pageSize - 1).abortSignal(signal);
    if (error) throw error;
    for (const ride of data) rides.set(ride.reference, ride);
    if (data.length < pageSize) return [...rides.values()];
  }
}

function toWhatsAppNumber(phone) {
  const digits = phone.replace(/\D/g, "");
  if (digits.startsWith("00")) return digits.slice(2);
  if (digits.length === 10 && digits.startsWith("0")) return "33" + digits.slice(1);
  return digits;
}

function RideList({ rides, language, kind }) {
  const t = (key) => getText(language, key);
  return (
    <section className="driver-list" id={kind} aria-labelledby={kind + "-heading"}>
      <h2 id={kind + "-heading"}>{t("driver." + kind)}</h2>
      {rides.length ? (
        <ul className="ride-list">
          {rides.map((ride) => (
            <li className="panel stack" key={ride.reference}>
              <strong>{formatParisTime(ride.pickup_at, language)}</strong>
              <p>{ride.pickup} → {ride.destination}</p>
              <a className="button" href={"?driver&ride=" + ride.reference}>
                {t("driver.detail")} {ride.reference}
              </a>
            </li>
          ))}
        </ul>
      ) : <p>{t("driver." + kind + "Empty")}</p>}
    </section>
  );
}

function RideDetail({ ride, language, onChanged, notice, setNotice, refreshing }) {
  const [busy, setBusy] = useState(false);
  const changing = useRef(false);
  const heading = useRef(null);
  const t = (key) => getText(language, key);

  useEffect(() => {
    if (ride.status !== "pending" && notice) heading.current?.focus();
  }, [ride.status, notice]);

  async function decide(status) {
    if (changing.current) return;
    changing.current = true;
    setBusy(true);
    setNotice("");
    try {
      const { data, error } = await client.rpc("change_ride", {
        p_reference: ride.reference, p_version: ride.version, p_status: status
      });
      if (error) throw error;
      onChanged(data);
      setNotice("driver.decisionSaved");
    } catch (error) {
      setNotice(error.code === "PT409" ? "driver.staleDecision" : "driver.decisionFailed");
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
        <div className="actions form-submit">
          <button className="button primary" type="button" disabled={busy || refreshing} onClick={() => decide("confirmed")}>{t("driver.accept")}</button>
          <button className="button" type="button" disabled={busy || refreshing} onClick={() => decide("declined")}>{t("driver.decline")}</button>
        </div>
      )}
      <p className="driver-feedback" role="status">{notice && t(notice)}</p>
    </>
  );
}

function DriverRides({ session, language }) {
  const [load, setLoad] = useState({ status: "loading", rides: [] });
  const [revision, setRevision] = useState(0);
  const [notice, setNotice] = useState("");
  const t = (key) => getText(language, key);
  const selectedReference = new URLSearchParams(window.location.search).get("ride");
  const selected = load.rides.find((ride) => String(ride.reference) === selectedReference);
  const token = session.access_token;

  useEffect(() => {
    if (!token) return;
    const controller = new AbortController();
    loadRides(controller.signal).then(
      (rides) => { if (!controller.signal.aborted) setLoad({ status: "ready", rides }); },
      (error) => {
        if (!controller.signal.aborted) setLoad({ status: error.code === "42501" ? "denied" : "loadFailed", rides: [] });
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

  return (
    <>
      <div className="actions driver-nav">
        {selectedReference && <a className="button" href="?driver">{t("driver.back")}</a>}
        <button className="button" type="button" disabled={load.status === "loading"} onClick={refresh}>{t("booking.refresh")}</button>
      </div>
      {selected ? (
        <RideDetail ride={selected} language={language} onChanged={onChanged} notice={notice} setNotice={setNotice}
          refreshing={load.status === "loading"} />
      ) : (
        <>
          <h1>{t("driver.title")}</h1>
          {load.status === "ready" && !selectedReference ? (
            <div className="booking-grid">
              <RideList rides={load.rides.filter((ride) => ride.status === "pending")} language={language} kind="pending" />
              <RideList rides={load.rides.filter((ride) => ride.status === "confirmed")} language={language} kind="confirmed" />
            </div>
          ) : <p role="status">{t("driver." + (load.status === "ready" ? "notFound" : load.status))}</p>}
        </>
      )}
    </>
  );
}

export default function DriverWorkspace({ language }) {
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
          <DriverRides key={session.user.id} session={session} language={language} />
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

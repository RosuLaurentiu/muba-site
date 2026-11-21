import { useEffect, useState } from "react";
import { getText } from "./i18n";
import { driverLink } from "./schedule";

async function status(client) {
  const { data, error } = await client.rpc("calendar_status");
  if (error) throw error;
  return data;
}

async function action(client, body) {
  const { data, error } = await client.functions.invoke("calendar-sync", { body });
  if (error) throw error;
  return data;
}

export default function CalendarPanel({ client, language, day, updateKey }) {
  const [calendar, setCalendar] = useState(null);
  const [identifier, setIdentifier] = useState("");
  const [busy, setBusy] = useState(false);
  const [revision, setRevision] = useState(0);
  const [notice, setNotice] = useState(() =>
    new URLSearchParams(window.location.search).get("calendar") === "failed" ? "calendar.connectionFailed" : ""
  );
  const t = (key) => getText(language, key);

  useEffect(() => {
    let alive = true;
    async function refresh() {
      try {
        const current = await status(client);
        if (!alive) return;
        setCalendar(current);
        if (current.calendar_id && current.outstanding.length) {
          await action(client, { action: "sync" });
          const latest = await status(client);
          if (alive) {
            setCalendar(latest);
            setNotice(latest.outstanding.some((ride) => ride.failed) ? "calendar.syncFailed" : "");
          }
        } else {
          setNotice((value) => value === "calendar.syncFailed" ? "" : value);
        }
      } catch {
        if (alive) setNotice("calendar.syncFailed");
      } finally {
        if (alive) setBusy(false);
      }
    }
    refresh();
    return () => { alive = false; };
  }, [client, revision, updateKey]);

  async function connect(event) {
    event.preventDefault();
    setBusy(true);
    setNotice("");
    try {
      const { url } = await action(client, { action: "authorize", calendar_id: (calendar?.calendar_id || identifier).trim() });
      const destination = new URL(url);
      if (destination.origin !== "https://accounts.google.com") throw new Error("CALENDAR_AUTH_URL_INVALID");
      window.location.assign(destination.href);
    } catch {
      setNotice("calendar.connectionFailed");
      setBusy(false);
    }
  }

  return (
    <details className="panel calendar-panel">
      <summary>
        <strong>{t("calendar.title")}</strong>
        <span className="muted" role="status">
          {calendar?.outstanding.length ? " · " + calendar.outstanding.length + " " + t("calendar.unsynced") : ""}
          {notice ? " · " + t(notice) : ""}
        </span>
      </summary>
      <div className="stack calendar-content">
        {calendar?.calendar_id && <p>{t("calendar.connected")} {calendar.calendar_id}</p>}
        {(calendar || notice === "calendar.syncFailed") && (
          <form className="stack" onSubmit={connect}>
            {calendar && !calendar.calendar_id && (
              <div className="field">
                <label htmlFor="calendar-id">{t("calendar.calendarId")}</label>
                <input id="calendar-id" type="text" required maxLength={300} value={identifier}
                  onChange={(event) => setIdentifier(event.target.value)} disabled={busy} />
              </div>
            )}
            <div className="actions">
              {calendar && <button className="button" type="submit" disabled={busy}>
                {t(calendar.calendar_id ? "calendar.reconnect" : "calendar.connect")}
              </button>}
              {(calendar?.calendar_id || notice === "calendar.syncFailed") && <button className="button primary" type="button" disabled={busy} onClick={() => {
                setBusy(true);
                setRevision((current) => current + 1);
              }}>{t("calendar.retry")}</button>}
            </div>
          </form>
        )}
        {!!calendar?.outstanding.length && (
          <ul className="calendar-queue">
            {calendar.outstanding.map((ride) => (
              <li key={ride.reference}>
                <a href={driverLink(day, { ride: ride.reference })}>{t("driver.detail")} {ride.reference}</a>
                {" · "}{t(ride.failed ? "calendar.failed" : "calendar.pending")}
              </li>
            ))}
          </ul>
        )}
      </div>
    </details>
  );
}

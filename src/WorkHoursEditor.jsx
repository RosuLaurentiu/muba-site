import { useState } from "react";
import { getText } from "./i18n";
import { driverLink, moveDay } from "./schedule";

export default function WorkHoursEditor({ current, day, language, rpc }) {
  const [revision] = useState(current.revision);
  const [draft, setDraft] = useState(() => Array.from({ length: 7 }, (_, index) => {
    const period = current.hours?.[index];
    return { working: Boolean(period), start: period?.[0] ?? "09:00", end: period?.[1] ?? "18:00" };
  }));
  const [busy, setBusy] = useState(false);
  const [notice, setNotice] = useState("");
  const t = (key) => getText(language, "schedule." + key);
  const weekday = new Intl.DateTimeFormat(language === "fr" ? "fr-FR" : "en-GB", { weekday: "long", timeZone: "UTC" });

  function update(index, values) {
    setDraft((days) => days.map((item, i) => i === index ? { ...item, ...values } : item));
    setNotice((currentNotice) => currentNotice === "invalidWorkHours" ? "" : currentNotice);
  }

  async function save(event) {
    event.preventDefault();
    if (busy) return;
    if (draft.some(({ working, start, end }) => working && start === end)) {
      setNotice("invalidWorkHours");
      return;
    }
    setBusy(true);
    setNotice("");
    try {
      const hours = draft.map(({ working, start, end }) => working ? [start, end] : null);
      await rpc("save_work_hours", { p_revision: revision, p_hours: hours });
      window.location.assign(driverLink(day, { saved: "hours" }) + "#day-heading");
    } catch (error) {
      setNotice(error.code === "PT409" ? "workHoursChanged" : "workHoursSaveFailed");
      setBusy(false);
    }
  }

  return (
    <form className="panel work-hours-form" onSubmit={save}>
      <p className="muted">{t("workHoursHelp")}</p>
      <fieldset className="schedule-fieldset" disabled={busy}>
        {draft.map(({ working, start, end }, index) => {
          const name = weekday.format(new Date(moveDay("2024-01-01", index) + "T12:00:00Z"));
          const previous = draft.at(index - 1);
          const overnight = previous.working && previous.end && previous.end !== "00:00" && previous.end < previous.start;
          return (
            <div className="work-hours-row" role="group" aria-label={name} key={name}>
              <label className="check">
                <input type="checkbox" checked={working} onChange={(event) => update(index, { working: event.target.checked })} />
                {name}
              </label>
              {working ? (
                <div className="time-pair">
                  <label className="field">
                    {t("workStart")}
                    <input type="time" required value={start} onChange={(event) => update(index, { start: event.target.value })} />
                  </label>
                  <label className="field">
                    {t("workEnd")}
                    {end && start && end < start && <span className="muted"> · {t("followingDay")}</span>}
                    <input type="time" required value={end} aria-invalid={notice === "invalidWorkHours" && start === end || undefined}
                      onChange={(event) => update(index, { end: event.target.value })} />
                  </label>
                </div>
              ) : <span className="muted">{overnight ? t("overnightUntil") + " " + previous.end : t("dayOff")}</span>}
            </div>
          );
        })}
      </fieldset>
      <p role="status" className="driver-feedback field-error">{notice && t(notice)}</p>
      <button className="button primary" type="submit" disabled={busy}>{t("saveWorkHours")}</button>
    </form>
  );
}

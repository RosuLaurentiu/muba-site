import { useState } from "react";
import { focusBookingError } from "./booking";
import { TimeField } from "./DateTimeFields";
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
    setNotice((currentNotice) => ["invalidWorkHours", "missingWorkHours"].includes(currentNotice) ? "" : currentNotice);
  }

  async function save(event) {
    event.preventDefault();
    if (busy) return;
    const invalidDay = draft.findIndex(({ working, start, end }) => working && (!start || !end || start === end));
    if (invalidDay >= 0) {
      const { start, end } = draft[invalidDay];
      const message = start && end ? "invalidWorkHours" : "missingWorkHours";
      focusBookingError(event.currentTarget, { [(start ? "work-end-" : "work-start-") + invalidDay]: message });
      setNotice(message);
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
    <form className="panel work-hours-form" onSubmit={save} noValidate>
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
                  <TimeField name={"work-start-" + index} label={t("workStart")} language={language} value={start}
                    onChange={(value) => update(index, { start: value })} disabled={busy}
                    errorId={notice === "missingWorkHours" && !start ? "work-hours-error" : undefined} />
                  <TimeField name={"work-end-" + index} label={t("workEnd")} language={language} value={end}
                    onChange={(value) => update(index, { end: value })} disabled={busy}
                    errorId={(notice === "invalidWorkHours" && start === end) || (notice === "missingWorkHours" && !end) ? "work-hours-error" : undefined}
                    hint={end && start && end < start ? t("followingDay") : ""} />
                </div>
              ) : <span className="muted">{overnight ? t("overnightUntil") + " " + previous.end : t("dayOff")}</span>}
            </div>
          );
        })}
      </fieldset>
      <p role="status" className="driver-feedback field-error" id="work-hours-error">{notice && t(notice)}</p>
      <div className="actions editor-actions">
        <button className="button primary" type="submit" disabled={busy}>{t(busy ? "saving" : "saveWorkHours")}</button>
        <a className="button" href={driverLink(day) + "#day-heading"} aria-disabled={busy}
          onClick={(event) => { if (busy) event.preventDefault(); }}>{t("discard")}</a>
      </div>
    </form>
  );
}

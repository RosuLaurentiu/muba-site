import {
  CalendarDay, CalendarGrid, CalendarHeading, CalendarNext, CalendarPrevious, CalendarWeekday,
  CalendarWeekdays, CalendarWeeks, DatePicker, DatePickerClear, DatePickerContent, DatePickerInput, DatePickerPreset, DatePickerTrigger
} from "@ui-sdk/react/date-picker";
import { TimeInput, TimeInputSegment } from "@ui-sdk/react/time-input";
import { getText } from "./i18n";
import { useParisDay } from "./useParisDay";

export function DateField({ name, label, language, value, onChange, disabled, error, max, allowClear = true }) {
  const today = useParisDay();
  const t = (key) => getText(language, key);
  return (
    <div className="field">
      <label htmlFor={name}>{label}</label>
      <DatePicker value={value || null} onValueChange={(next) => onChange(next ?? "")} disabled={disabled}
        locale={language === "fr" ? "fr-FR" : "en-GB"} timeZone="Europe/Paris" weekStartsOn={1} max={max} today={today}>
        <div className="date-control">
          <DatePickerInput id={name} data-booking-field={name} inputMode="numeric" placeholder={t("booking.dateFormat")}
            aria-invalid={error ? true : undefined} aria-describedby={error ? name + "-error" : undefined} />
          <DatePickerTrigger className="date-trigger" aria-label={t("booking.showCalendar") + " · " + label} />
        </div>
        <DatePickerContent className="date-popup" align="start" sideOffset={6} aria-label={label}>
          <div className="date-popup-heading">
            <CalendarPrevious className="date-month-arrow" aria-label={t("schedule.prevMonth")} />
            <CalendarHeading />
            <CalendarNext className="date-month-arrow" aria-label={t("schedule.nextMonth")} />
          </div>
          <CalendarGrid>
            <CalendarWeekdays>{(index) => <CalendarWeekday index={index} />}</CalendarWeekdays>
            <CalendarWeeks>{(cell) => <CalendarDay value={cell.date} />}</CalendarWeeks>
          </CalendarGrid>
          <div className="date-popup-actions">
            {allowClear && <DatePickerClear className="button">{t("booking.clearDate")}</DatePickerClear>}
            <DatePickerPreset className="button" value={today}>{t("schedule.today")}</DatePickerPreset>
          </div>
        </DatePickerContent>
      </DatePicker>
      {error && <span className="field-error" id={name + "-error"}>{error}</span>}
    </div>
  );
}

export function TimeField({ name, label, language, value, onChange, disabled, error, errorId, hint }) {
  const description = error ? name + "-error" : errorId;
  return (
    <div className="field">
      <label htmlFor={name} id={name + "-label"}>{label}{hint && <span className="muted"> · {hint}</span>}</label>
      <TimeInput value={value || null} onValueChange={(next) => onChange(next ?? "")} disabled={disabled}
        locale={language === "fr" ? "fr-FR" : "en-GB"} hourCycle={24} className="time-control"
        aria-labelledby={name + "-label"} aria-describedby={description}
        aria-invalid={description ? true : undefined}>
        {({ segments }) => segments.map((segment) => <TimeInputSegment key={segment.key} segment={segment}
          id={segment.type === "hour" ? name : undefined} data-booking-field={segment.type === "hour" ? name : undefined}
          placeholder={segment.type === "hour" ? "HH" : segment.type === "minute" ? "MM" : undefined} />)}
      </TimeInput>
      {error && <span className="field-error" id={name + "-error"}>{error}</span>}
    </div>
  );
}

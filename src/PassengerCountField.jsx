import { Select, SelectContent, SelectItem, SelectLabel, SelectTrigger, SelectValue } from "@ui-sdk/react/select";

export default function PassengerCountField({ capacity, label, value, onChange, error, disabled }) {
  const counts = Array.from({ length: capacity }, (_, index) => String(index + 1));

  return (
    <div className="field">
      <Select name="passengers" items={counts} value={value || null} required disabled={disabled}
        onValueChange={(next) => onChange(next ?? "")}>
        <SelectLabel className="passenger-count-label">{label}</SelectLabel>
        <SelectTrigger id="passengers" name="passengers" className="passenger-count-trigger"
          aria-invalid={error ? true : undefined} aria-describedby={error ? "passengers-error" : undefined}>
          <SelectValue />
        </SelectTrigger>
        <SelectContent className="passenger-count-menu" align="start" sideOffset={4}>
          {counts.map((count) => <SelectItem className="passenger-count-option" key={count} value={count}>{count}</SelectItem>)}
        </SelectContent>
      </Select>
      {error && <span className="field-error" id="passengers-error">{error}</span>}
    </div>
  );
}

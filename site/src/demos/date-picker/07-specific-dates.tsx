/** List days that can't be picked (`disabledDates`, like holidays), or the only days that can (`enabledDates`, like open slots). */
import { DatePicker } from '@sparkwire/core';

const holidays = [new Date(2026, 11, 25), new Date(2026, 11, 31)];
const slots = [new Date(2026, 11, 2), new Date(2026, 11, 4), new Date(2026, 11, 9), new Date(2026, 11, 11)];

export default function SpecificDates() {
  return (
    <div style={{ display: 'grid', gap: 16, width: '100%', maxWidth: 300 }}>
      <DatePicker label="Delivery" disabledDates={holidays} defaultValue={new Date(2026, 11, 24)} helperText="No deliveries on holidays" />
      <DatePicker label="Appointment" enabledDates={slots} helperText="Only open slots can be picked" />
    </div>
  );
}

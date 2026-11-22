/** Block dates that can't be chosen. Here: no weekends, and nothing in the past. */
import { DatePicker } from '@sparkwire/core';

export default function Rules() {
  return (
    <div style={{ width: 300 }}>
      <DatePicker label="Delivery day" min={new Date()} isDateDisabled={(d) => d.getDay() === 0 || d.getDay() === 6} helperText="Weekdays only" />
    </div>
  );
}

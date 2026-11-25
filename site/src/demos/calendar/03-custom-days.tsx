/** Draw extra content in day cells with `renderDay`, here a dot on days with events. Start the week on Monday with `firstDayOfWeek`. */
import { useState } from 'react';
import { Calendar } from '@sparkwire/core';

const busy = new Set([3, 9, 14, 21, 22]);

export default function CustomDays() {
  const [date, setDate] = useState<Date>(new Date(2026, 10, 14));
  return (
    <Calendar
      aria-label="Schedule"
      value={date}
      onChange={setDate}
      firstDayOfWeek="mon"
      showToday
      renderDay={(d, info) => (
        <span style={{ display: 'grid', justifyItems: 'center' }}>
          {info.formatted}
          {busy.has(d.getDate()) && <span aria-hidden="true" style={{ width: 4, height: 4, borderRadius: 2, background: 'currentColor' }} />}
        </span>
      )}
    />
  );
}

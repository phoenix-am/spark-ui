/** The value is `{ start, end }` with `Date`s. Limit the range with `min`, `max` and `isDateDisabled`. */
import { useState } from 'react';
import { DateRangePicker } from '@sparkwire/core';

export default function Controlled() {
  const [range, setRange] = useState<{ start: Date; end: Date } | null>(null);
  const nights = range ? Math.round((+range.end - +range.start) / 86_400_000) : 0;
  return (
    <div style={{ display: 'grid', gap: 12, width: '100%', maxWidth: 360 }}>
      <DateRangePicker label="Stay" value={range} onChange={setRange} min={new Date(2026, 0, 1)} isDateDisabled={(d) => d.getDate() === 25} />
      <output style={{ fontSize: 13, color: 'var(--spark-text-secondary)' }}>{range ? `${nights} nights` : 'Pick check-in and check-out'}</output>
    </div>
  );
}

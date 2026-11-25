/** `onChange` gets a `Date` (or `null` when cleared). Store it however you like. */
import { useState } from 'react';
import { DatePicker } from '@sparkwire/core';

export default function Controlled() {
  const [date, setDate] = useState<Date | null>(new Date(2026, 11, 24));
  return (
    <div style={{ display: 'grid', gap: 12, width: '100%', maxWidth: 300 }}>
      <DatePicker label="Ship by" value={date} onChange={setDate} min={new Date(2026, 0, 1)} max={new Date(2026, 11, 31)} clearable />
      <output style={{ fontSize: 13, color: 'var(--spark-text-secondary)' }}>{date ? date.toDateString() : 'No date'}</output>
    </div>
  );
}

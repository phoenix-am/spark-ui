/** `onChange` gives you a number, or `NaN` when the field is cleared. */
import { useState } from 'react';
import { NumberField } from '@sparkwire/core';

export default function Controlled() {
  const [seats, setSeats] = useState(5);
  return (
    <div style={{ display: 'grid', gap: 12, width: '100%', maxWidth: 240 }}>
      <NumberField label="Seats" value={seats} onChange={setSeats} min={1} max={50} />
      <output style={{ fontSize: 13, color: 'var(--spark-text-secondary)' }}>Total: ₹{(Number.isNaN(seats) ? 0 : seats * 499).toLocaleString('en-IN')} / month</output>
    </div>
  );
}

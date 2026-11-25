/** Values are 24-hour strings, whatever the display format. Rule out times with `isTimeDisabled`. */
import { useState } from 'react';
import { TimePicker } from '@sparkwire/core';

export default function Controlled() {
  const [time, setTime] = useState<string | null>('13:00');
  return (
    <div style={{ display: 'grid', gap: 12, width: '100%', maxWidth: 240 }}>
      <TimePicker label="Pickup" value={time} onChange={setTime} step={30} isTimeDisabled={(t) => t >= '13:00' && t < '14:00'} helperText="Closed for lunch 1–2 pm" clearable />
      <output style={{ fontSize: 13, color: 'var(--spark-text-secondary)' }}>Stored value: {time ?? 'none'}</output>
    </div>
  );
}

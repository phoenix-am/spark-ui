/** `onChange` fires while dragging; `onChangeEnd` fires once when you let go, which is the moment to save or fetch. */
import { useState } from 'react';
import { Slider } from '@sparkwire/core';

export default function Events() {
  const [value, setValue] = useState(40);
  const [saved, setSaved] = useState(40);
  return (
    <div style={{ display: 'grid', gap: 12, width: '100%', maxWidth: 320 }}>
      <Slider label="Volume" value={value} onChange={(v) => setValue(v as number)} onChangeEnd={(v) => setSaved(v as number)} formatValue={(v) => `${v} dB`} />
      <output style={{ fontSize: 13, color: 'var(--spark-text-secondary)' }}>Live: {value} dB · Saved: {saved} dB</output>
    </div>
  );
}

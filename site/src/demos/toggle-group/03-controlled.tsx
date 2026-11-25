/** Drive other UI from the selection. In single mode `onChange` gets a value (or `null` if deselected). */
import { useState } from 'react';
import { ToggleGroup, ToggleGroupItem } from '@sparkwire/core';

export default function Controlled() {
  const [align, setAlign] = useState<string>('start');
  return (
    <div style={{ display: 'grid', gap: 12, width: '100%', maxWidth: 320 }}>
      <ToggleGroup aria-label="Text alignment" variant="outlined" value={align} onChange={(v) => v && setAlign(v as string)}>
        <ToggleGroupItem value="start">Left</ToggleGroupItem>
        <ToggleGroupItem value="center">Centre</ToggleGroupItem>
        <ToggleGroupItem value="end">Right</ToggleGroupItem>
      </ToggleGroup>
      <p style={{ margin: 0, textAlign: align as 'start' | 'center' | 'end' }}>The quick brown fox jumps over the lazy dog.</p>
    </div>
  );
}

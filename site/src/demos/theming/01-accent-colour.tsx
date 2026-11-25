/** Change the energy colour and every component follows: buttons, focus rings, switches, charts. Here a nested `ThemeProvider` re-themes just this box. */
import { useState } from 'react';
import { ThemeProvider } from '@sparkwire/system';
import { ToggleGroup, ToggleGroupItem, Button, Switch, Slider, Badge } from '@sparkwire/core';

const accents = {
  Volt: '#FFD60A',
  Ocean: '#3AF2FF',
  Plasma: '#C77DFF',
  Mint: '#4ADE80',
};

export default function AccentColour() {
  const [name, setName] = useState<keyof typeof accents>('Ocean');
  const colour = accents[name];
  return (
    <div style={{ display: 'grid', gap: 16, width: 360 }}>
      <ToggleGroup aria-label="Accent colour" value={name} onChange={(v) => v && setName(v as keyof typeof accents)}>
        {Object.keys(accents).map((a) => (
          <ToggleGroupItem key={a} value={a}>{a}</ToggleGroupItem>
        ))}
      </ToggleGroup>
      <ThemeProvider theme={{ energy: { current: colour, ink: colour }, tones: { brand: { fill: colour, ink: colour } } }}>
        <div style={{ display: 'grid', gap: 16, padding: 16, borderRadius: 12, border: '1px solid var(--spark-surface-border)' }}>
          <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
            <Button>Primary</Button>
            <Button variant="outlined">Secondary</Button>
            <Badge variant="soft" led>Live</Badge>
          </div>
          <Switch label="Notifications" defaultChecked />
          <Slider label="Volume" defaultValue={60} />
        </div>
      </ThemeProvider>
    </div>
  );
}

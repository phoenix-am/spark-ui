/** Turn it up and down. The same components, from no motion at all to fully charged. */
import { useState } from 'react';
import { SparkProvider, ToggleGroup, ToggleGroupItem, Button, Switch, Card } from '@sparkwire/core';

type Energy = 'off' | 'calm' | 'default' | 'electric';

export default function Dial() {
  const [energy, setEnergy] = useState<Energy>('electric');
  return (
    <div style={{ display: 'grid', gap: 16, justifyItems: 'center' }}>
      <ToggleGroup aria-label="Energy" size="small" value={energy} onChange={(v) => v && setEnergy(v as Energy)}>
        <ToggleGroupItem value="off">Off</ToggleGroupItem>
        <ToggleGroupItem value="calm">Calm</ToggleGroupItem>
        <ToggleGroupItem value="default">Default</ToggleGroupItem>
        <ToggleGroupItem value="electric">Electric</ToggleGroupItem>
      </ToggleGroup>
      <SparkProvider energy={energy}>
        <Card padding="large" live>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12, alignItems: 'center' }}>
            <Button>Click for sparks</Button>
            <Button variant="outlined">Hover me</Button>
            <Switch label="Power" defaultChecked showBulb />
          </div>
        </Card>
      </SparkProvider>
    </div>
  );
}

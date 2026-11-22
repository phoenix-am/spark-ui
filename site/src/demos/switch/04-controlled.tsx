/** Hold the state yourself when other parts of the page need to react to it. */
import { useState } from 'react';
import { Switch, Badge } from '@sparkwire/core';

export default function Controlled() {
  const [paused, setPaused] = useState(false);
  return (
    <>
      <Switch label="Maintenance mode" checked={paused} onChange={setPaused} />
      <Badge tone={paused ? 'warning' : 'success'} variant="soft" led>
        {paused ? 'Site is offline' : 'Site is live'}
      </Badge>
    </>
  );
}

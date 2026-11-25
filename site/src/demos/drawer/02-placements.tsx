/** Open from any edge. A bottom drawer works well as a sheet on phones; set `dismissable={false}` when people must choose an action. */
import { useState } from 'react';
import { Drawer, Button } from '@sparkwire/core';

type Edge = 'start' | 'end' | 'top' | 'bottom';

export default function Placements() {
  const [edge, setEdge] = useState<Edge | null>(null);
  return (
    <>
      {(['start', 'end', 'top', 'bottom'] as Edge[]).map((e) => (
        <Button key={e} variant="outlined" onClick={() => setEdge(e)}>
          {e}
        </Button>
      ))}
      <Drawer open={edge !== null} onClose={() => setEdge(null)} placement={edge ?? 'end'} size="small" title={`From the ${edge}`} closeButton>
        Content slides in from this edge.
      </Drawer>
    </>
  );
}

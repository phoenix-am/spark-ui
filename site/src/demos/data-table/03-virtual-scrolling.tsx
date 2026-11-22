/** Ten thousand rows, rendered a screenful at a time. Scrolling stays smooth and the keyboard still reaches every row. */
import { DataTable } from '@sparkwire/core';

const rows = Array.from({ length: 10000 }, (_, i) => ({ id: i, event: `deploy #${10000 - i}`, region: ['Mumbai', 'Frankfurt', 'Virginia'][i % 3], ms: 80 + ((i * 37) % 400) }));

export default function VirtualScrolling() {
  return (
    <DataTable
      aria-label="Deploy log"
      data={rows}
      virtualize
      maxHeight={360}
      columns={[
        { key: 'event', header: 'Event' },
        { key: 'region', header: 'Region' },
        { key: 'ms', header: 'Duration (ms)', sortable: true },
      ]}
    />
  );
}

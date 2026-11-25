/** Hold the selection yourself with `selectedKeys` and `onSelectionChange`, here to choose visible columns. */
import { useState } from 'react';
import { Menu, Button } from '@sparkwire/core';

export default function ControlledSelection() {
  const [cols, setCols] = useState<Set<string>>(new Set(['name', 'status']));
  return (
    <div style={{ display: 'grid', gap: 12, justifyItems: 'center' }}>
      <Menu
        label="Columns"
        selectionMode="multiple"
        selectedKeys={cols}
        onSelectionChange={setCols}
        closeOnSelect={false}
        placement="bottom start"
        trigger={<Button variant="outlined">Columns ({cols.size})</Button>}
        items={[
          { key: 'name', label: 'Name' },
          { key: 'status', label: 'Status' },
          { key: 'owner', label: 'Owner' },
          { key: 'updated', label: 'Last updated' },
        ]}
      />
      <output style={{ fontSize: 13, color: 'var(--spark-text-secondary)' }}>Showing: {[...cols].join(', ') || 'nothing'}</output>
    </div>
  );
}

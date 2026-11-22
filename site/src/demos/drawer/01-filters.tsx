/** A panel that slides in from the edge, for filters, details or a quick form, without losing the page behind it. */
import { useState } from 'react';
import { Drawer, Button, Checkbox } from '@sparkwire/core';

export default function Filters() {
  const [open, setOpen] = useState(false);
  return (
    <>
      <Button variant="outlined" onClick={() => setOpen(true)}>Filters</Button>
      <Drawer
        open={open}
        onClose={() => setOpen(false)}
        title="Filters"
        description="Narrow down the list."
        actions={<Button onClick={() => setOpen(false)}>Apply</Button>}
      >
        <div style={{ display: 'grid', gap: 12 }}>
          <Checkbox label="Live" defaultChecked />
          <Checkbox label="Building" />
          <Checkbox label="Failed" />
        </div>
      </Drawer>
    </>
  );
}

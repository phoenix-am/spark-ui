/** One shortcut to reach anything in your app. Try ⌘K (or Ctrl+K) right here. This site's search is the same component. */
import { useState } from 'react';
import { CommandPalette, Button } from '@sparkwire/core';

export default function Basic() {
  const [open, setOpen] = useState(false);
  return (
    <>
      <Button variant="outlined" onClick={() => setOpen(true)}>Open command palette</Button>
      <CommandPalette
        open={open}
        onOpenChange={setOpen}
        hotkey={false}
        items={[
          { heading: 'Navigate', items: [{ id: 'home', label: 'Dashboard' }, { id: 'projects', label: 'Projects' }, { id: 'billing', label: 'Billing', keywords: ['invoice', 'payment'] }] },
          { heading: 'Actions', items: [{ id: 'new', label: 'New project', shortcut: '⌘N' }, { id: 'invite', label: 'Invite teammate' }] },
        ]}
      />
    </>
  );
}

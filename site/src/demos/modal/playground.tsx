import { useState } from 'react';
import { Modal, Button } from '@sparkwire/core';
import type { PlaygroundConfig } from '../../lib/demos';

function Demo(props: React.ComponentProps<typeof Modal>) {
  const [open, setOpen] = useState(false);
  return (
    <>
      <Button onClick={() => setOpen(true)}>Open modal</Button>
      <Modal {...props} open={open} onClose={() => setOpen(false)} actions={<Button onClick={() => setOpen(false)}>Got it</Button>} />
    </>
  );
}

export default {
  component: Demo,
  name: 'Modal',
  props: { title: 'Invite your team', description: 'They will get an email with a link to join.', size: 'medium', closeOnBackdrop: true },
} satisfies PlaygroundConfig;

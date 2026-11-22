/** Give people the next step right where they read the message. */
import { useState } from 'react';
import { Alert, Button } from '@sparkwire/core';

export default function WithAction() {
  const [open, setOpen] = useState(true);
  if (!open) return <Button variant="text" onClick={() => setOpen(true)}>Show it again</Button>;
  return (
    <div style={{ width: '100%', maxWidth: 520 }}>
      <Alert tone="warning" title="Your trial ends in 3 days" action={<Button size="small">Upgrade</Button>} onDismiss={() => setOpen(false)}>
        Keep your projects running by choosing a plan.
      </Alert>
    </div>
  );
}

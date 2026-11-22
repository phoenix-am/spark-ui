/** For decisions that need full attention. Focus stays inside until it closes, then goes back where it came from. */
import { useState } from 'react';
import { Modal, Button } from '@sparkwire/core';

export default function Confirm() {
  const [open, setOpen] = useState(false);
  return (
    <>
      <Button color="error" variant="outlined" onClick={() => setOpen(true)}>Delete project</Button>
      <Modal
        open={open}
        onClose={() => setOpen(false)}
        title="Delete this project?"
        description="All deployments, domains and logs will be removed. This can't be undone."
        actions={
          <>
            <Button variant="text" onClick={() => setOpen(false)}>Cancel</Button>
            <Button color="error" onClick={() => setOpen(false)}>Delete</Button>
          </>
        }
      />
    </>
  );
}

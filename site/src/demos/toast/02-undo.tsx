/** Add an action when there's something useful to do next, like undoing a delete. */
import { ToastProvider, useToast, Button } from '@sparkwire/core';

function Archive() {
  const { toast } = useToast();
  return <Button onClick={() => toast({ title: 'Email archived', action: { label: 'Undo', onClick: () => {} } })}>Archive</Button>;
}

export default function Undo() {
  return (
    <ToastProvider>
      <Archive />
    </ToastProvider>
  );
}

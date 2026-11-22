/** Quick notes that confirm something happened and get out of the way. Screen readers hear them without losing their place. */
import { ToastProvider, useToast, Button } from '@sparkwire/core';

function Buttons() {
  const { toast } = useToast();
  return (
    <>
      <Button onClick={() => toast({ title: 'Saved', tone: 'success' })}>Success</Button>
      <Button variant="outlined" onClick={() => toast({ title: 'High load', description: 'CPU at 92%.', tone: 'warning' })}>Warning</Button>
      <Button variant="outlined" color="error" onClick={() => toast({ title: 'Upload failed', description: 'Check your connection and try again.', tone: 'error' })}>Error</Button>
    </>
  );
}

export default function Tones() {
  return (
    <ToastProvider>
      <Buttons />
    </ToastProvider>
  );
}

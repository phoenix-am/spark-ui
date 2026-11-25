/** Keep important toasts up longer with `duration` (milliseconds). */
import { ToastProvider, useToast, Button } from '@sparkwire/core';

function Trigger() {
  const { toast } = useToast();
  return (
    <>
      <Button variant="outlined" onClick={() => toast({ title: 'Copied', duration: 2000 })}>Short (2 s)</Button>
      <Button variant="outlined" onClick={() => toast({ title: 'Export ready', description: 'Your CSV is in Downloads.', duration: 10000, tone: 'success' })}>Long (10 s)</Button>
    </>
  );
}

export default function Duration() {
  return (
    <ToastProvider>
      <Trigger />
    </ToastProvider>
  );
}

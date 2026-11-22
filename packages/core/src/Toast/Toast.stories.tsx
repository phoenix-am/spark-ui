import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { ToastProvider, useToast } from '.';
import { Button } from '../Button';

/**
 * Wrap your app in `ToastProvider`, then call `useToast().toast({...})` from
 * anywhere. The bottom bar discharges as the timer runs and pauses on hover.
 */
const meta: Meta<typeof ToastProvider> = {
  title: 'Overlays/Toast',
  component: ToastProvider,
  decorators: [(Story) => <ToastProvider><Story /></ToastProvider>],
};
export default meta;
type Story = StoryObj<typeof ToastProvider>;

function Triggers() {
  const { toast } = useToast();
  return (
    <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
      <Button color="success" onClick={() => toast({ title: 'Deployed', description: 'Your build is live.', tone: 'success' })}>Success</Button>
      <Button onClick={() => toast({ title: 'Draft saved', action: { label: 'Undo', onClick: () => {} } })}>With action</Button>
      <Button color="warning" variant="outlined" onClick={() => toast({ title: 'High load', description: 'CPU at 92%.', tone: 'warning' })}>Warning</Button>
      <Button color="error" variant="outlined" onClick={() => toast({ title: 'Short circuit', description: 'The build failed on step 3.', tone: 'error', duration: 0 })}>Error (stays)</Button>
    </div>
  );
}

export const Playground: Story = { render: () => <Triggers /> };

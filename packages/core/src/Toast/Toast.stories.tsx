import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { ThemeProvider } from '@spark-ui/system';
import { ToastProvider, useToast } from './Toast';
import { Button } from '../Button';

const meta: Meta = { title: 'Spark UI/Toast' };
export default meta;

const Triggers = () => {
  const { toast } = useToast();
  return (
    <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
      <Button onClick={() => toast({ title: 'Deployed', description: 'Your build is live.', tone: 'success' })}>Success</Button>
      <Button variant="outlined" onClick={() => toast({ title: 'Saved', action: { label: 'Undo', onClick: () => {} } })}>With action</Button>
      <Button color="error" onClick={() => toast({ title: 'Short circuit', description: 'The build failed.', tone: 'error', duration: 0 })}>Error</Button>
    </div>
  );
};

export const Base: StoryObj = {
  render: () => (
    <ThemeProvider>
      <ToastProvider>
        <Triggers />
      </ToastProvider>
    </ThemeProvider>
  ),
};

import type { Meta, StoryObj } from '@storybook/react';
import { fn } from '@storybook/test';
import { Alert } from '.';
import { Button } from '../Button';

/** Info, success, warning and error messages. Each tone has its own icon; errors are announced at once. */
const meta: Meta<typeof Alert> = {
  title: 'Feedback/Alert',
  component: Alert,
  args: { tone: 'info', title: 'New version available', children: 'Reload to get the latest features.' },
  argTypes: { tone: { control: 'inline-radio', options: ['info', 'success', 'warning', 'error'] }, variant: { control: 'inline-radio', options: ['soft', 'outlined', 'banner'] } },
  decorators: [(S) => <div style={{ maxWidth: 640 }}><S /></div>],
};
export default meta;
type Story = StoryObj<typeof Alert>;
export const Playground: Story = {};
export const Tones: Story = {
  render: () => (
    <div style={{ display: 'grid', gap: 12 }}>
      <Alert tone="info" title="Heads up">Maintenance on Sunday, 2–4 AM IST.</Alert>
      <Alert tone="success" title="Payment received">₹4,999 was added to your account.</Alert>
      <Alert tone="warning" title="Storage almost full">You've used 92% of 10 GB.</Alert>
      <Alert tone="error" title="Couldn't save">Check your connection and try again.</Alert>
    </div>
  ),
};
export const WithActions: Story = { args: { tone: 'warning', title: 'Your trial ends in 3 days', children: 'Upgrade to keep your projects.', action: <Button size="small">Upgrade</Button>, onDismiss: fn() } };
export const Outlined: Story = { args: { variant: 'outlined', tone: 'success', title: 'Deployed', children: 'spark-ui@0.4.0 is live.' } };
export const Banner: Story = { args: { variant: 'banner', tone: 'info', title: undefined, children: 'We have updated our terms of service.', onDismiss: fn() } };

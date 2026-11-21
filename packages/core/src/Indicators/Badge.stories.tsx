import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { Badge } from '.';

/** A status label with an LED. `pulse` means something is live. */
const meta: Meta<typeof Badge> = {
  title: 'Data display/Badge',
  component: Badge,
  args: { children: 'Live', tone: 'brand', variant: 'soft', led: true, pulse: true },
  argTypes: {
    tone: { control: 'inline-radio', options: ['brand', 'success', 'warning', 'error', 'neutral'] },
    variant: { control: 'inline-radio', options: ['soft', 'solid'] },
  },
};
export default meta;
type Story = StoryObj<typeof Badge>;

export const Playground: Story = {};
export const Tones: Story = {
  render: () => (
    <div style={{ display: 'grid', gap: 12 }}>
      {(['soft', 'solid'] as const).map((v) => (
        <div key={v} style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
          <Badge variant={v} pulse>Live</Badge>
          <Badge variant={v} tone="success">Online</Badge>
          <Badge variant={v} tone="warning">Degraded</Badge>
          <Badge variant={v} tone="error">Down</Badge>
          <Badge variant={v} tone="neutral">Draft</Badge>
        </div>
      ))}
    </div>
  ),
};
export const WithoutLed: Story = { args: { led: false, children: 'v2.4.0', tone: 'neutral' } };

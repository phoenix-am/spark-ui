import React, { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { fn } from '@storybook/test';
import { Switch } from '.';

/** A lever that closes a circuit and lights a bulb. Has the `switch` role. */
const meta: Meta<typeof Switch> = {
  title: 'Inputs/Switch',
  component: Switch,
  args: { label: 'Power', defaultChecked: true, onChange: fn() },
  argTypes: {
    color: { control: 'inline-radio', options: ['brand', 'success', 'warning', 'error'] },
    size: { control: 'inline-radio', options: ['small', 'medium', 'large'] },
  },
};
export default meta;
type Story = StoryObj<typeof Switch>;

export const Playground: Story = {};
export const Off: Story = { args: { label: 'Notifications', defaultChecked: false } };
export const Colors: Story = {
  render: (args) => (
    <div style={{ display: 'grid', gap: 12 }}>
      <Switch {...args} label="Brand" color="brand" />
      <Switch {...args} label="Success" color="success" />
      <Switch {...args} label="Warning" color="warning" />
      <Switch {...args} label="Error" color="error" />
    </div>
  ),
};
export const Sizes: Story = {
  render: (args) => (
    <div style={{ display: 'grid', gap: 12 }}>
      <Switch {...args} label="Small" size="small" />
      <Switch {...args} label="Medium" size="medium" />
      <Switch {...args} label="Large" size="large" />
    </div>
  ),
};
export const WithoutBulb: Story = { args: { label: undefined, 'aria-label': 'Wi-Fi', showBulb: false } };
export const Disabled: Story = { args: { label: 'Locked by admin', disabled: true } };
export const Controlled: Story = {
  render: function Render(args) {
    const [on, setOn] = useState(false);
    return <Switch {...args} checked={on} onChange={setOn} label={on ? 'Power on' : 'Power off'} />;
  },
};

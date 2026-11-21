import React, { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { Checkbox } from '.';

/** A terminal that fills with current when checked; the tick draws itself in. */
const meta: Meta<typeof Checkbox> = {
  title: 'Inputs/Checkbox',
  component: Checkbox,
  args: { label: 'Enable sparks', defaultChecked: true },
  argTypes: {
    color: { control: 'inline-radio', options: ['brand', 'success', 'warning', 'error'] },
    size: { control: 'inline-radio', options: ['small', 'medium', 'large'] },
  },
};
export default meta;
type Story = StoryObj<typeof Checkbox>;

export const Playground: Story = {};
export const Indeterminate: Story = { args: { label: 'Select all', indeterminate: true, defaultChecked: false } };
export const WithError: Story = { args: { label: 'I accept the terms', defaultChecked: false, error: true, helperText: 'Required to continue.' } };
export const Disabled: Story = { args: { label: 'Locked setting', disabled: true } };
export const Sizes: Story = {
  render: (args) => (
    <div style={{ display: 'grid', gap: 10 }}>
      <Checkbox {...args} label="Small" size="small" />
      <Checkbox {...args} label="Medium" size="medium" />
      <Checkbox {...args} label="Large" size="large" />
    </div>
  ),
};
export const SelectAll: Story = {
  render: function Render() {
    const items = ['Mumbai', 'Singapore', 'Frankfurt'];
    const [picked, setPicked] = useState<string[]>(['Mumbai']);
    const all = picked.length === items.length;
    return (
      <div style={{ display: 'grid', gap: 10 }}>
        <Checkbox
          label="All regions"
          checked={all}
          indeterminate={picked.length > 0 && !all}
          onChange={() => setPicked(all ? [] : items)}
        />
        <div style={{ display: 'grid', gap: 8, paddingLeft: 28 }}>
          {items.map((i) => (
            <Checkbox
              key={i}
              label={i}
              checked={picked.includes(i)}
              onChange={() => setPicked((p) => (p.includes(i) ? p.filter((x) => x !== i) : [...p, i]))}
            />
          ))}
        </div>
      </div>
    );
  },
};

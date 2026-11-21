import React, { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { fn } from '@storybook/test';
import { Select } from '.';

const regions = [
  { value: 'ap-south-1', label: 'Mumbai', description: 'ap-south-1' },
  { value: 'ap-southeast-1', label: 'Singapore', description: 'ap-southeast-1' },
  { value: 'eu-central-1', label: 'Frankfurt', description: 'eu-central-1' },
  { value: 'us-east-1', label: 'Virginia', description: 'us-east-1' },
  { value: 'sa-east-1', label: 'São Paulo', description: 'Not available on your plan', disabled: true },
];

/**
 * Pick one option. Built on React Aria's `useSelect`: type to jump to an
 * option (even while closed), arrow keys, Home/End, Escape, and a hidden
 * native select for forms. Replaces Dropdown.
 */
const meta: Meta<typeof Select> = {
  title: 'Inputs/Select',
  component: Select,
  args: { label: 'Region', options: regions, placeholder: 'Pick a region', onChange: fn() },
  argTypes: {
    size: { control: 'inline-radio', options: ['small', 'medium', 'large'] },
    options: { control: false },
  },
  decorators: [(Story) => <div style={{ maxWidth: 360, minHeight: 360 }}><Story /></div>],
};
export default meta;
type Story = StoryObj<typeof Select>;

export const Playground: Story = {};
export const WithValue: Story = { args: { defaultValue: 'eu-central-1' } };
export const WithHelperText: Story = { args: { helperText: 'Pick the region closest to your users.' } };
export const Error: Story = { args: { error: 'Choose a region to continue.', required: true } };
export const Disabled: Story = { args: { disabled: true, defaultValue: 'ap-south-1' } };
export const Controlled: Story = {
  render: function Render(args) {
    const [value, setValue] = useState<string | null>('ap-south-1');
    return (
      <>
        <Select {...args} value={value} onChange={setValue} />
        <p style={{ color: 'var(--spark-text-secondary)', fontSize: 14 }}>Selected value: {value}</p>
      </>
    );
  },
};

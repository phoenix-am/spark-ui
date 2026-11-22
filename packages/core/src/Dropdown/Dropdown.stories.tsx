import React, { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { fn } from '@storybook/test';
import { User, Home, Settings } from '@sparkwire/icons';
import { Dropdown } from '.';

const regions = [
  { value: 'ap-south-1', label: 'Mumbai', description: 'ap-south-1' },
  { value: 'ap-southeast-1', label: 'Singapore', description: 'ap-southeast-1' },
  { value: 'eu-central-1', label: 'Frankfurt', description: 'eu-central-1' },
  { value: 'us-east-1', label: 'Virginia', description: 'us-east-1' },
  { value: 'sa-east-1', label: 'São Paulo', description: 'Not available on your plan', disabled: true },
];

/**
 * Pick one value from a list. The chosen option's node lights up. Type to
 * jump to an option (even while closed), arrow keys, Home/End, Escape, and a
 * hidden native select for forms. Built on the Popover and ListBox base
 * components. `Select` is the same component under another name.
 */
const meta: Meta<typeof Dropdown> = {
  title: 'Inputs/Dropdown',
  component: Dropdown,
  args: { label: 'Region', options: regions, placeholder: 'Pick a region', onChange: fn() },
  argTypes: {
    size: { control: 'inline-radio', options: ['small', 'medium', 'large'] },
    options: { control: false },
    startIcon: { control: false },
    prependIcon: { table: { disable: true } },
    appendIcon: { table: { disable: true } },
    showBorder: { table: { disable: true } },
    forTeams: { table: { disable: true } },
    containerStyle: { table: { disable: true } },
    inputStyle: { table: { disable: true } },
    itemStyle: { table: { disable: true } },
    listContainerStyle: { table: { disable: true } },
  },
  decorators: [(Story) => <div style={{ maxWidth: 360, minHeight: 380 }}><Story /></div>],
};
export default meta;
type Story = StoryObj<typeof Dropdown>;

export const Playground: Story = {};
export const WithValue: Story = { args: { defaultValue: 'eu-central-1' } };
export const WithHelperText: Story = { args: { helperText: 'Pick the region closest to your users.' } };
export const Error: Story = { args: { error: 'Choose a region to continue.', required: true } };
export const Disabled: Story = { args: { disabled: true, defaultValue: 'ap-south-1' } };

/** Group options under headings. */
export const Groups: Story = {
  args: {
    label: 'Region',
    options: [
      { label: 'Asia Pacific', options: [regions[0], regions[1]] },
      { label: 'Europe', options: [regions[2]] },
      { label: 'Americas', options: [regions[3], regions[4]] },
    ],
  },
};

/** Options can carry an icon; the chosen one shows in the field. */
export const WithIcons: Story = {
  args: {
    label: 'Owner',
    placeholder: 'Assign to…',
    options: [
      { value: 'asha', label: 'Asha Patel', icon: <User /> },
      { value: 'rohan', label: 'Rohan Mehta', icon: <User /> },
      { value: 'meera', label: 'Meera Joshi', icon: <User /> },
    ],
  },
};

/** Number values come back as numbers. */
export const NumberValues: Story = {
  args: {
    label: 'Replicas',
    defaultValue: 3,
    options: [1, 2, 3, 5, 8].map((n) => ({ value: n, label: `${n} replica${n > 1 ? 's' : ''}` })),
  },
};

export const Controlled: Story = {
  render: function Render(args) {
    const [value, setValue] = useState<string | null>('ap-south-1');
    return (
      <>
        <Dropdown {...args} value={value} onChange={(v) => setValue(String(v))} />
        <p style={{ color: 'var(--spark-text-secondary)', fontSize: 14 }}>Selected value: {value}</p>
      </>
    );
  },
};

export const Empty: Story = { args: { options: [], emptyState: 'No regions yet' } };

/** Sizes match the other fields. */
export const Sizes: Story = {
  render: (args) => (
    <div style={{ display: 'grid', gap: 8 }}>
      <Dropdown {...args} size="small" label="Small" startIcon={<Home />} />
      <Dropdown {...args} size="medium" label="Medium" startIcon={<Settings />} />
      <Dropdown {...args} size="large" label="Large" />
    </div>
  ),
};

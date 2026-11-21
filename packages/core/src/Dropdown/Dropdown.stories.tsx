import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { fn } from '@storybook/test';
import { Dropdown } from '.';

const regions = [
  { label: 'Mumbai (ap-south-1)', value: 'ap-south-1' },
  { label: 'Singapore (ap-southeast-1)', value: 'ap-southeast-1' },
  { label: 'Frankfurt (eu-central-1)', value: 'eu-central-1' },
  { label: 'Virginia (us-east-1)', value: 'us-east-1' },
];

/**
 * Select one option from a list. The selected option's node lights up.
 * Keyboard: focus, then Enter or arrow keys; Escape closes.
 */
const meta: Meta<typeof Dropdown> = {
  title: 'Inputs/Dropdown',
  component: Dropdown,
  args: { label: 'Region', placeholder: 'Pick a region', options: regions, size: 'medium', onChange: fn() },
  argTypes: {
    size: { control: 'inline-radio', options: ['small', 'medium', 'large'] },
    prependIcon: { control: false },
    appendIcon: { control: false },
  },
  decorators: [(Story) => <div style={{ maxWidth: 380, minHeight: 300 }}><Story /></div>],
};
export default meta;
type Story = StoryObj<typeof Dropdown>;

export const Playground: Story = {};
export const WithHelperText: Story = { args: { helperText: 'Pick the region closest to your users.' } };
export const Error: Story = { args: { error: true, helperText: 'Choose a region to continue.' } };
export const Disabled: Story = { args: { disabled: true } };
export const ForTeams: Story = { args: { label: 'Owner', placeholder: 'Assign to…', forTeams: true, options: [
  { label: 'Asha Patel', value: 'asha' },
  { label: 'Rohan Mehta', value: 'rohan' },
  { label: 'Meera Joshi', value: 'meera' },
] } };
export const Empty: Story = { args: { options: [] } };

import type { Meta, StoryObj } from '@storybook/react';
import { fn } from '@storybook/test';
import { RadioGroup } from '.';

const plans = [
  { value: 'spark', label: 'Spark', description: 'For side projects' },
  { value: 'surge', label: 'Surge', description: 'For growing teams' },
  { value: 'grid', label: 'Grid', description: 'For companies', disabled: true },
];

/** Pick one option. Only the chosen contact carries current. Native radios underneath. */
const meta: Meta<typeof RadioGroup> = {
  title: 'Inputs/RadioGroup',
  component: RadioGroup,
  args: { label: 'Plan', options: plans, defaultValue: 'spark', onChange: fn() },
  argTypes: {
    variant: { control: 'inline-radio', options: ['list', 'cards'] },
    color: { control: 'inline-radio', options: ['brand', 'success', 'warning', 'error'] },
  },
};
export default meta;
type Story = StoryObj<typeof RadioGroup>;

export const Playground: Story = {};
export const Cards: Story = { args: { variant: 'cards', defaultValue: 'surge' } };
export const WithError: Story = { args: { defaultValue: undefined, error: true, helperText: 'Choose a plan to continue.' } };
export const Simple: Story = {
  args: { label: 'Region', defaultValue: 'mum', options: [{ value: 'mum', label: 'Mumbai' }, { value: 'sgp', label: 'Singapore' }] },
};

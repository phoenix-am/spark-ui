import type { Meta, StoryObj } from '@storybook/react';
import { fn } from '@storybook/test';
import { NumberField } from '.';

/**
 * Numbers formatted the way your locale writes them. Up/Down and − / + step,
 * Page Up/Down step by tens, Home/End jump to min/max; values clamp and snap
 * to `step` on blur. Forms get the plain number.
 */
const meta: Meta<typeof NumberField> = {
  title: 'Inputs/NumberField',
  component: NumberField,
  args: { label: 'Quantity', defaultValue: 1, min: 0, max: 99, onChange: fn() },
  argTypes: { size: { control: 'inline-radio', options: ['small', 'medium', 'large'] }, formatOptions: { control: false } },
  decorators: [(S) => <div style={{ maxWidth: 320 }}><S /></div>],
};
export default meta;
type Story = StoryObj<typeof NumberField>;

export const Playground: Story = {};
/** Indian grouping: ₹1,00,000. */
export const RupeesIndia: Story = { args: { label: 'Budget', defaultValue: 100000, min: 0, max: 10000000, step: 1000, formatOptions: { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }, name: 'budget' } };
export const Percent: Story = { args: { label: 'Discount', defaultValue: 0.15, min: 0, max: 1, step: 0.05, formatOptions: { style: 'percent' } } };
export const Units: Story = { args: { label: 'Weight', defaultValue: 2.5, max: 500, step: 0.1, formatOptions: { style: 'unit', unit: 'kilogram', maximumFractionDigits: 1 } } };
export const Error: Story = { args: { error: 'Order at least 1.', defaultValue: 0, required: true } };
export const Disabled: Story = { args: { disabled: true } };
export const NoSteppers: Story = { args: { label: 'Year', defaultValue: 2026, max: 2100, hideSteppers: true, formatOptions: { useGrouping: false } } };

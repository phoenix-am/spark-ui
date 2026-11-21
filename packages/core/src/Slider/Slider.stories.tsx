import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { fn } from '@storybook/test';
import { Slider } from '.';
import { SparkProvider } from '../Provider';

/** A dimmer: the wire is lit up to the knob, and the glow grows with the value. Give it a `[start, end]` value for a range. Built on React Aria. */
const meta: Meta<typeof Slider> = {
  title: 'Inputs/Slider',
  component: Slider,
  args: { label: 'Brightness', defaultValue: 60, min: 0, max: 100, step: 1, formatValue: (v: number) => `${v}%`, onChange: fn() },
  argTypes: { color: { control: 'inline-radio', options: ['brand', 'success', 'warning', 'error'] }, formatValue: { control: false }, formatOptions: { control: false } },
  decorators: [(Story) => <div style={{ maxWidth: 420 }}><Story /></div>],
};
export default meta;
type Story = StoryObj<typeof Slider>;

export const Playground: Story = {};
export const Stepped: Story = { args: { label: 'Voltage', max: 240, step: 10, defaultValue: 120, formatValue: (v: number) => `${v} V`, color: 'success' } };
export const Disabled: Story = { args: { label: 'Locked', disabled: true, defaultValue: 30 } };

/** Pass a `[start, end]` pair: two knobs, with current flowing between them. */
export const Range: Story = {
  args: { label: 'Budget', defaultValue: [20000, 60000], min: 0, max: 100000, step: 1000, formatValue: undefined, formatOptions: { style: 'currency', currency: 'INR', maximumFractionDigits: 0 } },
};

/** `onChangeEnd` fires once when you let go: the place to save or fetch. */
export const PriceFilter: Story = {
  args: { label: 'Price', defaultValue: [500, 3000], min: 0, max: 5000, step: 50, color: 'success', formatValue: (v: number) => `₹${v}`, onChangeEnd: fn() },
};

/** Numbers and direction follow the locale. */
export const RightToLeft: Story = {
  args: { label: 'السطوع', defaultValue: [0.25, 0.75], formatValue: undefined, formatOptions: { style: 'percent' }, min: 0, max: 1, step: 0.01 },
  render: (args) => (
    <SparkProvider locale="ar-EG">
      <Slider {...args} />
    </SparkProvider>
  ),
};

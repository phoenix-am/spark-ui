import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { fn } from '@storybook/test';
import { Slider } from '.';

/** A dimmer: the wire is lit up to the knob, and the glow grows with the value. */
const meta: Meta<typeof Slider> = {
  title: 'Inputs/Slider',
  component: Slider,
  args: { label: 'Brightness', defaultValue: 60, min: 0, max: 100, step: 1, formatValue: (v: number) => `${v}%`, onChange: fn() },
  argTypes: { color: { control: 'inline-radio', options: ['brand', 'success', 'warning', 'error'] }, formatValue: { control: false } },
  decorators: [(Story) => <div style={{ maxWidth: 420 }}><Story /></div>],
};
export default meta;
type Story = StoryObj<typeof Slider>;

export const Playground: Story = {};
export const Stepped: Story = { args: { label: 'Voltage', max: 240, step: 10, defaultValue: 120, formatValue: (v: number) => `${v} V`, color: 'success' } };
export const Disabled: Story = { args: { label: 'Locked', disabled: true, defaultValue: 30 } };

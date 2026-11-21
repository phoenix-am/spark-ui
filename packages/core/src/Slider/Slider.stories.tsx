import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { ThemeProvider } from '@spark-ui/system';
import { Slider, SliderProps } from './Slider';

const meta: Meta<typeof Slider> = {
  component: (props: SliderProps) => (
    <ThemeProvider>
      <div style={{ maxWidth: 360 }}>
        <Slider {...props} />
      </div>
    </ThemeProvider>
  ),
  title: 'Spark UI/Slider',
};
export default meta;
type Story = StoryObj<typeof Slider>;

export const Base: Story = { args: { label: 'Brightness', defaultValue: 60, formatValue: (v: number) => `${v}%` } };
export const Stepped: Story = { args: { label: 'Voltage', min: 0, max: 240, step: 10, defaultValue: 120, formatValue: (v: number) => `${v} V` } };
export const Disabled: Story = { args: { label: 'Locked', defaultValue: 30, disabled: true } };

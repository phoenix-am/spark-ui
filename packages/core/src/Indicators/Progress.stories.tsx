import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { Progress } from '.';

/** A charge bar. At 100% current flows; with no value it sweeps (indeterminate). */
const meta: Meta<typeof Progress> = {
  title: 'Feedback/Progress',
  component: Progress,
  args: { label: 'Uploading assets', value: 64, size: 'medium', tone: 'brand' },
  argTypes: {
    value: { control: { type: 'range', min: 0, max: 100 } },
    tone: { control: 'inline-radio', options: ['brand', 'success', 'warning', 'error'] },
    size: { control: 'inline-radio', options: ['small', 'medium', 'large'] },
  },
  decorators: [(Story) => <div style={{ maxWidth: 420 }}><Story /></div>],
};
export default meta;
type Story = StoryObj<typeof Progress>;

export const Playground: Story = {};
export const FullyCharged: Story = { args: { label: 'Battery', value: 100, tone: 'success' } };
export const Indeterminate: Story = { args: { label: 'Waiting for server', value: undefined } };

import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { Spinner } from '.';

/** An arc of current with a spark at its tip. Announced as "Loading". */
const meta: Meta<typeof Spinner> = {
  title: 'Feedback/Spinner',
  component: Spinner,
  args: { size: 'medium', tone: 'brand', label: 'Loading' },
  argTypes: {
    size: { control: 'inline-radio', options: ['small', 'medium', 'large'] },
    tone: { control: 'inline-radio', options: ['brand', 'success', 'warning', 'error'] },
  },
};
export default meta;
type Story = StoryObj<typeof Spinner>;

export const Playground: Story = {};
export const Sizes: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: 20, alignItems: 'center' }}>
      <Spinner size="small" />
      <Spinner size="medium" />
      <Spinner size="large" />
    </div>
  ),
};

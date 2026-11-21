import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { Tooltip } from '.';
import { Button } from '../Button';

/** A short glowing label on hover or keyboard focus. Escape hides it. */
const meta: Meta<typeof Tooltip> = {
  title: 'Overlays/Tooltip',
  component: Tooltip,
  args: { title: 'Restarts every service', placement: 'top', delay: 250 },
  argTypes: { placement: { control: 'inline-radio', options: ['top', 'bottom', 'left', 'right'] }, children: { control: false } },
  render: (args) => (
    <div style={{ padding: '60px 140px' }}>
      <Tooltip {...args}>
        <Button variant="outlined">Hover or focus me</Button>
      </Tooltip>
    </div>
  ),
};
export default meta;
type Story = StoryObj<typeof Tooltip>;

export const Playground: Story = {};
export const Placements: Story = {
  render: (args) => (
    <div style={{ display: 'flex', gap: 24, padding: 60, flexWrap: 'wrap' }}>
      {(['top', 'bottom', 'left', 'right'] as const).map((p) => (
        <Tooltip key={p} {...args} title={`Tooltip on ${p}`} placement={p}>
          <Button variant="outlined">{p}</Button>
        </Tooltip>
      ))}
    </div>
  ),
};

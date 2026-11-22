import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { Card, CardHeader, Skeleton } from '.';

/** Loading placeholders with a shimmer that sweeps across like a charge. */
const meta: Meta<typeof Skeleton> = {
  title: 'Feedback/Skeleton',
  component: Skeleton,
  args: { shape: 'rect', width: 240, height: 16, lines: 3 },
  argTypes: { shape: { control: 'inline-radio', options: ['rect', 'circle', 'text'] } },
};
export default meta;
type Story = StoryObj<typeof Skeleton>;

export const Playground: Story = {};
export const Text: Story = { args: { shape: 'text', width: 360, lines: 4, height: undefined } };
export const Circle: Story = { args: { shape: 'circle', width: 48 } };
export const LoadingCard: Story = {
  render: () => (
    <div style={{ maxWidth: 360 }}>
      <Card>
        <CardHeader title={<Skeleton width={140} />} subtitle={<Skeleton width={90} height={12} />} media={<Skeleton shape="circle" width={32} />} />
        <Skeleton shape="text" lines={3} />
      </Card>
    </div>
  ),
};

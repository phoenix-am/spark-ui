import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { Card, CardHeader, CardFooter } from '.';
import { Avatar } from '../Avatar';
import { Badge, Progress } from '../Indicators';
import { Button } from '../Button';

/** A raised panel. `live` cards carry current along the top; `interactive` cards glow on hover. */
const meta: Meta<typeof Card> = {
  title: 'Data display/Card',
  component: Card,
  subcomponents: { CardHeader, CardFooter } as Record<string, React.ComponentType<unknown>>,
  args: { live: true, interactive: true, padding: 'medium' },
  argTypes: {
    padding: { control: 'inline-radio', options: ['none', 'small', 'medium', 'large'] },
    as: { control: 'inline-radio', options: ['div', 'article', 'section', 'li'] },
  },
  render: (args) => (
    <div style={{ maxWidth: 380 }}>
      <Card {...args}>
        <CardHeader title="api-gateway" subtitle="Deployed 4 min ago" media={<Avatar name="Asha Patel" size="small" />} action={<Badge pulse>Live</Badge>} />
        <span style={{ fontSize: 14, color: 'var(--spark-text-secondary)' }}>Handling 1.2k requests a minute.</span>
        <CardFooter>
          <Button size="small" variant="outlined">Logs</Button>
          <Button size="small" variant="text">Restart</Button>
        </CardFooter>
      </Card>
    </div>
  ),
};
export default meta;
type Story = StoryObj<typeof Card>;

export const Playground: Story = {};
export const Static: Story = { args: { live: false, interactive: false } };
export const Grid: Story = {
  render: () => (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 16 }}>
      <Card live interactive>
        <CardHeader title="api-gateway" subtitle="Live" action={<Badge pulse>Live</Badge>} />
        <Progress label="Traffic" value={72} size="small" />
      </Card>
      <Card interactive>
        <CardHeader title="worker-queue" subtitle="Idle" action={<Badge tone="neutral">Idle</Badge>} />
        <Progress label="Queue drained" value={100} tone="success" size="small" />
      </Card>
      <Card interactive>
        <CardHeader title="billing" subtitle="Degraded" action={<Badge tone="warning">Degraded</Badge>} />
        <Progress label="Error budget" value={35} tone="warning" size="small" />
      </Card>
    </div>
  ),
};

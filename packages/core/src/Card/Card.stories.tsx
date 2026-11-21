import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { ThemeProvider } from '@spark-ui/system';
import { Card, CardHeader, CardFooter, Skeleton } from './Card';
import { Avatar } from '../Avatar';
import { Badge } from '../Indicators';
import { Button } from '../Button';

const meta: Meta = { title: 'Spark UI/Card' };
export default meta;

export const Base: StoryObj = {
  render: () => (
    <ThemeProvider>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: 16 }}>
        <Card live interactive>
          <CardHeader title="api-gateway" subtitle="Deployed 4 min ago" media={<Avatar name="Asha Patel" size="small" />} action={<Badge pulse>Live</Badge>} />
          Handling 1.2k requests a minute.
          <CardFooter>
            <Button size="small" variant="outlined">Logs</Button>
          </CardFooter>
        </Card>
        <Card>
          <CardHeader title={<Skeleton width={140} />} media={<Skeleton shape="circle" width={28} />} />
          <Skeleton shape="text" lines={3} />
        </Card>
      </div>
    </ThemeProvider>
  ),
};

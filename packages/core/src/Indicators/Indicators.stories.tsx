import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { ThemeProvider } from '@spark-ui/system';
import { Badge, Progress, Spinner } from './Indicators';

const meta: Meta = { title: 'Spark UI/Indicators' };
export default meta;

export const Badges: StoryObj = {
  render: () => (
    <ThemeProvider>
      <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
        <Badge pulse>Live</Badge>
        <Badge tone="success">Online</Badge>
        <Badge tone="warning">Degraded</Badge>
        <Badge tone="error" variant="solid">Down</Badge>
        <Badge tone="neutral">Draft</Badge>
      </div>
    </ThemeProvider>
  ),
};

export const ProgressBars: StoryObj = {
  render: () => (
    <ThemeProvider>
      <div style={{ display: 'grid', gap: 20, maxWidth: 420 }}>
        <Progress label="Uploading" value={42} />
        <Progress label="Battery" value={100} tone="success" />
        <Progress label="Waiting for server" />
      </div>
    </ThemeProvider>
  ),
};

export const Spinners: StoryObj = {
  render: () => (
    <ThemeProvider>
      <div style={{ display: 'flex', gap: 20, alignItems: 'center' }}>
        <Spinner size="small" />
        <Spinner />
        <Spinner size="large" tone="success" />
      </div>
    </ThemeProvider>
  ),
};

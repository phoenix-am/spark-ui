import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { Switch } from '.';
import { ThemeProvider } from '@spark-ui/system';
import { SwitchProps } from './Switch';

const meta: Meta<typeof Switch> = {
  component: (props: SwitchProps) => (
    <ThemeProvider>
      <Switch {...props} />
    </ThemeProvider>
  ),
  title: 'Spark UI/Switch',
};

export default meta;
type Story = StoryObj<typeof Switch>;

export const Base: Story = { args: { label: 'Power', defaultChecked: true } };
export const Off: Story = { args: { label: 'Notifications', defaultChecked: false } };
export const Success: Story = { args: { label: 'Auto-deploy', defaultChecked: true, color: 'success' } };
export const Small: Story = { args: { label: 'Compact', defaultChecked: true, size: 'small' } };
export const NoBulb: Story = { args: { 'aria-label': 'Wi-Fi', defaultChecked: true, showBulb: false } };
export const Disabled: Story = { args: { label: 'Locked', defaultChecked: true, disabled: true } };

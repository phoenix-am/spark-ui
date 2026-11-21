import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { ThemeProvider } from '@spark-ui/system';
import { RadioGroup } from './RadioGroup';

const meta: Meta = { title: 'Spark UI/RadioGroup' };
export default meta;

const plans = [
  { value: 'spark', label: 'Spark', description: 'For side projects' },
  { value: 'surge', label: 'Surge', description: 'For growing teams' },
  { value: 'grid', label: 'Grid', description: 'For companies', disabled: true },
];

export const List: StoryObj = {
  render: () => (
    <ThemeProvider>
      <RadioGroup label="Plan" options={plans} defaultValue="spark" />
    </ThemeProvider>
  ),
};

export const Cards: StoryObj = {
  render: () => (
    <ThemeProvider>
      <RadioGroup label="Plan" options={plans} defaultValue="surge" variant="cards" />
    </ThemeProvider>
  ),
};

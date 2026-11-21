import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { ThemeProvider } from '@spark-ui/system';
import { Checkbox, CheckboxProps } from './Checkbox';

const meta: Meta<typeof Checkbox> = {
  component: (props: CheckboxProps) => (
    <ThemeProvider>
      <Checkbox {...props} />
    </ThemeProvider>
  ),
  title: 'Spark UI/Checkbox',
};
export default meta;
type Story = StoryObj<typeof Checkbox>;

export const Base: Story = { args: { label: 'Remember me', defaultChecked: true } };
export const Indeterminate: Story = { args: { label: 'Select all', indeterminate: true } };
export const WithError: Story = { args: { label: 'I accept the terms', error: true, helperText: 'Required to continue.' } };
export const Disabled: Story = { args: { label: 'Locked', defaultChecked: true, disabled: true } };

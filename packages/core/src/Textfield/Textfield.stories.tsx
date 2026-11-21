import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { DollarSign, Info, Mail, Lock } from '@sparkwire/icons';
import { Textfield } from '.';

/**
 * Text input. In Live Wire a field can **charge up** as its value becomes
 * valid: pass `charge` as a number (0 to 1) or a function of the value.
 */
const meta: Meta<typeof Textfield> = {
  title: 'Inputs/Textfield',
  component: Textfield,
  args: { label: 'Email', placeholder: 'you@spark.dev', inputSize: 'medium' },
  argTypes: {
    inputSize: { control: 'inline-radio', options: ['small', 'medium', 'large'] },
    prepend: { control: false },
    append: { control: false },
    charge: { control: { type: 'range', min: 0, max: 1, step: 0.05 } },
  },
  decorators: [(Story) => <div style={{ maxWidth: 420 }}><Story /></div>],
};
export default meta;
type Story = StoryObj<typeof Textfield>;

export const Playground: Story = {};

export const WithIcons: Story = { args: { prepend: <Mail />, append: <Info /> } };

export const WithHelperText: Story = { args: { helperText: "We'll never share it." } };

export const Error: Story = {
  args: { label: 'Webhook URL', value: 'htp://example', error: true, helperText: 'Use http:// or https://' },
};

export const Disabled: Story = { args: { disabled: true, value: 'locked@spark.dev' } };

/** Type 8 characters to fully charge the field. */
export const ChargingPassword: Story = {
  args: {
    label: 'New password',
    type: 'password',
    placeholder: 'Type 8+ characters',
    prepend: <Lock />,
    charge: (value: string) => value.length / 8,
    chargeLabel: (p: number) => (p >= 100 ? 'Fully charged. Strong password.' : `${p}% charged`),
  },
};

export const Charged: Story = { args: { label: 'Display name', value: 'Asha Patel', charge: 1 } };

export const Currency: Story = {
  args: { label: 'Amount', placeholder: '0.00', type: 'currency', prepend: <DollarSign /> },
};

export const Sizes: Story = {
  render: (args) => (
    <div style={{ display: 'grid', gap: 8 }}>
      <Textfield {...args} label="Small" inputSize="small" />
      <Textfield {...args} label="Medium" inputSize="medium" />
      <Textfield {...args} label="Large" inputSize="large" />
    </div>
  ),
};

import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { fn } from '@storybook/test';
import { Mail, Zap, ArrowRight } from '@sparkwire/icons';
import { Button } from '.';

/**
 * Buttons throw sparks from the press point. Outlined and text buttons show
 * current flowing along a wire on hover. A disabled button is a dead circuit.
 */
const meta: Meta<typeof Button> = {
  title: 'Actions/Button',
  component: Button,
  args: { children: 'Ignite', onClick: fn() },
  argTypes: {
    variant: { control: 'inline-radio', options: ['contained', 'outlined', 'text'] },
    color: { control: 'inline-radio', options: ['brand', 'success', 'warning', 'error'] },
    size: { control: 'inline-radio', options: ['small', 'medium', 'large'] },
    spark: { control: 'boolean', description: 'Throw sparks on click' },
    startIcon: { control: false },
    endIcon: { control: false },
  },
};
export default meta;
type Story = StoryObj<typeof Button>;

export const Playground: Story = {};

export const Variants: Story = {
  render: (args) => (
    <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
      <Button {...args} variant="contained">Contained</Button>
      <Button {...args} variant="outlined">Outlined</Button>
      <Button {...args} variant="text">Text</Button>
    </div>
  ),
};

export const Colors: Story = {
  render: (args) => (
    <div style={{ display: 'grid', gap: 12 }}>
      {(['contained', 'outlined', 'text'] as const).map((v) => (
        <div key={v} style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
          <Button {...args} variant={v} color="brand">Brand</Button>
          <Button {...args} variant={v} color="success">Success</Button>
          <Button {...args} variant={v} color="warning">Warning</Button>
          <Button {...args} variant={v} color="error">Error</Button>
        </div>
      ))}
    </div>
  ),
};

export const Sizes: Story = {
  render: (args) => (
    <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
      <Button {...args} size="small">Small</Button>
      <Button {...args} size="medium">Medium</Button>
      <Button {...args} size="large">Large</Button>
    </div>
  ),
};

export const WithIcons: Story = {
  render: (args) => (
    <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
      <Button {...args} startIcon={<Zap />}>Ignite</Button>
      <Button {...args} variant="outlined" startIcon={<Mail />}>Email</Button>
      <Button {...args} variant="text" endIcon={<ArrowRight />}>Continue</Button>
    </div>
  ),
};

export const Disabled: Story = {
  render: (args) => (
    <div style={{ display: 'flex', gap: 12 }}>
      <Button {...args} disabled>Contained</Button>
      <Button {...args} variant="outlined" disabled>Outlined</Button>
      <Button {...args} variant="text" disabled>Text</Button>
    </div>
  ),
};

export const FullWidth: Story = { args: { fullWidth: true, children: 'Deploy to production' } };

export const AsLink: Story = { args: { as: 'a', href: '#', variant: 'outlined', children: 'I am a link' } };

export const WithoutSparks: Story = { args: { spark: false, children: 'Quiet button' } };

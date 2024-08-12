import type { Meta, StoryObj } from '@storybook/react';

import { Button } from '../components';

const meta: Meta<typeof Button> = {
  component: Button,
  title: "Spark UI/Button",
};

export default meta;
type Story = StoryObj<typeof Button>;

export const Primary: Story = {
  args: {
    variant: 'primary',
    label: 'Click Me!'
  }
}

export const Secondary: Story = {
  args: {
    variant: 'secondary',
    label: 'Click Me!'
  }
}

export const Danger: Story = {
  args: {
    variant: 'danger',
    label: 'Click Me!'
  }
}
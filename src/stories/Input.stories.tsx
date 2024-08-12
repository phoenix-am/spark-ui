import type { Meta, StoryObj } from '@storybook/react';

import { Input } from '../components';

const meta: Meta<typeof Input> = {
  component: Input,
  title: "Spark UI/Input",
};

export default meta;
type Story = StoryObj<typeof Input>;

export const Primary: Story = {
  args: {
    placeholder: 'Enter text here',
    type: 'text',
    disabled: false
  }
}
import type { Meta, StoryObj } from '@storybook/react';
import { fn } from '@storybook/test';
import { Textarea } from '.';

/** Multi-line text on the shared field shell. Grows between `minRows` and `maxRows`; `showCount` with `maxLength` shows "12 / 280". */
const meta: Meta<typeof Textarea> = {
  title: 'Inputs/Textarea',
  component: Textarea,
  args: { label: 'Message', placeholder: 'Tell us what happened…', onChange: fn() },
  decorators: [(S) => <div style={{ maxWidth: 420 }}><S /></div>],
};
export default meta;
type Story = StoryObj<typeof Textarea>;
export const Playground: Story = {};
export const WithCount: Story = { args: { label: 'Bio', maxLength: 160, showCount: true, helperText: 'Shown on your public profile.', defaultValue: 'Frontend engineer in Ahmedabad.' } };
export const Error: Story = { args: { error: 'Please describe the issue.', required: true } };
export const Filled: Story = { args: { variant: 'filled', minRows: 2 } };

import type { Meta, StoryObj } from '@storybook/react';
import { fn } from '@storybook/test';
import { TimePicker } from '.';

/** Type a time (hours, minutes, AM/PM) or pick from suggestions. Values are 24-hour strings like "14:30". */
const meta: Meta<typeof TimePicker> = {
  title: 'Inputs/TimePicker',
  component: TimePicker,
  args: { label: 'Start time', onChange: fn() },
  decorators: [(S) => <div style={{ maxWidth: 280, minHeight: 360 }}><S /></div>],
};
export default meta;
type Story = StoryObj<typeof TimePicker>;
export const Playground: Story = { args: { defaultValue: '09:30', clearable: true } };
export const BusinessHours: Story = {
  args: { label: 'Meeting', min: '09:00', max: '18:00', step: 15, helperText: '9 AM – 6 PM, every 15 minutes. Lunch is blocked.', isTimeDisabled: (t: string) => t >= '13:00' && t < '14:00' },
};
export const TwentyFourHour: Story = { args: { hourCycle: 24, defaultValue: '18:45' } };
export const WithSeconds: Story = { args: { granularity: 'second', showList: false, defaultValue: '07:05:30' } };
export const Error: Story = { args: { error: true, helperText: 'Pick a time after 9 AM.', required: true } };

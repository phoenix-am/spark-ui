import React, { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { fn } from '@storybook/test';
import { DatePicker } from '.';
import { Button } from '../Button';

const today = new Date();
const inDays = (n: number) => new Date(today.getFullYear(), today.getMonth(), today.getDate() + n);

/**
 * A field that opens a calendar. The picked day is a lit node and throws a
 * spark. Keyboard: Enter or ArrowDown opens; arrows move by day and week;
 * PageUp/PageDown change month (Shift for year); Escape closes.
 */
const meta: Meta<typeof DatePicker> = {
  title: 'Inputs/DatePicker',
  component: DatePicker,
  args: { label: 'Start date', placeholder: 'Pick a date', onChange: fn(), weekStartsOn: 1 },
  argTypes: {
    size: { control: 'inline-radio', options: ['small', 'medium', 'large'] },
    weekStartsOn: { control: 'inline-radio', options: [0, 1, 6] },
    locale: { control: 'select', options: [undefined, 'en-IN', 'en-US', 'hi-IN', 'gu-IN', 'fr-FR', 'ja-JP'] },
    value: { control: false },
    defaultValue: { control: false },
    min: { control: false },
    max: { control: false },
    isDateDisabled: { control: false },
    format: { control: false },
  },
  decorators: [(Story) => <div style={{ maxWidth: 340, minHeight: 470 }}><Story /></div>],
};
export default meta;
type Story = StoryObj<typeof DatePicker>;

export const Playground: Story = {};

export const WithValue: Story = { args: { defaultValue: inDays(3) } };

/** Only the next 30 days can be picked. */
export const MinAndMax: Story = {
  args: { label: 'Delivery date', min: today, max: inDays(30), helperText: 'We deliver within the next 30 days.' },
};

/** Weekends are switched off. */
export const NoWeekends: Story = {
  args: { label: 'Meeting day', isDateDisabled: (d: Date) => d.getDay() === 0 || d.getDay() === 6, helperText: 'Weekdays only.' },
};

export const LongFormat: Story = {
  args: { defaultValue: today, format: { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' } },
};

/** Month and weekday names follow the locale. */
export const Hindi: Story = { args: { label: 'तारीख चुनें', placeholder: 'तारीख', locale: 'hi-IN', todayLabel: 'आज', defaultValue: today } };

export const Error: Story = { args: { error: true, helperText: 'Pick a start date to continue.' } };

export const Disabled: Story = { args: { disabled: true, defaultValue: today } };

export const Sizes: Story = {
  render: (args) => (
    <div style={{ display: 'grid' }}>
      <DatePicker {...args} label="Small" size="small" />
      <DatePicker {...args} label="Medium" size="medium" />
      <DatePicker {...args} label="Large" size="large" />
    </div>
  ),
};

/** Submits the date as an ISO string through a hidden input named `checkin`. */
export const InAForm: Story = {
  render: function Render(args) {
    const [sent, setSent] = useState<string | null>(null);
    return (
      <form
        onSubmit={(e) => {
          e.preventDefault();
          setSent(String(new FormData(e.currentTarget).get('checkin') || '(empty)'));
        }}
      >
        <DatePicker {...args} label="Check-in" name="checkin" min={today} />
        <Button type="submit">Book</Button>
        {sent && <p style={{ color: 'var(--spark-text-secondary)', fontSize: 14 }}>Submitted checkin = {sent}</p>}
      </form>
    );
  },
};

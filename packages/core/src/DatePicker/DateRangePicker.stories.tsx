import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { fn } from '@storybook/test';
import { DateRangePicker, RangeCalendar } from '.';

const inDays = (n: number) => { const d = new Date(); d.setHours(0, 0, 0, 0); d.setDate(d.getDate() + n); return d; };

/**
 * Type or pick a start and end date; current flows between them. Two months
 * side by side, shortcut buttons under the calendar, and control over which
 * days can be picked.
 */
const meta: Meta<typeof DateRangePicker> = {
  title: 'Inputs/DateRangePicker',
  component: DateRangePicker,
  args: { label: 'Stay', locale: 'en-IN', onChange: fn(), presets: ['+7d', '+14d', '+1m', 'thisMonth'] },
  argTypes: { visibleMonths: { control: { type: 'number', min: 1, max: 3 } }, presets: { control: false } },
  decorators: [(S) => <div style={{ maxWidth: 420, minHeight: 520 }}><S /></div>],
};
export default meta;
type Story = StoryObj<typeof DateRangePicker>;

export const Playground: Story = {};
export const WithValue: Story = { args: { defaultValue: { start: inDays(3), end: inDays(8) } } };

/** Reporting-style presets looking back. */
export const ReportPresets: Story = { args: { label: 'Period', presets: ['-7d', '-30d', '-1y', 'thisMonth', 'thisYear'], max: inDays(0) } };

/** Booked nights can't be picked, and a range can't cross them. */
export const BookedDates: Story = { args: { label: 'Check-in → check-out', disabledDates: [inDays(4), inDays(5), inDays(12)], min: inDays(0), startName: 'checkIn', endName: 'checkOut', helperText: 'Struck-through days are booked.' } };

/** Prices under each date. */
export const WithPrices: Story = {
  args: { renderDay: (d: Date, i) => <>{i.formatted}{!i.outside && !i.unavailable && <small>₹{2 + (d.getDate() % 4)}k</small>}</> },
};

export const Error: Story = { args: { error: true, helperText: 'Pick at least two nights.', required: true } };
export const Disabled: Story = { args: { disabled: true, defaultValue: { start: inDays(1), end: inDays(4) } } };

/** The calendar on its own: RangeCalendar, here with one month and presets. */
export const CalendarOnly: StoryObj<typeof RangeCalendar> = {
  render: () => <RangeCalendar aria-label="Trip dates" defaultValue={{ start: inDays(2), end: inDays(6) }} presets={['+7d', '+1m', 'thisWeek']} onChange={fn()} />,
};

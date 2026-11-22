import React, { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { Calendar } from '.';

/** The month grid on its own, for inline use (booking pages, dashboards). */
const meta: Meta<typeof Calendar> = {
  title: 'Inputs/Calendar',
  component: Calendar,
  args: { firstDayOfWeek: 'mon' },
  argTypes: {
    firstDayOfWeek: { control: 'inline-radio', options: ['sun', 'mon', 'sat'] },
    weekStartsOn: { table: { disable: true } },
    calendar: { control: 'select', options: [undefined, 'indian', 'islamic-umalqura', 'buddhist', 'persian'] },
    locale: { control: 'select', options: [undefined, 'en-IN', 'en-US', 'hi-IN', 'gu-IN', 'fr-FR', 'ja-JP'] },
    value: { control: false },
    min: { control: false },
    max: { control: false },
    isDateDisabled: { control: false },
  },
  render: function Render(args) {
    const [date, setDate] = useState<Date | null>(new Date());
    return (
      <div style={{ display: 'inline-block', padding: 16, background: 'var(--spark-surface-raised)', border: '1px solid var(--spark-surface-border)', borderRadius: 8 }}>
        <Calendar {...args} value={date} onChange={setDate} />
        <p style={{ margin: '12px 0 0', fontSize: 13, color: 'var(--spark-text-secondary)' }}>Selected: {date ? date.toDateString() : 'none'}</p>
      </div>
    );
  },
};
export default meta;
type Story = StoryObj<typeof Calendar>;

export const Playground: Story = {};
export const SundayStart: Story = { args: { firstDayOfWeek: 'sun', locale: 'en-IN' } };
/** Hijri (Umm al-Qura) calendar in Arabic, right to left. */
export const Hijri: Story = { args: { locale: 'ar-SA', calendar: 'islamic-umalqura', todayLabel: 'اليوم' } };
export const Gujarati: Story = { args: { locale: 'gu-IN', todayLabel: 'આજે' } };

const inDays = (n: number) => { const d = new Date(); d.setHours(0, 0, 0, 0); d.setDate(d.getDate() + n); return d; };

/** Shortcut buttons under the grid. Short names, or your own `{ label, value }`. The active one lights up. */
export const Presets: Story = { args: { presets: ['today', 'tomorrow', '+7d', '+1m', '+1y'] } };

/** Presets in another language: pass objects with your own labels. */
export const PresetsHindi: Story = {
  args: {
    locale: 'hi-IN',
    presets: [
      { label: 'आज', value: () => inDays(0) },
      { label: 'कल', value: () => inDays(1) },
      { label: 'एक हफ़्ते में', value: () => inDays(7) },
    ],
  },
};

/** Block specific days (holidays, booked days) and every weekend with a rule. A preset that lands on one is disabled. */
export const DisabledDates: Story = {
  args: {
    disabledDates: [inDays(1), inDays(2), inDays(5)],
    isDateDisabled: (d: Date) => d.getDay() === 0 || d.getDay() === 6,
    presets: ['today', 'tomorrow', '+7d'],
  },
};

/** Only these days can be picked, e.g. open appointment slots. */
export const EnabledDatesOnly: Story = { args: { enabledDates: [inDays(2), inDays(3), inDays(9), inDays(10), inDays(16)], showToday: false } };

/** Custom day content: a price under each date. */
export const CustomDays: Story = {
  args: {
    visibleMonths: 1,
    renderDay: (date: Date, info) => (
      <>
        {info.formatted}
        {!info.outside && !info.unavailable && <small>₹{(3 + (date.getDate() % 5)).toString()}k</small>}
      </>
    ),
  },
};

/** Two months side by side. */
export const TwoMonths: Story = { args: { visibleMonths: 2, presets: ['today', '+1m'] } };

/** Classes on any part, e.g. square days with Tailwind-style utilities. */
export const ClassNames: Story = { args: { classNames: { day: 'demo-square-day', preset: 'demo-preset' } }, decorators: [(S) => <><style>{'.demo-square-day{border-radius:6px!important}.demo-preset{text-transform:uppercase;letter-spacing:.04em}'}</style><S /></>] };

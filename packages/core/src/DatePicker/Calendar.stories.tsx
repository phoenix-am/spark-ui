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

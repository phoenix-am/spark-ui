import React, { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { Calendar } from '.';

/** The month grid on its own, for inline use (booking pages, dashboards). */
const meta: Meta<typeof Calendar> = {
  title: 'Inputs/Calendar',
  component: Calendar,
  args: { weekStartsOn: 1 },
  argTypes: {
    weekStartsOn: { control: 'inline-radio', options: [0, 1, 6] },
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
export const SundayStart: Story = { args: { weekStartsOn: 0, locale: 'en-US' } };
export const Gujarati: Story = { args: { locale: 'gu-IN', todayLabel: 'આજે' } };

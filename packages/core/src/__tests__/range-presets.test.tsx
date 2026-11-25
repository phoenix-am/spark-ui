import React from 'react';
import { render, screen } from '@testing-library/react';
import { RangeCalendar } from '..';

const d = (y: number, m: number, day: number) => new Date(y, m - 1, day);
const presets = [
  { label: 'March', value: { start: d(2026, 3, 1), end: d(2026, 3, 31) } },
  { label: 'Ten years', value: { start: d(2016, 1, 1), end: d(2025, 12, 31) } },
];
const disabled = (label: string) => (screen.getByRole('button', { name: label }) as HTMLButtonElement).disabled || screen.getByRole('button', { name: label }).getAttribute('aria-disabled') === 'true';

describe('range presets and unavailable days', () => {
  test('with no rules every preset is usable', () => {
    render(<RangeCalendar aria-label="r" presets={presets} />);
    expect(disabled('March')).toBe(false);
    expect(disabled('Ten years')).toBe(false);
  });
  test('a blocked day inside a range disables that preset only', () => {
    render(<RangeCalendar aria-label="r" presets={presets} disabledDates={[d(2026, 3, 15)]} />);
    expect(disabled('March')).toBe(true);
    expect(disabled('Ten years')).toBe(false);
  });
  test('an allow-list smaller than the range disables it', () => {
    render(<RangeCalendar aria-label="r" presets={presets} enabledDates={[d(2026, 3, 1), d(2026, 3, 2)]} />);
    expect(disabled('March')).toBe(true);
    expect(disabled('Ten years')).toBe(true);
  });
  test('an allow-list covering the whole range keeps it usable', () => {
    const all = Array.from({ length: 31 }, (_, i) => d(2026, 3, i + 1));
    render(<RangeCalendar aria-label="r" presets={[presets[0]]} enabledDates={all} />);
    expect(disabled('March')).toBe(false);
  });
  test('a rule is applied to every day of the range', () => {
    const weekends = (x: Date) => x.getDay() === 0 || x.getDay() === 6;
    render(<RangeCalendar aria-label="r" presets={presets} isDateDisabled={weekends} />);
    expect(disabled('March')).toBe(true);
  });
  test('re-rendering with the same rule does not walk long ranges again', () => {
    let calls = 0;
    const rule = () => (calls++, false);
    const ui = <RangeCalendar aria-label="r" presets={presets} isDateDisabled={rule} />;
    const { rerender } = render(ui);
    const first = calls;
    for (let i = 0; i < 5; i++) rerender(<RangeCalendar aria-label="r" presets={presets} isDateDisabled={rule} />);
    // The grid itself still asks about the days it shows (a few hundred), not the ~3,650-day range again.
    expect(calls - first).toBeLessThan(1000);
    expect(first).toBeGreaterThan(3000);
  });
});

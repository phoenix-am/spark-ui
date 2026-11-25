import type { SparkMessages } from '../internal/messages';
/**
 * Ready-made shortcuts for Calendar, DatePicker, RangeCalendar and
 * DateRangePicker. Each preset's value is a function, so "Tomorrow" is
 * worked out when it's clicked, not when the page loaded. Labels are
 * English by default; pass your own for other languages.
 *
 *   presets={[datePresets.today(), datePresets.tomorrow(), datePresets.inDays(7, 'In a week')]}
 *   presets={[rangePresets.next(7, 'days'), rangePresets.last(1, 'months'), rangePresets.thisYear()]}
 */

export interface DatePreset {
  /** The button text. */
  label: string;
  /** A date, or a function returning one when the preset is used. */
  value: Date | (() => Date);
}

export interface DateRange {
  /** The first day of the range. */
  start: Date;
  /** The last day of the range. */
  end: Date;
}

export interface RangePreset {
  /** The button text. */
  label: string;
  /** A range, or a function returning one when the preset is used. */
  value: DateRange | (() => DateRange);
}

export type PresetUnit = 'days' | 'weeks' | 'months' | 'years';

const day = (d: Date) => new Date(d.getFullYear(), d.getMonth(), d.getDate());
const today = () => day(new Date());

/** Add whole days, weeks, months or years (month ends clamp: 31 Jan + 1 month = 28/29 Feb). */
export function addTime(date: Date, amount: number, unit: PresetUnit): Date {
  const d = day(date);
  if (unit === 'days') return new Date(d.getFullYear(), d.getMonth(), d.getDate() + amount);
  if (unit === 'weeks') return new Date(d.getFullYear(), d.getMonth(), d.getDate() + amount * 7);
  const months = unit === 'months' ? amount : amount * 12;
  const target = new Date(d.getFullYear(), d.getMonth() + months, 1);
  const lastDay = new Date(target.getFullYear(), target.getMonth() + 1, 0).getDate();
  return new Date(target.getFullYear(), target.getMonth(), Math.min(d.getDate(), lastDay));
}

const plural = (n: number, unit: PresetUnit) => `${n} ${n === 1 ? unit.slice(0, -1) : unit}`;

export const datePresets = {
  today: (label = 'Today'): DatePreset => ({ label, value: today }),
  tomorrow: (label = 'Tomorrow'): DatePreset => ({ label, value: () => addTime(today(), 1, 'days') }),
  yesterday: (label = 'Yesterday'): DatePreset => ({ label, value: () => addTime(today(), -1, 'days') }),
  /** `n` units from today; negative goes back. E.g. inDays(7), in(1, 'months', 'Next month'). */
  in: (n: number, unit: PresetUnit, label = n === 1 ? `In a ${unit.slice(0, -1)}` : n === -1 ? `A ${unit.slice(0, -1)} ago` : n >= 0 ? `In ${plural(n, unit)}` : `${plural(-n, unit)} ago`): DatePreset => ({
    label,
    value: () => addTime(today(), n, unit),
  }),
  inDays: (n: number, label?: string): DatePreset => datePresets.in(n, 'days', label),
};

export const rangePresets = {
  /** Today plus the next n units, e.g. next(7, 'days') → today … today + 6. */
  next: (n: number, unit: PresetUnit, label = n === 1 ? `Next ${unit.slice(0, -1)}` : `Next ${plural(n, unit)}`): RangePreset => ({
    label,
    value: () => ({ start: today(), end: addTime(addTime(today(), n, unit), -1, 'days') }),
  }),
  /** The last n units up to today, e.g. last(30, 'days') → today − 29 … today. */
  last: (n: number, unit: PresetUnit, label = n === 1 ? `Last ${unit.slice(0, -1)}` : `Last ${plural(n, unit)}`): RangePreset => ({
    label,
    value: () => ({ start: addTime(addTime(today(), -n, unit), 1, 'days'), end: today() }),
  }),
  thisWeek: (label = 'This week', firstDay = 1): RangePreset => ({
    label,
    value: () => {
      const t = today();
      const start = addTime(t, -((t.getDay() - firstDay + 7) % 7), 'days');
      return { start, end: addTime(start, 6, 'days') };
    },
  }),
  thisMonth: (label = 'This month'): RangePreset => ({
    label,
    value: () => {
      const t = today();
      return { start: new Date(t.getFullYear(), t.getMonth(), 1), end: new Date(t.getFullYear(), t.getMonth() + 1, 0) };
    },
  }),
  thisYear: (label = 'This year'): RangePreset => ({
    label,
    value: () => {
      const y = today().getFullYear();
      return { start: new Date(y, 0, 1), end: new Date(y, 11, 31) };
    },
  }),
};

export const resolvePreset = <T,>(value: T | (() => T)): T => (typeof value === 'function' ? (value as () => T)() : value);

/**
 * Short names for presets, so most apps need no code:
 *   'today' | 'tomorrow' | 'yesterday'            (dates)
 *   'thisWeek' | 'thisMonth' | 'thisYear'         (ranges)
 *   '+7d' '+2w' '+1m' '+1y'                       forward from today
 *   '-30d' '-1m'                                  back from today
 */
export type DatePresetName = 'today' | 'tomorrow' | 'yesterday' | `${'+' | '-'}${number}${'d' | 'w' | 'm' | 'y'}`;
export type RangePresetName = 'today' | 'thisWeek' | 'thisMonth' | 'thisYear' | `${'+' | '-'}${number}${'d' | 'w' | 'm' | 'y'}`;

const UNITS: Record<string, PresetUnit> = { d: 'days', w: 'weeks', m: 'months', y: 'years' };
const parseOffset = (s: string) => {
  const m = /^([+-])(\d+)([dwmy])$/.exec(s);
  return m ? { n: Number(m[2]) * (m[1] === '-' ? -1 : 1), unit: UNITS[m[3]] } : null;
};

/** What preset labels need from the message table (see `useMessages`). */
export type PresetText = Pick<SparkMessages, 'today' | 'thisWeek' | 'thisMonth' | 'thisYear' | 'nextAmount' | 'lastAmount'> & { locale: string };

const SINGULAR: Record<PresetUnit, Intl.RelativeTimeFormatUnit> = { days: 'day', weeks: 'week', months: 'month', years: 'year' };
const cap = (s: string, locale: string) => s.charAt(0).toLocaleUpperCase(locale) + s.slice(1);
/** "Tomorrow", "In 7 days", "2 weeks ago", in the locale's own words. */
function relativeLabel(n: number, unit: PresetUnit, t: PresetText) {
  return cap(new Intl.RelativeTimeFormat(t.locale, { numeric: 'auto' }).format(n, SINGULAR[unit]), t.locale);
}
/** "7 days", "1 month", in the locale's own words. */
function amount(n: number, unit: PresetUnit, t: PresetText) {
  return new Intl.NumberFormat(t.locale, { style: 'unit', unit: SINGULAR[unit], unitDisplay: 'long' }).format(n);
}

/** Turn a short name into a preset. With `text`, labels follow the locale; without it, English. */
export function toDatePreset(p: DatePreset | DatePresetName, text?: PresetText): DatePreset {
  if (typeof p !== 'string') return p;
  if (p === 'today') return datePresets.today(text?.today);
  if (p === 'tomorrow' || p === 'yesterday') return text ? datePresets.in(p === 'tomorrow' ? 1 : -1, 'days', relativeLabel(p === 'tomorrow' ? 1 : -1, 'days', text)) : datePresets[p]();
  const o = parseOffset(p);
  if (!o) throw new Error(`Unknown date preset "${p}"`);
  return datePresets.in(o.n, o.unit, text ? relativeLabel(o.n, o.unit, text) : undefined);
}

export function toRangePreset(p: RangePreset | RangePresetName, text?: PresetText): RangePreset {
  if (typeof p !== 'string') return p;
  if (p === 'today') return { label: text?.today ?? 'Today', value: () => ({ start: today(), end: today() }) };
  if (p === 'thisWeek' || p === 'thisMonth' || p === 'thisYear') return rangePresets[p](text?.[p]);
  const o = parseOffset(p);
  if (!o) throw new Error(`Unknown range preset "${p}"`);
  return o.n >= 0
    ? rangePresets.next(o.n, o.unit, text ? text.nextAmount(amount(o.n, o.unit, text)) : undefined)
    : rangePresets.last(-o.n, o.unit, text ? text.lastAmount(amount(-o.n, o.unit, text)) : undefined);
}

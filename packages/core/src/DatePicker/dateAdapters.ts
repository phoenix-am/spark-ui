import { CalendarDate, DateValue, GregorianCalendar, fromDate, getLocalTimeZone, toCalendar, toCalendarDate } from '@internationalized/date';
import { devWarn } from '../internal/devWarn';

/**
 * Spark UI's public date props use plain JS `Date`s; React Aria works with
 * `@internationalized/date` values. These helpers convert at the boundary.
 */
export const toDateValue = (d: Date | null | undefined): CalendarDate | null | undefined => {
  if (d === undefined) return undefined;
  if (d === null) return null;
  // Bad server data (`new Date('')`, a string, a number) shows as empty instead of crashing.
  if (!(d instanceof Date) || Number.isNaN(d.getTime())) {
    devWarn('Ignoring an invalid date:', d);
    return null;
  }
  return toCalendarDate(fromDate(d, getLocalTimeZone()));
};

export const fromDateValue = (v: DateValue | null | undefined): Date | null => (v ? v.toDate(getLocalTimeZone()) : null);

/** ISO `YYYY-MM-DD` in the Gregorian calendar, whatever calendar is displayed. */
export const toISO = (v: DateValue | null | undefined) => (v ? toCalendar(toCalendarDate(v), new GregorianCalendar()).toString() : '');

/** Calendar systems Intl understands, e.g. `indian`, `islamic-umalqura`, `buddhist`, `persian`, `japanese`. */
export type CalendarSystem =
  | 'gregory'
  | 'indian'
  | 'islamic-umalqura'
  | 'islamic-civil'
  | 'islamic-tbla'
  | 'buddhist'
  | 'persian'
  | 'japanese'
  | 'hebrew'
  | 'ethiopic'
  | 'coptic'
  | 'roc';

/** Add a calendar system to a locale: ('hi-IN', 'indian') → 'hi-IN-u-ca-indian'. */
export const withCalendar = (locale: string, calendar?: CalendarSystem) =>
  calendar ? `${locale.replace(/-u-ca-[a-z-]+$/, '')}-u-ca-${calendar}` : locale;

const days = ['sun', 'mon', 'tue', 'wed', 'thu', 'fri', 'sat'] as const;
export type FirstDayOfWeek = (typeof days)[number];
/** Old numeric `weekStartsOn` (0 = Sunday) to React Aria's `firstDayOfWeek`. */
export const toFirstDay = (n?: number): FirstDayOfWeek | undefined => (n === undefined ? undefined : days[((n % 7) + 7) % 7]);

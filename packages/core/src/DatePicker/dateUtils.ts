/** Small, dependency-free date helpers. All dates are treated as local calendar days. */

export const startOfDay = (d: Date) => new Date(d.getFullYear(), d.getMonth(), d.getDate());

export const isSameDay = (a?: Date | null, b?: Date | null) =>
  !!a && !!b && a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate();

export const addDays = (d: Date, n: number) => new Date(d.getFullYear(), d.getMonth(), d.getDate() + n);

/** Add months, clamping the day so 31 Jan + 1 month = 28/29 Feb. */
export const addMonths = (d: Date, n: number) => {
  const target = new Date(d.getFullYear(), d.getMonth() + n, 1);
  const last = new Date(target.getFullYear(), target.getMonth() + 1, 0).getDate();
  return new Date(target.getFullYear(), target.getMonth(), Math.min(d.getDate(), last));
};

export const startOfMonth = (d: Date) => new Date(d.getFullYear(), d.getMonth(), 1);

export const isBefore = (a: Date, b: Date) => startOfDay(a).getTime() < startOfDay(b).getTime();
export const isAfter = (a: Date, b: Date) => startOfDay(a).getTime() > startOfDay(b).getTime();

/** 6 rows × 7 days covering the month, starting on `weekStartsOn` (0 = Sunday). */
export const monthGrid = (month: Date, weekStartsOn: number) => {
  const first = startOfMonth(month);
  const offset = (first.getDay() - weekStartsOn + 7) % 7;
  const start = addDays(first, -offset);
  return Array.from({ length: 6 }, (_, w) => Array.from({ length: 7 }, (_, i) => addDays(start, w * 7 + i)));
};

/** Localised short weekday names, starting on `weekStartsOn`. */
export const weekdayNames = (locale: string | undefined, weekStartsOn: number, width: 'narrow' | 'short' | 'long') => {
  const fmt = new Intl.DateTimeFormat(locale, { weekday: width });
  // 4 Jan 1970 was a Sunday.
  return Array.from({ length: 7 }, (_, i) => fmt.format(new Date(1970, 0, 4 + ((i + weekStartsOn) % 7))));
};

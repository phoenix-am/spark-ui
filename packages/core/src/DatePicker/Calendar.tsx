import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Spark, SparkHandle } from '../Spark';
import { cx } from '../internal/cx';
import {
  addDays,
  addMonths,
  isAfter,
  isBefore,
  isSameDay,
  monthGrid,
  startOfDay,
  startOfMonth,
  weekdayNames,
} from './dateUtils';
import { useDefaults } from '../internal/defaults';

export interface CalendarProps {
  /** The selected day. */
  value?: Date | null;
  /** Called with the picked day. */
  onChange?: (date: Date) => void;
  /** Earliest selectable day. */
  min?: Date;
  /** Latest selectable day. */
  max?: Date;
  /** Return `true` for days that can't be picked (e.g. weekends, holidays). */
  isDateDisabled?: (date: Date) => boolean;
  /** First day of the week: 0 = Sunday, 1 = Monday. Default 1. */
  weekStartsOn?: 0 | 1 | 2 | 3 | 4 | 5 | 6;
  /** BCP 47 locale for month and weekday names. Defaults to the browser's. */
  locale?: string;
  /** Move keyboard focus into the grid when the calendar mounts. */
  autoFocus?: boolean;
  /** Label for the "Today" shortcut, for other languages. */
  todayLabel?: string;
  /** Called on Escape, so a popover can close. */
  onEscape?: () => void;
  className?: string;
}

/**
 * Calendar: a month grid. The selected day is a lit node, today is a ring,
 * and picking a day throws a spark. Arrows move by day/week, PageUp/PageDown
 * by month (Shift: year), Home/End to the week's start/end, Enter selects.
 *
 * Style hooks: `.sp-calendar`, `__nav`, `__title`, `__grid`, `__weekday`,
 * `__day` with `[data-selected]`, `[data-today]`, `[data-outside]`, `:disabled`.
 */
export function Calendar(inProps: CalendarProps) {
  const {
  value,
  onChange,
  min,
  max,
  isDateDisabled,
  weekStartsOn = 1,
  locale,
  autoFocus = false,
  todayLabel = 'Today',
  onEscape,
  className,
} = useDefaults('Calendar', inProps);
  const today = startOfDay(new Date());
  const [focused, setFocused] = useState<Date>(startOfDay(value ?? clampToRange(today, min, max)));
  const [month, setMonth] = useState<Date>(startOfMonth(focused));
  const gridRef = useRef<HTMLTableElement>(null);
  const sparkRef = useRef<SparkHandle>(null);
  const shouldFocus = useRef(autoFocus);

  const weeks = useMemo(() => monthGrid(month, weekStartsOn), [month, weekStartsOn]);
  const dayNames = useMemo(() => weekdayNames(locale, weekStartsOn, 'short'), [locale, weekStartsOn]);
  const longDay = useMemo(
    () => new Intl.DateTimeFormat(locale, { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' }),
    [locale],
  );
  const monthLabel = new Intl.DateTimeFormat(locale, { month: 'long', year: 'numeric' }).format(month);

  const disabled = (d: Date) =>
    (min ? isBefore(d, min) : false) || (max ? isAfter(d, max) : false) || (isDateDisabled?.(d) ?? false);

  // The one day that takes Tab focus: the focused day if it's in view, else the 1st.
  const inView = focused.getMonth() === month.getMonth() && focused.getFullYear() === month.getFullYear();
  const tabTarget = inView ? focused : month;

  const prevDisabled = !!min && !isAfter(startOfMonth(month), startOfMonth(min));
  const nextDisabled = !!max && !isBefore(startOfMonth(month), startOfMonth(max));

  // Keep the focused day's button focused after keyboard moves.
  useEffect(() => {
    if (!shouldFocus.current) return;
    gridRef.current?.querySelector<HTMLButtonElement>('button[tabindex="0"]')?.focus();
  }, [focused, month]);

  const moveTo = (d: Date) => {
    const next = clampToRange(d, min, max);
    shouldFocus.current = true;
    setFocused(next);
    if (next.getMonth() !== month.getMonth() || next.getFullYear() !== month.getFullYear()) {
      setMonth(startOfMonth(next));
    }
  };

  const select = (d: Date, event?: React.MouseEvent<HTMLElement>) => {
    if (disabled(d)) return;
    sparkRef.current?.burst(event);
    setFocused(d);
    onChange?.(d);
  };

  const onKeyDown = (e: React.KeyboardEvent) => {
    const dow = (focused.getDay() - weekStartsOn + 7) % 7;
    const map: Record<string, () => Date> = {
      ArrowLeft: () => addDays(focused, -1),
      ArrowRight: () => addDays(focused, 1),
      ArrowUp: () => addDays(focused, -7),
      ArrowDown: () => addDays(focused, 7),
      Home: () => addDays(focused, -dow),
      End: () => addDays(focused, 6 - dow),
      PageUp: () => addMonths(focused, e.shiftKey ? -12 : -1),
      PageDown: () => addMonths(focused, e.shiftKey ? 12 : 1),
    };
    if (map[e.key]) {
      e.preventDefault();
      moveTo(map[e.key]());
    } else if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      select(focused);
    } else if (e.key === 'Escape' && onEscape) {
      e.preventDefault();
      onEscape();
    }
  };

  return (
    <div className={cx('sp-calendar', className)}>
      <div className="sp-calendar__header">
        <button type="button" className="sp-calendar__nav" aria-label="Previous month" disabled={prevDisabled} onClick={() => setMonth(addMonths(month, -1))}>
          <svg width="16" height="16" viewBox="0 0 16 16" aria-hidden="true"><path d="M10 3L5 8l5 5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>
        </button>
        <h2 aria-live="polite" className="sp-calendar__title">
          {monthLabel}
        </h2>
        <button type="button" className="sp-calendar__nav" aria-label="Next month" disabled={nextDisabled} onClick={() => setMonth(addMonths(month, 1))}>
          <svg width="16" height="16" viewBox="0 0 16 16" aria-hidden="true"><path d="M6 3l5 5-5 5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>
        </button>
      </div>

      <table ref={gridRef} role="grid" aria-label={monthLabel} onKeyDown={onKeyDown} className="sp-calendar__grid">
        <thead>
          <tr>
            {dayNames.map((n) => (
              <th key={n} scope="col" abbr={n} className="sp-calendar__weekday">
                {n}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {weeks.map((week) => (
            <tr key={week[0].toISOString()}>
              {week.map((d) => {
                const outside = d.getMonth() !== month.getMonth();
                const selected = isSameDay(d, value);
                const isToday = isSameDay(d, today);
                const tabbable = isSameDay(d, tabTarget) && !outside;
                return (
                  <td key={d.toISOString()} role="gridcell" aria-selected={selected || undefined} className="sp-calendar__cell">
                    <button
                      type="button"
                      tabIndex={tabbable ? 0 : -1}
                      disabled={disabled(d)}
                      aria-label={longDay.format(d)}
                      aria-current={isToday ? 'date' : undefined}
                      data-selected={selected || undefined}
                      data-today={isToday || undefined}
                      data-outside={outside || undefined}
                      onClick={(e) => select(d, e)}
                      onFocus={() => setFocused(d)}
                      className="sp-calendar__day"
                    >
                      {d.getDate()}
                    </button>
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>

      <div className="sp-calendar__footer">
        <button
          type="button"
          className="sp-calendar__today"
          disabled={disabled(today)}
          onClick={(e) => {
            setMonth(startOfMonth(today));
            select(today, e);
          }}
        >
          {todayLabel}
        </button>
      </div>
      <Spark ref={sparkRef} count={8} spread={40} />
    </div>
  );
}

function clampToRange(d: Date, min?: Date, max?: Date) {
  if (min && isBefore(d, min)) return startOfDay(min);
  if (max && isAfter(d, max)) return startOfDay(max);
  return startOfDay(d);
}

export default Calendar;

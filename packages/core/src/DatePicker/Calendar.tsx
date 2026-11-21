import React, { useEffect, useMemo, useRef, useState } from 'react';
import { css } from '@emotion/react';
import { useTheme } from '@spark-ui/system';
import { alpha } from '@spark-ui/utils';
import { Spark, SparkHandle } from '../Spark';
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

export interface CalendarProps {
  /** The selected day. */
  value?: Date | null;
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
}

/**
 * Calendar: a month grid. The selected day is a lit node, today is a ring,
 * and picking a day throws a spark. Fully keyboard operable: arrows move by
 * day/week, PageUp/PageDown by month (with Shift: by year), Home/End to the
 * start/end of the week, Enter or Space selects.
 */
export function Calendar({
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
}: CalendarProps) {
  const { theme } = useTheme();
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
    const btn = gridRef.current?.querySelector<HTMLButtonElement>('button[tabindex="0"]');
    btn?.focus();
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

  const navBtn = css`
    width: 2.25rem;
    height: 2.25rem;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    border: 1px solid ${theme.surface.border};
    border-radius: ${theme.borderRadius.small};
    background: transparent;
    color: ${theme.text.primary};
    cursor: pointer;
    &:hover:not(:disabled) {
      border-color: ${theme.energy.current};
      color: ${theme.energy.current};
    }
    &:disabled {
      color: ${theme.text.disabled};
      cursor: not-allowed;
    }
    &:focus-visible {
      outline: 2px solid ${theme.energy.current};
      outline-offset: 2px;
    }
  `;

  return (
    <div
      css={css`
        position: relative;
        width: 18.5rem;
        max-width: 100%;
        font-family: ${theme.typography.fontFamily};
        color: ${theme.text.primary};
      `}
    >
      <div css={css`display: flex; align-items: center; justify-content: space-between; margin-bottom: 0.75rem;`}>
        <button type="button" css={navBtn} aria-label="Previous month" disabled={prevDisabled} onClick={() => setMonth(addMonths(month, -1))}>
          <svg width="16" height="16" viewBox="0 0 16 16" aria-hidden="true"><path d="M10 3L5 8l5 5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>
        </button>
        <h2 aria-live="polite" css={css`margin: 0; font-size: 0.9375rem; font-weight: 700;`}>
          {monthLabel}
        </h2>
        <button type="button" css={navBtn} aria-label="Next month" disabled={nextDisabled} onClick={() => setMonth(addMonths(month, 1))}>
          <svg width="16" height="16" viewBox="0 0 16 16" aria-hidden="true"><path d="M6 3l5 5-5 5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>
        </button>
      </div>

      <table
        ref={gridRef}
        role="grid"
        aria-label={monthLabel}
        onKeyDown={onKeyDown}
        css={css`width: 100%; border-collapse: collapse; table-layout: fixed;`}
      >
        <thead>
          <tr>
            {dayNames.map((n) => (
              <th key={n} scope="col" abbr={n} css={css`padding: 0 0 0.375rem; font-size: 0.6875rem; font-weight: 600; color: ${theme.text.secondary};`}>
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
                const off = disabled(d);
                const tabbable = isSameDay(d, tabTarget) && !outside;
                return (
                  <td key={d.toISOString()} role="gridcell" aria-selected={selected || undefined} css={css`padding: 2px; text-align: center;`}>
                    <button
                      type="button"
                      tabIndex={tabbable ? 0 : -1}
                      disabled={off}
                      aria-label={longDay.format(d)}
                      aria-current={isToday ? 'date' : undefined}
                      onClick={(e) => select(d, e)}
                      onFocus={() => setFocused(d)}
                      css={css`
                        position: relative;
                        width: 100%;
                        aspect-ratio: 1;
                        max-width: 2.5rem;
                        display: inline-flex;
                        align-items: center;
                        justify-content: center;
                        border: 2px solid ${selected ? theme.energy.current : isToday ? theme.surface.borderStrong : 'transparent'};
                        border-radius: 50%;
                        background: ${selected ? theme.energy.current : 'transparent'};
                        color: ${selected ? theme.text.onEnergy : off ? theme.text.disabled : outside ? theme.colors.primary.gray['400'] : theme.text.primary};
                        font: inherit;
                        font-size: 0.875rem;
                        font-weight: ${selected || isToday ? 700 : 500};
                        font-variant-numeric: tabular-nums;
                        text-decoration: ${off ? 'line-through' : 'none'};
                        box-shadow: ${selected ? `0 0 16px ${theme.energy.glow}` : 'none'};
                        cursor: ${off ? 'not-allowed' : 'pointer'};
                        transition: background ${theme.motion.fast}, box-shadow ${theme.motion.normal}, border-color ${theme.motion.fast};

                        &:hover:not(:disabled) {
                          border-color: ${theme.energy.current};
                          box-shadow: 0 0 10px ${alpha(theme.energy.current, 0.25)};
                        }
                        &:focus-visible {
                          outline: 2px solid ${theme.energy.current};
                          outline-offset: 2px;
                        }
                      `}
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

      <div css={css`display: flex; justify-content: flex-start; align-items: center; margin-top: 0.75rem; padding-top: 0.75rem; border-top: 1px solid ${theme.surface.border};`}>
        <button
          type="button"
          disabled={disabled(today)}
          onClick={(e) => {
            setMonth(startOfMonth(today));
            select(today, e);
          }}
          css={css`
            border: none;
            background: none;
            padding: 0.25rem 0;
            font: inherit;
            font-size: 0.8125rem;
            font-weight: 700;
            color: ${theme.energy.current};
            cursor: pointer;
            &:disabled {
              color: ${theme.text.disabled};
              cursor: not-allowed;
            }
            &:focus-visible {
              outline: 2px solid ${theme.energy.current};
              outline-offset: 2px;
            }
          `}
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

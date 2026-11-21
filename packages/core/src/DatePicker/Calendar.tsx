import React, { useRef } from 'react';
import { I18nProvider, useButton, useCalendar, useCalendarCell, useCalendarGrid, useLocale } from 'react-aria';
import { useCalendarState, CalendarState } from 'react-stately';
import { CalendarDate, DateValue, createCalendar, getLocalTimeZone, isToday, today } from '@internationalized/date';
import type { AriaCalendarProps, AriaButtonProps } from 'react-aria';
import { Spark, SparkHandle } from '../Spark';
import { cx } from '../internal/cx';
import { useDefaults } from '../internal/defaults';
import { CalendarSystem, FirstDayOfWeek, fromDateValue, toDateValue, toFirstDay, withCalendar } from './dateAdapters';

export interface CalendarProps {
  /** The selected day. */
  value?: Date | null;
  /** Initial selected day when uncontrolled. */
  defaultValue?: Date | null;
  /** Called with the picked day. */
  onChange?: (date: Date) => void;
  /** Earliest selectable day. */
  min?: Date;
  /** Latest selectable day. */
  max?: Date;
  /** Return `true` for days that can't be picked (e.g. weekends, holidays). */
  isDateDisabled?: (date: Date) => boolean;
  /** First day of the week. Defaults to the locale's convention. */
  firstDayOfWeek?: FirstDayOfWeek;
  /** @deprecated Use `firstDayOfWeek`. 0 = Sunday, 1 = Monday. */
  weekStartsOn?: 0 | 1 | 2 | 3 | 4 | 5 | 6;
  /** BCP 47 locale for names, digits and direction. Defaults to SparkProvider's or the browser's. */
  locale?: string;
  /** Calendar system to display, e.g. `indian` (Saka), `islamic-umalqura`, `buddhist`. Values stay JS Dates. */
  calendar?: CalendarSystem;
  /** Move keyboard focus into the grid when the calendar mounts. */
  autoFocus?: boolean;
  /** Label for the "Today" shortcut, for other languages. */
  todayLabel?: string;
  /** Called on Escape, so a custom popover can close. */
  onEscape?: () => void;
  /** Accessible name for the calendar. */
  'aria-label'?: string;
  className?: string;
}

/**
 * Calendar: a month grid. The selected day is a lit node, today is a ring,
 * and picking a day throws a spark. Behaviour comes from React Aria: arrows,
 * Page Up/Down (Shift for years), Home/End, right-to-left mirroring,
 * localized names and digits, other calendar systems, and announcements
 * when the month changes.
 *
 * Style hooks: `.sp-calendar`, `__nav`, `__title`, `__grid`, `__weekday`,
 * `__day` with `[data-selected]`, `[data-today]`, `[data-outside]`,
 * `[data-unavailable]`, `[data-disabled]`, `[data-focus-visible]`.
 */
export function Calendar(inProps: CalendarProps) {
  const { value, defaultValue, onChange, min, max, isDateDisabled, firstDayOfWeek, weekStartsOn, locale, calendar, ...rest } = useDefaults(
    'Calendar',
    inProps,
  );
  const { locale: inherited } = useLocale();
  return (
    <I18nProvider locale={withCalendar(locale ?? inherited, calendar)}>
      <CalendarCore
        value={value === undefined ? undefined : toDateValue(value)}
        defaultValue={toDateValue(defaultValue)}
        onChange={(v) => v && onChange?.(fromDateValue(v)!)}
        minValue={toDateValue(min) ?? undefined}
        maxValue={toDateValue(max) ?? undefined}
        isDateUnavailable={isDateDisabled ? (d) => isDateDisabled(fromDateValue(d)!) : undefined}
        firstDayOfWeek={firstDayOfWeek ?? toFirstDay(weekStartsOn)}
        {...rest}
      />
    </I18nProvider>
  );
}

export interface CalendarCoreProps extends AriaCalendarProps<DateValue> {
  firstDayOfWeek?: FirstDayOfWeek;
  todayLabel?: string;
  onEscape?: () => void;
  className?: string;
}

/** React Aria-level calendar, also used inside DatePicker's popover. */
export function CalendarCore({ todayLabel = 'Today', onEscape, className, firstDayOfWeek, ...props }: CalendarCoreProps) {
  const { locale, direction } = useLocale();
  const sparkRef = useRef<SparkHandle>(null);
  const lastPointer = useRef<{ clientX: number; clientY: number } | null>(null);

  const onChange = (v: DateValue) => {
    const p = lastPointer.current;
    sparkRef.current?.burst(p ? (p as unknown as React.MouseEvent<HTMLElement>) : undefined);
    lastPointer.current = null;
    props.onChange?.(v as never);
  };

  const state = useCalendarState({ ...props, onChange, firstDayOfWeek, locale, createCalendar });
  const { calendarProps, prevButtonProps, nextButtonProps, title } = useCalendar({ ...props, onChange }, state);
  const todayDate = today(getLocalTimeZone());
  const todayBlocked = state.isCellUnavailable(todayDate) || state.isInvalid(todayDate);

  return (
    <div
      {...calendarProps}
      dir={direction}
      className={cx('sp-calendar', className)}
      onPointerDown={(e) => (lastPointer.current = { clientX: e.clientX, clientY: e.clientY })}
      onKeyDown={(e) => {
        if (e.key === 'Escape' && onEscape) onEscape();
      }}
    >
      <div className="sp-calendar__header">
        <NavButton {...prevButtonProps} direction={direction} kind="prev" />
        <h2 className="sp-calendar__title">{title}</h2>
        <NavButton {...nextButtonProps} direction={direction} kind="next" />
      </div>
      <CalendarGrid state={state} firstDayOfWeek={firstDayOfWeek} />
      <div className="sp-calendar__footer">
        <button
          type="button"
          className="sp-calendar__today"
          disabled={todayBlocked || state.isDisabled}
          onClick={(e) => {
            lastPointer.current = { clientX: e.clientX, clientY: e.clientY };
            state.setFocusedDate(todayDate);
            state.selectDate(todayDate);
          }}
        >
          {todayLabel}
        </button>
      </div>
      <Spark ref={sparkRef} count={8} spread={40} />
    </div>
  );
}

function NavButton({ kind, direction, ...props }: AriaButtonProps & { kind: 'prev' | 'next'; direction: 'ltr' | 'rtl' }) {
  const ref = useRef<HTMLButtonElement>(null);
  const { buttonProps } = useButton(props, ref);
  // Arrows point the way time moves, so they swap in right-to-left languages.
  const pointsLeft = (kind === 'prev') === (direction === 'ltr');
  return (
    <button {...buttonProps} ref={ref} className="sp-calendar__nav">
      <svg width="16" height="16" viewBox="0 0 16 16" aria-hidden="true">
        <path d={pointsLeft ? 'M10 3L5 8l5 5' : 'M6 3l5 5-5 5'} fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </button>
  );
}

function CalendarGrid({ state, firstDayOfWeek }: { state: CalendarState; firstDayOfWeek?: FirstDayOfWeek }) {
  const { gridProps, headerProps, weekDays, weeksInMonth } = useCalendarGrid({ firstDayOfWeek, weekdayStyle: 'short' }, state);
  return (
    <table {...gridProps} className="sp-calendar__grid">
      <thead {...headerProps}>
        <tr>
          {weekDays.map((day, i) => (
            <th key={i} className="sp-calendar__weekday">
              {day}
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {Array.from({ length: weeksInMonth }, (_, week) => (
          <tr key={week}>
            {state.getDatesInWeek(week).map((date, i) =>
              date ? <CalendarCell key={i} state={state} date={date} /> : <td key={i} className="sp-calendar__cell" />,
            )}
          </tr>
        ))}
      </tbody>
    </table>
  );
}

function CalendarCell({ state, date }: { state: CalendarState; date: CalendarDate }) {
  const ref = useRef<HTMLDivElement>(null);
  const { cellProps, buttonProps, isSelected, isOutsideVisibleRange, isDisabled, isUnavailable, isFocused, formattedDate } = useCalendarCell(
    { date },
    state,
    ref,
  );
  return (
    <td {...cellProps} className="sp-calendar__cell">
      <div
        {...buttonProps}
        ref={ref}
        className="sp-calendar__day"
        data-selected={isSelected || undefined}
        data-today={isToday(date, getLocalTimeZone()) || undefined}
        data-outside={isOutsideVisibleRange || undefined}
        data-disabled={isDisabled || undefined}
        data-unavailable={isUnavailable || undefined}
        data-focused={isFocused || undefined}
      >
        {formattedDate}
      </div>
    </td>
  );
}

export default Calendar;

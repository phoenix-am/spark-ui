import React, { useRef } from 'react';
import { useMessages } from '../internal/messages';
import { I18nProvider, useButton, useCalendar, useCalendarCell, useCalendarGrid, useDateFormatter, useLocale, useRangeCalendar } from 'react-aria';
import { useCalendarState, useRangeCalendarState, CalendarState, RangeCalendarState } from 'react-stately';
import { CalendarDate, DateValue, createCalendar, getLocalTimeZone, isSameDay, isToday, today } from '@internationalized/date';
import type { AriaCalendarProps, AriaRangeCalendarProps, AriaButtonProps } from 'react-aria';
import { Spark, SparkHandle } from '../Spark';
import { useDefaults, slot, ClassNames } from '../internal/defaults';
import { CalendarSystem, FirstDayOfWeek, fromDateValue, toDateValue, toFirstDay, withCalendar } from './dateAdapters';
import { DatePreset, DatePresetName, DateRange, RangePreset, RangePresetName, resolvePreset, toDatePreset, toRangePreset } from './presets';
import { warnDeprecated } from '../internal/devWarn';

export type CalendarSlot = 'root' | 'header' | 'title' | 'nav' | 'months' | 'grid' | 'weekday' | 'cell' | 'day' | 'footer' | 'preset';

/** What `renderDay` gets for each day. */
export interface DayRenderInfo {
  /** The day number as the locale writes it (e.g. "१५" in Hindi digits). */
  formatted: string;
  /** The day is selected. */
  selected: boolean;
  /** The day is today. */
  today: boolean;
  /** Can't be picked: outside min/max, disabled, or not in `enabledDates`. */
  unavailable: boolean;
  /** Belongs to the previous or next month. */
  outside: boolean;
  /** Range calendars: inside the selected (or hovered) range. */
  inRange: boolean;
  /** Range calendars: the first day of the range. */
  rangeStart: boolean;
  /** Range calendars: the last day of the range. */
  rangeEnd: boolean;
}

/** Props shared by Calendar and RangeCalendar. */
export interface CalendarBaseProps {
  /** Earliest selectable day. */
  min?: Date;
  /** Latest selectable day. */
  max?: Date;
  /** Days that can't be picked, e.g. holidays or booked days. */
  disabledDates?: Date[];
  /** If set, only these days can be picked, e.g. open appointment slots. */
  enabledDates?: Date[];
  /** Return `true` for days that can't be picked, e.g. weekends. Combines with the lists above. */
  isDateDisabled?: (date: Date) => boolean;
  /** First day of the week. Defaults to the locale's convention. */
  firstDayOfWeek?: FirstDayOfWeek;
  /** @deprecated Use `firstDayOfWeek`. 0 = Sunday, 1 = Monday. */
  weekStartsOn?: 0 | 1 | 2 | 3 | 4 | 5 | 6;
  /** BCP 47 locale for names, digits and direction. Defaults to SparkProvider's or the browser's. */
  locale?: string;
  /** Calendar system to display, e.g. `indian` (Saka), `islamic-umalqura`, `buddhist`. Values stay JS Dates. */
  calendar?: CalendarSystem;
  /** Months shown side by side. Default 1. */
  visibleMonths?: number;
  /** Custom content for a day cell, e.g. a price or an event dot under the number. */
  renderDay?: (date: Date, info: DayRenderInfo) => React.ReactNode;
  /** Show the Today button. Default `true` for Calendar, `false` for RangeCalendar. Ignored when `presets` is set. */
  showToday?: boolean;
  /** Label for the Today button, for other languages. */
  todayLabel?: string;
  /** Move keyboard focus into the grid when the calendar mounts. */
  autoFocus?: boolean;
  /** Called on Escape, so a custom popover can close. */
  onEscape?: () => void;
  /** Accessible name for the calendar. */
  'aria-label'?: string;
  /** Extra class names for the outermost element. */
  className?: string;
  /** Extra classes for each part. */
  classNames?: ClassNames<CalendarSlot>;
}

export interface CalendarProps extends CalendarBaseProps {
  /** The selected day. */
  value?: Date | null;
  /** Initial selected day when uncontrolled. */
  defaultValue?: Date | null;
  /** Called with the picked day. */
  onChange?: (date: Date) => void;
  /**
   * Shortcut buttons under the calendar, replacing the Today button. Short
   * names (`'today'`, `'tomorrow'`, `'+7d'`, `'+1m'`, `'-1y'`) or your own
   * `{ label, value }` where value is a Date or a function returning one.
   */
  presets?: Array<DatePreset | DatePresetName>;
}

export interface RangeCalendarProps extends CalendarBaseProps {
  /** The selected range. */
  value?: DateRange | null;
  /** Initial range when uncontrolled. */
  defaultValue?: DateRange | null;
  /** Called with the picked range once both ends are chosen. */
  onChange?: (range: DateRange) => void;
  /**
   * Shortcut buttons under the calendar. Short names (`'+7d'` next 7 days,
   * `'-30d'` last 30 days, `'thisWeek'`, `'thisMonth'`, `'thisYear'`,
   * `'today'`) or your own `{ label, value }`.
   */
  presets?: Array<RangePreset | RangePresetName>;
  /** Allow ranges that cross unavailable days. Default `false`. */
  allowsNonContiguousRanges?: boolean;
}

/* -------------------------------------------------------- availability */

const dayKey = (d: Date) => `${d.getFullYear()}-${d.getMonth()}-${d.getDate()}`;

/** One check for min/max-free availability: allow-list, block-list and rule. */
/** The check, plus what it was built from, so a range can be tested without visiting every day. */
type Unavailable = ((value: DateValue) => boolean) & { blockedDays?: Date[]; allowed?: Set<string> | null; rule?: (d: Date) => boolean };

export function makeUnavailable({ disabledDates, enabledDates, isDateDisabled }: CalendarBaseProps): Unavailable | undefined {
  if (!disabledDates && !enabledDates && !isDateDisabled) return undefined;
  const blocked = new Set((disabledDates ?? []).map(dayKey));
  const allowed = enabledDates ? new Set(enabledDates.map(dayKey)) : null;
  const check: Unavailable = (value: DateValue) => {
    const d = fromDateValue(value)!;
    const key = dayKey(d);
    return (allowed !== null && !allowed.has(key)) || blocked.has(key) || Boolean(isDateDisabled?.(d));
  };
  return Object.assign(check, { blockedDays: disabledDates ?? [], allowed, rule: isDateDisabled });
}

const startOfDay = (d: Date) => new Date(d.getFullYear(), d.getMonth(), d.getDate()).getTime();

/** Results of walking a range with a rule, per rule, so re-renders don't repeat the walk. */
const walked = new WeakMap<object, Map<string, boolean>>();

/**
 * Is every day from `start` to `end` available? Day-by-day only when it has to be:
 * no rules means yes, block and allow lists are checked directly, and a rule's
 * answer is remembered for as long as the same rule function is passed.
 */
function rangeAvailable(start: DateValue, end: DateValue, check: Unavailable | undefined, cell: (d: DateValue) => boolean): boolean {
  if (!check) return true;
  const from = startOfDay(fromDateValue(start)!);
  const to = startOfDay(fromDateValue(end)!);
  if (check.blockedDays && check.blockedDays.some((d) => startOfDay(d) >= from && startOfDay(d) <= to)) return false;
  const days = Math.round((to - from) / 86_400_000) + 1;
  // An allow-list smaller than the range can't cover it.
  if (check.allowed && days > check.allowed.size) return false;
  const rule = check.rule ?? (check.blockedDays === undefined ? check : undefined);
  if (!rule && !check.allowed) return true;
  const memo = rule ? walked.get(rule) ?? new Map<string, boolean>() : undefined;
  if (rule && !walked.has(rule)) walked.set(rule, memo!);
  const key = `${start.toString()}/${end.toString()}`;
  const known = memo?.get(key);
  if (known !== undefined && !check.allowed) return known;
  let ok = true;
  for (let d = start; d.compare(end) <= 0; d = d.add({ days: 1 }))
    if (cell(d)) {
      ok = false;
      break;
    }
  if (memo && !check.allowed) memo.set(key, ok);
  return ok;
}

/* ------------------------------------------------------------ Calendar */

/**
 * The month grid on its own, for when you want a calendar on the page rather
 * than in a popover.
 *
 * A month grid. The selected day is a lit node, today is a ring,
 * and picking a day throws a spark. Shortcut buttons (`presets`) sit under
 * the grid. Behaviour comes from React Aria: arrows, Page Up/Down (Shift for
 * years), Home/End, right-to-left mirroring, localized names and digits,
 * other calendar systems, and announcements when the month changes.
 *
 * Style hooks: `.sp-calendar`, `__header`, `__title`, `__nav`, `__months`,
 * `__grid`, `__weekday`, `__day` with `[data-selected]`, `[data-today]`,
 * `[data-unavailable]`, `[data-outside]`, `[data-focus-visible]`,
 * `__footer`, `__preset[data-active]`. Add classes with `classNames`.
 */
export function Calendar(inProps: CalendarProps) {
  const props = useDefaults('Calendar', inProps);
  warnDeprecated('Calendar', props, { weekStartsOn: 'Use `firstDayOfWeek`.', todayLabel: 'Use `presets`.' });
  const { value, defaultValue, onChange, min, max, firstDayOfWeek, weekStartsOn, locale, calendar, presets, showToday = true, todayLabel, ...ui } = props;
  const { locale: inherited } = useLocale();
  const m = useMessages();
  const isDateUnavailable = makeUnavailable(props);
  const resolved = presets?.map((p) => toDatePreset(p, m)) ?? (showToday ? [{ label: todayLabel ?? m.today, value: () => fromDateValue(today(getLocalTimeZone()))! }] : []);
  return (
    <I18nProvider locale={withCalendar(locale ?? inherited, calendar)}>
      <CalendarCore
        {...ui}
        value={value === undefined ? undefined : toDateValue(value)}
        defaultValue={toDateValue(defaultValue)}
        onChange={(v) => v && onChange?.(fromDateValue(v)!)}
        minValue={toDateValue(min) ?? undefined}
        maxValue={toDateValue(max) ?? undefined}
        isDateUnavailable={isDateUnavailable}
        firstDayOfWeek={firstDayOfWeek ?? toFirstDay(weekStartsOn)}
        presets={resolved}
      />
    </I18nProvider>
  );
}

type SharedUI = Pick<CalendarBaseProps, 'visibleMonths' | 'renderDay' | 'onEscape' | 'className' | 'classNames' | 'firstDayOfWeek'>;

export interface CalendarCoreProps extends AriaCalendarProps<DateValue>, SharedUI {
  presets?: DatePreset[];
  /** @deprecated Use presets. Kept for DatePicker's popover. */
  todayLabel?: string;
}

/** React Aria-level calendar, also used inside DatePicker's popover. */
export function CalendarCore({ presets, todayLabel, visibleMonths: rawMonths = 1, renderDay, onEscape, className, classNames, firstDayOfWeek, ...props }: CalendarCoreProps) {
  const { locale } = useLocale();
  const sparkRef = useRef<SparkHandle>(null);
  const pointer = useRef<{ clientX: number; clientY: number } | null>(null);
  const onChange = (v: DateValue) => {
    sparkRef.current?.burst((pointer.current ?? undefined) as unknown as React.MouseEvent<HTMLElement>);
    pointer.current = null;
    props.onChange?.(v as never);
  };
  const visibleMonths = Math.max(1, Math.floor(Number(rawMonths)) || 1);
  const ariaProps = { ...props, onChange, visibleDuration: { months: visibleMonths } };
  const state = useCalendarState({ ...ariaProps, firstDayOfWeek, locale, createCalendar });
  const ref = useRef<HTMLDivElement>(null);
  const { calendarProps, prevButtonProps, nextButtonProps } = useCalendar(ariaProps, state);
  const list = presets ?? [{ label: todayLabel ?? 'Today', value: () => fromDateValue(today(getLocalTimeZone()))! }];

  const choose = (preset: DatePreset) => {
    const d = toDateValue(resolvePreset(preset.value))!;
    state.setFocusedDate(d);
    state.selectDate(d);
  };
  const usable = (preset: DatePreset) => {
    const d = toDateValue(resolvePreset(preset.value))!;
    return !state.isDisabled && !state.isInvalid(d) && !state.isCellUnavailable(d);
  };
  const active = (preset: DatePreset) => Boolean(state.value && isSameDay(state.value, toDateValue(resolvePreset(preset.value))!));

  return (
    <CalendarShell
      calendarProps={calendarProps}
      calRef={ref}
      state={state}
      prevButtonProps={prevButtonProps}
      nextButtonProps={nextButtonProps}
      visibleMonths={visibleMonths}
      firstDayOfWeek={firstDayOfWeek}
      renderDay={renderDay}
      onEscape={onEscape}
      className={className}
      classNames={classNames}
      onPointer={(p) => (pointer.current = p)}
      presets={list.map((p) => ({ label: p.label, onPress: () => choose(p), disabled: !usable(p), active: active(p) }))}
      spark={<Spark ref={sparkRef} count={8} spread={40} />}
    />
  );
}

/* ------------------------------------------------------- RangeCalendar */

/**
 * A calendar for picking a range of dates, without the input field around it.
 *
 * Pick a start and an end day; current flows between them.
 * Hovering after the first click previews the range. Shows two months with
 * `visibleMonths={2}`. Shortcut buttons (`presets`) sit under the grid.
 *
 * Style hooks: as Calendar, plus `__day[data-range-start][data-range-end][data-in-range]`.
 */
export function RangeCalendar(inProps: RangeCalendarProps) {
  const props = useDefaults('RangeCalendar', inProps);
  warnDeprecated('RangeCalendar', props, { weekStartsOn: 'Use `firstDayOfWeek`.', todayLabel: 'Use `presets`.' });
  const { value, defaultValue, onChange, min, max, firstDayOfWeek, weekStartsOn, locale, calendar, presets, showToday = false, todayLabel, ...ui } = props;
  const { locale: inherited } = useLocale();
  const m = useMessages();
  const isDateUnavailable = makeUnavailable(props);
  const toRange = (r?: DateRange | null) => (r === undefined ? undefined : r === null ? null : { start: toDateValue(r.start)!, end: toDateValue(r.end)! });
  const resolved = presets?.map((p) => toRangePreset(p, m)) ?? (showToday ? [toRangePreset('today', m)] : []);
  if (resolved[0] && todayLabel && !presets) resolved[0] = { ...resolved[0], label: todayLabel };
  return (
    <I18nProvider locale={withCalendar(locale ?? inherited, calendar)}>
      <RangeCalendarCore
        {...ui}
        value={toRange(value)}
        defaultValue={toRange(defaultValue)}
        onChange={(r) => r && onChange?.({ start: fromDateValue(r.start)!, end: fromDateValue(r.end)! })}
        minValue={toDateValue(min) ?? undefined}
        maxValue={toDateValue(max) ?? undefined}
        isDateUnavailable={isDateUnavailable}
        firstDayOfWeek={firstDayOfWeek ?? toFirstDay(weekStartsOn)}
        presets={resolved}
      />
    </I18nProvider>
  );
}

export interface RangeCalendarCoreProps extends AriaRangeCalendarProps<DateValue>, SharedUI {
  presets?: RangePreset[];
}

/** React Aria-level range calendar, also used inside DateRangePicker's popover. */
export function RangeCalendarCore({ presets = [], visibleMonths: rawMonths = 1, renderDay, onEscape, className, classNames, firstDayOfWeek, ...props }: RangeCalendarCoreProps) {
  const { locale } = useLocale();
  const sparkRef = useRef<SparkHandle>(null);
  const pointer = useRef<{ clientX: number; clientY: number } | null>(null);
  const onChange = (v: { start: DateValue; end: DateValue }) => {
    sparkRef.current?.burst((pointer.current ?? undefined) as unknown as React.MouseEvent<HTMLElement>);
    pointer.current = null;
    props.onChange?.(v as never);
  };
  const visibleMonths = Math.max(1, Math.floor(Number(rawMonths)) || 1);
  const ariaProps = { ...props, onChange, visibleDuration: { months: visibleMonths } };
  const state = useRangeCalendarState({ ...ariaProps, firstDayOfWeek, locale, createCalendar });
  const ref = useRef<HTMLDivElement>(null);
  const { calendarProps, prevButtonProps, nextButtonProps } = useRangeCalendar(ariaProps, state, ref);

  const resolve = (p: RangePreset) => {
    const r = resolvePreset(p.value);
    return { start: toDateValue(r.start)!, end: toDateValue(r.end)! };
  };
  const choose = (p: RangePreset) => {
    const r = resolve(p);
    state.setFocusedDate(r.start);
    state.setValue(r);
    onChange(r);
  };
  const usable = (p: RangePreset) => {
    const r = resolve(p);
    if (state.isDisabled || state.isInvalid(r.start) || state.isInvalid(r.end)) return false;
    if (props.allowsNonContiguousRanges) return !state.isCellUnavailable(r.start) && !state.isCellUnavailable(r.end);
    return rangeAvailable(r.start, r.end, props.isDateUnavailable as Unavailable | undefined, (d) => state.isCellUnavailable(d as CalendarDate));
  };
  const active = (p: RangePreset) => {
    if (!state.value) return false;
    const r = resolve(p);
    return isSameDay(state.value.start, r.start) && isSameDay(state.value.end, r.end);
  };

  return (
    <CalendarShell
      calendarProps={calendarProps}
      calRef={ref}
      state={state}
      prevButtonProps={prevButtonProps}
      nextButtonProps={nextButtonProps}
      visibleMonths={visibleMonths}
      firstDayOfWeek={firstDayOfWeek}
      renderDay={renderDay}
      onEscape={onEscape}
      className={className}
      classNames={classNames}
      onPointer={(p) => (pointer.current = p)}
      range
      presets={presets.map((p) => ({ label: p.label, onPress: () => choose(p), disabled: !usable(p), active: active(p) }))}
      spark={<Spark ref={sparkRef} count={10} spread={50} />}
    />
  );
}

/* --------------------------------------------------------------- shell */

interface ShellProps {
  calendarProps: React.HTMLAttributes<HTMLElement>;
  calRef: React.RefObject<HTMLDivElement>;
  state: CalendarState | RangeCalendarState;
  prevButtonProps: AriaButtonProps;
  nextButtonProps: AriaButtonProps;
  visibleMonths: number;
  firstDayOfWeek?: FirstDayOfWeek;
  renderDay?: CalendarBaseProps['renderDay'];
  onEscape?: () => void;
  className?: string;
  classNames?: ClassNames<CalendarSlot>;
  onPointer: (p: { clientX: number; clientY: number }) => void;
  presets: Array<{ label: string; onPress: () => void; disabled: boolean; active: boolean }>;
  range?: boolean;
  spark: React.ReactNode;
}

function CalendarShell({ calendarProps, calRef, state, prevButtonProps, nextButtonProps, visibleMonths, firstDayOfWeek, renderDay, onEscape, className, classNames, onPointer, presets, range, spark }: ShellProps) {
  const { direction } = useLocale();
  const monthFormat = useDateFormatter({ month: 'long', year: 'numeric', calendar: state.visibleRange.start.calendar.identifier, timeZone: state.timeZone });
  const months = Array.from({ length: visibleMonths }, (_, i) => state.visibleRange.start.add({ months: i }));
  return (
    <div
      {...calendarProps}
      ref={calRef}
      dir={direction}
      className={slot('sp-calendar', classNames, 'root', className)}
      data-range={range || undefined}
      data-months={visibleMonths > 1 ? visibleMonths : undefined}
      onPointerDown={(e) => onPointer({ clientX: e.clientX, clientY: e.clientY })}
      onKeyDown={(e) => {
        if (e.key === 'Escape' && onEscape) onEscape();
      }}
    >
      <div className={slot('sp-calendar__months', classNames, 'months')}>
        {months.map((month, i) => (
          <div key={month.toString()} className="sp-calendar__month">
            <div className={slot('sp-calendar__header', classNames, 'header')}>
              {i === 0 ? <NavButton {...prevButtonProps} direction={direction} kind="prev" className={classNames?.nav} /> : <span className="sp-calendar__nav-spacer" />}
              <h2 className={slot('sp-calendar__title', classNames, 'title')}>{monthFormat.format(month.toDate(state.timeZone))}</h2>
              {i === months.length - 1 ? <NavButton {...nextButtonProps} direction={direction} kind="next" className={classNames?.nav} /> : <span className="sp-calendar__nav-spacer" />}
            </div>
            <CalendarGrid state={state} startDate={month} firstDayOfWeek={firstDayOfWeek} renderDay={renderDay} classNames={classNames} />
          </div>
        ))}
      </div>
      {presets.length > 0 && (
        <div className={slot('sp-calendar__footer', classNames, 'footer')}>
          {presets.map((p) => (
            <button
              key={p.label}
              type="button"
              className={slot('sp-calendar__preset sp-calendar__today', classNames, 'preset')}
              data-active={p.active || undefined}
              aria-pressed={p.active}
              disabled={p.disabled}
              onClick={(e) => {
                onPointer({ clientX: e.clientX, clientY: e.clientY });
                p.onPress();
              }}
            >
              {p.label}
            </button>
          ))}
        </div>
      )}
      {spark}
    </div>
  );
}

function NavButton({ kind, direction, className, ...props }: AriaButtonProps & { kind: 'prev' | 'next'; direction: 'ltr' | 'rtl'; className?: string }) {
  const ref = useRef<HTMLButtonElement>(null);
  const m = useMessages();
  const { buttonProps } = useButton({ ...props, 'aria-label': kind === 'prev' ? m.previous : m.next }, ref);
  // Arrows point the way time moves, so they swap in right-to-left languages.
  const pointsLeft = (kind === 'prev') === (direction === 'ltr');
  return (
    <button {...buttonProps} ref={ref} className={slot('sp-calendar__nav', { nav: className }, 'nav')}>
      <svg width="16" height="16" viewBox="0 0 16 16" aria-hidden="true">
        <path d={pointsLeft ? 'M10 3L5 8l5 5' : 'M6 3l5 5-5 5'} fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </button>
  );
}

function CalendarGrid({
  state,
  startDate,
  firstDayOfWeek,
  renderDay,
  classNames,
}: {
  state: CalendarState | RangeCalendarState;
  startDate: CalendarDate;
  firstDayOfWeek?: FirstDayOfWeek;
  renderDay?: CalendarBaseProps['renderDay'];
  classNames?: ClassNames<CalendarSlot>;
}) {
  const { gridProps, headerProps, weekDays, weeksInMonth } = useCalendarGrid({ startDate, endDate: startDate.add({ months: 1 }).subtract({ days: 1 }), firstDayOfWeek, weekdayStyle: 'short' }, state);
  return (
    <table {...gridProps} className={slot('sp-calendar__grid', classNames, 'grid')}>
      <thead {...headerProps}>
        <tr>
          {weekDays.map((day, i) => (
            <th key={i} className={slot('sp-calendar__weekday', classNames, 'weekday')}>
              {day}
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {Array.from({ length: weeksInMonth }, (_, week) => (
          <tr key={week}>
            {state.getDatesInWeek(week, startDate).map((date, i) =>
              date ? (
                <CalendarCell key={i} state={state} date={date} month={startDate} renderDay={renderDay} classNames={classNames} />
              ) : (
                <td key={i} className={slot('sp-calendar__cell', classNames, 'cell')} />
              ),
            )}
          </tr>
        ))}
      </tbody>
    </table>
  );
}

function CalendarCell({
  state,
  date,
  month,
  renderDay,
  classNames,
}: {
  state: CalendarState | RangeCalendarState;
  date: CalendarDate;
  month: CalendarDate;
  renderDay?: CalendarBaseProps['renderDay'];
  classNames?: ClassNames<CalendarSlot>;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const { cellProps, buttonProps, isSelected, isDisabled, isUnavailable, isFocused, formattedDate } = useCalendarCell({ date }, state, ref);
  const m = useMessages();
  const { locale } = useLocale();
  // React Aria words the day's name in English for languages it lacks (Hindi, Gujarati, Tamil).
  const dayLabel = /^en\b/i.test(locale)
    ? buttonProps['aria-label']
    : buttonProps['aria-label']?.replace(/^Today, /, `${m.today}, `).replace(/ selected$/, `, ${m.selected}`);
  const outside = date.month !== month.month;
  const range = 'highlightedRange' in state ? state.highlightedRange : null;
  const rangeStart = Boolean(range && isSameDay(date, range.start));
  const rangeEnd = Boolean(range && isSameDay(date, range.end));
  const inRange = Boolean(range && date.compare(range.start) >= 0 && date.compare(range.end) <= 0);
  const todayFlag = isToday(date, getLocalTimeZone());
  const info: DayRenderInfo = { formatted: formattedDate, selected: isSelected, today: todayFlag, unavailable: isUnavailable || isDisabled, outside, inRange, rangeStart, rangeEnd };
  return (
    <td {...cellProps} className={slot('sp-calendar__cell', classNames, 'cell')} data-in-range={(inRange && !outside) || undefined} data-range-start={(rangeStart && !outside) || undefined} data-range-end={(rangeEnd && !outside) || undefined}>
      <div
        {...buttonProps}
        aria-label={dayLabel}
        ref={ref}
        className={slot('sp-calendar__day', classNames, 'day')}
        data-selected={(isSelected && !outside) || undefined}
        data-today={todayFlag || undefined}
        data-outside={outside || undefined}
        data-disabled={isDisabled || undefined}
        data-unavailable={isUnavailable || undefined}
        data-focused={isFocused || undefined}
        data-range-start={(rangeStart && !outside) || undefined}
        data-range-end={(rangeEnd && !outside) || undefined}
        data-in-range={(inRange && !outside) || undefined}
        data-custom={renderDay ? true : undefined}
      >
        {renderDay ? renderDay(fromDateValue(date)!, info) : formattedDate}
      </div>
    </td>
  );
}

export default Calendar;

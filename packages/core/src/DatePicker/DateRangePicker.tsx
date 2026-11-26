import React, { useRef } from 'react';
import { useMessages } from '../internal/messages';
import { I18nProvider, useButton, useDateRangePicker, useLocale } from 'react-aria';
import { useDateRangePickerState } from 'react-stately';
import type { DateValue } from '@internationalized/date';
import { Popover } from '../base/Popover';
import { useDefaults, slot, ClassNames } from '../internal/defaults';
import { CalendarSlot, RangeCalendarCore, RangeCalendarProps, makeUnavailable } from './Calendar';
import { DateField, Dialog } from './DatePicker';
import { fromDateValue, toDateValue, toISO, withCalendar } from './dateAdapters';
import { DateRange, toRangePreset } from './presets';

export interface DateRangePickerProps
  extends Pick<
    RangeCalendarProps,
    | 'min' | 'max' | 'isDateDisabled' | 'disabledDates' | 'enabledDates' | 'firstDayOfWeek' | 'locale' | 'calendar'
    | 'presets' | 'renderDay' | 'allowsNonContiguousRanges'
  > {
  /** Visible label above the field. */
  label?: React.ReactNode;
  /** Accessible name when there is no visible label. */
  'aria-label'?: string;
  /** Controlled range; `null` for none. */
  value?: DateRange | null;
  /** Initial range when uncontrolled. */
  defaultValue?: DateRange | null;
  /** Called with the picked or typed range, or `null` when cleared. */
  onChange?: (range: DateRange | null) => void;
  /** Months shown in the popover. Default 2. */
  visibleMonths?: number;
  /** Help text under the field (or the error message when `error` is set). */
  helperText?: React.ReactNode;
  /** Shows the field in its error state. Pair it with `helperText`. */
  error?: boolean;
  /** Turns the control off: it can't be focused or changed, and it's announced as disabled. */
  disabled?: boolean;
  /** Marks the field as required: screen readers announce it and the form won't submit while it's empty. */
  required?: boolean;
  /** Show a clear button when a range is set. Default `true`. */
  clearable?: boolean;
  /** One hidden input with an ISO interval, e.g. `2026-12-01/2026-12-07`. */
  name?: string;
  /** Hidden input with the start date (ISO), e.g. `checkIn`. */
  startName?: string;
  /** Hidden input with the end date (ISO), e.g. `checkOut`. */
  endName?: string;
  /** Default `medium`. */
  size?: 'small' | 'medium' | 'large';
  /** Extra class names for the outermost element. */
  className?: string;
  /** Extra classes for each part: root, label, control, field, trigger, popover, helper. */
  classNames?: ClassNames<'root' | 'label' | 'control' | 'field' | 'trigger' | 'popover' | 'helper'>;
  /** Extra classes for the calendar's parts. */
  calendarClassNames?: ClassNames<CalendarSlot>;
}

/**
 * Choose a start and an end date in one go, with two months side by side and
 * presets like “This month” or “Last 30 days”.
 *
 * Type or pick a start and an end date; current flows
 * between them in the calendar. Two months side by side, shortcut buttons
 * (`presets`) under the calendar, and full control over which days can be
 * picked. Behaviour comes from React Aria: typed entry in the locale's order,
 * hover preview of the range, right-to-left, calendar systems.
 *
 * Style hooks: `.sp-date-picker.sp-date-range-picker[data-open][data-invalid]`,
 * `__control`, `.sp-date-field`, `__dash`, `__trigger`, `__clear`, `__popover`.
 */
export function DateRangePicker(inProps: DateRangePickerProps) {
  const props = useDefaults('DateRangePicker', inProps);
  const { locale: inherited } = useLocale();
  return (
    <I18nProvider locale={withCalendar(props.locale ?? inherited, props.calendar)}>
      <Inner {...props} />
    </I18nProvider>
  );
}

function Inner({
  label,
  'aria-label': ariaLabel,
  value,
  defaultValue,
  onChange,
  min,
  max,
  isDateDisabled,
  disabledDates,
  enabledDates,
  firstDayOfWeek,
  presets,
  renderDay,
  allowsNonContiguousRanges,
  visibleMonths = 2,
  helperText,
  error,
  disabled,
  required,
  clearable = true,
  name,
  startName,
  endName,
  size = 'medium',
  className,
  classNames,
  calendarClassNames,
}: DateRangePickerProps) {
  const { direction } = useLocale();
  const m = useMessages();
  const firstDay = firstDayOfWeek;
  const toRange = (r?: DateRange | null) => (r === undefined ? undefined : r === null ? null : { start: toDateValue(r.start)!, end: toDateValue(r.end)! });
  const ariaProps = {
    label,
    'aria-label': ariaLabel,
    value: toRange(value),
    defaultValue: toRange(defaultValue),
    onChange: (r: { start: DateValue; end: DateValue } | null) => onChange?.(r ? { start: fromDateValue(r.start)!, end: fromDateValue(r.end)! } : null),
    minValue: toDateValue(min) ?? undefined,
    maxValue: toDateValue(max) ?? undefined,
    isDateUnavailable: makeUnavailable({ isDateDisabled, disabledDates, enabledDates }),
    allowsNonContiguousRanges,
    isDisabled: disabled,
    isRequired: required,
    isInvalid: error,
    validationBehavior: 'aria' as const,
    description: !error && helperText ? helperText : undefined,
    errorMessage: error && helperText ? helperText : undefined,
    granularity: 'day' as const,
    firstDayOfWeek: firstDay,
    shouldCloseOnSelect: true,
  };
  const state = useDateRangePickerState(ariaProps);
  const groupRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const { groupProps, labelProps, startFieldProps, endFieldProps, buttonProps, dialogProps, calendarProps, descriptionProps, errorMessageProps } = useDateRangePicker(
    ariaProps,
    state,
    groupRef,
  );
  const { buttonProps: triggerButtonProps } = useButton({ ...buttonProps, 'aria-label': m.calendar }, triggerRef);
  const hasValue = Boolean(state.value?.start || state.value?.end);

  return (
    <div
      className={slot('sp-date-picker sp-date-range-picker', classNames, 'root', className)}
      dir={direction}
      data-tone={error ? 'error' : 'brand'}
      data-size={size}
      data-open={state.isOpen || undefined}
      data-invalid={error || undefined}
      data-disabled={disabled || undefined}
      data-empty={!hasValue || undefined}
    >
      {label && (
        <span {...labelProps} className={slot('sp-date-picker__label', classNames, 'label')}>
          {label}
          {required && (
            <span className="sp-field__required" aria-hidden="true">
              {' '}*
            </span>
          )}
        </span>
      )}
      <div {...groupProps} ref={groupRef} className={slot('sp-date-picker__control', classNames, 'control')}>
        <DateField {...startFieldProps} className={slot('sp-date-field', classNames, 'field')} />
        <span className="sp-date-range-picker__dash" aria-hidden="true">
          →
        </span>
        <DateField {...endFieldProps} className={slot('sp-date-field', classNames, 'field')} />
        {clearable && hasValue && !disabled && (
          <button type="button" aria-label={m.clearDates} className="sp-date-picker__clear" onClick={() => state.setValue(null)}>
            <svg width="14" height="14" viewBox="0 0 16 16" aria-hidden="true">
              <path d="M3 3l10 10M13 3L3 13" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
            </svg>
          </button>
        )}
        <button {...triggerButtonProps} ref={triggerRef} className={slot('sp-date-picker__trigger', classNames, 'trigger')}>
          <svg className="sp-date-picker__icon" width="18" height="18" viewBox="0 0 24 24" aria-hidden="true">
            <rect x="3" y="5" width="18" height="16" rx="2" fill="none" stroke="currentColor" strokeWidth="2" />
            <path d="M3 10h18M8 3v4M16 3v4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
          </svg>
        </button>
      </div>
      {helperText && (
        <p {...(error ? errorMessageProps : descriptionProps)} className={slot('sp-date-picker__helper', classNames, 'helper')}>
          {helperText}
        </p>
      )}
      {name && <input type="hidden" name={name} value={state.value?.start && state.value?.end ? `${toISO(state.value.start)}/${toISO(state.value.end)}` : ''} />}
      {startName && <input type="hidden" name={startName} value={toISO(state.value?.start ?? null)} />}
      {endName && <input type="hidden" name={endName} value={toISO(state.value?.end ?? null)} />}
      {state.isOpen && (
        <Popover state={state} triggerRef={groupRef} offset={8} className={slot('sp-date-picker__popover', classNames, 'popover')}>
          <Dialog {...dialogProps}>
            <RangeCalendarCore
              {...calendarProps}
              firstDayOfWeek={firstDay}
              visibleMonths={visibleMonths}
              renderDay={renderDay}
              presets={presets?.map((p) => toRangePreset(p, m)) ?? []}
              classNames={calendarClassNames}
            />
          </Dialog>
        </Popover>
      )}
    </div>
  );
}

export default DateRangePicker;

import React, { useRef } from 'react';
import { I18nProvider, useButton, useDateField, useDatePicker, useDateSegment, useDialog, useLocale } from 'react-aria';
import { useDateFieldState, useDatePickerState, DateFieldState, DateSegment } from 'react-stately';
import { DateValue, createCalendar } from '@internationalized/date';
import type { AriaDateFieldProps, AriaDialogProps } from 'react-aria';
import { CalendarCore, CalendarProps } from './Calendar';
import { Popover } from '../base/Popover';
import { useDefaults, slot, ClassNames } from '../internal/defaults';
import { CalendarSystem, FirstDayOfWeek, fromDateValue, toDateValue, toFirstDay, toISO, withCalendar } from './dateAdapters';

export interface DatePickerProps
  extends Pick<CalendarProps, 'min' | 'max' | 'isDateDisabled' | 'firstDayOfWeek' | 'weekStartsOn' | 'locale' | 'calendar' | 'todayLabel'> {
  /** Visible label above the field. */
  label?: React.ReactNode;
  /** Accessible name when there is no visible label. */
  'aria-label'?: string;
  /** Controlled value; `null` for no date. */
  value?: Date | null;
  /** Initial value when uncontrolled. */
  defaultValue?: Date | null;
  /** Called with the picked or typed date, or `null` when cleared. */
  onChange?: (date: Date | null) => void;
  /** Help text under the field (or the error message when `error` is set). */
  helperText?: React.ReactNode;
  /** Marks the field invalid. */
  error?: boolean;
  disabled?: boolean;
  required?: boolean;
  /** Show a clear button when a date is set. Default `true`. */
  clearable?: boolean;
  /** Name for a hidden input carrying the ISO date (YYYY-MM-DD), for plain forms. */
  name?: string;
  /** Default `medium`. */
  size?: 'small' | 'medium' | 'large';
  /** @deprecated The field now shows editable segments in the locale's order. */
  placeholder?: string;
  /** @deprecated The field now shows editable segments in the locale's order. */
  format?: Intl.DateTimeFormatOptions;
  className?: string;
  /** Extra classes for each part: root, label, control, field, trigger, popover, helper. */
  classNames?: ClassNames<'root' | 'label' | 'control' | 'field' | 'trigger' | 'popover' | 'helper'>;
}

/**
 * DatePicker: type a date or pick it from a calendar. The field lights up
 * while the calendar is open, and the picked day is a lit node with a spark.
 * Behaviour comes from React Aria: segment-by-segment typing in the
 * locale's order (DD/MM/YYYY in India, MM/DD/YYYY in the US), arrow keys to
 * adjust a segment, right-to-left layouts, other calendar systems, and a
 * dialog popover that restores focus.
 *
 * Style hooks: `.sp-date-picker[data-open][data-invalid][data-disabled]`,
 * `__label`, `__control`, `.sp-date-field`, `__segment[data-placeholder]`,
 * `__trigger`, `__clear`, `__helper`, `__popover`.
 */
export function DatePicker(inProps: DatePickerProps) {
  const props = useDefaults('DatePicker', inProps);
  const { locale: inherited } = useLocale();
  return (
    <I18nProvider locale={withCalendar(props.locale ?? inherited, props.calendar)}>
      <DatePickerInner {...props} />
    </I18nProvider>
  );
}

function DatePickerInner({
  label,
  'aria-label': ariaLabel,
  value,
  defaultValue,
  onChange,
  min,
  max,
  isDateDisabled,
  firstDayOfWeek,
  weekStartsOn,
  todayLabel,
  helperText,
  error,
  disabled,
  required,
  clearable = true,
  name,
  size = 'medium',
  className,
  classNames,
}: DatePickerProps) {
  const { direction } = useLocale();
  const firstDay = firstDayOfWeek ?? toFirstDay(weekStartsOn);
  const ariaProps = {
    label,
    'aria-label': ariaLabel,
    value: value === undefined ? undefined : toDateValue(value),
    defaultValue: toDateValue(defaultValue),
    onChange: (v: DateValue | null) => onChange?.(fromDateValue(v)),
    minValue: toDateValue(min) ?? undefined,
    maxValue: toDateValue(max) ?? undefined,
    isDateUnavailable: isDateDisabled ? (d: DateValue) => isDateDisabled(fromDateValue(d)!) : undefined,
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
  const state = useDatePickerState(ariaProps);
  const groupRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const { groupProps, labelProps, fieldProps, buttonProps, dialogProps, calendarProps, descriptionProps, errorMessageProps } = useDatePicker(
    ariaProps,
    state,
    groupRef,
  );
  const { buttonProps: triggerButtonProps } = useButton(buttonProps, triggerRef);

  return (
    <div
      className={slot('sp-date-picker', classNames, 'root', className)}
      dir={direction}
      data-tone={error ? 'error' : 'brand'}
      data-size={size}
      data-open={state.isOpen || undefined}
      data-invalid={error || undefined}
      data-disabled={disabled || undefined}
      data-empty={!state.value || undefined}
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
        <DateField {...fieldProps} className={slot('sp-date-field', classNames, 'field')} />
        {clearable && state.value && !disabled && (
          <button type="button" aria-label="Clear date" className="sp-date-picker__clear" onClick={() => state.setValue(null)}>
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
      {name && <input type="hidden" name={name} value={toISO(state.value)} />}
      {state.isOpen && (
        <Popover state={state} triggerRef={groupRef} offset={8} className={slot('sp-date-picker__popover', classNames, 'popover')}>
          <Dialog {...dialogProps}>
            <CalendarCore {...calendarProps} firstDayOfWeek={firstDay} todayLabel={todayLabel} />
          </Dialog>
        </Popover>
      )}
    </div>
  );
}

function DateField({ className, ...props }: AriaDateFieldProps<DateValue> & { className: string }) {
  const { locale } = useLocale();
  const state = useDateFieldState({ ...props, locale, createCalendar });
  const ref = useRef<HTMLDivElement>(null);
  const { fieldProps } = useDateField(props, state, ref);
  return (
    <div {...fieldProps} ref={ref} className={className}>
      {state.segments.map((segment, i) => (
        <Segment key={i} segment={segment} state={state} />
      ))}
    </div>
  );
}

function Segment({ segment, state }: { segment: DateSegment; state: DateFieldState }) {
  const ref = useRef<HTMLSpanElement>(null);
  const { segmentProps } = useDateSegment(segment, state, ref);
  return (
    <span
      {...segmentProps}
      ref={ref}
      className="sp-date-field__segment"
      data-type={segment.type}
      data-placeholder={segment.isPlaceholder || undefined}
      data-literal={segment.type === 'literal' || undefined}
    >
      {segment.text}
    </span>
  );
}

function Dialog({ children, ...props }: AriaDialogProps & { children: React.ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);
  const { dialogProps } = useDialog(props, ref);
  return (
    <div {...dialogProps} ref={ref} className="sp-date-picker__dialog">
      {children}
    </div>
  );
}

export type { FirstDayOfWeek, CalendarSystem };
export default DatePicker;

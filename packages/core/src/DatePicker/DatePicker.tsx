import React, { useEffect, useId, useRef, useState } from 'react';
import { Calendar, CalendarProps } from './Calendar';
import { cx } from '../internal/cx';
import { useDefaults, slot, ClassNames } from '../internal/defaults';

export interface DatePickerProps extends Omit<CalendarProps, 'autoFocus' | 'onEscape' | 'onChange' | 'value' | 'className'> {
  /** Visible label above the field. */
  label?: React.ReactNode;
  /** Controlled value; `null` for no date. */
  value?: Date | null;
  /** Initial value when uncontrolled. */
  defaultValue?: Date | null;
  /** Called with the picked date, or `null` when cleared. */
  onChange?: (date: Date | null) => void;
  /** Shown when no date is picked. Default "Pick a date". */
  placeholder?: string;
  /** Help or error text under the field. */
  helperText?: React.ReactNode;
  /** Marks the field invalid. */
  error?: boolean;
  disabled?: boolean;
  /** Show a clear button when a date is picked. Default `true`. */
  clearable?: boolean;
  /** How the picked date is shown in the field (Intl options). */
  format?: Intl.DateTimeFormatOptions;
  /** Name for a hidden input carrying the ISO date (YYYY-MM-DD), for plain forms. */
  name?: string;
  /** Default `medium`. */
  size?: 'small' | 'medium' | 'large';
  className?: string;
  /** Extra classes for each part: root, label, control, trigger, popover, helper. */
  classNames?: ClassNames<'root' | 'label' | 'control' | 'trigger' | 'popover' | 'helper'>;
}

const toISODate = (d: Date) =>
  `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;

/**
 * DatePicker: a field that opens a Calendar. The field lights up while the
 * calendar is open, and the picked day is a lit node with a spark.
 * Escape or a click outside closes it; focus returns to the field.
 *
 * Style hooks: `.sp-date-picker[data-open][data-invalid][data-disabled]`,
 * `__label`, `__control`, `__trigger`, `__clear`, `__helper`, `__popover`.
 */
export function DatePicker(inProps: DatePickerProps) {
  const {
  label,
  value,
  defaultValue = null,
  onChange,
  placeholder = 'Pick a date',
  helperText,
  error,
  disabled,
  clearable = true,
  format = { day: 'numeric', month: 'short', year: 'numeric' },
  name,
  size = 'medium',
  locale,
  className,
  classNames,
  ...calendarProps
} = useDefaults('DatePicker', inProps);
  const [inner, setInner] = useState<Date | null>(defaultValue);
  const current = value !== undefined ? value : inner;
  const [isOpen, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const id = useId();
  const labelId = `${id}-label`;
  const helperId = `${id}-helper`;
  const dialogId = `${id}-dialog`;

  const display = current ? new Intl.DateTimeFormat(locale, format).format(current) : '';

  const commit = (d: Date | null) => {
    if (value === undefined) setInner(d);
    onChange?.(d);
  };

  const close = (refocus = true) => {
    setOpen(false);
    if (refocus) triggerRef.current?.focus();
  };

  // Close on outside click.
  useEffect(() => {
    if (!isOpen) return;
    const onDown = (e: MouseEvent) => {
      if (rootRef.current && !rootRef.current.contains(e.target as Node)) close(false);
    };
    document.addEventListener('mousedown', onDown);
    return () => document.removeEventListener('mousedown', onDown);
  }, [isOpen]);

  return (
    <div
      ref={rootRef}
      className={slot('sp-date-picker', classNames, 'root', className)}
      data-tone={error ? 'error' : 'brand'}
      data-size={size}
      data-open={(isOpen && !disabled) || undefined}
      data-invalid={error || undefined}
      data-disabled={disabled || undefined}
      data-empty={!current || undefined}
    >
      {label && (
        <span id={labelId} className={slot('sp-date-picker__label', classNames, 'label')}>
          {label}
        </span>
      )}
      <div className={slot('sp-date-picker__control', classNames, 'control')}>
        <button
          ref={triggerRef}
          type="button"
          disabled={disabled}
          aria-haspopup="dialog"
          aria-expanded={isOpen}
          aria-controls={isOpen ? dialogId : undefined}
          aria-labelledby={label ? `${labelId} ${id}-value` : undefined}
          aria-describedby={helperText ? helperId : undefined}
          aria-invalid={error || undefined}
          onClick={() => setOpen((o) => !o)}
          onKeyDown={(e) => {
            if (e.key === 'ArrowDown' && !isOpen) {
              e.preventDefault();
              setOpen(true);
            }
          }}
          className={slot('sp-date-picker__trigger', classNames, 'trigger')}
        >
          <svg className="sp-date-picker__icon" width="18" height="18" viewBox="0 0 24 24" aria-hidden="true">
            <rect x="3" y="5" width="18" height="16" rx="2" fill="none" stroke="currentColor" strokeWidth="2" />
            <path d="M3 10h18M8 3v4M16 3v4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
          </svg>
          <span id={`${id}-value`} className="sp-date-picker__value">
            {display || placeholder}
          </span>
        </button>
        {clearable && current && !disabled && (
          <button
            type="button"
            aria-label="Clear date"
            className="sp-date-picker__clear"
            onClick={() => {
              commit(null);
              triggerRef.current?.focus();
            }}
          >
            <svg width="14" height="14" viewBox="0 0 16 16" aria-hidden="true"><path d="M3 3l10 10M13 3L3 13" stroke="currentColor" strokeWidth="2" strokeLinecap="round" /></svg>
          </button>
        )}
      </div>
      {helperText && (
        <p id={helperId} className={slot('sp-date-picker__helper', classNames, 'helper')}>
          {helperText}
        </p>
      )}
      {name && <input type="hidden" name={name} value={current ? toISODate(current) : ''} />}

      {isOpen && (
        <div
          id={dialogId}
          role="dialog"
          aria-modal="false"
          aria-label={typeof label === 'string' ? `Choose ${label.toLowerCase()}` : 'Choose date'}
          className={slot('sp-date-picker__popover', classNames, 'popover')}
          data-has-label={label ? true : undefined}
        >
          <Calendar
            {...calendarProps}
            locale={locale}
            value={current}
            autoFocus
            onEscape={() => close()}
            onChange={(d) => {
              commit(d);
              // Let the spark play before the popover closes.
              window.setTimeout(() => close(), 260);
            }}
          />
        </div>
      )}
    </div>
  );
}

export default DatePicker;

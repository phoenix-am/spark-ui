import React, { useMemo, useRef, useState } from 'react';
import { useMessages } from '../internal/messages';
import { useButton, useLocale, useTimeField } from 'react-aria';
import { useOverlayTriggerState, useSingleSelectListState, useTimeFieldState } from 'react-stately';
import { Time } from '@internationalized/date';
type TimeValue = { hour: number; minute: number; second: number };
import { Popover } from '../base/Popover';
import { ListBox, ListOption, renderListItems } from '../base/ListBox';
import { useDefaults, slot, ClassNames } from '../internal/defaults';
import { Segment } from '../DatePicker/DatePicker';

export interface TimePickerProps {
  /** Visible label above the field. */
  label?: React.ReactNode;
  /** Accessible name, read by screen readers. Use it when there's no visible label. */
  'aria-label'?: string;
  /** "HH:mm" or "HH:mm:ss", 24-hour. `null` when empty. */
  value?: string | null;
  /** Starting time when the picker manages its own state, as `"HH:mm"` (24-hour), e.g. `"09:30"`. */
  defaultValue?: string | null;
  /** Called with the new time as `"HH:mm"`, or `null` when cleared. */
  onChange?: (value: string | null) => void;
  /** Earliest time, "HH:mm". */
  min?: string;
  /** Latest time, "HH:mm". */
  max?: string;
  /** Minutes between suggestions in the list. Default 30. */
  step?: number;
  /** Turn off the suggestion list (typing only). */
  showList?: boolean;
  /** Grey out suggestions, e.g. booked slots: `(t) => booked.includes(t)`. */
  isTimeDisabled?: (time: string) => boolean;
  /** 12 or 24-hour. Default: the locale's. */
  hourCycle?: 12 | 24;
  /** `minute` (default) or `second`. */
  granularity?: 'hour' | 'minute' | 'second';
  /** Short guidance under the field. Shown in red with an error. */
  helperText?: React.ReactNode;
  /** Shows the field in its error state. Pair it with `helperText` explaining what to fix. */
  error?: boolean;
  /** Turns the control off: it can't be focused or changed, and it's announced as disabled. */
  disabled?: boolean;
  /** Marks the field as required: screen readers announce it and the form won't submit while it's empty. */
  required?: boolean;
  /** Show a button that empties the field. */
  clearable?: boolean;
  /** Submits "HH:mm" with forms. */
  name?: string;
  /** Height and text size. Default `medium`. */
  size?: 'small' | 'medium' | 'large';
  /** Extra class names for the outermost element. */
  className?: string;
  /** Extra class names for the component's inner parts, keyed by part name. Handy with Tailwind. */
  classNames?: ClassNames<'root' | 'label' | 'control' | 'field' | 'trigger' | 'helper' | 'popover' | 'list'>;
}

const pad = (n: number) => String(n).padStart(2, '0');
/** "09:30" → Time. Invalid input → null. */
export function parseTime(s: string | null | undefined): Time | null {
  if (!s) return null;
  const m = /^(\d{1,2}):(\d{2})(?::(\d{2}))?$/.exec(s.trim());
  if (!m) return null;
  const [h, mi, se] = [Number(m[1]), Number(m[2]), Number(m[3] ?? 0)];
  return h < 24 && mi < 60 && se < 60 ? new Time(h, mi, se) : null;
}
/** Time → "09:30" (or "09:30:15" when seconds are set). */
export function formatTime(t: TimeValue | null | undefined, seconds = false): string | null {
  if (!t) return null;
  return `${pad(t.hour)}:${pad(t.minute)}${seconds || t.second ? `:${pad(t.second)}` : ''}`;
}
const toMinutes = (t: Time) => t.hour * 60 + t.minute;

/**
 * Enter a time by typing, using the arrow keys on each part, or picking from a
 * list. It respects 12 and 24-hour clocks for the locale and can limit choices
 * to business hours or fixed steps.
 *
 * Type a time segment by segment (hours, minutes, AM/PM), or
 * pick from a list of suggestions every `step` minutes. Values are plain
 * 24-hour strings ("14:30"), so they store and submit cleanly; the field
 * shows the locale's format. `min`, `max` and `isTimeDisabled` limit both
 * typing and the list.
 *
 * Built on React Aria's `useTimeField` with the same segments as DatePicker,
 * and the Popover and ListBox base components.
 *
 * Style hooks: shares `.sp-date-picker` styles; `.sp-time-picker`, `__list`, `__option[data-disabled]`.
 */
export function TimePicker(inProps: TimePickerProps) {
  const props = useDefaults('TimePicker', inProps) as TimePickerProps;
  const m = useMessages();
  const {
    label,
    step = 30,
    showList = true,
    isTimeDisabled,
    hourCycle,
    granularity = 'minute',
    helperText,
    error,
    disabled,
    required,
    clearable,
    name,
    size = 'medium',
    className,
    classNames,
  } = props;
  const { locale, direction } = useLocale();
  const minT = useMemo(() => parseTime(props.min), [props.min]);
  const maxT = useMemo(() => parseTime(props.max), [props.max]);
  const fieldRef = useRef<HTMLDivElement>(null);
  const groupRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const seconds = granularity === 'second';

  // Hold the value here (as "HH:mm") so the field, the list and Clear all go through one path.
  const [inner, setInner] = useState<string | null>(props.defaultValue ?? null);
  const controlled = props.value !== undefined;
  const setTime = (next: string | null) => {
    if (!controlled) setInner(next);
    props.onChange?.(next);
  };
  const valueStr = controlled ? props.value ?? null : inner;
  const parsed = useMemo(() => parseTime(valueStr), [valueStr]);
  const ariaProps = {
    label,
    'aria-label': props['aria-label'],
    value: parsed,
    onChange: (v: TimeValue | null) => setTime(formatTime(v, seconds)),
    minValue: minT ?? undefined,
    maxValue: maxT ?? undefined,
    hourCycle,
    granularity,
    isDisabled: disabled,
    isRequired: required,
    isInvalid: error,
    validationBehavior: 'aria' as const,
    description: !error && helperText ? helperText : undefined,
    errorMessage: error && helperText ? helperText : undefined,
  };
  const state = useTimeFieldState({ ...ariaProps, locale });
  const { labelProps, fieldProps, descriptionProps, errorMessageProps } = useTimeField(ariaProps, state, fieldRef);
  const current = formatTime(state.value as TimeValue | null, seconds);

  // Suggestions every `step` minutes within [min, max].
  const fmt = useMemo(() => new Intl.DateTimeFormat(locale, { hour: 'numeric', minute: '2-digit', hourCycle: hourCycle === 12 ? 'h12' : hourCycle === 24 ? 'h23' : undefined }), [locale, hourCycle]);
  const options: ListOption<string>[] = useMemo(() => {
    const out: ListOption<string>[] = [];
    const lo = minT ? toMinutes(minT) : 0;
    const hi = maxT ? toMinutes(maxT) : 24 * 60 - 1;
    for (let m = Math.ceil(lo / step) * step; m <= hi; m += Math.max(5, step)) {
      const value = `${pad(Math.floor(m / 60))}:${pad(m % 60)}`;
      out.push({ value, label: fmt.format(new Date(2000, 0, 1, Math.floor(m / 60), m % 60)), disabled: isTimeDisabled?.(value) });
    }
    return out;
  }, [step, props.min, props.max, fmt, isTimeDisabled]); // eslint-disable-line react-hooks/exhaustive-deps

  const overlay = useOverlayTriggerState({});
  const list = useSingleSelectListState<ListOption<string>>({
    items: options,
    children: renderListItems(options) as never,
    selectedKey: current?.slice(0, 5) ?? null,
    disabledKeys: options.filter((o) => o.disabled).map((o) => o.value),
    onSelectionChange: (key) => {
      const t = parseTime(String(key));
      if (t) setTime(formatTime(t, seconds));
      overlay.close();
      fieldRef.current?.querySelector<HTMLElement>('[role="spinbutton"]')?.focus();
    },
  });
  const { buttonProps } = useButton(
    { 'aria-label': m.showTimes, isDisabled: disabled, onPress: () => overlay.toggle(), excludeFromTabOrder: false },
    triggerRef,
  );

  return (
    <div
      className={slot('sp-date-picker sp-time-picker', classNames, 'root', className)}
      dir={direction}
      data-tone={error ? 'error' : 'brand'}
      data-size={size}
      data-open={overlay.isOpen || undefined}
      data-invalid={error || undefined}
      data-disabled={disabled || undefined}
      data-empty={!state.value || undefined}
    >
      {label && (
        <span {...labelProps} className={slot('sp-date-picker__label', classNames, 'label')}>
          {label}
          {required && <span className="sp-field__required" aria-hidden="true"> *</span>}
        </span>
      )}
      <div ref={groupRef} className={slot('sp-date-picker__control', classNames, 'control')}>
        <div {...fieldProps} ref={fieldRef} className={slot('sp-date-field', classNames, 'field')}>
          {state.segments.map((segment, i) => (
            <Segment key={i} segment={segment} state={state} />
          ))}
        </div>
        {clearable && state.value && !disabled && (
          <button type="button" aria-label={m.clearTime} className="sp-date-picker__clear" onClick={() => setTime(null)}>
            <svg width="14" height="14" viewBox="0 0 16 16" aria-hidden="true">
              <path d="M3 3l10 10M13 3L3 13" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
            </svg>
          </button>
        )}
        {showList && (
          <button {...buttonProps} ref={triggerRef} aria-expanded={overlay.isOpen} aria-haspopup="listbox" className={slot('sp-date-picker__trigger', classNames, 'trigger')}>
            <svg className="sp-date-picker__icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
              <circle cx="12" cy="12" r="9" />
              <path d="M12 7v5l3 2" />
            </svg>
          </button>
        )}
      </div>
      {helperText && (
        <p {...(error ? errorMessageProps : descriptionProps)} className={slot('sp-date-picker__helper', classNames, 'helper')}>
          {helperText}
        </p>
      )}
      {name && <input type="hidden" name={name} value={current ?? ''} />}
      {overlay.isOpen && (
        <Popover state={overlay} triggerRef={groupRef} offset={8} matchTriggerWidth className={slot('sp-dropdown__popover sp-time-picker__popover', classNames, 'popover')}>
          <ListBox
            state={list}
            aria-label={typeof label === 'string' ? `${label}: ${m.times}` : m.times}
            autoFocus={list.selectedKey != null ? true : 'first'}
            shouldFocusWrap
            className={slot('sp-time-picker__list', classNames, 'list')}
            optionClassName="sp-time-picker__option"
          />
        </Popover>
      )}
    </div>
  );
}

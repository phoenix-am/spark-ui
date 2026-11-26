/**
 * Spark UI headless hooks: the behaviour of Spark components without their
 * markup. Same prop names as the components, plain JS Dates, and `dataProps`
 * with the `data-*` attributes Spark's CSS uses, so your own markup can
 * still pick up the Live Wire look (or none at all).
 *
 * Built on React Aria; for anything not here, use react-aria directly.
 * Unstable until 1.0.
 */
import React, { useRef } from 'react';
import { haptic, powerCut, readEnergy, type HapticKind } from '../internal/energy';
import { useCheckbox as useAriaCheckbox, useDatePicker as useAriaDatePicker, useFocusRing, useNumberFormatter, useSlider as useAriaSlider, useSwitch as useAriaSwitch, mergeProps } from 'react-aria';
import { useDatePickerState, useSliderState, useToggleState } from 'react-stately';
import type { DateValue } from '@internationalized/date';
import { Spark, SparkHandle } from '../Spark';
import { FirstDayOfWeek, fromDateValue, toDateValue, toISO } from '../DatePicker/dateAdapters';

export { useSliderThumb } from 'react-aria';
export { useDataTable } from '../DataTable/useDataTable';
export { toDateValue, fromDateValue, toISO, withCalendar } from '../DatePicker/dateAdapters';

type DataProps = Record<`data-${string}`, string | true | undefined>;

/* --------------------------------------------------------------- switch */

export interface UseSwitchProps {
  checked?: boolean;
  defaultChecked?: boolean;
  onChange?: (checked: boolean) => void;
  disabled?: boolean;
  name?: string;
  value?: string;
  'aria-label'?: string;
  'aria-labelledby'?: string;
}

/**
 * Switch behaviour: a native checkbox input with `role="switch"`, keyboard
 * and form support. Spread `inputProps` on a (visually hidden) input and
 * `dataProps` on your root to get `data-state="on" | "off"`.
 */
export function useSwitch(props: UseSwitchProps, ref: React.RefObject<HTMLInputElement>) {
  const ariaProps = {
    isSelected: props.checked,
    defaultSelected: props.defaultChecked,
    onChange: props.onChange,
    isDisabled: props.disabled,
    name: props.name,
    value: props.value,
    'aria-label': props['aria-label'],
    'aria-labelledby': props['aria-labelledby'],
  };
  const state = useToggleState(ariaProps);
  const { inputProps, isSelected, isDisabled } = useAriaSwitch(ariaProps, state, ref);
  const { focusProps, isFocusVisible } = useFocusRing();
  const dataProps: DataProps = {
    'data-state': isSelected ? 'on' : 'off',
    'data-disabled': isDisabled || undefined,
    'data-focus-visible': isFocusVisible || undefined,
  };
  return { inputProps: mergeProps(inputProps, focusProps), dataProps, checked: isSelected, disabled: isDisabled, focusVisible: isFocusVisible, setChecked: state.setSelected, toggle: state.toggle };
}

/* ------------------------------------------------------------- checkbox */

export interface UseCheckboxProps extends UseSwitchProps {
  /** Shown as a dash; announced as "mixed". */
  indeterminate?: boolean;
  required?: boolean;
  invalid?: boolean;
}

/** Checkbox behaviour. `dataProps` gives `data-state="checked" | "unchecked" | "indeterminate"`. */
export function useCheckbox(props: UseCheckboxProps, ref: React.RefObject<HTMLInputElement>) {
  const ariaProps = {
    isSelected: props.checked,
    defaultSelected: props.defaultChecked,
    onChange: props.onChange,
    isDisabled: props.disabled,
    isIndeterminate: props.indeterminate,
    isRequired: props.required,
    isInvalid: props.invalid,
    validationBehavior: 'aria' as const,
    name: props.name,
    value: props.value,
    'aria-label': props['aria-label'],
    'aria-labelledby': props['aria-labelledby'],
  };
  const state = useToggleState(ariaProps);
  const { inputProps, isSelected, isDisabled, isInvalid } = useAriaCheckbox(ariaProps, state, ref);
  const { focusProps, isFocusVisible } = useFocusRing();
  const dataProps: DataProps = {
    'data-state': props.indeterminate ? 'indeterminate' : isSelected ? 'checked' : 'unchecked',
    'data-disabled': isDisabled || undefined,
    'data-invalid': isInvalid || undefined,
    'data-focus-visible': isFocusVisible || undefined,
  };
  return { inputProps: mergeProps(inputProps, focusProps), dataProps, checked: isSelected, disabled: isDisabled, focusVisible: isFocusVisible, setChecked: state.setSelected, toggle: state.toggle };
}

/* --------------------------------------------------------------- slider */

type SliderValue = number | [number, number];

export interface UseSliderProps<T extends SliderValue = SliderValue> {
  label?: React.ReactNode;
  'aria-label'?: string;
  /** A number, or `[start, end]` for a range. */
  value?: T;
  defaultValue?: T;
  min?: number;
  max?: number;
  step?: number;
  onChange?: (value: T) => void;
  onChangeEnd?: (value: T) => void;
  disabled?: boolean;
  formatOptions?: Intl.NumberFormatOptions;
}

/**
 * Slider behaviour for one value or a two-knob range. Render one thumb per
 * entry in `values` with `useSliderThumb({ index, trackRef, inputRef }, state)`.
 * `cssVars` sets `--sp-start`, `--sp-end` and `--sp-pct` (0–100) for the fill.
 */
export function useSlider<T extends SliderValue = number>(props: UseSliderProps<T>, trackRef: React.RefObject<HTMLElement>) {
  const { min = 0, max = 100, step = 1 } = props;
  const isRange = Array.isArray(props.value ?? props.defaultValue);
  const toArray = (v?: SliderValue) => (v === undefined ? undefined : Array.isArray(v) ? v : [v]);
  const fromArray = (v: number | number[]) => {
    const a = Array.isArray(v) ? v : [v];
    return (isRange ? [a[0], a[1]] : a[0]) as T;
  };
  const numberFormatter = useNumberFormatter(props.formatOptions);
  const ariaProps = {
    label: props.label,
    'aria-label': props['aria-label'],
    value: toArray(props.value),
    defaultValue: toArray(props.defaultValue) ?? (isRange ? [min, max] : [min]),
    minValue: min,
    maxValue: max,
    step,
    isDisabled: props.disabled,
    numberFormatter,
    onChange: (v: number | number[]) => props.onChange?.(fromArray(v)),
    onChangeEnd: (v: number | number[]) => props.onChangeEnd?.(fromArray(v)),
  };
  const state = useSliderState(ariaProps);
  const aria = useAriaSlider(ariaProps, state, trackRef);
  const pct = (i: number) => state.getThumbPercent(i) * 100;
  const start = isRange ? pct(0) : 0;
  const end = isRange ? pct(1) : pct(0);
  return {
    ...aria,
    state,
    isRange,
    value: fromArray(state.values),
    cssVars: { '--sp-start': start, '--sp-end': end, '--sp-pct': end } as React.CSSProperties,
    dataProps: { 'data-range': isRange || undefined, 'data-disabled': props.disabled || undefined } as DataProps,
    format: (n: number) => numberFormatter.format(n),
  };
}

/* ---------------------------------------------------------- date picker */

export interface UseDatePickerProps {
  label?: React.ReactNode;
  'aria-label'?: string;
  value?: Date | null;
  defaultValue?: Date | null;
  onChange?: (date: Date | null) => void;
  min?: Date;
  max?: Date;
  isDateDisabled?: (date: Date) => boolean;
  firstDayOfWeek?: FirstDayOfWeek;
  disabled?: boolean;
  required?: boolean;
  invalid?: boolean;
}

/**
 * DatePicker behaviour with plain JS Dates. Returns React Aria's props for
 * the group, field, button, dialog and calendar (render them with
 * `useDateField`/`useCalendar` from react-aria), plus `value` as a Date and
 * `isoValue` for forms. Set the locale with `<SparkProvider locale>` or
 * React Aria's `I18nProvider`.
 */
export function useDatePicker(props: UseDatePickerProps, groupRef: React.RefObject<HTMLElement>) {
  const ariaProps = {
    label: props.label,
    'aria-label': props['aria-label'],
    value: props.value === undefined ? undefined : toDateValue(props.value),
    defaultValue: toDateValue(props.defaultValue),
    onChange: (v: DateValue | null) => props.onChange?.(fromDateValue(v)),
    minValue: toDateValue(props.min) ?? undefined,
    maxValue: toDateValue(props.max) ?? undefined,
    isDateUnavailable: props.isDateDisabled ? (d: DateValue) => props.isDateDisabled!(fromDateValue(d)!) : undefined,
    firstDayOfWeek: props.firstDayOfWeek,
    isDisabled: props.disabled,
    isRequired: props.required,
    isInvalid: props.invalid,
    validationBehavior: 'aria' as const,
    granularity: 'day' as const,
  };
  const state = useDatePickerState(ariaProps);
  const aria = useAriaDatePicker(ariaProps, state, groupRef);
  return {
    ...aria,
    state,
    value: fromDateValue(state.value),
    isoValue: toISO(state.value),
    dataProps: { 'data-open': state.isOpen || undefined, 'data-invalid': props.invalid || undefined, 'data-disabled': props.disabled || undefined, 'data-empty': !state.value || undefined } as DataProps,
  };
}

/* ---------------------------------------------------------------- spark */

/**
 * The spark burst for any element. Render `sparks` inside a positioned
 * element and call `burst(event)` from a click handler (or with no event to
 * burst from the centre). Respects reduced motion.
 */
export interface UseSparkOptions {
  /** Particles per burst at default energy. Default 10. */
  count?: number;
  /** Burst radius in px at default energy. Default 70. */
  spread?: number;
  colors?: string[];
}

/**
 * Spark UI's motion on your own elements. Every effect follows the energy
 * dial (`SparkProvider energy` / `data-spark-energy`) and switches off for
 * reduced motion.
 *
 * ```tsx
 * const spark = useSpark();
 * <button className="sp-spark-host" onClick={spark.burst}>{spark.sparks}Launch</button>
 * <div {...spark.current()} style={{ height: 2 }} />          // flowing current line
 * spark.powerCut(panelRef.current);                             // flicker an element
 * spark.haptic('toggle');                                       // short vibration (if enabled)
 * ```
 */
export function useSpark(options: UseSparkOptions = {}) {
  const ref = useRef<SparkHandle>(null);
  const sparks = <Spark ref={ref} count={options.count} spread={options.spread} colors={options.colors} />;
  return {
    /** Render inside a `position: relative` element; bursts appear here. */
    sparks,
    /** Fire a burst from the pointer (or the centre for keyboard clicks). */
    burst: (event?: React.MouseEvent<HTMLElement> | React.PointerEvent<HTMLElement>) => ref.current?.burst(event as React.MouseEvent<HTMLElement> | undefined),
    /** Props for a flowing current line. Give the element a height (or width when `down`). */
    current: (opts: { direction?: 'right' | 'down'; color?: string } = {}) => ({
      className: opts.direction === 'down' ? 'sp-current sp-current--down' : 'sp-current',
      style: (opts.color ? { '--sp-line': opts.color } : {}) as React.CSSProperties,
    }),
    /** Glow ring sized by the energy dial. */
    glow: () => ({ className: 'sp-glow' }),
    /** Flicker an element like a power cut. Resolves when it ends. */
    powerCut,
    /** Short vibration on supporting phones when haptics are on. */
    haptic: (kind?: HapticKind, el?: Element | null) => haptic(kind, el),
    /** Energy in effect at an element (or the page): off, calm, default or electric. */
    energy: (el?: Element | null) => readEnergy(el),
  };
}

export { readEnergy, haptic, powerCut, ENERGY_SCALE } from '../internal/energy';
export type { Energy, HapticKind } from '../internal/energy';

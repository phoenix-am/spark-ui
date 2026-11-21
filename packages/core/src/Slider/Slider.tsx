import React, { forwardRef, useRef } from 'react';
import { mergeProps, mergeRefs, useFocusRing, useLocale, useNumberFormatter, useSlider, useSliderThumb, VisuallyHidden } from 'react-aria';
import { useSliderState, SliderState } from 'react-stately';
import { Tone } from '../internal/tone';
import { useDefaults, slot, ClassNames } from '../internal/defaults';

type SliderValue = number | [number, number];

export interface SliderProps<T extends SliderValue = SliderValue>
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'type' | 'value' | 'defaultValue' | 'onChange' | 'name' | 'min' | 'max' | 'step'> {
  /** Visible label, shown with the current value. */
  label?: React.ReactNode;
  /** Controlled value: a number, or `[start, end]` for a range with two knobs. */
  value?: T;
  /** Initial value when uncontrolled. A `[start, end]` pair makes it a range. Defaults to `min`. */
  defaultValue?: T;
  /** Default 0. */
  min?: number;
  /** Default 100. */
  max?: number;
  /** Default 1. */
  step?: number;
  /** Called on every move with the new value (a number, or `[start, end]`). */
  onChange?: (value: T) => void;
  /** Called once when the user lets go, e.g. to save or fetch. */
  onChangeEnd?: (value: T) => void;
  /** Format each value for the label and for screen readers. */
  formatValue?: (value: number) => string;
  /** Intl number options when `formatValue` isn't set, e.g. `{ style: 'currency', currency: 'INR' }`. */
  formatOptions?: Intl.NumberFormatOptions;
  /** Form field name. For a range, one name (sent twice) or `[startName, endName]`. */
  name?: string | [string, string];
  /** Screen-reader names for the two knobs of a range. Default `['Minimum', 'Maximum']`. */
  thumbLabels?: [string, string];
  /** Default `brand`. */
  color?: Tone;
  /** Extra classes for each part: root, header, label, value, track, fill, thumb. */
  classNames?: ClassNames<'root' | 'header' | 'label' | 'value' | 'track' | 'fill' | 'thumb'>;
}

/**
 * Slider: a dimmer. The wire is lit up to the knob, and the glow gets stronger
 * the higher you turn it. Pass a `[start, end]` value for a range: current
 * flows between two knobs. Behaviour comes from React Aria: arrows, Page
 * Up/Down, Home/End, dragging, clicking the track, right-to-left, and
 * localized numbers. Each knob holds a native range input, so forms and
 * React Hook Form's `register` work.
 *
 * Style hooks: `.sp-slider[data-range][data-disabled]`, `__header`, `__value`,
 * `__track`, `__fill`, `__thumb[data-dragging][data-focus-visible]`.
 * Variables: `--sp-start`, `--sp-end` and `--sp-pct` (0–100).
 */
export const Slider = forwardRef(function Slider(inProps: SliderProps, ref: React.ForwardedRef<HTMLInputElement>) {
  const {
    label,
    value,
    defaultValue,
    min = 0,
    max = 100,
    step = 1,
    onChange,
    onChangeEnd,
    formatValue,
    formatOptions,
    name,
    thumbLabels = ['Minimum', 'Maximum'],
    color = 'brand',
    disabled,
    className,
    style,
    classNames,
    'aria-label': ariaLabel,
    'aria-labelledby': ariaLabelledby,
    id,
    ...inputRest
  } = useDefaults('Slider', inProps);

  const isRange = Array.isArray(value ?? defaultValue);
  const toArray = (v: SliderValue | undefined) => (v === undefined ? undefined : Array.isArray(v) ? v : [v]);
  const fromArray = (v: number[]): SliderValue => (isRange ? [v[0], v[1]] : v[0]);

  const numberFormatter = useNumberFormatter(formatOptions);
  const format = formatValue ?? ((n: number) => numberFormatter.format(n));
  const { direction } = useLocale();
  const trackRef = useRef<HTMLDivElement>(null);

  const ariaProps = {
    label,
    'aria-label': ariaLabel,
    'aria-labelledby': ariaLabelledby,
    id,
    value: toArray(value),
    defaultValue: toArray(defaultValue) ?? (isRange ? [min, max] : [min]),
    minValue: min,
    maxValue: max,
    step,
    isDisabled: disabled,
    numberFormatter,
    onChange: (v: number | number[]) => onChange?.(fromArray(Array.isArray(v) ? v : [v])),
    onChangeEnd: (v: number | number[]) => onChangeEnd?.(fromArray(Array.isArray(v) ? v : [v])),
  };
  const state = useSliderState(ariaProps);
  const { groupProps, trackProps, labelProps, outputProps } = useSlider(ariaProps, state, trackRef);

  const pct = (i: number) => state.getThumbPercent(i) * 100;
  const start = isRange ? pct(0) : 0;
  const end = isRange ? pct(1) : pct(0);
  const shown = state.values.map(format).join(' – ');

  return (
    <div
      {...groupProps}
      className={slot('sp-slider', classNames, 'root', className)}
      dir={direction}
      data-tone={color}
      data-range={isRange || undefined}
      data-disabled={disabled || undefined}
      style={{ ...style, '--sp-start': start, '--sp-end': end, '--sp-pct': end } as React.CSSProperties}
    >
      {label && (
        <div className={slot('sp-slider__header', classNames, 'header')}>
          <label {...labelProps} className={slot('sp-slider__label', classNames, 'label')}>
            {label}
          </label>
          <output {...outputProps} className={slot('sp-slider__value', classNames, 'value')}>
            {shown}
          </output>
        </div>
      )}
      <div {...trackProps} ref={trackRef} className={slot('sp-slider__track', classNames, 'track')}>
        <span aria-hidden="true" className={slot('sp-slider__fill sp-current', classNames, 'fill')} />
        {state.values.map((_, i) => (
          <Thumb
            key={i}
            index={i}
            state={state}
            trackRef={trackRef}
            name={Array.isArray(name) ? name[i] : name}
            ariaLabel={isRange ? thumbLabels[i] : undefined}
            valueText={format(state.values[i])}
            className={slot('sp-slider__thumb', classNames, 'thumb')}
            forwardedRef={i === 0 ? ref : undefined}
            inputRest={i === 0 ? inputRest : undefined}
          />
        ))}
      </div>
    </div>
  );
}) as (<T extends SliderValue = number>(props: SliderProps<T> & { ref?: React.Ref<HTMLInputElement> }) => React.ReactElement) & {
  displayName?: string;
};

function Thumb({
  index,
  state,
  trackRef,
  name,
  ariaLabel,
  valueText,
  className,
  forwardedRef,
  inputRest,
}: {
  index: number;
  state: SliderState;
  trackRef: React.RefObject<HTMLDivElement>;
  name?: string;
  ariaLabel?: string;
  valueText: string;
  className: string;
  forwardedRef?: React.ForwardedRef<HTMLInputElement>;
  inputRest?: React.InputHTMLAttributes<HTMLInputElement>;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const { thumbProps, inputProps, isDragging } = useSliderThumb({ index, trackRef, inputRef, name, 'aria-label': ariaLabel }, state);
  const { focusProps, isFocusVisible } = useFocusRing();
  return (
    <div {...thumbProps} className={className} data-dragging={isDragging || undefined} data-focus-visible={isFocusVisible || undefined}>
      <VisuallyHidden>
        <input
          {...mergeProps(inputRest ?? {}, inputProps, focusProps)}
          aria-valuetext={valueText}
          ref={(forwardedRef ? mergeRefs(inputRef, forwardedRef) : inputRef) as React.Ref<HTMLInputElement>}
        />
      </VisuallyHidden>
    </div>
  );
}

Slider.displayName = 'Slider';
export default Slider;

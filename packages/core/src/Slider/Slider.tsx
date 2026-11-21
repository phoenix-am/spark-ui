import React, { forwardRef, useId, useState } from 'react';
import { Tone } from '../internal/tone';
import { cx } from '../internal/cx';
import { useDefaults, slot, ClassNames } from '../internal/defaults';

export interface SliderProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'type' | 'value' | 'defaultValue' | 'onChange'> {
  /** Visible label, shown with the current value. */
  label?: React.ReactNode;
  /** Controlled value. */
  value?: number;
  /** Initial value when uncontrolled. Defaults to `min`. */
  defaultValue?: number;
  /** Default 0. */
  min?: number;
  /** Default 100. */
  max?: number;
  /** Default 1. */
  step?: number;
  onChange?: (value: number, event: React.ChangeEvent<HTMLInputElement>) => void;
  /** Format the value shown next to the label and read by screen readers. */
  formatValue?: (value: number) => string;
  /** Default `brand`. */
  color?: Tone;
  /** Extra classes for each part: root, header, label, value, input. */
  classNames?: ClassNames<'root' | 'header' | 'label' | 'value' | 'input'>;
}

/**
 * Slider: a dimmer. The wire is lit up to the knob, and the glow gets stronger
 * the higher you turn it. Built on a native range input.
 *
 * Style hooks: `.sp-slider`, `__header`, `__value`, `__input`; the fill level
 * is the `--sp-pct` variable (0–100).
 */
export const Slider = forwardRef<HTMLInputElement, SliderProps>(function Slider(inProps, ref) {
  const { label, value, defaultValue, min = 0, max = 100, step = 1, onChange, formatValue = String, color = 'brand', disabled, id, className, style, classNames, ...rest } = useDefaults('Slider', inProps);
  const [inner, setInner] = useState(defaultValue ?? min);
  const v = value ?? inner;
  const pct = max === min ? 0 : ((v - min) / (max - min)) * 100;
  const autoId = useId();
  const inputId = id ?? autoId;

  return (
    <div
      className={slot('sp-slider', classNames, 'root', className)}
      data-tone={color}
      data-disabled={disabled || undefined}
      style={{ ...style, '--sp-pct': pct } as React.CSSProperties}
    >
      {label && (
        <div className={slot('sp-slider__header', classNames, 'header')}>
          <label htmlFor={inputId} className={slot('sp-slider__label', classNames, 'label')}>
            {label}
          </label>
          <output htmlFor={inputId} className={slot('sp-slider__value', classNames, 'value')}>
            {formatValue(v)}
          </output>
        </div>
      )}
      <input
        ref={ref}
        id={inputId}
        type="range"
        min={min}
        max={max}
        step={step}
        value={v}
        disabled={disabled}
        aria-valuetext={formatValue(v)}
        className={slot('sp-slider__input', classNames, 'input')}
        onChange={(e) => {
          const n = Number(e.target.value);
          if (value === undefined) setInner(n);
          onChange?.(n, e);
        }}
        {...rest}
      />
    </div>
  );
});

Slider.displayName = 'Slider';
export default Slider;

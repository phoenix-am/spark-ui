import React, { forwardRef, useId, useState } from 'react';
import { css } from '@emotion/react';
import { useTheme } from '@spark-ui/system';
import { getTone, Tone } from '../internal/tone';

export interface SliderProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'type' | 'value' | 'defaultValue' | 'onChange'> {
  label?: React.ReactNode;
  value?: number;
  defaultValue?: number;
  min?: number;
  max?: number;
  step?: number;
  onChange?: (value: number, event: React.ChangeEvent<HTMLInputElement>) => void;
  /** Format the value shown next to the label and read by screen readers. */
  formatValue?: (value: number) => string;
  color?: Tone;
}

/**
 * Slider: a dimmer. The wire is lit up to the knob, and the glow gets stronger
 * the higher you turn it. Built on a native range input.
 */
export const Slider = forwardRef<HTMLInputElement, SliderProps>(function Slider(
  { label, value, defaultValue, min = 0, max = 100, step = 1, onChange, formatValue = String, color = 'brand', disabled, id, ...rest },
  ref,
) {
  const { theme } = useTheme();
  const tone = getTone(color, theme);
  const [inner, setInner] = useState(defaultValue ?? min);
  const v = value ?? inner;
  const pct = max === min ? 0 : ((v - min) / (max - min)) * 100;
  const autoId = useId();
  const inputId = id ?? autoId;
  const lit = disabled ? theme.surface.borderStrong : tone.fill;
  const glow = disabled ? 'transparent' : `0 0 ${6 + pct / 6}px ${tone.glowStrong}`;

  const thumb = css`
    width: 20px;
    height: 20px;
    border-radius: 50%;
    background: ${disabled ? theme.surface.borderStrong : theme.energy.hot};
    border: 3px solid ${lit};
    box-shadow: ${glow};
    cursor: ${disabled ? 'not-allowed' : 'grab'};
    transition: transform ${theme.motion.fast};
  `;

  return (
    <div css={css`font-family: ${theme.typography.fontFamily}; color: ${disabled ? theme.text.disabled : theme.text.primary};`}>
      {label && (
        <div css={css`display: flex; justify-content: space-between; margin-bottom: 0.5rem; font-size: ${theme.typography.fontSize.small};`}>
          <label htmlFor={inputId} css={css`font-weight: 600;`}>
            {label}
          </label>
          <output htmlFor={inputId} css={css`font-variant-numeric: tabular-nums; color: ${disabled ? theme.text.disabled : tone.fill}; font-weight: 700;`}>
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
        onChange={(e) => {
          const n = Number(e.target.value);
          if (value === undefined) setInner(n);
          onChange?.(n, e);
        }}
        css={css`
          -webkit-appearance: none;
          appearance: none;
          width: 100%;
          height: 28px;
          margin: 0;
          background: transparent;
          cursor: ${disabled ? 'not-allowed' : 'pointer'};

          &::-webkit-slider-runnable-track {
            height: 4px;
            border-radius: 2px;
            background: linear-gradient(90deg, ${lit} ${pct}%, ${theme.energy.off} ${pct}%);
          }
          &::-moz-range-track {
            height: 4px;
            border-radius: 2px;
            background: ${theme.energy.off};
          }
          &::-moz-range-progress {
            height: 4px;
            border-radius: 2px;
            background: ${lit};
          }
          &::-webkit-slider-thumb {
            -webkit-appearance: none;
            margin-top: -8px;
            ${thumb};
          }
          &::-moz-range-thumb {
            box-sizing: border-box;
            ${thumb};
          }
          &:active::-webkit-slider-thumb {
            transform: scale(1.15);
            cursor: grabbing;
          }
          &:focus-visible {
            outline: none;
          }
          &:focus-visible::-webkit-slider-thumb {
            outline: 2px solid ${tone.fill};
            outline-offset: 3px;
          }
          &:focus-visible::-moz-range-thumb {
            outline: 2px solid ${tone.fill};
            outline-offset: 3px;
          }
        `}
        {...rest}
      />
    </div>
  );
});

Slider.displayName = 'Slider';
export default Slider;

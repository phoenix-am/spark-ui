import React from 'react';
import { Tone } from '../internal/tone';
import { cx } from '../internal/cx';

/* ------------------------------------------------------------------ Badge */

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  /** Default `brand`. */
  tone?: Tone | 'neutral';
  /** Show the status LED. Default `true`. */
  led?: boolean;
  /** Pulse the LED: something is live or in progress. */
  pulse?: boolean;
  /** `soft` tinted background (default) or `solid` fill. */
  variant?: 'soft' | 'solid';
}

/** Badge: a status label with an LED. Pulsing means "live". Style hooks: `.sp-badge`, `__led`. */
export function Badge({ tone = 'brand', led = true, pulse = false, variant = 'soft', className, children, ...rest }: BadgeProps) {
  return (
    <span
      className={cx('sp-badge', className)}
      data-tone={tone}
      data-variant={variant}
      data-pulse={pulse || undefined}
      {...rest}
    >
      {led && <span aria-hidden="true" className="sp-badge__led" />}
      {children}
    </span>
  );
}

/* --------------------------------------------------------------- Progress */

export interface ProgressProps {
  /** 0–100. Leave undefined for an indeterminate bar. */
  value?: number;
  /** Text above the bar; also its accessible name when a string. */
  label?: React.ReactNode;
  /** Show the percentage next to the label. Default `true` when determinate. */
  showValue?: boolean;
  /** Default `brand`. */
  tone?: Tone;
  /** Bar thickness: 4, 8 or 12px. Default `medium`. */
  size?: 'small' | 'medium' | 'large';
}

/**
 * Progress: a charge bar. At 100% the bar is fully charged and current flows.
 * Style hooks: `.sp-progress[data-state="charging"|"charged"|"indeterminate"]`, `__track`, `__fill`.
 */
export function Progress({ value, label, showValue, tone = 'brand', size = 'medium' }: ProgressProps) {
  const v = value === undefined ? undefined : Math.max(0, Math.min(100, value));
  const state = v === undefined ? 'indeterminate' : v === 100 ? 'charged' : 'charging';
  const showNumber = v !== undefined && showValue !== false;

  return (
    <div className="sp-progress" data-tone={tone} data-size={size} data-state={state}>
      {(label || showNumber) && (
        <div className="sp-progress__header">
          <span>{label}</span>
          {showNumber && <span className="sp-progress__value">{Math.round(v!)}%</span>}
        </div>
      )}
      <div
        role="progressbar"
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={v}
        aria-label={typeof label === 'string' ? label : undefined}
        className="sp-progress__track"
      >
        {v === undefined ? (
          <span className="sp-progress__sweep" />
        ) : (
          <span className={cx('sp-progress__fill', state === 'charged' && 'sp-current')} style={{ width: `${v}%` }} />
        )}
      </div>
    </div>
  );
}

/* ---------------------------------------------------------------- Spinner */

export interface SpinnerProps {
  /** 16, 24 or 36px. Default `medium`. */
  size?: 'small' | 'medium' | 'large';
  /** Default `brand`. */
  tone?: Tone;
  /** Accessible label. Default "Loading". */
  label?: string;
}

const spinners = { small: 16, medium: 24, large: 36 };

/** Spinner: an arc of current with a spark at its head. Style hooks: `.sp-spinner`, `__track`, `__arc`, `__head`. */
export function Spinner({ size = 'medium', tone = 'brand', label = 'Loading' }: SpinnerProps) {
  const s = spinners[size];
  const stroke = Math.max(2, s / 10);
  const r = (s - stroke) / 2;
  const c = 2 * Math.PI * r;
  const a = 0.3 * 2 * Math.PI - Math.PI / 2;

  return (
    <span role="status" aria-label={label} className="sp-spinner" data-tone={tone} style={{ width: s, height: s }}>
      <svg width={s} height={s} viewBox={`0 0 ${s} ${s}`} aria-hidden="true">
        <circle className="sp-spinner__track" cx={s / 2} cy={s / 2} r={r} fill="none" strokeWidth={stroke} />
        <circle
          className="sp-spinner__arc"
          cx={s / 2}
          cy={s / 2}
          r={r}
          fill="none"
          strokeWidth={stroke}
          strokeLinecap="round"
          strokeDasharray={`${c * 0.3} ${c}`}
          transform={`rotate(-90 ${s / 2} ${s / 2})`}
        />
        <circle className="sp-spinner__head" cx={s / 2 + r * Math.cos(a)} cy={s / 2 + r * Math.sin(a)} r={stroke * 0.9} />
      </svg>
    </span>
  );
}

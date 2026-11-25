import React from 'react';
import { renderElement, type RenderProp } from '../internal/render';
import { useMessages } from '../internal/messages';
import { Tone } from '../internal/tone';
import { cx } from '../internal/cx';
import { useDefaults, slot, ClassNames } from '../internal/defaults';

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
  /** Extra classes for each part: root, led. */
  classNames?: ClassNames<'root' | 'led'>;
  /** Render any element instead, e.g. a link: `render={<a href="/inbox" />}`. */
  render?: RenderProp<{ tone: string }>;
}

/**
 * A small label for status, counts or categories. The LED dot makes state easy
 * to read at a glance, and it can pulse for things that are in progress.
 *
 * A status label with an LED. Pulsing means "live". Style hooks: `.sp-badge`, `__led`.
 */
export function Badge(inProps: BadgeProps) {
  const { tone = 'brand', led = true, pulse = false, variant = 'soft', render, className, classNames, children, ...rest } = useDefaults('Badge', inProps);
  return renderElement('span', render, {
    className: slot('sp-badge', classNames, 'root', className),
    'data-tone': tone,
    'data-variant': variant,
    'data-pulse': pulse || undefined,
    ...rest,
    children: (
      <>
        {led && <span aria-hidden="true" className={slot('sp-badge__led', classNames, 'led')} />}
        {children}
      </>
    ),
  }, { tone });
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
 * Shows how far along a task is when you know the total, with an optional
 * label and percentage.
 *
 * A charge bar. At 100% the bar is fully charged and current flows.
 * Style hooks: `.sp-progress[data-state="charging"|"charged"|"indeterminate"]`, `__track`, `__fill`.
 */
export function Progress(inProps: ProgressProps) {
  const { value, label, showValue, tone = 'brand', size = 'medium' } = useDefaults('Progress', inProps);
  // NaN or Infinity shows as indeterminate rather than aria-valuenow="NaN".
  const v = value === undefined || !Number.isFinite(value) ? undefined : Math.max(0, Math.min(100, value));
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

/**
 * For waits of unknown length. Always give it a label so screen readers know
 * something is loading.
 *
 * An arc of current with a spark at its head. Style hooks: `.sp-spinner`, `__track`, `__arc`, `__head`.
 */
export function Spinner(inProps: SpinnerProps) {
  const m = useMessages();
  const { size = 'medium', tone = 'brand', label = m.loading } = useDefaults('Spinner', inProps);
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

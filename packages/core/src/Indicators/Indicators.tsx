import React from 'react';
import { css, keyframes } from '@emotion/react';
import { useTheme } from '@spark-ui/system';
import { alpha } from '@spark-ui/utils';
import { currentLine, getTone, Tone } from '../internal/tone';

const pulse = keyframes`
  0%, 100% { box-shadow: 0 0 0 0 var(--led-glow); }
  50% { box-shadow: 0 0 0 5px transparent, 0 0 10px var(--led-glow); }
`;
const spin = keyframes`to { transform: rotate(360deg); }`;
const sweep = keyframes`
  from { transform: translateX(-100%); }
  to { transform: translateX(250%); }
`;

/* ------------------------------------------------------------------ Badge */

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  tone?: Tone | 'neutral';
  /** Show the status LED. Default `true`. */
  led?: boolean;
  /** Pulse the LED: something is live or in progress. */
  pulse?: boolean;
  variant?: 'soft' | 'solid';
}

/** Badge: a status label with an LED. Pulsing means "live". */
export function Badge({ tone = 'brand', led = true, pulse: pulsing = false, variant = 'soft', children, ...rest }: BadgeProps) {
  const { theme } = useTheme();
  const t = tone === 'neutral' ? null : getTone(tone, theme);
  const color = t ? t.fill : theme.text.secondary;
  const solid = variant === 'solid';

  return (
    <span
      css={css`
        display: inline-flex;
        align-items: center;
        gap: 0.4rem;
        padding: 0.2rem 0.6rem;
        border-radius: 999px;
        font-family: ${theme.typography.fontFamily};
        font-size: 0.75rem;
        font-weight: 600;
        line-height: 1.4;
        white-space: nowrap;
        color: ${solid ? theme.text.onEnergy : color};
        background: ${solid ? color : alpha(color, 0.12)};
        border: 1px solid ${solid ? color : alpha(color, 0.35)};
      `}
      {...rest}
    >
      {led && (
        <span
          aria-hidden="true"
          style={{ '--led-glow': alpha(solid ? theme.text.onEnergy : color, 0.6) } as React.CSSProperties}
          css={css`
            width: 6px;
            height: 6px;
            border-radius: 50%;
            background: ${solid ? theme.text.onEnergy : color};
            ${pulsing &&
            css`
              animation: ${pulse} 1.4s ease-in-out infinite;
              @media (prefers-reduced-motion: reduce) {
                animation: none;
              }
            `}
          `}
        />
      )}
      {children}
    </span>
  );
}

/* --------------------------------------------------------------- Progress */

export interface ProgressProps {
  /** 0–100. Leave undefined for an indeterminate bar. */
  value?: number;
  label?: React.ReactNode;
  /** Show the percentage next to the label. Default `true` when determinate. */
  showValue?: boolean;
  tone?: Tone;
  size?: 'small' | 'medium' | 'large';
}

const bars = { small: 4, medium: 8, large: 12 };

/** Progress: a charge bar. At 100% the bar is fully charged and current flows. */
export function Progress({ value, label, showValue, tone = 'brand', size = 'medium' }: ProgressProps) {
  const { theme } = useTheme();
  const t = getTone(tone, theme);
  const v = value === undefined ? undefined : Math.max(0, Math.min(100, value));
  const full = v === 100;
  const h = bars[size];

  return (
    <div css={css`font-family: ${theme.typography.fontFamily}; color: ${theme.text.primary};`}>
      {(label || (v !== undefined && showValue !== false)) && (
        <div css={css`display: flex; justify-content: space-between; margin-bottom: 0.4rem; font-size: 0.8125rem;`}>
          <span>{label}</span>
          {v !== undefined && showValue !== false && (
            <span css={css`color: ${full ? t.fill : theme.text.secondary}; font-variant-numeric: tabular-nums;`}>{Math.round(v)}%</span>
          )}
        </div>
      )}
      <div
        role="progressbar"
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={v}
        aria-label={typeof label === 'string' ? label : undefined}
        css={css`
          position: relative;
          height: ${h}px;
          border-radius: ${h / 2}px;
          background: ${theme.surface.border};
          overflow: hidden;
        `}
      >
        {v === undefined ? (
          <span
            css={css`
              position: absolute;
              inset: 0 auto 0 0;
              width: 40%;
              border-radius: inherit;
              background: linear-gradient(90deg, transparent, ${t.fill}, ${theme.energy.hot});
              animation: ${sweep} 1.2s ${theme.motion.easing} infinite;
              @media (prefers-reduced-motion: reduce) {
                animation: none;
                width: 100%;
                opacity: 0.5;
              }
            `}
          />
        ) : (
          <span
            style={{ width: `${v}%` }}
            css={css`
              display: block;
              height: 100%;
              border-radius: inherit;
              transition: width ${theme.motion.normal} ${theme.motion.easing};
              ${full
                ? css`
                    background-color: ${alpha(t.fill, 0.35)};
                    ${currentLine(t.fill)};
                    box-shadow: 0 0 12px ${t.glow};
                  `
                : css`
                    background: ${t.fill};
                  `}
            `}
          />
        )}
      </div>
    </div>
  );
}

/* ---------------------------------------------------------------- Spinner */

export interface SpinnerProps {
  size?: 'small' | 'medium' | 'large';
  tone?: Tone;
  /** Accessible label. Default "Loading". */
  label?: string;
}

const spinners = { small: 16, medium: 24, large: 36 };

/** Spinner: an arc of current with a spark at its head. */
export function Spinner({ size = 'medium', tone = 'brand', label = 'Loading' }: SpinnerProps) {
  const { theme } = useTheme();
  const t = getTone(tone, theme);
  const s = spinners[size];
  const stroke = Math.max(2, s / 10);
  const r = (s - stroke) / 2;
  const c = 2 * Math.PI * r;

  return (
    <span role="status" aria-label={label} css={css`display: inline-flex; width: ${s}px; height: ${s}px;`}>
      <svg
        width={s}
        height={s}
        viewBox={`0 0 ${s} ${s}`}
        aria-hidden="true"
        css={css`
          animation: ${spin} 0.8s linear infinite;
          overflow: visible;
          @media (prefers-reduced-motion: reduce) {
            animation-duration: 2.4s;
          }
        `}
      >
        <circle cx={s / 2} cy={s / 2} r={r} fill="none" stroke={theme.surface.border} strokeWidth={stroke} />
        <circle
          cx={s / 2}
          cy={s / 2}
          r={r}
          fill="none"
          stroke={t.fill}
          strokeWidth={stroke}
          strokeLinecap="round"
          strokeDasharray={`${c * 0.3} ${c}`}
          transform={`rotate(-90 ${s / 2} ${s / 2})`}
        />
        <circle cx={s / 2 + r * Math.cos(0.3 * 2 * Math.PI - Math.PI / 2)} cy={s / 2 + r * Math.sin(0.3 * 2 * Math.PI - Math.PI / 2)} r={stroke * 0.9} fill={theme.energy.hot} css={css`filter: drop-shadow(0 0 3px ${t.fill});`} />
      </svg>
    </span>
  );
}

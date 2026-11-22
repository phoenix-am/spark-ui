import React, { useId, useState } from 'react';
import { useMessages } from '../internal/messages';
import { ClassNames, slot, useDefaults } from '../internal/defaults';
import { useFormatters } from './core';

export interface DonutSlice {
  label: string;
  value: number;
  /** Default: the next categorical slot, in order. */
  color?: string;
}

export interface DonutChartProps {
  /** Parts of one whole. Keep it to 6 or fewer; fold the rest into "Other". */
  data: DonutSlice[];
  title?: React.ReactNode;
  'aria-label'?: string;
  /** Headline in the hole. Default: the total. */
  centerLabel?: React.ReactNode;
  /** Small caption under the headline. Default "Total". */
  centerCaption?: React.ReactNode;
  /** Diameter in px. Default 200. */
  size?: number;
  /** Ring thickness in px. Default 28. */
  thickness?: number;
  valueFormat?: Intl.NumberFormatOptions;
  className?: string;
  classNames?: ClassNames<'root' | 'title' | 'legend' | 'plot'>;
}

const TAU = Math.PI * 2;
function arc(cx: number, cy: number, r0: number, r1: number, a0: number, a1: number) {
  const p = (r: number, a: number) => `${cx + r * Math.sin(a)},${cy - r * Math.cos(a)}`;
  const big = a1 - a0 > Math.PI ? 1 : 0;
  return `M${p(r1, a0)}A${r1},${r1} 0 ${big} 1 ${p(r1, a1)}L${p(r0, a1)}A${r0},${r0} 0 ${big} 0 ${p(r0, a0)}Z`;
}

/**
 * Parts of a whole, with room for a headline number in the middle. Best with a
 * handful of slices; the legend shows values and percentages so nothing
 * depends on colour alone.
 *
 * Share of a whole. Slices start at 12 o'clock in data order,
 * separated by a 2px surface gap; the legend lists every slice with its
 * value and percentage so identity never depends on colour alone. Hover or
 * focus a slice (Tab, then ← →) for its tooltip.
 *
 * Style hooks: `.sp-chart[data-kind="donut"]`, `__slice[data-active]`, `__center`.
 */
export function DonutChart(inProps: DonutChartProps) {
  const props = useDefaults('DonutChart', inProps) as DonutChartProps;
  const m = useMessages();
  const { data, title, size = 200, thickness = 28, centerCaption = m.total, className, classNames } = props;
  const [active, setActive] = useState<number | null>(null);
  const f = useFormatters({ valueFormat: props.valueFormat });
  const titleId = useId();
  const total = data.reduce((a, d) => a + Math.max(0, d.value), 0) || 1;
  const r1 = size / 2;
  const r0 = r1 - thickness;
  const gap = 2 / r1; // 2px of surface between slices, measured on the outer edge
  const pct = (v: number) => `${Math.round((v / total) * 1000) / 10}%`;
  const color = (i: number) => data[i].color ?? `var(--spark-chart-${(i % 8) + 1})`;

  let a = 0;
  const slices = data.map((d, i) => {
    const sweep = (Math.max(0, d.value) / total) * TAU;
    const s = { a0: a + (data.length > 1 ? gap / 2 : 0), a1: a + sweep - (data.length > 1 ? gap / 2 : 0) };
    a += sweep;
    return s;
  });

  return (
    <figure className={slot('sp-chart', classNames, 'root', className)} data-kind="donut" aria-labelledby={title ? titleId : undefined} aria-label={title ? undefined : props['aria-label']}>
      {title && (
        <figcaption id={titleId} className={slot('sp-chart__title', classNames, 'title')}>
          {title}
        </figcaption>
      )}
      <div className={slot('sp-chart__donut', classNames, 'plot')}>
        <div className="sp-chart__donut-ring" style={{ width: size, height: size }}>
          <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} role="group" aria-label={typeof title === 'string' ? title : props['aria-label'] ?? m.chart}>
            {data.map((d, i) =>
              slices[i].a1 > slices[i].a0 ? (
                <path
                  key={d.label}
                  d={data.length === 1 ? arc(r1, r1, r0, r1, 0, TAU - 0.0001) : arc(r1, r1, active === i ? r0 - 2 : r0, active === i ? r1 : r1 - 2, slices[i].a0, slices[i].a1)}
                  className="sp-chart__slice"
                  data-active={active === i || undefined}
                  style={{ fill: color(i) }}
                  tabIndex={0}
                  role="img"
                  aria-label={`${d.label}: ${f.value(d.value)}, ${pct(d.value)}`}
                  onPointerEnter={() => setActive(i)}
                  onPointerLeave={() => setActive(null)}
                  onFocus={() => setActive(i)}
                  onBlur={() => setActive(null)}
                  onKeyDown={(e) => {
                    const step = e.key === 'ArrowRight' || e.key === 'ArrowDown' ? 1 : e.key === 'ArrowLeft' || e.key === 'ArrowUp' ? -1 : 0;
                    if (!step) return;
                    e.preventDefault();
                    const paths = (e.currentTarget.parentNode as SVGElement).querySelectorAll<SVGPathElement>('.sp-chart__slice');
                    paths[(Array.from(paths).indexOf(e.currentTarget) + step + paths.length) % paths.length]?.focus();
                  }}
                />
              ) : null,
            )}
          </svg>
          {/* Hover/focus readout lives in the hole; the legend row highlights too. */}
          <div className="sp-chart__center" aria-live="polite">
            {active !== null ? (
              <>
                <strong>{pct(data[active].value)}</strong>
                <span>
                  {data[active].label} · {f.value(data[active].value)}
                </span>
              </>
            ) : (
              <>
                <strong>{props.centerLabel ?? f.axis(total)}</strong>
                <span>{centerCaption}</span>
              </>
            )}
          </div>
        </div>
        <ul className={slot('sp-chart__legend sp-chart__legend--list', classNames, 'legend')}>
          {data.map((d, i) => (
            <li key={d.label} data-active={active === i || undefined}>
              <span className="sp-chart__swatch" style={{ background: color(i) }} aria-hidden="true" />
              <span className="sp-chart__legend-label">{d.label}</span>
              <span className="sp-chart__legend-value">{f.value(d.value)}</span>
              <span className="sp-chart__legend-pct">{pct(d.value)}</span>
            </li>
          ))}
        </ul>
      </div>
    </figure>
  );
}

export interface SparklineProps {
  /** Values in order (oldest first). */
  data: number[];
  /** What the line shows, for screen readers, e.g. "Sign-ups, last 30 days". */
  'aria-label': string;
  width?: number;
  height?: number;
  /** Fill under the line. */
  area?: boolean;
  /** Line colour. Default `--spark-chart-1`. */
  color?: string;
  /** Mark the last value with a dot. Default `true`. */
  showLast?: boolean;
  className?: string;
}

/**
 * A tiny trend line that fits in a table cell or beside a number. No axes, no
 * fuss, just the shape of the data and, optionally, its latest value.
 *
 * A word-sized trend for tables, stat tiles and cards. No axes;
 * the last point is marked so the current value is easy to find. Its
 * accessible name states the first, last and range.
 */
export function Sparkline(inProps: SparklineProps) {
  const { data, width = 96, height = 28, area = false, color = 'var(--spark-chart-1)', showLast = true, className, ...rest } = useDefaults('Sparkline', inProps) as SparklineProps;
  const id = useId().replace(/:/g, '');
  if (!data.length) return null;
  const lo = Math.min(...data);
  const hi = Math.max(...data);
  const pad = 3;
  const sx = (i: number) => pad + (data.length < 2 ? (width - pad * 2) / 2 : (i / (data.length - 1)) * (width - pad * 2));
  const sy = (v: number) => (hi === lo ? height / 2 : pad + (1 - (v - lo) / (hi - lo)) * (height - pad * 2));
  const line = data.map((v, i) => `${i ? 'L' : 'M'}${sx(i).toFixed(1)},${sy(v).toFixed(1)}`).join('');
  const last = data[data.length - 1];
  return (
    <svg
      className={['sp-sparkline', className].filter(Boolean).join(' ')}
      width={width}
      height={height}
      viewBox={`0 0 ${width} ${height}`}
      role="img"
      aria-label={`${rest['aria-label']}: from ${data[0]} to ${last}, low ${lo}, high ${hi}`}
    >
      {area && (
        <>
          <defs>
            <linearGradient id={`sp-spark-${id}`} x1="0" x2="0" y1="0" y2="1">
              <stop offset="0" stopColor={color} stopOpacity="0.28" />
              <stop offset="1" stopColor={color} stopOpacity="0" />
            </linearGradient>
          </defs>
          <path d={`${line}L${sx(data.length - 1)},${height}L${sx(0)},${height}Z`} fill={`url(#sp-spark-${id})`} />
        </>
      )}
      <path d={line} fill="none" stroke={color} strokeWidth={1.5} strokeLinejoin="round" strokeLinecap="round" />
      {showLast && <circle cx={sx(data.length - 1)} cy={sy(last)} r={2.5} fill={color} stroke="var(--spark-surface-base)" strokeWidth={1.5} />}
    </svg>
  );
}

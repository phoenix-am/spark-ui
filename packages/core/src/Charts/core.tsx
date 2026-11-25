import React, { useEffect, useId, useMemo, useRef, useState } from 'react';
import { useMessages } from '../internal/messages';
import { useLocale } from 'react-aria';
import { slot, ClassNames } from '../internal/defaults';

/* ------------------------------------------------------------------ types */

export interface ChartSeries<Row> {
  /** Field of each row holding this series' value. */
  key: keyof Row & string;
  /** Name in the legend, tooltip and table. */
  label: string;
  /**
   * Colour. Default: the next slot of the validated categorical palette
   * (`--spark-chart-1` … `-8`), assigned in fixed order. Colour follows the
   * series, not its position, so hiding one never repaints the others.
   */
  color?: string;
}

export interface ChartBaseProps<Row> {
  /** One object per point on the x axis, with a field for `x` and one for each series, e.g. `{ month: 'Jan', sales: 420 }`. */
  data: Row[];
  /** Field used for the category / x axis. */
  x: keyof Row & string;
  /** One or more series (up to 8; fold the rest into "Other"). */
  series: ChartSeries<Row>[];
  /** Title shown above the chart; also its accessible name. */
  title?: React.ReactNode;
  /** Accessible name when there is no visible title. */
  'aria-label'?: string;
  /** One-line summary for screen readers, e.g. "Revenue rose 40% in Q3". */
  description?: string;
  /** Height in px. Width follows the container. Default 280. */
  height?: number;
  /** Intl options for values, e.g. `{ style: 'currency', currency: 'INR', notation: 'compact' }`. */
  valueFormat?: Intl.NumberFormatOptions;
  /** Format x values for axis, tooltip and table. Default: dates by locale, others as text. */
  formatX?: (value: unknown) => string;
  /** Show the legend (default: when there are 2+ series). */
  legend?: boolean;
  /** Show a "Data table" toggle under the chart. Default `true`. */
  tableView?: boolean;
  /** Extra class names for the outermost element. */
  className?: string;
  /** Extra class names for the component's inner parts, keyed by part name. Handy with Tailwind. */
  classNames?: ClassNames<'root' | 'title' | 'legend' | 'plot' | 'tooltip' | 'table'>;
}

/* ---------------------------------------------------------------- scales */

/** Rounded ticks covering [min, max]: 0, 250, 500… or 0, 0.2, 0.4… */
export function niceTicks(min: number, max: number, count = 5): number[] {
  if (!Number.isFinite(min) || !Number.isFinite(max)) return [0, 1];
  if (min > max) [min, max] = [max, min];
  // A flat series still needs a range. `min + 1` is no change at all past 2^53, so scale it.
  if (min === max) max = min + (Math.abs(min) * Number.EPSILON * 8 || 1);
  const span = max - min;
  // Spans beyond Number.MAX_VALUE: no "nice" step exists, so mark the ends (and zero).
  if (!Number.isFinite(span)) return min < 0 && max > 0 ? [min, 0, max] : [min, max];
  const raw = span / count;
  const mag = 10 ** Math.floor(Math.log10(raw));
  const step = [1, 2, 2.5, 5, 10].map((m) => m * mag).find((s) => span / s <= count) ?? 10 * mag;
  let start = Math.floor(min / step) * step;
  let end = Math.ceil(max / step) * step;
  // Tiny values can underflow to 0 in the division (5e-324 / 2), leaving an end short of the data.
  if (start > min) start -= step;
  if (end < max) end += step;
  // Count by index, never by `v += step`: adding a step smaller than the gap between
  // floats leaves v unchanged and loops forever. Capped so a rounding slip can't explode.
  const n = Math.min(50, Math.max(1, Math.round((end - start) / step)));
  const digits = Math.min(100, Math.max(0, 1 - Math.floor(Math.log10(step))));
  const ticks: number[] = [];
  for (let i = 0; i <= n; i++) {
    const v = Number((start + i * step).toFixed(digits));
    if (!ticks.length || v > ticks[ticks.length - 1]) ticks.push(v);
  }
  if (ticks.length < 2) return [min, max];
  // At extreme magnitudes rounding can leave the outer ticks a hair inside the data; pull them out.
  if (ticks[0] > min) ticks[0] = min;
  if (ticks[ticks.length - 1] < max) ticks[ticks.length - 1] = max;
  return ticks;
}

export const linear = (d0: number, d1: number, r0: number, r1: number) => (v: number) => (d1 === d0 ? r0 : r0 + ((v - d0) / (d1 - d0)) * (r1 - r0));

/* ------------------------------------------------------------------ size */

/** Width of the container, kept up to date. Starts at 600 for server rendering. */
export function useWidth<T extends HTMLElement>() {
  const ref = useRef<T>(null);
  const [width, setWidth] = useState(600);
  useEffect(() => {
    const el = ref.current;
    if (!el || typeof ResizeObserver === 'undefined') return;
    const ro = new ResizeObserver(([entry]) => setWidth(Math.max(120, Math.round(entry.contentRect.width))));
    ro.observe(el);
    return () => ro.disconnect();
  }, []);
  return [ref, width] as const;
}

/* ------------------------------------------------------------ formatting */

export function useFormatters<Row>(props: Pick<ChartBaseProps<Row>, 'valueFormat' | 'formatX'>) {
  const { locale } = useLocale();
  return useMemo(() => {
    const num = new Intl.NumberFormat(locale, props.valueFormat);
    const axisNum = new Intl.NumberFormat(locale, { notation: 'compact', maximumFractionDigits: 1, ...props.valueFormat });
    const date = new Intl.DateTimeFormat(locale, { day: 'numeric', month: 'short' });
    const fx = props.formatX ?? ((v: unknown) => (v instanceof Date ? date.format(v) : String(v ?? '')));
    return { value: (v: number) => num.format(v), axis: (v: number) => axisNum.format(v), x: fx };
  }, [locale, props.valueFormat, props.formatX]);
}

/** Series colours in fixed palette order; a series keeps its colour wherever it appears. */
export const seriesColor = <Row,>(series: ChartSeries<Row>[], i: number) => series[i].color ?? `var(--spark-chart-${(i % 8) + 1})`;

/* ----------------------------------------------------------------- frame */

export interface FrameProps<Row> extends ChartBaseProps<Row> {
  kind: string;
  /** Series hidden via the legend. */
  hidden: Set<string>;
  onToggle: (key: string) => void;
  tooltip: React.ReactNode;
  tooltipPos: { x: number; y: number } | null;
  children: (width: number) => React.ReactNode;
  /** Rows/series for the table view. */
  tableColumns?: Array<{ key: string; label: string }>;
}

/**
 * Shared chart shell: title, legend (click to hide a series), responsive
 * plot, a tooltip layer and an accessible data-table view. Every chart
 * type renders inside it.
 */
export function ChartFrame<Row>({
  kind,
  data,
  x,
  series,
  title,
  'aria-label': ariaLabel,
  description,
  legend,
  tableView = true,
  valueFormat,
  formatX,
  className,
  classNames,
  hidden,
  onToggle,
  tooltip,
  tooltipPos,
  children,
  tableColumns,
}: FrameProps<Row>) {
  const [ref, width] = useWidth<HTMLDivElement>();
  const titleId = useId();
  const f = useFormatters<Row>({ valueFormat, formatX });
  const m = useMessages();
  const showLegend = legend ?? series.length > 1;
  const cols = tableColumns ?? series.map((s) => ({ key: s.key, label: s.label }));
  return (
    <figure className={slot('sp-chart', classNames, 'root', className)} data-kind={kind} aria-labelledby={title ? titleId : undefined} aria-label={title ? undefined : ariaLabel}>
      {title && (
        <figcaption id={titleId} className={slot('sp-chart__title', classNames, 'title')}>
          {title}
        </figcaption>
      )}
      {showLegend && (
        <ul className={slot('sp-chart__legend', classNames, 'legend')} aria-label={m.series}>
          {series.map((s, i) => (
            <li key={s.key}>
              <button type="button" className="sp-chart__key" aria-pressed={!hidden.has(s.key)} onClick={() => onToggle(s.key)}>
                <span className="sp-chart__swatch" style={{ background: seriesColor(series, i) }} aria-hidden="true" />
                {s.label}
              </button>
            </li>
          ))}
        </ul>
      )}
      <div ref={ref} className={slot('sp-chart__plot', classNames, 'plot')}>
        {description && <p className="sp-visually-hidden">{description}</p>}
        {children(width)}
        {tooltip && tooltipPos && (
          <div
            className={slot('sp-chart__tooltip', classNames, 'tooltip')}
            role="status"
            style={{ left: tooltipPos.x, top: tooltipPos.y, transform: `translate(${tooltipPos.x > width / 2 ? 'calc(-100% - 12px)' : '12px'}, -50%)` }}
          >
            {tooltip}
          </div>
        )}
      </div>
      {tableView && (
        <details className={slot('sp-chart__table', classNames, 'table')}>
          <summary>{m.dataTable}</summary>
          <div className="sp-chart__table-scroll">
            <table>
              <thead>
                <tr>
                  <th scope="col">{String(x)}</th>
                  {cols.map((c) => (
                    <th key={c.key} scope="col">
                      {c.label}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {data.map((row, i) => (
                  <tr key={i}>
                    <th scope="row">{f.x((row as Record<string, unknown>)[x])}</th>
                    {cols.map((c) => {
                      const v = (row as Record<string, unknown>)[c.key];
                      return <td key={c.key}>{typeof v === 'number' ? f.value(v) : String(v ?? '')}</td>;
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </details>
      )}
    </figure>
  );
}

/** Legend toggling: hidden series keep their colour slot. */
export function useHiddenSeries() {
  const [hidden, setHidden] = useState<Set<string>>(new Set());
  const toggle = (key: string) =>
    setHidden((prev) => {
      const next = new Set(prev);
      next.has(key) ? next.delete(key) : next.add(key);
      return next;
    });
  return [hidden, toggle] as const;
}

/** Tooltip body: heading plus a row per series with its colour key. */
export function TooltipBody({ heading, rows }: { heading: string; rows: Array<{ label: string; value: string; color: string }> }) {
  return (
    <>
      <div className="sp-chart__tooltip-heading">{heading}</div>
      {rows.map((r) => (
        <div key={r.label} className="sp-chart__tooltip-row">
          <span className="sp-chart__swatch" style={{ background: r.color }} aria-hidden="true" />
          <span className="sp-chart__tooltip-label">{r.label}</span>
          <span className="sp-chart__tooltip-value">{r.value}</span>
        </div>
      ))}
    </>
  );
}

export const MARGIN = { top: 12, right: 16, bottom: 28, left: 52 };

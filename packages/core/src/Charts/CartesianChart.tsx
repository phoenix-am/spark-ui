import React, { useState } from 'react';
import { useMessages } from '../internal/messages';
import { ChartBaseProps, ChartFrame, MARGIN, TooltipBody, linear, niceTicks, seriesColor, useFormatters, useHiddenSeries } from './core';
import { useDefaults } from '../internal/defaults';

export interface LineChartProps<Row> extends ChartBaseProps<Row> {
  /** Fill under each line. */
  area?: boolean;
  /** Stack the series (implies `area`). */
  stacked?: boolean;
  /** Smooth the lines. Default `true`. */
  curved?: boolean;
  /** Show a dot on every point (default: only the hovered one). */
  showPoints?: boolean;
  /** Start the y axis at zero. Default `true` for areas, `false` for lines. */
  zeroBaseline?: boolean;
}

export interface BarChartProps<Row> extends ChartBaseProps<Row> {
  /** Stack the series in one bar instead of side by side. */
  stacked?: boolean;
  /** Bars run left to right (good for long category names). */
  horizontal?: boolean;
}

/* ------------------------------------------------------------ geometry */

/** Monotone cubic path: smooth without overshooting the data. */
function monotonePath(pts: Array<[number, number]>) {
  if (pts.length < 3) return pts.map((p, i) => `${i ? 'L' : 'M'}${p[0]},${p[1]}`).join('');
  const n = pts.length;
  const dx = pts.slice(1).map((p, i) => p[0] - pts[i][0]);
  const slope = pts.slice(1).map((p, i) => (p[1] - pts[i][1]) / (dx[i] || 1));
  const m = pts.map((_, i) => (i === 0 ? slope[0] : i === n - 1 ? slope[n - 2] : slope[i - 1] * slope[i] <= 0 ? 0 : (slope[i - 1] + slope[i]) / 2));
  let d = `M${pts[0][0]},${pts[0][1]}`;
  for (let i = 0; i < n - 1; i++) {
    const h = dx[i] / 3;
    d += `C${pts[i][0] + h},${pts[i][1] + m[i] * h} ${pts[i + 1][0] - h},${pts[i + 1][1] - m[i + 1] * h} ${pts[i + 1][0]},${pts[i + 1][1]}`;
  }
  return d;
}
const straightPath = (pts: Array<[number, number]>) => pts.map((p, i) => `${i ? 'L' : 'M'}${p[0]},${p[1]}`).join('');

/** A bar with 4px rounded corners on its data end only, anchored square to the baseline. */
function barPath(x: number, y: number, w: number, h: number, end: 'top' | 'right' | 'bottom' | 'left', r = 4) {
  r = Math.max(0, Math.min(r, w / 2, h / 2));
  if (end === 'top') return `M${x},${y + h}V${y + r}Q${x},${y} ${x + r},${y}H${x + w - r}Q${x + w},${y} ${x + w},${y + r}V${y + h}Z`;
  if (end === 'bottom') return `M${x},${y}V${y + h - r}Q${x},${y + h} ${x + r},${y + h}H${x + w - r}Q${x + w},${y + h} ${x + w},${y + h - r}V${y}Z`;
  if (end === 'right') return `M${x},${y}H${x + w - r}Q${x + w},${y} ${x + w},${y + r}V${y + h - r}Q${x + w},${y + h} ${x + w - r},${y + h}H${x}Z`;
  return `M${x + w},${y}H${x + r}Q${x},${y} ${x},${y + r}V${y + h - r}Q${x},${y + h} ${x + r},${y + h}H${x + w}Z`;
}

const num = (v: unknown) => (typeof v === 'number' && Number.isFinite(v) ? v : 0);

/* ------------------------------------------------------------ LineChart */

/**
 * Show how something changes over time. Hover, or focus the chart and use the
 * arrow keys, to read exact values. Fill the area underneath, stack series,
 * and switch to a data table view for screen readers.
 *
 * Change over time or an
 * ordered axis. Thin 2px lines that draw in like current, a crosshair and
 * tooltip that follow the pointer, keyboard stepping (focus the chart, then
 * ← →), legend toggles, and a data-table view. One y axis only.
 *
 * Style hooks: `.sp-chart[data-kind="line"|"area"]`, `__line`, `__area`,
 * `__crosshair`, `__point`, `__grid`, `__axis`. Colours: `--spark-chart-1…8`.
 */
export function LineChart<Row>(inProps: LineChartProps<Row>) {
  const props = useDefaults('LineChart', inProps) as LineChartProps<Row>;
  const { data, x, series, height = 280, stacked = false, curved = true, showPoints = false } = props;
  const area = props.area || stacked;
  const zero = props.zeroBaseline ?? area;
  const [hidden, toggle] = useHiddenSeries();
  const [active, setActive] = useState<number | null>(null);
  const [tipX, setTipX] = useState(0);
  const f = useFormatters<Row>(props);
  const msg = useMessages();
  const visible = series.map((s, i) => ({ s, i })).filter(({ s }) => !hidden.has(s.key));

  // Stacked totals per row, bottom-up in series order.
  const stacks = data.map((row) => {
    let acc = 0;
    return visible.map(({ s }) => {
      const lo = stacked ? acc : 0;
      acc = stacked ? acc + num((row as Record<string, unknown>)[s.key]) : num((row as Record<string, unknown>)[s.key]);
      return [lo, acc] as [number, number];
    });
  });
  // Unstacked lines start at 0 only for drawing; the range uses their values alone,
  // so `zeroBaseline={false}` can zoom in on 1000–1002.
  const values = stacked ? stacks.flat().flat() : stacks.flat().map(([, v]) => v);
  const lo = zero ? Math.min(0, ...values) : Math.min(...values);
  const hi = Math.max(...values, lo + 1);
  const ticks = niceTicks(lo, hi);

  const render = (width: number) => {
    const iw = width - MARGIN.left - MARGIN.right;
    const ih = height - MARGIN.top - MARGIN.bottom;
    const sx = (i: number) => MARGIN.left + (data.length < 2 ? iw / 2 : (i / (data.length - 1)) * iw);
    const sy = linear(ticks[0], ticks[ticks.length - 1], MARGIN.top + ih, MARGIN.top);
    const path = curved ? monotonePath : straightPath;
    const xLabelEvery = Math.max(1, Math.ceil(data.length / Math.max(2, Math.floor(iw / 80))));

    const go = (i: number) => {
      setActive(i);
      setTipX(sx(i));
    };
    const pick = (clientX: number, rect: DOMRect) => {
      const rel = ((clientX - rect.left - MARGIN.left) / iw) * (data.length - 1);
      go(Math.max(0, Math.min(data.length - 1, Math.round(rel))));
    };

    return (
      <svg
        width={width}
        height={height}
        className="sp-chart__svg"
        role="img"
        aria-label={`${typeof props.title === 'string' ? props.title : props['aria-label'] ?? msg.chart}: ${visible.map(({ s }) => s.label).join(', ')}`}
        tabIndex={0}
        onPointerMove={(e) => pick(e.clientX, e.currentTarget.getBoundingClientRect())}
        onPointerLeave={() => setActive(null)}
        onBlur={() => setActive(null)}
        onKeyDown={(e) => {
          if (e.key === 'ArrowRight') go(Math.min(data.length - 1, (active ?? -1) + 1));
          else if (e.key === 'ArrowLeft') go(Math.max(0, (active ?? data.length) - 1));
          else if (e.key === 'Home') go(0);
          else if (e.key === 'End') go(data.length - 1);
          else if (e.key === 'Escape') setActive(null);
          else return;
          e.preventDefault();
        }}
      >
        <g className="sp-chart__grid" aria-hidden="true">
          {ticks.map((t) => (
            <g key={t}>
              <line x1={MARGIN.left} x2={MARGIN.left + iw} y1={sy(t)} y2={sy(t)} data-zero={t === 0 || undefined} />
              <text x={MARGIN.left - 8} y={sy(t)} dy="0.32em" textAnchor="end" className="sp-chart__axis">
                {f.axis(t)}
              </text>
            </g>
          ))}
          {data.map((row, i) =>
            i % xLabelEvery === 0 ? (
              <text key={i} x={sx(i)} y={height - 8} textAnchor="middle" className="sp-chart__axis">
                {f.x((row as Record<string, unknown>)[x])}
              </text>
            ) : null,
          )}
        </g>
        {visible.map(({ s, i }, vi) => {
          const top = data.map((_, r) => [sx(r), sy(stacks[r][vi][1])] as [number, number]);
          const base = data.map((_, r) => [sx(r), sy(stacks[r][vi][0])] as [number, number]);
          const color = seriesColor(series, i);
          const areaD = area ? `${path(top)}L${base[base.length - 1][0]},${base[base.length - 1][1]}${path([...base].reverse()).replace(/^M/, 'L')}Z` : '';
          return (
            <g key={s.key} aria-hidden="true">
              {area && <path d={areaD} className="sp-chart__area" style={{ fill: color }} />}
              <path d={path(top)} className="sp-chart__line" pathLength={1} style={{ stroke: color }} />
              {showPoints && top.map(([px, py], r) => <circle key={r} cx={px} cy={py} r={3} className="sp-chart__dot" style={{ fill: color }} />)}
            </g>
          );
        })}
        {active !== null && (
          <g aria-hidden="true">
            <line className="sp-chart__crosshair" x1={sx(active)} x2={sx(active)} y1={MARGIN.top} y2={MARGIN.top + ih} />
            {visible.map(({ s, i }, vi) => (
              <circle key={s.key} cx={sx(active)} cy={sy(stacks[active][vi][1])} r={4.5} className="sp-chart__point" style={{ fill: seriesColor(series, i) }} />
            ))}
          </g>
        )}
      </svg>
    );
  };

  const activeRow = active !== null ? (data[active] as Record<string, unknown>) : null;
  return (
    <ChartFrame
      {...props}
      kind={area ? 'area' : 'line'}
      hidden={hidden}
      onToggle={toggle}
      tooltipPos={active !== null ? { x: tipX, y: (props.height ?? 280) / 2 } : null}
      tooltip={
        activeRow && (
          <TooltipBody
            heading={f.x(activeRow[x])}
            rows={visible.map(({ s, i }) => ({ label: s.label, value: f.value(num(activeRow[s.key])), color: seriesColor(series, i) })).reverse()}
          />
        )
      }
      children={render}
    />
  );
}

/* ------------------------------------------------------------- BarChart */

/**
 * Compare amounts side by side, stacked or horizontally. Bars are rounded only
 * at their ends with a little gap between them, so they stay easy to read even
 * with several series.
 *
 * Compare amounts across categories. Grouped or `stacked`,
 * vertical or `horizontal`. Thin bars with 4px rounded data ends, square to
 * the baseline, a 2px gap between neighbours; a per-group tooltip on hover
 * or keyboard (focus the chart, then arrow keys), legend toggles and a
 * data-table view.
 *
 * Style hooks: `.sp-chart[data-kind="bar"]`, `__bar[data-active]`, `__band`.
 */
export function BarChart<Row>(inProps: BarChartProps<Row>) {
  const props = useDefaults('BarChart', inProps) as BarChartProps<Row>;
  const { data, x, series, height = 280, stacked = false, horizontal = false } = props;
  const [hidden, toggle] = useHiddenSeries();
  const [active, setActive] = useState<number | null>(null);
  const [tip, setTip] = useState<{ x: number; y: number } | null>(null);
  const f = useFormatters<Row>(props);
  const msg = useMessages();
  const visible = series.map((s, i) => ({ s, i })).filter(({ s }) => !hidden.has(s.key));
  const totals = data.map((row) => visible.reduce((a, { s }) => a + num((row as Record<string, unknown>)[s.key]), 0));
  const maxV = stacked ? Math.max(1, ...totals) : Math.max(1, ...data.flatMap((row) => visible.map(({ s }) => num((row as Record<string, unknown>)[s.key]))));
  const ticks = niceTicks(0, maxV);
  const labelW = horizontal ? Math.min(140, 12 + Math.max(...data.map((r) => f.x((r as Record<string, unknown>)[x]).length)) * 7) : 0;

  const render = (width: number) => {
    const m = { ...MARGIN, left: horizontal ? labelW : MARGIN.left, bottom: horizontal ? 24 : MARGIN.bottom };
    const iw = width - m.left - m.right;
    const ih = height - m.top - m.bottom;
    const n = data.length;
    const band = (horizontal ? ih : iw) / Math.max(n, 1);
    const groupPad = band * 0.22;
    const inner = band - groupPad * 2;
    const per = stacked ? inner : inner / Math.max(visible.length, 1);
    const val = linear(0, ticks[ticks.length - 1], 0, horizontal ? iw : ih);
    const gap = 2;

    const at = (clientX: number, clientY: number, rect: DOMRect) => {
      const pos = horizontal ? clientY - rect.top - m.top : clientX - rect.left - m.left;
      const i = Math.floor(pos / band);
      if (i < 0 || i >= n) return setActive(null);
      setActive(i);
      setTip(horizontal ? { x: Math.min(width - 40, m.left + val(totalsOrMax(i)) + 8), y: m.top + band * i + band / 2 } : { x: m.left + band * i + band / 2, y: m.top + ih - val(totalsOrMax(i)) });
    };
    const totalsOrMax = (i: number) => (stacked ? totals[i] : Math.max(0, ...visible.map(({ s }) => num((data[i] as Record<string, unknown>)[s.key]))));
    const xLabelEvery = horizontal ? 1 : Math.max(1, Math.ceil(n / Math.max(2, Math.floor(iw / 70))));

    return (
      <svg
        width={width}
        height={height}
        className="sp-chart__svg"
        role="img"
        aria-label={`${typeof props.title === 'string' ? props.title : props['aria-label'] ?? msg.chart}: ${visible.map(({ s }) => s.label).join(', ')}`}
        tabIndex={0}
        onPointerMove={(e) => at(e.clientX, e.clientY, e.currentTarget.getBoundingClientRect())}
        onPointerLeave={() => setActive(null)}
        onBlur={() => setActive(null)}
        onKeyDown={(e) => {
          const next = e.key === 'ArrowRight' || e.key === 'ArrowDown' ? 1 : e.key === 'ArrowLeft' || e.key === 'ArrowUp' ? -1 : 0;
          if (e.key === 'Escape') setActive(null);
          else if (next) {
            const i = Math.max(0, Math.min(n - 1, (active ?? (next > 0 ? -1 : n)) + next));
            setActive(i);
            setTip(horizontal ? { x: Math.min(width - 40, m.left + val(totalsOrMax(i)) + 8), y: m.top + band * i + band / 2 } : { x: m.left + band * i + band / 2, y: m.top + ih - val(totalsOrMax(i)) });
          } else return;
          e.preventDefault();
        }}
      >
        <g className="sp-chart__grid" aria-hidden="true">
          {ticks.map((t) =>
            horizontal ? (
              <g key={t}>
                <line x1={m.left + val(t)} x2={m.left + val(t)} y1={m.top} y2={m.top + ih} data-zero={t === 0 || undefined} />
                <text x={m.left + val(t)} y={height - 6} textAnchor="middle" className="sp-chart__axis">
                  {f.axis(t)}
                </text>
              </g>
            ) : (
              <g key={t}>
                <line x1={m.left} x2={m.left + iw} y1={m.top + ih - val(t)} y2={m.top + ih - val(t)} data-zero={t === 0 || undefined} />
                <text x={m.left - 8} y={m.top + ih - val(t)} dy="0.32em" textAnchor="end" className="sp-chart__axis">
                  {f.axis(t)}
                </text>
              </g>
            ),
          )}
          {data.map((row, i) =>
            i % xLabelEvery === 0 ? (
              horizontal ? (
                <text key={i} x={m.left - 8} y={m.top + band * i + band / 2} dy="0.32em" textAnchor="end" className="sp-chart__axis sp-chart__category">
                  {f.x((row as Record<string, unknown>)[x])}
                </text>
              ) : (
                <text key={i} x={m.left + band * i + band / 2} y={height - 8} textAnchor="middle" className="sp-chart__axis">
                  {f.x((row as Record<string, unknown>)[x])}
                </text>
              )
            ) : null,
          )}
        </g>
        {active !== null && (
          <rect
            className="sp-chart__band"
            aria-hidden="true"
            x={horizontal ? m.left : m.left + band * active}
            y={horizontal ? m.top + band * active : m.top}
            width={horizontal ? iw : band}
            height={horizontal ? band : ih}
          />
        )}
        <g aria-hidden="true">
          {data.map((row, r) => {
            let acc = 0;
            return visible.map(({ s, i }, vi) => {
              const v = Math.max(0, num((row as Record<string, unknown>)[s.key]));
              const len = val(v);
              const start = stacked ? val(acc) : 0;
              acc += v;
              const isTop = !stacked || vi === visible.length - 1 || visible.slice(vi + 1).every(({ s: s2 }) => num((row as Record<string, unknown>)[s2.key]) <= 0);
              const offset = groupPad + (stacked ? 0 : per * vi);
              const thick = Math.max(1, per - (stacked ? 0 : gap));
              // In stacks, each segment gives up 2px at its far end so neighbours are separated by the surface.
              const segLen = stacked && !isTop ? Math.max(0, len - gap) : len;
              if (segLen <= 0) return null;
              const d = horizontal
                ? barPath(m.left + start, m.top + band * r + offset, segLen, thick, 'right', isTop ? 4 : 0)
                : barPath(m.left + band * r + offset, m.top + ih - start - segLen, thick, segLen, 'top', isTop ? 4 : 0);
              return <path key={s.key} d={d} className="sp-chart__bar" data-active={active === r || undefined} style={{ fill: seriesColor(series, i) }} />;
            });
          })}
        </g>
      </svg>
    );
  };

  const row = active !== null ? (data[active] as Record<string, unknown>) : null;
  return (
    <ChartFrame
      {...props}
      kind="bar"
      hidden={hidden}
      onToggle={toggle}
      tooltipPos={active !== null ? tip : null}
      tooltip={
        row && (
          <TooltipBody
            heading={f.x(row[x]) + (stacked && visible.length > 1 ? ` · ${f.value(totals[active!])}` : '')}
            rows={visible.map(({ s, i }) => ({ label: s.label, value: f.value(num(row[s.key])), color: seriesColor(series, i) }))}
          />
        )
      }
      children={render}
    />
  );
}

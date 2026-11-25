import React, { useMemo, useState } from 'react';
import { Switch, Textfield, NumberField, Dropdown, ToggleGroup, ToggleGroupItem } from '@sparkwire/core';
import type { ComponentDoc, PropDoc } from '../lib/catalog';
import type { PlaygroundConfig } from '../lib/demos';
import { toJsx } from '../lib/jsx';
import { defaultFor } from '../lib/api';
import { CodeBlock } from './CodeBlock';
import { ErrorBoundary } from './ExampleCard';
import { Icon } from './Icon';

type Control =
  | { kind: 'choice'; prop: PropDoc; options: string[] }
  | { kind: 'boolean'; prop: PropDoc }
  | { kind: 'text'; prop: PropDoc }
  | { kind: 'number'; prop: PropDoc };

/** Props that make no sense as a control: styling hooks, escape hatches, controlled state, legacy. */
const SKIP = new Set(['className', 'classNames', 'style', 'render', 'as', 'id', 'name', 'value', 'checked', 'open', 'page', 'selectedKeys', 'expandedKeys', 'inputValue', 'collapsed', 'mobileOpen', 'files', 'columnWidths', 'ripple', 'href', 'containerStyle', 'inputStyle', 'itemStyle', 'listContainerStyle', 'appendIcon', 'prependIcon', 'wrapperClassName', 'forTeams', 'showBorder']);
const TEXTY = new Set(['children', 'label', 'title', 'placeholder', 'helperText', 'description', 'error', 'emptyState', 'searchPlaceholder']);

function controlFor(p: PropDoc, initial: unknown): Control | null {
  if (SKIP.has(p.name) || p.name.startsWith('on') || p.name.startsWith('aria-') || p.name.startsWith('default') || p.type.includes('=>')) return null;
  const options = (p.values ?? []).filter((v) => v !== 'true' && v !== 'false');
  if (options.length >= 2) return { kind: 'choice', prop: p, options };
  if (p.type === 'boolean') return { kind: 'boolean', prop: p };
  if (p.type === 'number') return { kind: 'number', prop: p };
  if (p.type === 'string' || (TEXTY.has(p.name) && /ReactNode|string/.test(p.type)) || typeof initial === 'string') return { kind: 'text', prop: p };
  return null;
}



export function Playground({ config, doc }: { config: PlaygroundConfig; doc: ComponentDoc }) {
  /** The prop's real default, unquoted: `'medium'` → medium. */
  const defaultOf = (p: PropDoc) => defaultFor(doc.name, p)?.replace(/^['"`](.*)['"`]$/, '$1');
  const initial = useMemo(() => ({ ...config.props }), [config]);
  const [values, setValues] = useState<Record<string, unknown>>(initial);
  const controls = useMemo(
    () => {
      const rank = { choice: 0, text: 1, number: 2, boolean: 3 } as const;
      const first = (n: string) => (n === 'variant' ? -2 : n === 'children' || n === 'label' ? -1 : 0);
      return (doc.props.filter((p) => !config.hide?.includes(p.name)).map((p) => controlFor(p, initial[p.name])).filter(Boolean) as Control[]).sort(
        (a, b) => first(a.prop.name) - first(b.prop.name) || rank[a.kind] - rank[b.kind] || a.prop.name.localeCompare(b.prop.name),
      );
    },
    [doc, config, initial],
  );
  const set = (key: string, v: unknown) => setValues((all) => ({ ...all, [key]: v }));
  const { children, ...rest } = values;
  const C = config.component;
  const preview = <C {...config.fixed} {...values} />;
  const code = toJsx(config.name ?? doc.name, { ...rest, ...Object.fromEntries(Object.keys(config.fixed ?? {}).map((k) => [k, config.fixed![k]])) }, children);

  return (
    <div className="sw-playground">
      <div className="sw-playground__stage">
        <div className="sw-canvas sw-canvas--stage">
          <ErrorBoundary key={JSON.stringify(values)}>{config.wrap ? config.wrap(preview) : preview}</ErrorBoundary>
        </div>
        <aside className="sw-playground__controls" aria-label="Props">
          <div className="sw-playground__controls-head">
            <span>Props</span>
            <button type="button" className="sw-chip" onClick={() => setValues(initial)} aria-label="Reset props">
              <Icon name="reset" size={14} /> Reset
            </button>
          </div>
          {controls.map((c) => {
            const key = c.prop.name;
            const v = values[key];
            const hint = c.prop.description.split(/(?<=\.)\s/)[0];
            if (c.kind === 'boolean')
              return (
                <div key={key} className="sw-control sw-control--inline" title={hint}>
                  <Switch size="small" label={<code>{key}</code>} checked={Boolean(v ?? defaultOf(c.prop) === 'true')} onChange={(on) => set(key, on)} />
                </div>
              );
            if (c.kind === 'choice') {
              const current = String(v ?? defaultOf(c.prop) ?? '');
              const short = c.options.length <= 3 && c.options.join('').length <= 24;
              return (
                <div key={key} className="sw-control" title={hint}>
                  <span className="sw-control__label" id={`ctl-${key}`}>
                    <code>{key}</code>
                  </span>
                  {short ? (
                    <ToggleGroup aria-labelledby={`ctl-${key}`} size="small" fullWidth value={current || null} onChange={(nv) => set(key, nv ?? undefined)}>
                      {c.options.map((o) => (
                        <ToggleGroupItem key={o} value={o}>
                          {o}
                        </ToggleGroupItem>
                      ))}
                    </ToggleGroup>
                  ) : (
                    <Dropdown aria-labelledby={`ctl-${key}`} size="small" value={current || null} onChange={(nv) => set(key, nv)} options={c.options.map((o) => ({ value: o, label: o }))} />
                  )}
                </div>
              );
            }
            if (c.kind === 'number')
              return (
                <div key={key} className="sw-control" title={hint}>
                  <NumberField size="small" label={key} value={typeof v === 'number' ? v : null} onChange={(n) => set(key, Number.isNaN(n) ? undefined : n)} />
                </div>
              );
            return (
              <div key={key} className="sw-control" title={hint}>
                <Textfield inputSize="small" label={key} value={typeof v === 'string' ? v : ''} onChange={(e) => set(key, e.target.value || undefined)} />
              </div>
            );
          })}
          {controls.length === 0 && <p className="sw-muted">This one is best explored through the demos below.</p>}
        </aside>
      </div>
      <CodeBlock code={code} />
    </div>
  );
}

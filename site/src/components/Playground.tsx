import React, { useEffect, useMemo, useState } from 'react';
import { useSearchParams } from 'react-router';
import { Switch, Textfield, NumberField, Dropdown, ToggleGroup, ToggleGroupItem, SparkProvider } from '@sparkwire/core';
import { ThemeProvider } from '@sparkwire/system';
import { useSite } from '../App';
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



type Env = { mode: 'dark' | 'light'; energy: 'off' | 'calm' | 'default' | 'electric'; locale: string; dir: 'ltr' | 'rtl' };
const LOCALES = [
  { value: 'en-US', label: 'EN' },
  { value: 'hi-IN', label: 'हिन्दी' },
  { value: 'gu-IN', label: 'ગુજરાતી' },
  { value: 'ta-IN', label: 'தமிழ்' },
];

/** Settings live in `?play=` so a link reopens the playground exactly as it was. */
function readShared(raw: string | null): { values?: Record<string, unknown>; env?: Partial<Env> } {
  if (!raw) return {};
  try {
    const parsed = JSON.parse(raw);
    return parsed && typeof parsed === 'object' ? parsed : {};
  } catch {
    return {};
  }
}

export function Playground({ config, doc }: { config: PlaygroundConfig; doc: ComponentDoc }) {
  /** The prop's real default, unquoted: `'medium'` → medium. */
  const defaultOf = (p: PropDoc) => defaultFor(doc.name, p)?.replace(/^['"`](.*)['"`]$/, '$1');
  const site = useSite();
  const [params, setParams] = useSearchParams();
  const shared = useMemo(() => readShared(params.get('play')), []); // eslint-disable-line react-hooks/exhaustive-deps
  const initial = useMemo(() => ({ ...config.props }), [config]);
  const [values, setValues] = useState<Record<string, unknown>>(() => ({ ...initial, ...shared.values }));
  const [env, setEnv] = useState<Env>(() => ({ mode: site.mode, energy: site.energy, locale: 'en-US', dir: 'ltr', ...shared.env }));
  const setEnvKey = <K extends keyof Env>(k: K, v: Env[K] | null) => v && setEnv((e) => ({ ...e, [k]: v }));

  // Keep the URL in step, without adding history entries. Untouched settings leave it clean.
  useEffect(() => {
    const changed = Object.fromEntries(Object.entries(values).filter(([k, v]) => JSON.stringify(v) !== JSON.stringify(initial[k])).filter(([, v]) => typeof v !== 'function'));
    const envChanged = Object.fromEntries(Object.entries(env).filter(([k, v]) => v !== ({ mode: site.mode, energy: site.energy, locale: 'en-US', dir: 'ltr' } as Env)[k as keyof Env]));
    const next = new URLSearchParams(params);
    if (Object.keys(changed).length || Object.keys(envChanged).length) next.set('play', JSON.stringify({ values: changed, env: envChanged }));
    else next.delete('play');
    if (next.toString() !== params.toString()) setParams(next, { replace: true, preventScrollReset: true });
  }, [values, env]); // eslint-disable-line react-hooks/exhaustive-deps
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
      <div className="sw-playground__toolbar" role="toolbar" aria-label="Preview settings">
        <ToggleGroup aria-label="Theme" size="small" value={env.mode} onChange={(v) => setEnvKey('mode', v as Env['mode'])}>
          <ToggleGroupItem value="dark">Dark</ToggleGroupItem>
          <ToggleGroupItem value="light">Light</ToggleGroupItem>
        </ToggleGroup>
        <ToggleGroup aria-label="Energy" size="small" value={env.energy} onChange={(v) => setEnvKey('energy', v as Env['energy'])}>
          <ToggleGroupItem value="off">Off</ToggleGroupItem>
          <ToggleGroupItem value="calm">Calm</ToggleGroupItem>
          <ToggleGroupItem value="default">Default</ToggleGroupItem>
          <ToggleGroupItem value="electric">Electric</ToggleGroupItem>
        </ToggleGroup>
        <ToggleGroup aria-label="Language of built-in text" size="small" value={env.locale} onChange={(v) => setEnvKey('locale', v as string)}>
          {LOCALES.map((l) => (
            <ToggleGroupItem key={l.value} value={l.value}>
              <span lang={l.value}>{l.label}</span>
            </ToggleGroupItem>
          ))}
        </ToggleGroup>
        <ToggleGroup aria-label="Direction" size="small" value={env.dir} onChange={(v) => setEnvKey('dir', v as Env['dir'])}>
          <ToggleGroupItem value="ltr">LTR</ToggleGroupItem>
          <ToggleGroupItem value="rtl">RTL</ToggleGroupItem>
        </ToggleGroup>
      </div>
      <div className="sw-playground__stage">
        <ThemeProvider mode={env.mode}>
          <SparkProvider energy={env.energy} locale={env.locale}>
            <div className="sw-canvas sw-canvas--stage sw-playground__surface" dir={env.dir}>
              <ErrorBoundary key={JSON.stringify(values)}>{config.wrap ? config.wrap(preview) : preview}</ErrorBoundary>
            </div>
          </SparkProvider>
        </ThemeProvider>
        <aside className="sw-playground__controls" aria-label="Props">
          <div className="sw-playground__controls-head">
            <span>Props</span>
            <button type="button" className="sw-chip" onClick={() => (setValues(initial), setEnv({ mode: site.mode, energy: site.energy, locale: 'en-US', dir: 'ltr' }))} aria-label="Reset props">
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
                <Textfield size="small" label={key} value={typeof v === 'string' ? v : ''} onChange={(e) => set(key, e.target.value || undefined)} />
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

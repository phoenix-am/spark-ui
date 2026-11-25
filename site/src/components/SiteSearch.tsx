import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router';
import { Button, CommandPalette, ToggleGroup, ToggleGroupItem } from '@sparkwire/core';
import type { Command } from '@sparkwire/core';
import { entryByName } from '../lib/catalog';
import { loadDemos, type Demo } from '../lib/demos';
import { renderMarkdown } from '../lib/markdown';
import { Hit, Kind, SCOPES, index, search } from '../lib/search';
import { Icon } from './Icon';

type Scope = 'all' | Kind;
const byId = new Map(index.map((h) => [h.id, h]));
const inline = (md: string) => renderMarkdown(md).replace(/^<p>|<\/p>\s*$/g, '');

const ICON: Record<Kind, React.ComponentProps<typeof Icon>['name']> = { component: 'sparkle', prop: 'code', event: 'bolt', variable: 'palette', guide: 'pages' };
const CONTEXT: Record<Kind, (h: Hit) => string> = {
  component: (h) => h.context,
  prop: (h) => `Prop on ${h.context}`,
  event: (h) => `Event on ${h.context}`,
  variable: (h) => `CSS variable on ${h.context}`,
  guide: (h) => `Guide · ${h.context}`,
};

/** The docs search: components, props, events, CSS variables and guides, with a live preview. */
export function SiteSearch({ open, onOpenChange }: { open: boolean; onOpenChange: (open: boolean) => void }) {
  const navigate = useNavigate();
  const [query, setQuery] = useState('');
  const [scope, setScope] = useState<Scope>('all');

  useEffect(() => {
    if (!open) {
      setQuery('');
      setScope('all');
    }
  }, [open]);

  const go = (href: string) => {
    onOpenChange(false);
    navigate(href);
  };

  const items = useMemo(
    () =>
      search(query, scope).map((g) => ({
        heading: g.heading,
        items: g.hits.map<Command>((h) => ({
          id: h.id,
          label: h.label,
          description: CONTEXT[h.kind](h),
          icon: <Icon name={ICON[h.kind]} size={16} />,
          onSelect: () => navigate(h.href),
        })),
      })),
    [query, scope, navigate],
  );

  const pickScope = (v: Scope) => {
    setScope(v);
    // Keep typing where you were: the toggle took focus, give it back to the search box.
    requestAnimationFrame(() => document.querySelector<HTMLInputElement>('.sw-search-palette .sp-command__input input')?.focus());
  };

  return (
    <CommandPalette
      aria-label="Search the docs"
      placeholder="Search components, props, CSS variables, guides…"
      className="sw-search-palette"
      items={items}
      filter={false}
      open={open}
      onOpenChange={onOpenChange}
      onSearchChange={setQuery}
      emptyState={<>Nothing matches “{query}”{scope !== 'all' ? <> in {SCOPES.find((s) => s.value === scope)?.label}</> : null}.</>}
      toolbar={
        <ToggleGroup aria-label="Search in" size="small" value={scope} onChange={(v) => v && pickScope(v as Scope)}>
          {SCOPES.map((s) => (
            <ToggleGroupItem key={s.value} value={s.value}>
              {s.label}
            </ToggleGroupItem>
          ))}
        </ToggleGroup>
      }
      preview={(cmd) => {
        const hit = cmd && byId.get(cmd.id);
        return hit ? <Preview hit={hit} go={go} /> : <p className="sw-muted sw-search-preview__empty">Move through the results to preview them here.</p>;
      }}
    />
  );
}

const demoCache = new Map<string, Promise<Demo[]>>();
const demosFor = (entry: string) => {
  if (!demoCache.has(entry)) demoCache.set(entry, loadDemos(entry).catch(() => []));
  return demoCache.get(entry)!;
};

function FirstDemo({ entry }: { entry: string }) {
  const [demo, setDemo] = useState<Demo | null | undefined>(undefined);
  useEffect(() => {
    let live = true;
    setDemo(undefined);
    demosFor(entry).then((d) => live && setDemo(d[0] ?? null));
    return () => {
      live = false;
    };
  }, [entry]);
  if (demo === null) return null;
  return (
    <div className="sw-search-preview__stage" aria-label="Live example">
      {demo ? <demo.Component /> : <span className="sw-muted">Loading example…</span>}
    </div>
  );
}

function CopyButton({ text, label }: { text: string; label: string }) {
  const [done, setDone] = useState(false);
  return (
    <Button
      size="small"
      variant="outlined"
      onClick={() => {
        navigator.clipboard?.writeText(text).then(() => {
          setDone(true);
          setTimeout(() => setDone(false), 1500);
        });
      }}
    >
      {done ? 'Copied' : label}
    </Button>
  );
}

function Preview({ hit, go }: { hit: Hit; go: (href: string) => void }) {
  const entry = hit.entry ? entryByName.get(hit.entry) : undefined;
  const open = (
    <Button size="small" onClick={() => go(hit.href)}>
      {hit.kind === 'guide' ? 'Read the guide' : hit.kind === 'component' ? 'Open the page' : 'Open in the API reference'}
    </Button>
  );

  return (
    <div className="sw-search-preview">
      <div className="sw-search-preview__head">
        <span className="sw-search-preview__kind">{CONTEXT[hit.kind](hit)}</span>
        <h2 className={hit.kind === 'component' || hit.kind === 'guide' ? undefined : 'sw-search-preview__code'}>{hit.label}</h2>
      </div>

      {hit.kind === 'component' && entry && (
        <>
          <p>{hit.description}</p>
          <FirstDemo entry={entry.name} />
          <div className="sw-search-preview__actions">
            {open}
            <CopyButton text={entry.install.copy} label="Copy add command" />
            <CopyButton text={entry.import} label="Copy import" />
          </div>
        </>
      )}

      {(hit.kind === 'prop' || hit.kind === 'event') && (
        <>
          <dl className="sw-search-preview__facts">
            <dt>{hit.kind === 'event' ? 'Signature' : 'Type'}</dt>
            <dd><code>{hit.type}</code></dd>
            {hit.default && (
              <>
                <dt>Default</dt>
                <dd><code>{hit.default}</code></dd>
              </>
            )}
          </dl>
          {hit.description && <p dangerouslySetInnerHTML={{ __html: inline(hit.description) }} />}
          <div className="sw-search-preview__actions">
            {open}
            {entry && (
              <Button size="small" variant="outlined" onClick={() => go(`/components/${entry.name}#playground`)}>
                Try it in the playground
              </Button>
            )}
          </div>
        </>
      )}

      {hit.kind === 'variable' && (
        <>
          <dl className="sw-search-preview__facts">
            {hit.default && (
              <>
                <dt>Default</dt>
                <dd><code>{hit.default}</code></dd>
              </>
            )}
            <dt>Set it on</dt>
            <dd><code>{hit.targets?.join(' ')}</code></dd>
          </dl>
          <pre className="sw-search-preview__snippet"><code>{`${hit.targets?.[0] ?? ':root'} {\n  ${hit.label}: …;\n}`}</code></pre>
          <div className="sw-search-preview__actions">
            {open}
            <CopyButton text={`${hit.label}: `} label="Copy variable" />
          </div>
        </>
      )}

      {hit.kind === 'guide' && (
        <>
          {hit.description && <p>{hit.description}</p>}
          {hit.sections && hit.sections.length > 0 && (
            <ul className="sw-search-preview__sections">
              {hit.sections.slice(0, 6).map((s) => (
                <li key={s}>{s}</li>
              ))}
            </ul>
          )}
          <div className="sw-search-preview__actions">{open}</div>
        </>
      )}
    </div>
  );
}

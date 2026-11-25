/**
 * The site search index: components, their props, events and CSS variables, and the
 * guides. Built once from the generated docs data, so it never drifts from the source.
 */
import { entries, guides } from './catalog';
import { apiOf, defaultFor } from './api';
import { eventAnchor, propAnchor, varAnchor } from './anchors';

export type Kind = 'component' | 'prop' | 'event' | 'variable' | 'guide';

export interface Hit {
  id: string;
  kind: Kind;
  /** What the result is called: a component title, a prop name, a guide title. */
  label: string;
  /** Short line under the label. */
  context: string;
  href: string;
  /** Registry entry the result belongs to (components, props, events, variables). */
  entry?: string;
  component?: string;
  /** Longer text for the preview pane and for matching. */
  description: string;
  type?: string;
  default?: string;
  targets?: string[];
  sections?: string[];
  /** Extra words that should find this result. */
  keywords: string[];
}


const typeOf = (values: string[] | undefined, type: string) => (values?.length ? values.map((v) => (/^(true|false|\d+)$/.test(v) ? v : `'${v}'`)).join(' | ') : type);
const firstSentence = (s: string) => s.replace(/\s+/g, ' ').split(/(?<=\.)\s/)[0] ?? s;

function build(): Hit[] {
  const hits: Hit[] = [];
  for (const e of entries) {
    hits.push({
      id: `c:${e.name}`,
      kind: 'component',
      label: e.title,
      context: e.category,
      href: `/components/${e.name}`,
      entry: e.name,
      description: e.summary,
      keywords: e.components.map((c) => c.name),
    });
    for (const c of e.components) {
      const api = apiOf(c.name);
      const eventNames = new Set((api?.events ?? []).map((x) => x.name));
      for (const p of c.props) {
        if (eventNames.has(p.name)) continue;
        hits.push({
          id: `p:${c.name}.${p.name}`,
          kind: 'prop',
          label: p.name,
          context: c.name,
          href: `/components/${e.name}#${propAnchor(c.name, p.name)}`,
          entry: e.name,
          component: c.name,
          description: p.description,
          type: typeOf(p.values, p.type),
          default: defaultFor(c.name, p),
          keywords: [],
        });
      }
      for (const ev of api?.events ?? []) {
        hits.push({
          id: `e:${c.name}.${ev.name}`,
          kind: 'event',
          label: ev.name,
          context: c.name,
          href: `/components/${e.name}#${eventAnchor(c.name, ev.name)}`,
          entry: e.name,
          component: c.name,
          description: ev.description,
          type: ev.signature,
          keywords: [],
        });
      }
      for (const v of api?.styles?.variables ?? []) {
        hits.push({
          id: `v:${c.name}.${v.name}`,
          kind: 'variable',
          label: v.name,
          context: c.name,
          href: `/components/${e.name}#${varAnchor(c.name, v.name)}`,
          entry: e.name,
          component: c.name,
          description: '',
          default: v.value,
          targets: v.on.map((x) => `.${x}`),
          keywords: [],
        });
      }
    }
  }
  for (const g of guides) {
    const sections = [...g.markdown.matchAll(/^#{2,3} (.+)$/gm)].map((m) => m[1].replace(/[`*]/g, '').trim());
    const intro = g.markdown.split(/\n\s*\n/).find((para) => para.trim() && !/^[#|`>-]/.test(para.trim())) ?? '';
    hits.push({ id: `g:${g.slug}`, kind: 'guide', label: g.title, context: g.group, href: `/docs/${g.slug}`, description: intro.replace(/\[([^\]]+)\]\([^)]*\)/g, '$1').replace(/[`*_]/g, '').trim(), sections, keywords: sections });
  }
  return hits;
}

export const index: Hit[] = build();

const fold = (s: string) => s.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase();

/** Higher is better; 0 means no match. Names count far more than descriptions. */
function score(h: Hit, q: string): number {
  const label = fold(h.label);
  if (label === q) return 100;
  if (label.startsWith(q)) return 80 - Math.min(20, label.length - q.length);
  if (h.label.split(/[\s\-_/.]+|(?=[A-Z])/).some((w) => fold(w).startsWith(q))) return 60;
  if (label.includes(q)) return 50;
  if (h.keywords.some((k) => fold(k).includes(q))) return 40;
  // Descriptions only for pages; for props they mostly add noise ("swit" finding every prop that mentions a switch).
  if (q.length >= 4 && (h.kind === 'component' || h.kind === 'guide') && new RegExp(`\\b${q.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}`).test(fold(h.description))) return 20;
  return 0;
}

export const SCOPES: { value: 'all' | Kind; label: string }[] = [
  { value: 'all', label: 'All' },
  { value: 'component', label: 'Components' },
  { value: 'prop', label: 'Props' },
  { value: 'event', label: 'Events' },
  { value: 'variable', label: 'CSS variables' },
  { value: 'guide', label: 'Guides' },
];

const HEADINGS: Record<Kind, string> = { component: 'Components', prop: 'Props', event: 'Events', variable: 'CSS variables', guide: 'Guides' };
const LIMIT: Record<Kind, number> = { component: 8, prop: 12, event: 6, variable: 6, guide: 6 };
const ORDER: Kind[] = ['component', 'prop', 'event', 'variable', 'guide'];

/** Grouped results for a query and scope. An empty query lists guides and components only. */
export function search(query: string, scope: 'all' | Kind): { kind: Kind; heading: string; hits: Hit[] }[] {
  const q = fold(query.trim());
  const kinds = scope === 'all' ? (q ? ORDER : (['guide', 'component'] as Kind[])) : [scope];
  return kinds
    .map((kind) => {
      const pool = index.filter((h) => h.kind === kind);
      const ranked = q
        ? pool
            .map((h) => ({ h, s: score(h, q) }))
            .filter((x) => x.s > 0)
            .sort((a, b) => b.s - a.s || a.h.label.localeCompare(b.h.label))
            .map((x) => x.h)
        : pool;
      const limit = scope === 'all' ? LIMIT[kind] : 50;
      return { kind, heading: HEADINGS[kind], hits: ranked.slice(0, limit) };
    })
    .filter((g) => g.hits.length);
}

export const summaryOf = (h: Hit) => firstSentence(h.description || h.context);

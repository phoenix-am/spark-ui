/** The API reference extracted from source (registry/api.json), joined with docs.json's props. */
import api from '../../../registry/api.json';
import type { ComponentDoc, PropDoc } from './catalog';

export interface StyleClass { class: string; states: string[]; description: string }
export interface StyleAttr { name: string; values: string[]; on: string[]; description: string }
export interface StyleVar { name: string; value: string; on: string[] }
export interface ComponentApi {
  defaults: Record<string, string>;
  events: { name: string; signature: string; description: string }[];
  slots: string[];
  blocks: string[];
  styles: { classes: StyleClass[]; attributes: StyleAttr[]; variables: StyleVar[]; tokens: string[] } | null;
}
export interface TypeDoc {
  name: string;
  kind: 'interface' | 'type';
  description: string;
  fields?: { name: string; type: string; required: boolean; description: string }[];
  type?: string;
}
interface EntryApi {
  types: TypeDoc[];
  methods: { handle: string; name: string; signature: string; description: string }[];
  components: Record<string, ComponentApi>;
}
const data = api as unknown as Record<string, EntryApi>;

/** Registry entry that holds a component (split pages share one). */
const entryOf = (component: string) => Object.entries(data).find(([, e]) => component in e.components);

export const apiOf = (component: string): ComponentApi | undefined => entryOf(component)?.[1].components[component];

/** Types that matter for these components: the ones their props mention, plus anything those types mention. */
export function typesFor(components: ComponentDoc[]): TypeDoc[] {
  const entries = [...new Set(components.map((c) => entryOf(c.name)?.[1]).filter(Boolean))] as EntryApi[];
  const all = entries.flatMap((e) => e.types);
  const text = components.flatMap((c) => c.props.map((p) => p.type)).join(' ');
  const picked = new Map<string, TypeDoc>();
  const visit = (t: TypeDoc) => {
    if (picked.has(t.name)) return;
    picked.set(t.name, t);
    const inner = [t.type ?? '', ...(t.fields ?? []).map((f) => f.type)].join(' ');
    for (const u of all) if (new RegExp(`\\b${u.name}\\b`).test(inner)) visit(u);
  };
  for (const t of all) if (new RegExp(`\\b${t.name}\\b`).test(text)) visit(t);
  return [...picked.values()].filter((t) => !/^(ButtonVariant|ButtonSize|ButtonColor)$/.test(t.name) || components.some((c) => c.name === 'Button'));
}

export const methodsFor = (components: ComponentDoc[]) =>
  [...new Set(components.map((c) => entryOf(c.name)?.[1]).filter(Boolean))].flatMap((e) => (e as EntryApi).methods);

/** The default a prop really has: from the implementation, then docgen, then its description; unset booleans act as false. */
export function defaultFor(component: string, p: PropDoc): string | undefined {
  const fromCode = apiOf(component)?.defaults[p.name];
  const fromDesc = p.description.match(/Default(?:s to)? `([^`]+)`/)?.[1];
  const value = fromCode ?? p.default ?? fromDesc;
  if (value !== undefined) return value.replace(/^'(.*)'$/, "'$1'");
  if (p.type === 'boolean') return 'false';
  return undefined;
}

/** "(value: string, event: X) => void" → "value: string, event: X" */
export const payloadOf = (signature: string) => {
  const m = signature.match(/^\((.*)\)\s*=>/s);
  return m ? m[1].trim() || '—' : '—';
};

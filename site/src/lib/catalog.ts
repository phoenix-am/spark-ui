/**
 * Everything the site lists: component entries (from registry/docs.json, which
 * the build extracts from the source), their example files, and guide pages.
 */
import docs from '../../../registry/docs.json';
import pages from './pages.json';

export interface PropDoc {
  name: string;
  type: string;
  required: boolean;
  default?: string;
  description: string;
  values?: string[];
}
export interface ComponentDoc {
  name: string;
  description: string;
  props: PropDoc[];
}
export interface Entry {
  name: string;
  title: string;
  summary: string;
  import: string;
  install: { package: string; copy: string; shadcn: string; copiedImport: string };
  components: ComponentDoc[];
  category: string;
}

export const CATEGORY_ORDER = ['Inputs', 'Data display', 'Navigation', 'Overlays', 'Feedback', 'Effects', 'Foundations'];

/**
 * Some registry items hold several independent components (they share a file
 * and install together). Each gets its own page; parts that only make sense
 * together (Tabs + Tab, Card + CardHeader) stay on one.
 */
export const SPLIT: Record<string, { name: string; parts: string[] }[]> = pages.split;
/** Old page names that now redirect to their first split page. */
export const REDIRECT: Record<string, string> = Object.fromEntries(
  Object.entries(SPLIT)
    .filter(([from, pages]) => !pages.some((p) => p.name === from))
    .map(([from, pages]) => [from, pages[0].name]),
);

export const entries: Entry[] = (docs.components as any[]).flatMap((e) => {
  const base = { ...e } as Entry;
  const pages = SPLIT[e.name];
  if (!pages) return [base];
  return pages.map(({ name, parts }) => {
    const components = base.components.filter((c) => parts.includes(c.name));
    const main = components[0];
    return {
      ...base,
      name,
      title: main.name,
      summary: main.description.split(/\n\s*\n/)[0],
      import: `import { ${components.map((c) => c.name).join(', ')} } from '@sparkwire/core';`,
      components,
    };
  });
});
entries.push({
  name: 'blocks',
  title: 'Blocks',
  summary: 'Whole screens built from Sparkwire: a dashboard, a sign-in page and a settings page. Copy one and make it yours.',
  import: "import { Dashboard } from '@/components/spark-ui/blocks/Dashboard';",
  install: { package: '', copy: 'npx sparkwire add dashboard sign-in settings', shadcn: 'npx shadcn add @sparkwire/dashboard', copiedImport: "import { Dashboard } from '@/components/spark-ui/blocks/Dashboard';" },
  components: [],
  category: 'Data display',
});
export const entryByName = new Map(entries.map((e) => [e.name, e]));

export const byCategory = CATEGORY_ORDER.map((c) => ({
  category: c,
  entries: entries.filter((e) => e.category === c).sort((a, b) => a.title.localeCompare(b.title)),
})).filter((g) => g.entries.length);

/* ------------------------------------------------------------------ guides */

import guideMd from '../../../docs/guide.md?raw';
import accessibilityMd from '../../../docs/accessibility.md?raw';
import translationsMd from '../../../docs/translations.md?raw';

export interface Guide {
  slug: string;
  title: string;
  markdown: string;
  group: string;
  /** Live examples shown under the text. */
  examples?: string;
}

const section = (heading: string) => {
  const re = new RegExp(`^### ${heading.replace(/[.*+?^${}()|[\]\\`]/g, '\\$&')}\\s*$`, 'm');
  const at = guideMd.search(re);
  if (at < 0) return '';
  const rest = guideMd.slice(at).replace(re, '');
  const end = rest.search(/^#{2,3} /m);
  return (end < 0 ? rest : rest.slice(0, end)).trim();
};

const FILES: Record<string, string> = { accessibility: accessibilityMd, translations: translationsMd };
export const guides: Guide[] = (pages.guides as { slug: string; title: string; group: string; sections?: string[]; file?: string; examples?: string }[]).map((g) => ({
  slug: g.slug,
  title: g.title,
  group: g.group,
  examples: g.examples,
  markdown: g.file ? FILES[g.file].replace(/^# .*\n/, '') : (g.sections ?? []).map(section).join('\n\n'),
}));
export const guideBySlug = new Map(guides.map((g) => [g.slug, g]));

/** Guide notes for a component page, from the "Components" part of the guide. */
const NOTES: Record<string, string[]> = {
  dropdown: ['Dropdown, Combobox and Menu'],
  combobox: ['Dropdown, Combobox and Menu'],
  menu: ['Dropdown, Combobox and Menu'],
  'date-picker': ['Dates: presets, rules and ranges'],
  'date-range-picker': ['Dates: presets, rules and ranges'],
  calendar: ['Dates: presets, rules and ranges'],
  'time-picker': ['TimePicker'],
  'number-field': ['NumberField'],
  textarea: ['Textarea, Alert, Breadcrumbs, Pagination'],
  alert: ['Textarea, Alert, Breadcrumbs, Pagination'],
  breadcrumbs: ['Textarea, Alert, Breadcrumbs, Pagination'],
  pagination: ['Textarea, Alert, Breadcrumbs, Pagination'],
  'toggle-group': ['ToggleGroup, Stepper, FileUpload'],
  stepper: ['ToggleGroup, Stepper, FileUpload'],
  'file-upload': ['ToggleGroup, Stepper, FileUpload'],
  'data-table': ['DataTable'],
  'line-chart': ['Charts'],
  'bar-chart': ['Charts'],
  'donut-chart': ['Charts'],
  sparkline: ['Charts'],
  sidebar: ['Sidebar'],
  drawer: ['Drawer'],
  'command-palette': ['CommandPalette'],
  blocks: ['Blocks'],
  base: ['Base components'],
};
export const notesFor = (name: string) => (NOTES[name] ?? []).map(section).filter(Boolean).join('\n\n');

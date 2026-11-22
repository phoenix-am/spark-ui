/**
 * Everything the site lists: component entries (from registry/docs.json, which
 * the build extracts from the source), their example files, and guide pages.
 */
import docs from '../../../registry/docs.json';

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
export const SPLIT: Record<string, { name: string; parts: string[] }[]> = {
  navigation: [
    { name: 'breadcrumbs', parts: ['Breadcrumbs'] },
    { name: 'pagination', parts: ['Pagination'] },
  ],
  indicators: [
    { name: 'badge', parts: ['Badge'] },
    { name: 'progress', parts: ['Progress'] },
    { name: 'spinner', parts: ['Spinner'] },
  ],
  card: [
    { name: 'card', parts: ['Card', 'CardHeader', 'CardFooter'] },
    { name: 'skeleton', parts: ['Skeleton'] },
  ],
  charts: [
    { name: 'line-chart', parts: ['LineChart'] },
    { name: 'bar-chart', parts: ['BarChart'] },
    { name: 'donut-chart', parts: ['DonutChart'] },
    { name: 'sparkline', parts: ['Sparkline'] },
  ],
  'date-picker': [
    { name: 'date-picker', parts: ['DatePicker'] },
    { name: 'date-range-picker', parts: ['DateRangePicker'] },
    { name: 'calendar', parts: ['Calendar', 'RangeCalendar'] },
  ],
};
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

export const guides: Guide[] = [
  { slug: 'getting-started', title: 'Getting started', group: 'Start here', markdown: [section('Install'), section('Live Wire theme')].join('\n\n') },
  { slug: 'theming', title: 'Theming', group: 'Start here', markdown: section('Theming'), examples: 'theming' },
  { slug: 'energy', title: 'Energy dial', group: 'Start here', markdown: section('Energy dial, `useSpark()` and haptics'), examples: 'energy' },
  { slug: 'languages', title: 'Languages', group: 'Start here', markdown: [section('Languages'), section('Languages, dates and right-to-left')].join('\n\n'), examples: 'languages' },
  { slug: 'defaults', title: 'App-wide defaults', group: 'Customise', markdown: section('App-wide defaults and slots'), examples: 'provider' },
  { slug: 'composition', title: 'Render prop and variants', group: 'Customise', markdown: section('`render` prop and theme variants'), examples: 'composition' },
  { slug: 'tailwind', title: 'Tailwind', group: 'Customise', markdown: section('Tailwind') },
  { slug: 'forms', title: 'Forms', group: 'Customise', markdown: section('Forms'), examples: 'forms' },
  { slug: 'cli', title: 'Own the source', group: 'Ways to use it', markdown: section('Own the source: `npx sparkwire add`') },
  { slug: 'headless', title: 'Headless hooks', group: 'Ways to use it', markdown: section('Headless hooks'), examples: 'headless' },
  { slug: 'ai', title: 'AI coding agents', group: 'Ways to use it', markdown: section('For AI coding agents') },
  { slug: 'packages', title: 'Packages', group: 'Ways to use it', markdown: section('Packages') },
  { slug: 'accessibility', title: 'Accessibility', group: 'Quality', markdown: accessibilityMd.replace(/^# .*\n/, '') },
  { slug: 'translations', title: 'Translations', group: 'Quality', markdown: translationsMd.replace(/^# .*\n/, '') },
];
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

#!/usr/bin/env node
/**
 * Extracts component docs (descriptions, props, imports, install commands)
 * from packages/core/src with react-docgen-typescript.
 *
 * Output (next to the registry, so one host serves everything):
 *   registry/docs.json       machine-readable docs (used by @sparkwire/mcp)
 *   registry/llms.txt        short index for AI agents (llmstxt.org format)
 *   registry/llms-full.txt   every component with its props, in one file
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { createRequire } from 'node:module';

const require = createRequire(import.meta.url);
const docgen = require('react-docgen-typescript');

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const src = path.join(root, 'packages/core/src');
const out = path.join(root, 'registry');
const SITE = process.env.SPARKWIRE_SITE ?? 'https://phoenix-am.github.io/spark-ui';
const VERSION = JSON.parse(fs.readFileSync(path.join(root, 'packages/core/package.json'), 'utf8')).version;

/** Registry item → files holding its public components, and its Storybook path. */
const ENTRIES = [
  ['button', ['__docgen__/shims.tsx'], 'actions-button', ['Button']],
  ['spark', ['Spark/Spark.tsx'], 'effects-spark'],
  ['switch', ['Switch/Switch.tsx'], 'inputs-switch'],
  ['checkbox', ['Checkbox/Checkbox.tsx'], 'inputs-checkbox'],
  ['radio-group', ['RadioGroup/RadioGroup.tsx'], 'inputs-radiogroup'],
  ['slider', ['Slider/Slider.tsx'], 'inputs-slider'],
  ['textfield', ['Textfield/Textfield.tsx'], 'inputs-textfield'],
  ['field', ['Field/Field.tsx'], 'inputs-field'],
  ['dropdown', ['Dropdown/Dropdown.tsx'], 'inputs-dropdown'],
  ['combobox', ['Combobox/Combobox.tsx'], 'inputs-combobox'],
  ['date-picker', ['DatePicker/DatePicker.tsx', 'DatePicker/Calendar.tsx'], 'inputs-datepicker'],
  ['data-table', ['DataTable/DataTable.tsx'], 'data-display-datatable'],
  ['menu', ['Menu/Menu.tsx'], 'navigation-menu'],
  ['tabs', ['Tabs/Tabs.tsx'], 'navigation-tabs'],
  ['accordion', ['Accordion/Accordion.tsx'], 'navigation-accordion'],
  ['modal', ['Modal/Modal.tsx'], 'overlays-modal'],
  ['tooltip', ['Tooltip/Tooltip.tsx'], 'overlays-tooltip'],
  ['toast', ['Toast/Toast.tsx', '__docgen__/shims.tsx'], 'feedback-toast', ['ToastProvider', 'ToastShowOptions']],
  ['card', ['Card/Card.tsx'], 'data-display-card'],
  ['avatar', ['Avatar/Avatar.tsx'], 'data-display-avatar'],
  ['indicators', ['Indicators/Indicators.tsx'], 'feedback-badge'],
  ['provider', ['Provider/SparkProvider.tsx'], 'foundations-customization'],
  ['base', ['base/ButtonBase.tsx', 'base/InputBase.tsx', 'base/Popover.tsx', 'base/ListBox.tsx', 'base/Overlay.tsx'], 'foundations-base-components'],
];

const parser = docgen.withCustomConfig(path.join(root, 'tsconfig.json'), {
  savePropValueAsString: true,
  shouldExtractLiteralValuesFromEnum: true,
  shouldRemoveUndefinedFromOptional: true,
  // Keep our own props; drop the hundreds inherited from React's HTML types.
  propFilter: (prop) => !prop.parent || !prop.parent.fileName.includes('node_modules') || prop.name.startsWith('aria-label'),
});

const clean = (s = '') => s.replace(/\r/g, '').trim();
const INTERNAL = new Set(['CalendarSystem', 'CalendarCore', 'FirstDayOfWeek']);

/*
 * Shims for APIs docgen can't read directly: Button's polymorphic forwardRef
 * cast, and the options object passed to toast.show(). Written next to the
 * source so types resolve, removed after parsing.
 */
const shimDir = path.join(src, '__docgen__');
fs.mkdirSync(shimDir, { recursive: true });
const buttonDoc = fs.readFileSync(path.join(src, 'Button/Button.tsx'), 'utf8').match(/\/\*\*[\s\S]*?\*\/\nconst ButtonInner/)?.[0].replace(/\nconst ButtonInner$/, '') ?? '';
fs.writeFileSync(
  path.join(shimDir, 'shims.tsx'),
  `import type { ElementType } from 'react';
import type { ButtonPropsBase } from '../Button/Button.types';
import type { ToastOptions } from '../Toast/Toast';
${buttonDoc}
export function Button(props: ButtonPropsBase & {
  /** Render as another element or component, e.g. \`"a"\` or a router Link. */
  as?: ElementType;
}) { return null; }
/**
 * Options for \`toast.show()\`. Wrap your app in \`<ToastProvider>\`, then
 * \`const toast = useToast(); toast.show({ title: 'Saved', tone: 'success' })\`.
 */
export function ToastShowOptions(props: ToastOptions) { return null; }
`,
);
process.on('exit', () => fs.rmSync(shimDir, { recursive: true, force: true }));
const registry = JSON.parse(fs.readFileSync(path.join(out, 'registry.json'), 'utf8'));
const itemByName = new Map(registry.items.map((i) => [i.name, i]));

const docs = [];
for (const [name, files, story, only] of ENTRIES) {
  const existing = files.map((f) => path.join(src, f)).filter((f) => fs.existsSync(f));
  const parsed = parser.parse(existing).filter((c) => /^[A-Z]/.test(c.displayName) && !INTERNAL.has(c.displayName) && (!only || only.includes(c.displayName)));
  const seen = new Set();
  const components = parsed
    .filter((c) => !seen.has(c.displayName) && seen.add(c.displayName))
    .map((c) => ({
      name: c.displayName,
      description: clean(c.description),
      props: Object.values(c.props)
        .map((p) => ({
          name: p.name,
          type: clean(p.type?.raw ?? p.type?.name),
          required: p.required,
          default: p.defaultValue?.value ?? undefined,
          description: clean(p.description),
          deprecated: /@deprecated/.test(p.description) || 'deprecated' in (p.tags ?? {}) || undefined,
        }))
        .sort((a, b) => Number(b.required) - Number(a.required) || Number(!!a.deprecated) - Number(!!b.deprecated) || a.name.localeCompare(b.name)),
    }))
    // Internal pieces (e.g. a Tab rendered by TabList) still document the API; keep them.
    .filter((c) => c.description || c.props.length || only);
  const item = itemByName.get(name);
  const exported = components.map((c) => c.name).filter((n) => n !== 'ToastShowOptions').concat(name === 'toast' ? ['useToast'] : []);
  const folder = { button: 'Button', toast: 'Toast' }[name] ?? files[0].split('/')[0];
  docs.push({
    name,
    title: item?.title ?? name,
    summary: item?.description ?? '',
    components,
    import: name === 'base' ? `import { ${exported.join(', ')} } from '@sparkwire/core/base';` : `import { ${exported.join(', ')} } from '@sparkwire/core';`,
    install: {
      package: 'npm install @sparkwire/core   # then: import "@sparkwire/core/styles.css" once',
      copy: `npx sparkwire add ${name}`,
      shadcn: `npx shadcn add @sparkwire/${name}`,
      copiedImport: `import { ${exported.join(', ')} } from '@/components/spark-ui/${folder}';`,
    },
    storybook: `${SITE}/?path=/docs/${story}--docs`,
  });
}

fs.writeFileSync(path.join(out, 'docs.json'), JSON.stringify({ version: VERSION, site: SITE, components: docs }, null, 2) + '\n');

/* ------------------------------------------------------------- llms.txt */

const intro = `# Spark UI (@sparkwire)

> React component library with a "Live Wire" look: components carry current (sparks on press, flowing current on hover, a lever switch with a bulb). Accessible behaviour from React Aria, zero-runtime CSS with --spark-* variables, light/dark/system modes, works in React Server Components. Use it as an npm package (@sparkwire/core) or copy the source (npx sparkwire add <name>).

Key facts for writing code:
- Import the stylesheet once: import '@sparkwire/core/styles.css'. Set the mode with data-spark-theme="dark" | "light" | "system" on <html> or any wrapper.
- App-wide defaults and slot classes: <SparkProvider components={{ Button: { defaultProps: { variant: 'outlined' } } }} locale="hi-IN">.
- Every component takes className, and most take classNames for inner parts. State is exposed as data-* attributes (data-state, data-open, data-invalid, data-disabled) for CSS or Tailwind.
- Forms: inputs take name and work with FormData and React Hook Form. Dropdown/Combobox/Slider/DatePicker submit through hidden inputs.
- Dates are plain JS Date objects; DatePicker submits ISO YYYY-MM-DD. Locales and calendar systems (indian, islamic-umalqura, buddhist...) are supported.
- Pick a value: Dropdown (alias Select). Search then pick: Combobox. Run actions: Menu.
- Custom markup with Spark behaviour: useSwitch, useCheckbox, useSlider, useDatePicker, useSpark from '@sparkwire/core/headless'. Building blocks: ButtonBase, InputBase, Popover, ListBox, Overlay from '@sparkwire/core/base'.
- The npm scope is @sparkwire (not @spark-ui, which is a different library).
`;

const index = [
  intro,
  '## Components',
  ...docs.map((d) => `- [${d.title}](${d.storybook}): ${d.summary} Exports: ${d.components.map((c) => c.name).join(', ')}.`),
  '',
  '## Docs',
  `- [Full reference with every prop](${SITE}/llms-full.txt)`,
  `- [Machine-readable docs](${SITE}/registry/docs.json)`,
  `- [Component registry (shadcn format)](${SITE}/registry/registry.json)`,
  '- MCP server: npx -y @sparkwire/mcp',
  '',
].join('\n');

const propLine = (p) =>
  `- \`${p.name}${p.required ? '' : '?'}\`: \`${p.type}\`${p.default !== undefined ? ` (default \`${p.default}\`)` : ''}${p.deprecated ? ' **Deprecated.**' : ''}${p.description ? ` ${p.description.replace(/@deprecated\s*/, '').replace(/\n+/g, ' ')}` : ''}`;

const full = [
  intro,
  ...docs.flatMap((d) => [
    `## ${d.title} (\`${d.name}\`)`,
    d.summary,
    '',
    '```tsx',
    d.import,
    '```',
    `Install: \`${d.install.copy}\` (copy source) or use the npm package. Examples: ${d.storybook}`,
    '',
    ...d.components.flatMap((c) => [`### ${c.name}`, c.description, '', ...(c.props.length ? c.props.map(propLine) : ['No props.']), '']),
  ]),
].join('\n');

fs.writeFileSync(path.join(out, 'llms.txt'), index);
fs.writeFileSync(path.join(out, 'llms-full.txt'), full);
const propCount = docs.reduce((n, d) => n + d.components.reduce((m, c) => m + c.props.length, 0), 0);
console.log(`docs: ${docs.length} entries, ${docs.reduce((n, d) => n + d.components.length, 0)} components, ${propCount} props`);

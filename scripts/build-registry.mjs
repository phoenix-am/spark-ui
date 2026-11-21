#!/usr/bin/env node
/**
 * Builds the Spark UI component registry from packages/core/src.
 *
 * Output (committed, served from GitHub raw or any static host):
 *   registry/registry.json   index of all items (shadcn registry format)
 *   registry/r/<name>.json   one item per component, with file contents inlined
 *
 * Both `npx shadcn add @spark-ui/<name>` and `npx spark-ui add <name>` read
 * these files. Dependencies are found by scanning imports: relative imports
 * into another folder become registry dependencies, bare imports become npm
 * dependencies. Files are placed under components/spark-ui/, mirroring src/,
 * so relative imports keep working after copying.
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const src = path.join(root, 'packages/core/src');
const out = path.join(root, 'registry');
const core = JSON.parse(fs.readFileSync(path.join(root, 'packages/core/package.json'), 'utf8'));
const TARGET = 'components/spark-ui';
const HOMEPAGE = 'https://github.com/phoenix-am/spark-ui';

/** Folder in src → registry item. */
const ITEMS = {
  internal: { name: 'utils', title: 'Spark UI utilities', description: 'Shared helpers: class names, defaults and slots, tones, portal theming.' },
  styles: { name: 'styles', title: 'Spark UI styles', description: 'Tokens and styles for every component (dark, light and system modes). Import once.' },
  base: { name: 'base', title: 'Base components', description: 'ButtonBase, InputBase, Popover, ListBox and Overlay: the building blocks under the other components.' },
  Spark: { description: 'A burst of sparks from a point; used by Button and Calendar.' },
  Button: { description: 'Throws sparks from the press point; current runs along outlined buttons on hover.' },
  Switch: { description: 'A lever switch that lights a bulb.' },
  Checkbox: { description: 'A checkbox that closes a circuit.' },
  RadioGroup: { description: 'One live wire at a time.' },
  Slider: { description: 'A dimmer, with two-knob ranges.' },
  Textfield: { description: 'A field that charges as you type.' },
  InputBase: { name: 'input-base', description: 'The field shell (re-exports the base InputBase).' },
  Field: { description: 'Label, help text and error wiring for any control.' },
  Dropdown: { description: 'Pick one value from a list.' },
  Select: { description: 'Alias of Dropdown.' },
  Combobox: { description: 'Type to search, then pick.' },
  Menu: { description: 'Actions behind a button, with submenus.' },
  DataTable: { name: 'data-table', description: 'Sort, search, filter, page and select rows; responsive div grid, no table library.' },
  CommandPalette: { name: 'command-palette', description: 'A ⌘K launcher: search commands and pages, run with the keyboard.' },
  Drawer: { description: 'A panel that slides in from an edge, with focus trapping.' },
  Sidebar: { description: 'App navigation: sections, nested groups, collapsed rail, drawer on small screens.' },
  Textarea: { description: 'Multi-line text that grows with its content, with a character count.' },
  Alert: { description: 'Info, success, warning and error messages, with actions, dismiss and a banner variant.' },
  Navigation: { name: 'navigation', description: 'Breadcrumbs and Pagination.' },
  Charts: { name: 'charts', description: 'Our own SVG charts: Line/Area, Bar (grouped, stacked, horizontal), Donut, Sparkline. Validated colour-blind-safe palette, tooltips, keyboard, data-table view.' },
  NumberField: { name: 'number-field', description: 'Locale-formatted numbers (₹1,00,000, %, units) with steppers.' },
  Tabs: { description: 'Tabs on one wire; the active tab is lit.' },
  Accordion: { description: 'Sections that power on as they open.' },
  Modal: { description: 'A dialog that powers on, with focus trapping.' },
  Tooltip: { description: 'A hint that flickers on.' },
  Toast: { description: 'Notifications.' },
  Card: { description: 'Card, CardHeader, CardFooter and Skeleton.' },
  Avatar: { description: 'Avatar and AvatarGroup.' },
  Indicators: { description: 'Badge, Progress and Spinner.' },
  DatePicker: { name: 'date-picker', description: 'DatePicker, DateRangePicker, Calendar and RangeCalendar: typed entry, presets, date rules, locales and calendar systems.' },
  headless: { name: 'headless', title: 'Headless hooks', description: 'useSwitch, useCheckbox, useSlider, useDatePicker and useSpark: behaviour without markup.' },
  Provider: { name: 'provider', title: 'SparkProvider', description: 'App-wide default props, slot classes and locale.' },
};

const kebab = (s) => s.replace(/([a-z])([A-Z])/g, '$1-$2').toLowerCase();
const itemName = (folder) => ITEMS[folder]?.name ?? kebab(folder);
const skip = (f) => /\.(stories|test)\.tsx?$|\.mdx$/.test(f);
const PEER = new Set(['react', 'react-dom']);

/** Vendored copies of the two @sparkwire/utils helpers the components use. */
const VENDORED_UTILS = `import type { ComponentPropsWithRef, ElementType } from 'react';

/** True when the user asked the OS to reduce motion. */
export function prefersReducedMotion(): boolean {
  if (typeof window === 'undefined' || !window.matchMedia) return false;
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

/** Props of a polymorphic component rendered as \`C\`. */
export type OverrideProps<
  M extends { props: object; defaultComponent: ElementType },
  C extends ElementType,
> = M['props'] & Omit<ComponentPropsWithRef<C>, keyof M['props']>;
`;

function listFiles(dir) {
  return fs.readdirSync(dir, { withFileTypes: true }).flatMap((d) => {
    const p = path.join(dir, d.name);
    return d.isDirectory() ? listFiles(p) : skip(d.name) ? [] : [p];
  });
}

function packageName(spec) {
  const parts = spec.split('/');
  return spec.startsWith('@') ? parts.slice(0, 2).join('/') : parts[0];
}

function versionOf(pkg) {
  const v = core.dependencies?.[pkg] ?? core.peerDependencies?.[pkg];
  return v && !v.startsWith('workspace') ? `${pkg}@${v}` : pkg;
}

function buildItem(folder) {
  const dir = path.join(src, folder);
  const meta = ITEMS[folder] ?? {};
  const deps = new Set();
  const regDeps = new Set();
  const files = [];

  if (folder === 'styles') {
    // Ship the built, flattened stylesheet: one file to import.
    const css = fs.readFileSync(path.join(root, 'packages/core/dist/styles.css'), 'utf8');
    files.push({ path: `${TARGET}/styles.css`, type: 'registry:file', target: `${TARGET}/styles.css`, content: css });
  } else {
    for (const file of listFiles(dir)) {
      let content = fs.readFileSync(file, 'utf8');
      const rel = path.relative(src, file).split(path.sep).join('/');
      for (const [, spec] of content.matchAll(/from\s+'([^']+)'/g)) {
        if (spec.startsWith('.')) {
          const targetFolder = path.relative(src, path.resolve(path.dirname(file), spec)).split(path.sep)[0];
          if (targetFolder && targetFolder !== folder) regDeps.add(itemName(targetFolder));
        } else if (spec === '@sparkwire/utils') {
          const depth = rel.split('/').length - 1;
          content = content.replaceAll("'@sparkwire/utils'", `'${'../'.repeat(depth)}internal/spark-utils'`);
          if (folder !== 'internal') regDeps.add('utils');
        } else if (!PEER.has(packageName(spec))) {
          deps.add(versionOf(packageName(spec)));
        }
      }
      files.push({ path: `${TARGET}/${rel}`, type: folder === 'internal' ? 'registry:lib' : 'registry:ui', target: `${TARGET}/${rel}`, content });
    }
    if (folder === 'internal') {
      files.push({ path: `${TARGET}/internal/spark-utils.ts`, type: 'registry:lib', target: `${TARGET}/internal/spark-utils.ts`, content: VENDORED_UTILS });
    }
    if (folder !== 'internal') regDeps.add('utils');
    regDeps.add('styles');
  }
  regDeps.delete(itemName(folder));

  return {
    $schema: 'https://ui.shadcn.com/schema/registry-item.json',
    name: itemName(folder),
    type: folder === 'internal' ? 'registry:lib' : 'registry:ui',
    title: meta.title ?? folder,
    description: meta.description ?? '',
    dependencies: [...deps].sort(),
    registryDependencies: [...regDeps].sort(),
    files,
  };
}

fs.rmSync(path.join(out, 'r'), { recursive: true, force: true });
fs.mkdirSync(path.join(out, 'r'), { recursive: true });

const items = Object.keys(ITEMS).map(buildItem);
// shadcn resolves bare registryDependencies against its own registry; namespace ours.
const forShadcn = (item) => ({ ...item, registryDependencies: item.registryDependencies.map((d) => `@sparkwire/${d}`) });

for (const item of items) {
  fs.writeFileSync(path.join(out, 'r', `${item.name}.json`), JSON.stringify(forShadcn(item), null, 2) + '\n');
}
// Index without file contents, for listing and for `spark-ui list`.
const index = {
  $schema: 'https://ui.shadcn.com/schema/registry.json',
  name: 'spark-ui',
  homepage: HOMEPAGE,
  items: items.map(({ $schema, files, ...rest }) => ({ ...forShadcn(rest), files: files.map(({ content, ...f }) => f) })),
};
fs.writeFileSync(path.join(out, 'registry.json'), JSON.stringify(index, null, 2) + '\n');

const missing = items.flatMap((i) => i.registryDependencies.filter((d) => !items.some((x) => x.name === d)).map((d) => `${i.name} → ${d}`));
if (missing.length) {
  console.error('Unknown registry dependencies:', missing.join(', '));
  process.exit(1);
}
console.log(`registry: ${items.length} items written to registry/r/`);

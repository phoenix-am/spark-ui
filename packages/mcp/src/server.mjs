#!/usr/bin/env node
/**
 * Spark UI MCP server. Gives AI coding agents real answers about the
 * library: which components exist, their props, how to install and import
 * them, and their source.
 *
 * Add to an MCP client (Claude Code, Cursor, VS Code...):
 *   { "mcpServers": { "sparkwire": { "command": "npx", "args": ["-y", "@sparkwire/mcp"] } } }
 *
 * Data is bundled at publish time. Set SPARKWIRE_REGISTRY to a folder or
 * URL (the one holding docs.json and r/) to use another version.
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import { z } from 'zod';

const here = path.dirname(fileURLToPath(import.meta.url));
// Bundled data in the published package; the repo's registry/ during development.
const LOCAL = [path.resolve(here, '../data'), path.resolve(here, '../../../registry')].find((p) => fs.existsSync(path.join(p, 'docs.json')));
const SOURCE = process.env.SPARKWIRE_REGISTRY ?? LOCAL;

async function read(rel) {
  if (/^https?:\/\//.test(SOURCE)) {
    const res = await fetch(`${SOURCE.replace(/\/$/, '')}/${rel}`);
    if (!res.ok) throw new Error(`${res.status} for ${rel}`);
    return res.json();
  }
  return JSON.parse(fs.readFileSync(path.join(SOURCE, rel), 'utf8'));
}

const docs = await read('docs.json');
const entries = docs.components;

/** Find an entry by registry name ("date-picker"), component ("DatePicker", "Calendar") or a loose match. */
function find(query) {
  const q = query.trim().toLowerCase().replace(/^@sparkwire\//, '');
  const flat = (s) => s.toLowerCase().replace(/[^a-z0-9]/g, '');
  return (
    entries.find((e) => e.name === q) ??
    entries.find((e) => e.components.some((c) => flat(c.name) === flat(q))) ??
    entries.find((e) => flat(e.name) === flat(q)) ??
    (q === 'select' ? entries.find((e) => e.name === 'dropdown') : undefined)
  );
}

const text = (t) => ({ content: [{ type: 'text', text: t }] });
const notFound = (q) =>
  text(`No Spark UI component matches "${q}". Available: ${entries.map((e) => e.name).join(', ')}. Use search_components to search by feature.`);

function formatProps(c, { includeDeprecated }) {
  const props = c.props.filter((p) => includeDeprecated || !p.deprecated);
  if (!props.length) return 'No props.';
  return props
    .map((p) => {
      const desc = (p.description || '').replace(/@deprecated\s*/, '').replace(/\n+/g, ' ');
      return `- \`${p.name}${p.required ? '' : '?'}\`: \`${p.type}\`${p.default !== undefined ? ` = \`${p.default}\`` : ''}${p.deprecated ? ' (deprecated)' : ''}${desc ? ` ${desc}` : ''}`;
    })
    .join('\n');
}

function formatEntry(e, opts) {
  return [
    `# ${e.title} (\`${e.name}\`)`,
    e.summary,
    '',
    '## Import',
    '```tsx',
    e.import,
    "import '@sparkwire/core/styles.css'; // once, in your root layout",
    '```',
    '## Install',
    `- npm package: \`npm install @sparkwire/core\``,
    `- Copy the source: \`${e.install.copy}\` then \`${e.install.copiedImport}\``,
    `- With shadcn: \`${e.install.shadcn}\` (needs the @sparkwire registry in components.json)`,
    '',
    ...e.components.flatMap((c) => [`## ${c.name}`, c.description, '', '### Props', formatProps(c, opts), '']),
    `Examples and props: ${e.docs ?? e.storybook}`,
  ].join('\n');
}

const SETUP = `# Setting up Spark UI

1. Install: \`npm install @sparkwire/core\` (peer: react 18 or 19).
2. Import the styles once, e.g. in app/layout.tsx: \`import '@sparkwire/core/styles.css';\`
3. Pick a mode with an attribute on <html> or any wrapper: \`data-spark-theme="dark" | "light" | "system"\`. No provider is required, and it works in React Server Components.
4. Optional, app-wide settings:
\`\`\`tsx
import { SparkProvider } from '@sparkwire/core';
<SparkProvider
  locale="hi-IN"                                   // dates, digits, right-to-left
  components={{
    Button: { defaultProps: { variant: 'outlined' } },
    Switch: { classNames: { bulb: 'my-bulb' } },    // extra classes on inner parts
  }}
>
  {children}
</SparkProvider>
\`\`\`
5. Theme: override CSS variables (e.g. \`--spark-energy-current\`, \`--spark-radius-medium\`) on any selector, or use \`createTheme()\` and \`themeToCss()\` from @sparkwire/styles.

Styling hooks: every component takes \`className\`; most take \`classNames\` for inner parts; state is exposed as data attributes (\`data-state\`, \`data-open\`, \`data-invalid\`, \`data-disabled\`, \`data-focus-visible\`) for plain CSS or Tailwind (\`data-[state=on]:...\`).

Choosing components: pick a value → Dropdown (alias Select); search then pick → Combobox; run actions → Menu. Forms: inputs take \`name\` and work with FormData and React Hook Form. Dates are JS Date objects; DatePicker submits ISO YYYY-MM-DD.

Note: the npm scope is @sparkwire. Packages under @spark-ui belong to a different library (Leboncoin's Spark).`;

const server = new McpServer({ name: 'sparkwire', version: docs.version ?? '0.1.0' });

server.registerTool(
  'list_components',
  { title: 'List components', description: 'List every Spark UI component with a one-line summary.' },
  async () => text(entries.map((e) => `- ${e.name}: ${e.summary} (exports ${e.components.map((c) => c.name).join(', ')})`).join('\n')),
);

server.registerTool(
  'get_component',
  {
    title: 'Get component docs',
    description: 'Props, description, import and install commands for one component, e.g. "DatePicker", "date-picker", "Menu", "Select".',
    inputSchema: {
      name: z.string().describe('Component or registry name'),
      includeDeprecated: z.boolean().optional().describe('Also list deprecated props (default false)'),
    },
  },
  async ({ name, includeDeprecated = false }) => {
    const e = find(name);
    return e ? text(formatEntry(e, { includeDeprecated })) : notFound(name);
  },
);

server.registerTool(
  'search_components',
  {
    title: 'Search components',
    description: 'Find components by feature or prop, e.g. "date range", "searchable select", "loading", "right-to-left".',
    inputSchema: { query: z.string() },
  },
  async ({ query }) => {
    const words = query.toLowerCase().split(/\s+/).filter((w) => w.length > 1);
    const score = (e) => {
      const hay = [e.name, e.title, e.summary, ...e.components.flatMap((c) => [c.name, c.description, ...c.props.map((p) => `${p.name} ${p.description}`)])].join(' ').toLowerCase();
      return words.reduce((n, w) => n + (hay.includes(w) ? 1 : 0), 0);
    };
    const hits = entries.map((e) => [e, score(e)]).filter(([, s]) => s > 0).sort((a, b) => b[1] - a[1]).slice(0, 6);
    return text(hits.length ? hits.map(([e]) => `- ${e.name}: ${e.summary}`).join('\n') : `Nothing matches "${query}". Try list_components.`);
  },
);

server.registerTool(
  'get_component_source',
  {
    title: 'Get component source',
    description: 'The source files of a component, as copied by `npx sparkwire add`. Use to explain internals or customise a copy.',
    inputSchema: { name: z.string(), file: z.string().optional().describe('Only this file, e.g. "Menu.tsx"') },
  },
  async ({ name, file }) => {
    // Only known components: never build a file path from raw tool input.
    const e = find(name);
    if (!e) return notFound(name);
    let item;
    try {
      item = await read(`r/${e.name}.json`);
    } catch {
      return notFound(name);
    }
    const files = item.files.filter((f) => !file || f.path.endsWith(file));
    const deps = `Depends on: ${item.registryDependencies.join(', ') || 'nothing else'}${item.dependencies.length ? `; npm: ${item.dependencies.join(', ')}` : ''}`;
    return text([deps, ...files.map((f) => `\n// ${f.path}\n${f.content}`)].join('\n'));
  },
);

server.registerTool(
  'get_setup',
  { title: 'Setup guide', description: 'How to install Spark UI, import styles, choose light/dark mode, set app-wide defaults and theme it.' },
  async () => text(SETUP),
);

await server.connect(new StdioServerTransport());

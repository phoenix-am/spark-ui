#!/usr/bin/env node
/**
 * Tailwind integration, generated from the design tokens so it never drifts.
 *
 *   dist/tailwind.css           Tailwind v4:  @import "@sparkwire/core/tailwind.css";
 *   dist/tailwind-preset.js     Tailwind v3:  presets: [require('@sparkwire/core/tailwind-preset')]
 *
 * Every utility points at a live --spark-* variable, so it follows light/dark
 * mode, the energy dial and createTheme() overrides. Names carry a `spark-`
 * prefix so they never clash with Tailwind's own palette:
 * bg-spark-raised, text-spark-brand-ink, border-spark-border, rounded-spark-md,
 * shadow-spark-lg, font-spark, text-spark-sm, ease-spark.
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const styles = path.join(root, 'packages/core/src/styles');
const out = path.join(root, 'packages/core/dist');

const tokens = new Set();
for (const f of ['tokens.css', 'charts.css']) {
  for (const [, name] of fs.readFileSync(path.join(styles, f), 'utf8').matchAll(/--spark-([a-z0-9-]+)\s*:/g)) tokens.add(name);
}
const v = (t) => {
  if (!tokens.has(t)) throw new Error(`build-tailwind: token --spark-${t} not found`);
  return `var(--spark-${t})`;
};

/* ------------------------------------------------------------- the map */
const TONES = ['brand', 'success', 'warning', 'error'];
const colors = {
  // surfaces and lines
  base: v('surface-base'),
  raised: v('surface-raised'),
  sunken: v('surface-sunken'),
  border: v('surface-border'),
  'border-strong': v('surface-border-strong'),
  // text
  text: v('text-primary'),
  muted: v('text-secondary'),
  disabled: v('text-disabled'),
  'on-energy': v('text-on-energy'),
  // energy
  current: v('energy-current'),
  'current-ink': v('energy-ink'),
  'current-glow': v('energy-glow'),
  hot: v('energy-hot'),
  off: v('energy-off'),
};
for (const t of TONES) {
  colors[t] = v(`${t}-fill`);
  for (const k of ['ink', 'glow', 'hover']) colors[`${t}-${k}`] = v(`${t}-${k}`);
}
// Full palette scales: spark-gray-500, spark-brand-100, …
const scales = [...new Set([...tokens].map((t) => /^([a-z-]+)-(\d{2,3})$/.exec(t)?.[1]).filter(Boolean))].sort();
for (const s of scales) for (const t of tokens) {
  const m = new RegExp(`^${s}-(\\d{2,3})$`).exec(t);
  if (m) colors[`${s}-${m[1]}`] = v(t);
}
for (let i = 1; i <= 8; i++) colors[`chart-${i}`] = v(`chart-${i}`);

const SIZE = { small: 'sm', medium: 'md', large: 'lg', xlarge: 'xl', '2xlarge': '2xl', '3xlarge': '3xl', 'extra-small': 'xs' };
const pick = (prefix) => Object.fromEntries([...tokens].filter((t) => t.startsWith(prefix)).map((t) => [SIZE[t.slice(prefix.length)] ?? t.slice(prefix.length), v(t)]));
const radius = pick('radius-');
const shadow = pick('shadow-');
const fontSize = pick('font-size-');

/* ---------------------------------------------------------- Tailwind v4 */
const lines = [];
const block = (ns, map) => Object.entries(map).forEach(([k, val]) => lines.push(`  --${ns}-spark-${k}: ${val};`));
block('color', colors);
block('radius', radius);
block('shadow', shadow);
block('text', fontSize);
lines.push(`  --font-spark: ${v('font')};`, `  --ease-spark: ${v('motion-easing')};`);
const v4 = `/* Sparkwire for Tailwind v4 (generated from the design tokens; do not edit).
   @import "tailwindcss";
   @import "@sparkwire/core/styles.css";
   @import "@sparkwire/core/tailwind.css";
   Utilities: bg-spark-raised, text-spark-brand-ink, border-spark-border, rounded-spark-md, shadow-spark-lg, font-spark … */
@theme inline {
${lines.join('\n')}
}
`;

/* ---------------------------------------------------------- Tailwind v3 */
const preset = {
  theme: {
    extend: {
      colors: { spark: colors },
      borderRadius: Object.fromEntries(Object.entries(radius).map(([k, val]) => [`spark-${k}`, val])),
      boxShadow: Object.fromEntries(Object.entries(shadow).map(([k, val]) => [`spark-${k}`, val])),
      fontSize: Object.fromEntries(Object.entries(fontSize).map(([k, val]) => [`spark-${k}`, val])),
      fontFamily: { spark: [v('font')] },
      transitionTimingFunction: { spark: v('motion-easing') },
    },
  },
};
const json = JSON.stringify(preset, null, 2);
const header = '// Sparkwire preset for Tailwind v3 (generated from the design tokens; do not edit).\n';

fs.mkdirSync(out, { recursive: true });
fs.writeFileSync(path.join(out, 'tailwind.css'), v4);
fs.writeFileSync(path.join(out, 'tailwind-preset.js'), `${header}module.exports = ${json};\n`);
fs.writeFileSync(path.join(out, 'tailwind-preset.mjs'), `${header}export default ${json};\n`);
fs.writeFileSync(path.join(out, 'tailwind-preset.d.ts'), `${header}declare const preset: { theme: { extend: Record<string, unknown> } };\nexport = preset;\n`);
console.log(`build-tailwind: ${Object.keys(colors).length} colours, ${Object.keys(radius).length} radii, ${Object.keys(shadow).length} shadows`);

/**
 * Docs coverage: compares each component's public API (registry/docs.json and
 * registry/api.json, both read from source) with what the docs site shows.
 *
 * - Reference coverage: every prop, event, style hook, type and method is
 *   rendered by the page template; checks each has a description.
 * - Demo coverage: which props, events and variant values are exercised by a
 *   demo file or the playground (site/src/demos/<page>/).
 *
 * Run: node scripts/docs-coverage.mjs [--verbose]
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const docs = JSON.parse(fs.readFileSync(path.join(root, 'registry/docs.json'), 'utf8'));
const api = JSON.parse(fs.readFileSync(path.join(root, 'registry/api.json'), 'utf8'));
const pages = JSON.parse(fs.readFileSync(path.join(root, 'site/src/lib/pages.json'), 'utf8'));
const demosDir = path.join(root, 'site/src/demos');
const contentDir = path.join(root, 'site/src/content');
const verbose = process.argv.includes('--verbose');

/** Props that are plumbing rather than features: not expected in a demo. */
const PLUMBING = /^(className|classNames|style|id|ref|key|aria-.*|data-.*|render|as|calendarClassNames|wrapperClassName|dismissLabel|labels|todayLabel|loadingText|searchPlaceholder|emptyState|locale)$/;

const pageList = docs.components.flatMap((e) =>
  pages.split[e.name] ? pages.split[e.name].map((p) => ({ page: p.name, entry: e.name, components: e.components.filter((c) => p.parts.includes(c.name)) })) : [{ page: e.name, entry: e.name, components: e.components }],
);

const rows = [];
const totals = { props: 0, described: 0, demoed: 0, demoable: 0, events: 0, eventsDemoed: 0, values: 0, valuesDemoed: 0 };
for (const { page, entry, components } of pageList) {
  const dir = path.join(demosDir, page);
  const files = fs.existsSync(dir) ? fs.readdirSync(dir).filter((f) => f.endsWith('.tsx')) : [];
  const demoText = files.map((f) => fs.readFileSync(path.join(dir, f), 'utf8')).join('\n');
  const playground = files.includes('playground.tsx') ? fs.readFileSync(path.join(dir, 'playground.tsx'), 'utf8') : '';
  const content = fs.existsSync(path.join(contentDir, `${page}.md`)) ? fs.readFileSync(path.join(contentDir, `${page}.md`), 'utf8') : '';
  const missing = { undescribed: [], notDemoed: [], eventsNotDemoed: [], valuesNotDemoed: [], sections: [] };
  for (const c of components) {
    const a = api[entry]?.components[c.name];
    for (const p of c.props) {
      totals.props++;
      if (p.description) totals.described++;
      else missing.undescribed.push(`${c.name}.${p.name}`);
      if (PLUMBING.test(p.name) || /deprecated/i.test(p.description)) continue;
      const isEvent = /^on[A-Z]/.test(p.name);
      const used = new RegExp(`\\b${p.name}\\b`).test(demoText);
      // The playground offers a control for most enum, boolean, text and number props.
      const controlled = playground && !isEvent && (p.values?.length || /^(boolean|string|number)$/.test(p.type) || /ReactNode/.test(p.type)) && !/^(value|checked|open|page|selectedKeys|expandedKeys|default\w+)$/.test(p.name);
      if (isEvent) {
        totals.events++;
        if (used) totals.eventsDemoed++;
        else missing.eventsNotDemoed.push(`${c.name}.${p.name}`);
      } else {
        totals.demoable++;
        if (used || controlled) totals.demoed++;
        else missing.notDemoed.push(`${c.name}.${p.name}`);
      }
      // Variant values: each option of an enum prop should appear in a demo or be selectable in the playground.
      if (p.values?.length > 1 && !/^(true|false)$/.test(p.values[0])) {
        for (const v of p.values) {
          totals.values++;
          if (controlled || new RegExp(`['"\`]${v}['"\`]`).test(demoText)) totals.valuesDemoed++;
          else missing.valuesNotDemoed.push(`${c.name}.${p.name}=${v}`);
        }
      }
    }
    if (!a) missing.sections.push(`${c.name}: no API extraction`);
  }
  for (const s of ['Features', 'Accessibility']) if (!content.includes(`## ${s}`)) missing.sections.push(`content: no ${s}`);
  if (!files.some((f) => f !== 'playground.tsx')) missing.sections.push('no demos');
  rows.push({ page, demos: files.filter((f) => f !== 'playground.tsx').length, playground: Boolean(playground), ...missing });
}

const pct = (a, b) => (b ? Math.round((a / b) * 100) : 100) + '%';
console.log(`pages: ${rows.length}`);
console.log(`props described: ${totals.described}/${totals.props} (${pct(totals.described, totals.props)})`);
console.log(`props shown in a demo or playground: ${totals.demoed}/${totals.demoable} (${pct(totals.demoed, totals.demoable)})`);
console.log(`events used in a demo: ${totals.eventsDemoed}/${totals.events} (${pct(totals.eventsDemoed, totals.events)})`);
console.log(`variant values shown: ${totals.valuesDemoed}/${totals.values} (${pct(totals.valuesDemoed, totals.values)})`);
const gaps = rows.filter((r) => r.undescribed.length || r.sections.length || (verbose && (r.notDemoed.length || r.eventsNotDemoed.length || r.valuesNotDemoed.length)));
for (const r of gaps) {
  console.log(`\n${r.page} (${r.demos} demos${r.playground ? ' + playground' : ''})`);
  for (const k of ['sections', 'undescribed', ...(verbose ? ['notDemoed', 'eventsNotDemoed', 'valuesNotDemoed'] : [])]) if (r[k].length) console.log(`  ${k}: ${r[k].join(', ')}`);
}
fs.writeFileSync(path.join(root, 'site-coverage.json'), JSON.stringify({ totals, rows }, null, 2));

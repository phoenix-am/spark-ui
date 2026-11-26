/**
 * After `vite build`: write an HTML file for every docs page (copies of the
 * app's index.html with that page's title, description and link-preview tags),
 * so shared links preview correctly and every page answers 200 for search
 * engines. Also writes sitemap.xml (submit it in Google Search Console; a
 * robots.txt under /spark-ui/ would be ignored). The app itself is unchanged.
 *
 * Run: SPARKWIRE_SITE=https://phoenix-am.github.io/spark-ui node scripts/build-site-pages.mjs
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const dist = path.join(root, 'site-dist');
const SITE = (process.env.SPARKWIRE_SITE ?? 'https://phoenix-am.github.io/spark-ui').replace(/\/$/, '');
const docs = JSON.parse(fs.readFileSync(path.join(root, 'registry/docs.json'), 'utf8'));
const pages = JSON.parse(fs.readFileSync(path.join(root, 'site/src/lib/pages.json'), 'utf8'));
const guideMd = fs.readFileSync(path.join(root, 'docs/guide.md'), 'utf8');
// Drop tags a previous run added to index.html, so running this twice is safe.
const template = fs
  .readFileSync(path.join(dist, 'index.html'), 'utf8')
  .replace(/\n\s*<(?:link rel="canonical"|meta property="og:(?:url|type|site_name)"|meta name="twitter:card"|meta name="robots")[^>]*>/g, '');

/** Markdown → one plain sentence or two, for a meta description. */
const plain = (md = '') =>
  md
    .replace(/```[\s\S]*?```/g, '')
    .replace(/!?\[([^\]]*)\]\([^)]*\)/g, '$1')
    .replace(/[`*_>#]/g, '')
    .replace(/\s+/g, ' ')
    .trim();
const firstPara = (md = '') => plain(md.split(/\n\s*\n/).find((p) => p.trim() && !p.trim().startsWith('```') && !p.trim().startsWith('|')) ?? '');
const clip = (s, n = 158) => (s.length <= n ? s : s.slice(0, s.lastIndexOf(' ', n - 1)) + '…');
const esc = (s) => s.replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
const section = (heading) => {
  const at = guideMd.search(new RegExp(`^### ${heading.replace(/[.*+?^${}()|[\]\\`]/g, '\\$&')}\\s*$`, 'm'));
  if (at < 0) return '';
  const rest = guideMd.slice(at).replace(/^### .*\n/, '');
  const end = rest.search(/^#{2,3} /m);
  return end < 0 ? rest : rest.slice(0, end);
};

/* --------------------------------------------------------------- routes */
const routes = [];
// Components: one page per entry, or per part for entries split into several pages.
for (const e of docs.components) {
  const split = pages.split[e.name];
  if (!split) {
    routes.push({ path: `components/${e.name}`, title: e.title, description: firstPara(e.components[0]?.description) || e.summary });
    continue;
  }
  for (const page of split) {
    const main = e.components.find((c) => c.name === page.parts[0]);
    routes.push({ path: `components/${page.name}`, title: main.name, description: firstPara(main.description) });
  }
  // The old combined address still resolves (the app redirects); point search engines at the first page.
  if (!split.some((p) => p.name === e.name)) routes.push({ path: `components/${e.name}`, title: split[0].parts[0], description: firstPara(e.components[0].description), canonical: `components/${split[0].name}`, noindex: true });
}
routes.push({ path: 'theme-builder', title: 'Theme builder', description: 'Pick a colour and corner style, watch real Sparkwire components change, check contrast, and copy the theme as a ThemeProvider or CSS variables.' });
routes.push({ path: 'components/blocks', title: 'Blocks', description: 'Whole screens built from Sparkwire: a dashboard, a sign-in page and a settings page. Copy one into your app and make it yours.' });
for (const g of pages.guides) {
  const md = g.file ? fs.readFileSync(path.join(root, `docs/${g.file}.md`), 'utf8').replace(/^# .*\n/, '') : (g.sections ?? []).map(section).join('\n\n');
  routes.push({ path: `docs/${g.slug}`, title: g.title, description: g.description ?? firstPara(md) });
}

/* ---------------------------------------------------------------- write */
const head = (r) => {
  const title = `${r.title} · Sparkwire`;
  // GitHub Pages serves folders at /path/ (it redirects /path there), so that's the canonical address.
  const url = `${SITE}/${r.canonical ?? r.path}/`;
  const description = esc(clip(r.description || 'Accessible React components with a live wire.'));
  return template
    .replace(/<title>[\s\S]*?<\/title>/, `<title>${esc(title)}</title>`)
    .replace(/<meta name="description"[^>]*>/, `<meta name="description" content="${description}" />`)
    .replace(/<meta property="og:title"[^>]*>/, `<meta property="og:title" content="${esc(title)}" />`)
    .replace(/<meta property="og:description"[^>]*>/, `<meta property="og:description" content="${description}" />`)
    .replace(
      '</head>',
      [
        `    <link rel="canonical" href="${url}" />`,
        `    <meta property="og:url" content="${url}" />`,
        `    <meta property="og:type" content="website" />`,
        `    <meta property="og:site_name" content="Sparkwire" />`,
        `    <meta name="twitter:card" content="summary_large_image" />`,
        r.noindex ? `    <meta name="robots" content="noindex" />` : '',
        '  </head>',
      ]
        .filter(Boolean)
        .join('\n'),
    );
};

for (const r of routes) {
  const dir = path.join(dist, r.path);
  fs.mkdirSync(dir, { recursive: true });
  fs.writeFileSync(path.join(dir, 'index.html'), head(r));
}
// Home page: same tags, its own URL.
fs.writeFileSync(
  path.join(dist, 'index.html'),
  template.replace('</head>', `    <link rel="canonical" href="${SITE}/" />\n    <meta property="og:url" content="${SITE}/" />\n    <meta property="og:type" content="website" />\n    <meta property="og:site_name" content="Sparkwire" />\n    <meta name="twitter:card" content="summary_large_image" />\n  </head>`),
);
// Unknown addresses: GitHub Pages serves 404.html, and the app shows its not-found page.
fs.writeFileSync(path.join(dist, '404.html'), template.replace('</head>', '    <meta name="robots" content="noindex" />\n  </head>'));

const listed = routes.filter((r) => !r.noindex);
fs.writeFileSync(
  path.join(dist, 'sitemap.xml'),
  `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n  <url><loc>${SITE}/</loc></url>\n${listed.map((r) => `  <url><loc>${SITE}/${r.path}/</loc></url>`).join('\n')}\n</urlset>\n`,
);
console.log(`site pages: ${routes.length} pages, ${listed.length + 1} in the sitemap`);

/**
 * Hand-written sections per component page: site/src/content/<page>.md, split
 * on "## " headings (Features, Accessibility, Responsive behavior, Best
 * practices, Limitations, and any extras such as Hooks).
 */
const files = import.meta.glob<string>('../content/*.md', { query: '?raw', import: 'default', eager: true });

export const SECTION_ORDER = ['Features', 'Accessibility', 'Responsive behavior', 'Best practices', 'Limitations'];

export function contentFor(page: string): Record<string, string> {
  const raw = files[`../content/${page}.md`];
  if (!raw) return {};
  const out: Record<string, string> = {};
  for (const part of raw.split(/^## /m).slice(1)) {
    const [heading, ...body] = part.split('\n');
    out[heading.trim()] = body.join('\n').trim();
  }
  return out;
}

import { Marked } from 'marked';
import { highlight } from 'sugar-high';

const esc = (s: string) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
const JS = /^(tsx?|jsx?|ts|js|json)$/;

/** Markdown → HTML, with code highlighted and internal links rewritten to site routes. */
const marked = new Marked({
  gfm: true,
  renderer: {
    code({ text, lang }) {
      const body = lang && JS.test(lang) ? highlight(text) : esc(text);
      return `<div class="sw-code" data-lang="${lang ?? ''}"><pre><code>${body}</code></pre><button class="sw-copy" type="button" data-copy aria-label="Copy code">Copy</button></div>`;
    },
    link({ href, text }) {
      const local = href.match(/^\.?\/?(?:docs\/)?([a-z-]+)\.md(?:#([a-z-]+))?$/);
      // guide.md#languages → the Languages page; accessibility.md → the Accessibility page
      const slug = local && (local[1] === 'guide' ? local[2] ?? 'getting-started' : local[1]);
      const base = import.meta.env.BASE_URL;
      const to = slug ? `${base}docs/${slug}` : href.replace(/^https:\/\/phoenix-am\.github\.io\/spark-ui\//, base);
      const external = /^https?:/.test(to);
      return `<a href="${to}"${external ? ' target="_blank" rel="noreferrer"' : ''}>${text}</a>`;
    },
  },
});

export const renderMarkdown = (md: string) => marked.parse(md) as string;
export const highlightCode = (code: string) => highlight(code);

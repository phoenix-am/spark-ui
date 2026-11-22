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
      const local = href.match(/^\.?\/?(?:docs\/)?([a-z-]+)\.md(#.*)?$/);
      const to = local ? `#/docs/${local[1]}` : href;
      const external = /^https?:/.test(to);
      return `<a href="${to}"${external ? ' target="_blank" rel="noreferrer"' : ''}>${text}</a>`;
    },
  },
});

export const renderMarkdown = (md: string) => marked.parse(md) as string;
export const highlightCode = (code: string) => highlight(code);

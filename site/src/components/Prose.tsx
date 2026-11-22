import React, { useMemo } from 'react';
import { useNavigate } from 'react-router';
import { renderMarkdown } from '../lib/markdown';

/** Rendered markdown. Internal links navigate in-app; code blocks get working copy buttons. */
export function Prose({ markdown, className }: { markdown: string; className?: string }) {
  const html = useMemo(() => renderMarkdown(markdown), [markdown]);
  const navigate = useNavigate();
  return (
    <div
      className={`sw-prose ${className ?? ''}`}
      dangerouslySetInnerHTML={{ __html: html }}
      onClick={(e) => {
        const el = e.target as HTMLElement;
        const copy = el.closest<HTMLButtonElement>('[data-copy]');
        if (copy) {
          const code = copy.parentElement?.querySelector('code')?.textContent ?? '';
          navigator.clipboard?.writeText(code);
          copy.textContent = 'Copied';
          setTimeout(() => (copy.textContent = 'Copy'), 1500);
          return;
        }
        const a = el.closest('a');
        const href = a?.getAttribute('href');
        if (href?.startsWith('#/')) {
          e.preventDefault();
          navigate(href.slice(1));
        }
      }}
    />
  );
}

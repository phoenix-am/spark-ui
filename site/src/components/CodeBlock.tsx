import React, { useState } from 'react';
import { highlightCode } from '../lib/markdown';

export function CodeBlock({ code, lang = 'tsx', label }: { code: string; lang?: string; label?: string }) {
  const [copied, setCopied] = useState(false);
  const html = /^(tsx?|jsx?|js|ts)$/.test(lang) ? highlightCode(code) : code.replace(/&/g, '&amp;').replace(/</g, '&lt;');
  return (
    <div className="sw-code" data-lang={lang}>
      {label && <div className="sw-code__label">{label}</div>}
      <pre>
        <code dangerouslySetInnerHTML={{ __html: html }} />
      </pre>
      <button
        type="button"
        className="sw-copy"
        aria-label={copied ? 'Copied' : 'Copy code'}
        onClick={() => {
          navigator.clipboard?.writeText(code);
          setCopied(true);
          setTimeout(() => setCopied(false), 1500);
        }}
      >
        {copied ? 'Copied' : 'Copy'}
      </button>
    </div>
  );
}

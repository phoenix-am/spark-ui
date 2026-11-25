import React, { useState } from 'react';
import type { Demo } from '../lib/demos';
import { CodeBlock } from './CodeBlock';
import { Icon } from './Icon';
import { renderMarkdown } from '../lib/markdown';

const inline = (md: string) => renderMarkdown(md).replace(/^<p>|<\/p>\s*$/g, '');

export class ErrorBoundary extends React.Component<{ children: React.ReactNode }, { error?: Error }> {
  state: { error?: Error } = {};
  static getDerivedStateFromError(error: Error) {
    return { error };
  }
  render() {
    if (this.state.error) return <p className="sw-error">This demo couldn't render: {this.state.error.message}</p>;
    return this.props.children;
  }
}

export function ExampleCard({ demo }: { demo: Demo }) {
  const [tab, setTab] = useState<'preview' | 'code'>('preview');
  const { Component } = demo;
  const anchor = demo.id;
  return (
    <section className="sw-example" id={anchor} aria-labelledby={`${anchor}-title`}>
      <h3 id={`${anchor}-title`}>
        <a href={`#${anchor}`}>{demo.name}</a>
      </h3>
      {demo.description && <p className="sw-example__desc" dangerouslySetInnerHTML={{ __html: inline(demo.description) }} />}
      <div className="sw-example__frame">
        <div className="sw-example__tabs" role="tablist" aria-label={`${demo.name}: preview or code`}>
          <button type="button" role="tab" aria-selected={tab === 'preview'} onClick={() => setTab('preview')}>
            Preview
          </button>
          <button type="button" role="tab" aria-selected={tab === 'code'} onClick={() => setTab('code')}>
            <Icon name="code" size={14} /> Code
          </button>
        </div>
        {tab === 'preview' ? (
          <div className="sw-canvas">
            <ErrorBoundary>
              <Component />
            </ErrorBoundary>
          </div>
        ) : (
          <CodeBlock code={demo.source} />
        )}
      </div>
    </section>
  );
}

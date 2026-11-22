import React, { useEffect, useState } from 'react';
import { Navigate, useParams } from 'react-router';
import { Tabs, TabList, Tab, TabPanel, Badge } from '@sparkwire/core';
import { entryByName, notesFor, REDIRECT } from '../lib/catalog';
import { loadDemos, loadPlayground, type Demo, type PlaygroundConfig } from '../lib/demos';
import { Playground } from '../components/Playground';
import { PropsTable } from '../components/PropsTable';
import { ExampleCard } from '../components/ExampleCard';
import { CodeBlock } from '../components/CodeBlock';
import { Prose } from '../components/Prose';
import { NotFound } from './NotFound';
import { usePageTitle } from '../lib/usePageTitle';
import { renderMarkdown } from '../lib/markdown';

const inline = (md: string) => renderMarkdown(md).replace(/^<p>|<\/p>\s*$/g, '');

/** First paragraph of a doc comment is the friendly intro; the rest is reference detail. */
const split = (text = '') => {
  const [intro, ...rest] = text.split(/\n\s*\n/);
  return { intro: intro.replace(/\n/g, ' '), details: rest.join('\n\n') };
};

export function ComponentPage() {
  const { name = '' } = useParams();
  const entry = entryByName.get(name);
  const [demos, setDemos] = useState<Demo[]>([]);
  const [playground, setPlayground] = useState<PlaygroundConfig | undefined>();
  usePageTitle(entry?.title);
  useEffect(() => {
    setDemos([]);
    setPlayground(undefined);
    loadDemos(name).then(setDemos);
    loadPlayground(name).then(setPlayground);
  }, [name]);
  if (REDIRECT[name]) return <Navigate to={`/components/${REDIRECT[name]}`} replace />;
  if (!entry) return <NotFound />;

  const main = entry.components[0];
  const { intro } = split(main?.description);
  const notes = notesFor(entry.name);
  const playDoc = (playground?.name && entry.components.find((c) => c.name === playground.name)) || main;
  const toc = [
    playground && { id: 'playground', label: 'Playground' },
    { id: 'install', label: 'Install' },
    demos.length > 0 && { id: 'examples', label: 'Examples' },
    notes && { id: 'notes', label: 'Good to know' },
    entry.components.length > 0 && { id: 'api', label: 'API' },
  ].filter(Boolean) as { id: string; label: string }[];

  return (
    <div className="sw-page-grid">
      <article className="sw-page">
        <p className="sw-eyebrow">{entry.category}</p>
        <h1>{entry.title}</h1>
        <p className="sw-lead" dangerouslySetInnerHTML={{ __html: inline(intro || entry.summary) }} />
        {entry.components.length > 1 && (
          <p className="sw-parts">
            {entry.components.map((c) => (
              <Badge key={c.name} variant="soft">
                {c.name}
              </Badge>
            ))}
          </p>
        )}

        {playground && playDoc && (
          <section aria-labelledby="playground">
            <h2 id="playground" className="sw-section-title">
              Playground
            </h2>
            <Playground key={entry.name} config={playground} doc={playDoc} />
          </section>
        )}

        <section aria-labelledby="install">
          <h2 id="install" className="sw-section-title">
            Install
          </h2>
          <Tabs defaultValue={entry.install.package ? 'npm' : 'copy'}>
            <TabList aria-label="How to install">
              {entry.install.package && <Tab value="npm">npm</Tab>}
              <Tab value="copy">Copy the source</Tab>
              <Tab value="shadcn">shadcn</Tab>
            </TabList>
            {entry.install.package && (
            <TabPanel value="npm">
              <CodeBlock lang="bash" code={`npm install @sparkwire/core`} />
              <CodeBlock code={`import '@sparkwire/core/styles.css'; // once, at your app's root\n${entry.import}`} />
            </TabPanel>
            )}
            <TabPanel value="copy">
              <CodeBlock lang="bash" code={entry.install.copy} />
              {entry.install.copiedImport && <CodeBlock code={entry.install.copiedImport} />}
            </TabPanel>
            <TabPanel value="shadcn">
              <CodeBlock lang="bash" code={entry.install.shadcn} />
            </TabPanel>
          </Tabs>
        </section>

        {demos.length > 0 && (
          <section aria-labelledby="examples">
            <h2 id="examples" className="sw-section-title">
              Examples
            </h2>
            {demos.map((d) => (
              <ExampleCard key={d.id} demo={d} />
            ))}
          </section>
        )}

        {notes && (
          <section aria-labelledby="notes">
            <h2 id="notes" className="sw-section-title">
              Good to know
            </h2>
            <Prose markdown={notes} />
          </section>
        )}

        {entry.components.length > 0 && (
          <section aria-labelledby="api">
            <h2 id="api" className="sw-section-title">
              API
            </h2>
            {entry.components.map((c) => {
              const { intro: cIntro, details } = split(c.description);
              return (
                <div key={c.name} className="sw-api">
                  <h3 id={`api-${c.name.toLowerCase().replace(/\./g, '-')}`}>
                    <code>{c.name}</code>
                  </h3>
                  {entry.components.length > 1 && cIntro && <p dangerouslySetInnerHTML={{ __html: inline(cIntro) }} />}
                  {details && <Prose markdown={details} className="sw-api__details" />}
                  <PropsTable props={c.props} />
                </div>
              );
            })}
          </section>
        )}
      </article>
      <nav className="sw-toc sw-hide-mobile" aria-label="On this page">
        <p>On this page</p>
        {toc.map((t) => (
          <a key={t.id} href={`#${t.id}`}>
            {t.label}
          </a>
        ))}
      </nav>
    </div>
  );
}

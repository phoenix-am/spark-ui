import React, { useEffect, useState } from 'react';
import { Navigate, useParams } from 'react-router';
import { Tabs, TabList, Tab, TabPanel, Badge } from '@sparkwire/core';
import { InstallBar } from '../components/InstallBar';
import { entryByName, notesFor, REDIRECT } from '../lib/catalog';
import { loadDemos, loadPlayground, type Demo, type PlaygroundConfig } from '../lib/demos';
import { contentFor, SECTION_ORDER } from '../lib/content';
import { Playground } from '../components/Playground';
import { ApiReference } from '../components/ApiReference';
import { ExampleCard } from '../components/ExampleCard';
import { CodeBlock } from '../components/CodeBlock';
import { Prose } from '../components/Prose';
import { NotFound } from './NotFound';
import { usePageTitle } from '../lib/usePageTitle';
import { renderMarkdown } from '../lib/markdown';

const inline = (md: string) => renderMarkdown(md).replace(/^<p>|<\/p>\s*$/g, '');
const slug = (s: string) => s.toLowerCase().replace(/[^a-z0-9]+/g, '-');

/** First paragraph of a doc comment is the friendly intro; the rest is reference detail. */
const split = (text = '') => {
  const [intro, ...rest] = text.split(/\n\s*\n/);
  return { intro: intro.replace(/\n/g, ' '), details: rest.join('\n\n') };
};

function Section({ id, title, first, children }: { id: string; title: string; first?: boolean; children: React.ReactNode }) {
  return (
    <section aria-labelledby={id}>
      <h2 id={id} className={first ? 'sw-section-title sw-section-title--first' : 'sw-section-title'}>
        {title}
      </h2>
      {children}
    </section>
  );
}

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
  const content = contentFor(entry.name);
  const playDoc = (playground?.name && entry.components.find((c) => c.name === playground.name)) || main;
  const [basic, ...examples] = demos;
  const extras = Object.keys(content).filter((k) => !SECTION_ORDER.includes(k));
  const reference = entry.components;

  const toc = [
    playground && { id: 'playground', label: 'Playground' },
    basic && { id: 'usage', label: 'Basic usage' },
    examples.length > 0 && { id: 'examples', label: 'Examples' },
    content.Features && { id: 'features', label: 'Features' },
    notes && { id: 'notes', label: 'Good to know' },
    { id: 'install', label: 'Installation' },
    ...extras.map((k) => ({ id: slug(k), label: k })),
    reference.length > 0 && { id: 'api', label: 'API reference' },
    ...SECTION_ORDER.slice(1)
      .filter((k) => content[k])
      .map((k) => ({ id: slug(k), label: k })),
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
        <InstallBar entry={entry} />
        <nav className="sw-jumpbar" aria-label="Sections">
          {toc.map((t) => (
            <a key={t.id} href={`#${t.id}`}>
              {t.label}
            </a>
          ))}
        </nav>

        {playground && playDoc && (
          <Section id="playground" title="Playground" first>
            <Playground key={entry.name} config={playground} doc={playDoc} />
          </Section>
        )}



        {basic && (
          <Section id="usage" title="Basic usage" first={!playground}>
            <ExampleCard demo={basic} />
          </Section>
        )}



        {examples.length > 0 && (
          <Section id="examples" title="Examples">
            {examples.map((d) => (
              <ExampleCard key={d.id} demo={d} />
            ))}
          </Section>
        )}

        {content.Features && (
          <Section id="features" title="Features">
            <Prose markdown={content.Features} />
          </Section>
        )}

        {notes && (
          <Section id="notes" title="Good to know">
            <Prose markdown={notes} />
          </Section>
        )}

        <Section id="install" title="Installation">
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
        </Section>

        {extras.map((k) => (
          <Section key={k} id={slug(k)} title={k}>
            <Prose markdown={content[k]} />
          </Section>
        ))}

        {reference.length > 0 && (
          <Section id="api" title="API reference">
            <ApiReference components={reference} />
          </Section>
        )}

        {SECTION_ORDER.slice(1)
          .filter((k) => content[k])
          .map((k) => (
            <Section key={k} id={slug(k)} title={k}>
              <Prose markdown={content[k]} />
            </Section>
          ))}
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

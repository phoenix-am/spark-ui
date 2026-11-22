import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router';
import { guideBySlug } from '../lib/catalog';
import { loadDemos, type Demo } from '../lib/demos';
import { Prose } from '../components/Prose';
import { ExampleCard } from '../components/ExampleCard';
import { NotFound } from './NotFound';
import { usePageTitle } from '../lib/usePageTitle';

export function GuidePage() {
  const { slug = '' } = useParams();
  const guide = guideBySlug.get(slug);
  const [examples, setExamples] = useState<Demo[]>([]);
  usePageTitle(guide?.title);
  useEffect(() => {
    setExamples([]);
    if (guide?.examples) loadDemos(guide.examples).then(setExamples);
  }, [guide]);
  if (!guide) return <NotFound />;
  return (
    <article className="sw-page">
      <p className="sw-eyebrow">{guide.group}</p>
      <h1>{guide.title}</h1>
      <Prose markdown={guide.markdown} />
      {examples.length > 0 && (
        <>
          <h2 className="sw-section-title">Try it</h2>
          {examples.map((ex) => (
            <ExampleCard key={ex.id} demo={ex} />
          ))}
        </>
      )}
    </article>
  );
}

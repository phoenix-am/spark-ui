/**
 * Accessibility: every docs demo (site/src/demos/<component>/*.tsx) and every
 * playground's starting state is rendered and checked with axe. A new demo is
 * covered automatically, and what's tested is exactly what the docs show.
 */
import React from 'react';
import { readdirSync, statSync } from 'node:fs';
import { join, relative } from 'node:path';
import { render, cleanup } from '@testing-library/react';
import { axe } from 'jest-axe';

const demosDir = join(__dirname, '../../../../site/src/demos');
const files: string[] = [];
for (const entry of readdirSync(demosDir)) {
  const dir = join(demosDir, entry);
  if (!statSync(dir).isDirectory()) continue;
  for (const name of readdirSync(dir)) if (name.endsWith('.tsx')) files.push(join(dir, name));
}

// Rules that need a full page (landmarks, one <h1>) don't apply to a component on its own.
const axeOptions = { rules: { region: { enabled: false }, 'page-has-heading-one': { enabled: false }, 'landmark-one-main': { enabled: false } } };

interface PlaygroundConfig {
  component: React.ComponentType<Record<string, unknown>>;
  props?: Record<string, unknown>;
  fixed?: Record<string, unknown>;
  wrap?: (node: React.ReactNode) => React.ReactNode;
}

function Example({ file }: { file: string }) {
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  const mod = require(file);
  if (file.endsWith('/playground.tsx')) {
    const config = mod.default as PlaygroundConfig;
    const C = config.component;
    const node = <C {...config.fixed} {...config.props} />;
    return <>{config.wrap ? config.wrap(node) : node}</>;
  }
  const Demo = mod.default as React.ComponentType;
  return <Demo />;
}

test.each(files.map((f) => [relative(demosDir, f), f]))('%s has no axe violations', async (_label, file) => {
  const { container } = render(<Example file={file} />);
  expect(await axe(container, axeOptions)).toHaveNoViolations();
  cleanup();
});

/**
 * Accessibility: every Storybook story is rendered and checked with axe.
 * A new story is covered automatically.
 */
import React from 'react';
import { readdirSync, statSync } from 'node:fs';
import { join, relative } from 'node:path';
import { render, cleanup } from '@testing-library/react';
import { axe } from 'jest-axe';
import { composeStories } from '@storybook/react';

const root = join(__dirname, '..');
const storyFiles: string[] = [];
(function walk(dir: string) {
  for (const name of readdirSync(dir)) {
    const p = join(dir, name);
    if (statSync(p).isDirectory()) walk(p);
    else if (name.endsWith('.stories.tsx')) storyFiles.push(p);
  }
})(root);

// Rules that need a full page (landmarks, one <h1>) don't apply to a component on its own.
const axeOptions = { rules: { region: { enabled: false }, 'page-has-heading-one': { enabled: false }, 'landmark-one-main': { enabled: false } } };

describe.each(storyFiles.map((f) => [relative(root, f), f]))('%s', (_label, file) => {
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  const stories = composeStories(require(file));
  const entries = Object.entries(stories) as [string, React.ComponentType][];
  test.each(entries)('%s has no axe violations', async (_name, Story) => {
    const { container } = render(<Story />);
    expect(await axe(container, axeOptions)).toHaveNoViolations();
    cleanup();
  });
});

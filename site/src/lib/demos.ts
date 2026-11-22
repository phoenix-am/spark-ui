/**
 * Demos are plain React files: src/demos/<entry>/<name>.tsx, default export a
 * component. The page renders it and shows the file itself as the code. An
 * optional leading /** comment *\/ becomes the demo's description; a number
 * prefix (01-…) sets the order. src/demos/<entry>/playground.tsx configures
 * the playground.
 */
import type React from 'react';

export interface Demo {
  id: string;
  name: string;
  description?: string;
  Component: React.ComponentType;
  source: string;
}
export interface PlaygroundConfig {
  /** The component the controls drive. */
  component: React.ComponentType<any>;
  /** Its docs name, if different from the entry's first component. */
  name?: string;
  /** Starting values for the controls. */
  props?: Record<string, unknown>;
  /** Props passed as-is (sample data, handlers); shown as `name={name}` in the code. */
  fixed?: Record<string, unknown>;
  /** Props not to offer as controls. */
  hide?: string[];
  /** Wrap the preview, e.g. to give a chart a width. */
  wrap?: (node: React.ReactNode) => React.ReactNode;
}

const modules = import.meta.glob<{ default: React.ComponentType }>('../demos/*/*.tsx');
const sources = import.meta.glob<string>('../demos/*/*.tsx', { query: '?raw', import: 'default' });
const playgrounds = import.meta.glob<{ default: PlaygroundConfig }>('../demos/*/playground.tsx');

const label = (file: string) => {
  const s = file.replace(/^\d+-/, '').replace(/-/g, ' ');
  return s[0].toUpperCase() + s.slice(1);
};
/** The file as readers should see it: without the description comment. */
const display = (raw: string) => raw.replace(/^\/\*\*[\s\S]*?\*\/\s*/, '').trim();
const describe = (raw: string) => raw.match(/^\/\*\*([\s\S]*?)\*\//)?.[1].replace(/^\s*\* ?/gm, '').trim();

export const hasDemos = (entry: string) => Object.keys(modules).some((p) => p.startsWith(`../demos/${entry}/`) && !p.endsWith('/playground.tsx'));

export async function loadDemos(entry: string): Promise<Demo[]> {
  const paths = Object.keys(modules)
    .filter((p) => p.startsWith(`../demos/${entry}/`) && !p.endsWith('/playground.tsx'))
    .sort();
  return Promise.all(
    paths.map(async (p) => {
      const file = p.split('/').pop()!.replace(/\.tsx$/, '');
      const [mod, raw] = await Promise.all([modules[p](), sources[p]()]);
      return { id: `${entry}-${file.replace(/^\d+-/, '')}`, name: label(file), description: describe(raw), Component: mod.default, source: display(raw) };
    }),
  );
}

export async function loadPlayground(entry: string): Promise<PlaygroundConfig | undefined> {
  const load = playgrounds[`../demos/${entry}/playground.tsx`];
  return load ? (await load()).default : undefined;
}

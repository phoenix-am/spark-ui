import React, { useState } from 'react';
import type { Entry } from '../lib/catalog';
import { defaultFor } from '../lib/api';
import { Icon } from './Icon';

const SITE = 'https://phoenix-am.github.io/spark-ui';
const firstSentence = (s: string) => s.replace(/\s+/g, ' ').split(/(?<=\.)\s/)[0] ?? s;

/** A compact brief an AI coding agent can work from: what it is, how to import it, every prop. */
function briefFor(entry: Entry): string {
  const lines = [
    `# ${entry.title} (Sparkwire)`,
    '',
    entry.summary,
    '',
    'Install: `npm install @sparkwire/core`, then `import "@sparkwire/core/styles.css"` once at the app root.',
    `Import: \`${entry.import}\``,
    `Or copy the source: \`${entry.install.copy}\``,
  ];
  for (const c of entry.components) {
    if (!c.props.length) continue;
    lines.push('', `## ${c.name} props`);
    for (const p of c.props) {
      const type = p.values?.length ? p.values.map((v) => (/^(true|false|\d+)$/.test(v) ? v : `'${v}'`)).join(' | ') : p.type;
      const def = defaultFor(c.name, p);
      lines.push(`- \`${p.name}${p.required ? '' : '?'}: ${type}\`${def ? ` (default \`${def}\`)` : ''}: ${firstSentence(p.description)}`);
    }
  }
  lines.push('', `Docs: ${SITE}/components/${entry.name}/`);
  return lines.join('\n');
}

function CopyChip({ text, children, label, mono = true }: { text: string; children: React.ReactNode; label: string; mono?: boolean }) {
  const [done, setDone] = useState(false);
  return (
    <button
      type="button"
      className={mono ? 'sw-chip sw-installbar__chip sw-installbar__chip--mono' : 'sw-chip sw-installbar__chip'}
      aria-label={done ? 'Copied' : label}
      onClick={() =>
        navigator.clipboard?.writeText(text).then(() => {
          setDone(true);
          setTimeout(() => setDone(false), 1500);
        })
      }
    >
      <span>{children}</span>
      <Icon name={done ? 'check' : 'copy'} size={14} />
    </button>
  );
}

/** One row of ways to get the component, each a click to copy. Full steps are in Installation below. */
export function InstallBar({ entry }: { entry: Entry }) {
  return (
    <div className="sw-installbar" role="group" aria-label="Get this component">
      {entry.install.package && (
        <CopyChip text="npm install @sparkwire/core" label="Copy npm install command">
          npm i @sparkwire/core
        </CopyChip>
      )}
      <CopyChip text={entry.install.copy} label="Copy the command that adds the source">
        {entry.install.copy}
      </CopyChip>
      <CopyChip text={entry.import} label="Copy the import line">
        {entry.import.replace(/^import /, '').replace(/;$/, '')}
      </CopyChip>
      <CopyChip text={briefFor(entry)} label="Copy a summary of this component for an AI coding assistant" mono={false}>
        Copy for AI
      </CopyChip>
    </div>
  );
}

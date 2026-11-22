import React from 'react';
import type { PropDoc } from '../lib/catalog';
import { defaultOf } from './Playground';
import { renderMarkdown } from '../lib/markdown';

const HIDDEN = new Set(['ripple', 'forTeams', 'showBorder', 'inputStyle', 'itemStyle', 'listContainerStyle', 'containerStyle', 'appendIcon', 'prependIcon']);
const inline = (md: string) => renderMarkdown(md).replace(/^<p>|<\/p>\s*$/g, '');

export function PropsTable({ props }: { props: PropDoc[] }) {
  const rows = props.filter((p) => !HIDDEN.has(p.name)).sort((a, b) => Number(b.required) - Number(a.required) || a.name.localeCompare(b.name));
  if (!rows.length) return <p className="sw-muted">No props of its own.</p>;
  return (
    <div className="sw-props" role="region" aria-label="Props" tabIndex={0}>
      <table>
        <thead>
          <tr>
            <th scope="col">Prop</th>
            <th scope="col">Type</th>
            <th scope="col">Default</th>
            <th scope="col">Description</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((p) => {
            const type = p.values?.length ? p.values.map((v) => (/^(true|false|\d+)$/.test(v) ? v : `'${v}'`)).join(' | ') : p.type;
            const def = defaultOf(p);
            return (
              <tr key={p.name}>
                <th scope="row" data-label="Prop">
                  <code className="sw-props__name">{p.name}</code>
                  {p.required && <span className="sw-props__req">required</span>}
                </th>
                <td data-label="Type">
                  <code className="sw-props__type">{type}</code>
                </td>
                <td data-label="Default">{def ? <code>{def}</code> : <span className="sw-muted">—</span>}</td>
                <td data-label="Description" dangerouslySetInnerHTML={{ __html: p.description ? inline(p.description) : '<span class="sw-muted">—</span>' }} />
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

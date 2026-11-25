import React from 'react';
import { renderMarkdown } from '../lib/markdown';

const inline = (md: string) => renderMarkdown(md).replace(/^<p>|<\/p>\s*$/g, '');

export interface Column<Row> {
  label: string;
  /** Plain text is shown as is; `code` wraps it in <code>; `md` renders inline markdown. */
  render: (row: Row) => React.ReactNode | { code: string } | { md: string };
  className?: string;
}

/** A reference table that stacks into cards on narrow screens (same styles as the props table). */
export function RefTable<Row>({ caption, columns, rows, rowKey }: { caption: string; columns: Column<Row>[]; rows: Row[]; rowKey: (r: Row) => string }) {
  if (!rows.length) return null;
  return (
    <div className="sw-props" role="region" aria-label={caption} tabIndex={0}>
      <table>
        <thead>
          <tr>
            {columns.map((c) => (
              <th key={c.label} scope="col">
                {c.label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((r) => (
            <tr key={rowKey(r)}>
              {columns.map((c, i) => {
                const v = c.render(r);
                const Cell = i === 0 ? 'th' : 'td';
                const content =
                  v && typeof v === 'object' && 'code' in (v as object) ? (
                    <code className={i === 0 ? 'sw-props__name' : 'sw-props__type'}>{(v as { code: string }).code}</code>
                  ) : v && typeof v === 'object' && 'md' in (v as object) ? (
                    <span dangerouslySetInnerHTML={{ __html: inline((v as { md: string }).md) || '<span class="sw-muted">—</span>' }} />
                  ) : v === undefined || v === null || v === '' ? (
                    <span className="sw-muted">—</span>
                  ) : (
                    (v as React.ReactNode)
                  );
                return (
                  <Cell key={c.label} data-label={c.label} className={c.className} {...(i === 0 ? { scope: 'row' } : {})}>
                    {content}
                  </Cell>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

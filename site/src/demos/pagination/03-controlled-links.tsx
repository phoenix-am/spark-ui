/** Controlled with `page` and `onChange`, and rendered as real links with `getHref` so every page has its own URL. */
import { useState } from 'react';
import { Pagination } from '@sparkwire/core';

export default function ControlledLinks() {
  const [page, setPage] = useState(3);
  return (
    <div style={{ display: 'grid', gap: 12, justifyItems: 'center' }}>
      <Pagination count={10} page={page} onChange={setPage} getHref={(p) => `?page=${p}`} />
      <output style={{ fontSize: 13, color: 'var(--spark-text-secondary)' }}>Showing results {(page - 1) * 20 + 1}–{page * 20}</output>
    </div>
  );
}

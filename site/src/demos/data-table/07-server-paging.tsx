/** With `manual`, the table doesn't sort, search or page by itself: it reports what people asked for, and you fetch that page. */
import { useEffect, useState } from 'react';
import { DataTable } from '@sparkwire/core';

type Row = { id: number; order: string; total: number };
const ALL: Row[] = Array.from({ length: 87 }, (_, i) => ({ id: i + 1, order: `#${5000 + i}`, total: 400 + ((i * 397) % 9000) }));
// Stand-in for an API that pages and sorts on the server.
const fetchPage = (page: number, size: number, desc: boolean) =>
  new Promise<Row[]>((r) => setTimeout(() => r([...ALL].sort((a, b) => (desc ? b.total - a.total : a.id - b.id)).slice(page * size, page * size + size)), 250));

export default function ServerPaging() {
  const [page, setPage] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  const [desc, setDesc] = useState(false);
  const [rows, setRows] = useState<Row[]>([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    setLoading(true);
    fetchPage(page, pageSize, desc).then((r) => (setRows(r), setLoading(false)));
  }, [page, pageSize, desc]);
  return (
    <DataTable
      aria-label="Orders"
      manual
      data={rows}
      rowCount={ALL.length}
      loading={loading}
      page={page}
      onPageChange={setPage}
      pageSize={pageSize}
      onPageSizeChange={setPageSize}
      pageSizeOptions={[10, 25]}
      onSortChange={(rules) => setDesc(rules[0]?.direction === 'descending')}
      columns={[
        { key: 'order', header: 'Order' },
        { key: 'total', header: 'Total', sortable: true, cell: (r) => `₹${r.total.toLocaleString('en-IN')}` },
      ]}
    />
  );
}

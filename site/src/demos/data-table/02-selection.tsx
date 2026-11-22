/** Checkboxes, select-all and bulk actions that appear as soon as something's picked. */
import { DataTable, Button } from '@sparkwire/core';

const rows = Array.from({ length: 6 }, (_, i) => ({ id: i + 1, file: `invoice-2026-${String(i + 1).padStart(2, '0')}.pdf`, size: `${(i + 1) * 84} KB` }));

export default function Selection() {
  return (
    <DataTable
      aria-label="Invoices"
      data={rows}
      pageSize={0}
      selectionMode="multiple"
      bulkActions={(picked) => <Button size="small" variant="outlined" color="error">Delete {picked.length}</Button>}
      columns={[
        { key: 'file', header: 'File' },
        { key: 'size', header: 'Size', align: 'end' },
      ]}
    />
  );
}

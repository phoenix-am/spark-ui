/** Put your own filters in the `toolbar` and drive them through `filters`. Selection and row clicks report back through `onSelectionChange` and `onRowAction`. */
import { useState } from 'react';
import { DataTable, Dropdown, Badge } from '@sparkwire/core';

const rows = [
  { id: 'a', name: 'api-gateway', status: 'Live' },
  { id: 'b', name: 'payments', status: 'Live' },
  { id: 'c', name: 'search', status: 'Building' },
  { id: 'd', name: 'notifications', status: 'Failed' },
];

export default function ToolbarFiltersEvents() {
  const [filters, setFilters] = useState<Record<string, unknown>>({});
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [opened, setOpened] = useState<string>();
  return (
    <div style={{ display: 'grid', gap: 12, width: '100%' }}>
      <DataTable
        aria-label="Services"
        data={rows}
        pageSize={0}
        searchable
        selectionMode="multiple"
        filters={filters}
        onFiltersChange={setFilters}
        onSelectionChange={setSelected}
        onRowAction={(row) => setOpened(row.name)}
        toolbar={
          <Dropdown
            aria-label="Status"
            size="small"
            placeholder="Any status"
            value={(filters.status as string) ?? null}
            onChange={(v) => setFilters({ ...filters, status: v || undefined })}
            options={[{ value: '', label: 'Any status' }, { value: 'Live', label: 'Live' }, { value: 'Building', label: 'Building' }, { value: 'Failed', label: 'Failed' }]}
          />
        }
        columns={[
          { key: 'name', header: 'Service' },
          { key: 'status', header: 'Status', filter: (value, wanted) => !wanted || value === wanted, cell: (r) => <Badge variant="soft">{r.status}</Badge> },
        ]}
      />
      <output style={{ fontSize: 13, color: 'var(--spark-text-secondary)' }}>
        {selected.size} selected{opened ? ` · last opened: ${opened}` : ''}
      </output>
    </div>
  );
}

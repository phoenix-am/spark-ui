import React, { useEffect, useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { fn } from '@storybook/test';
import { DataTable, DataTableColumn } from '.';
import { Badge } from '../Indicators';
import { Button } from '../Button';
import { Dropdown } from '../Dropdown';

interface Deploy { id: string; service: string; owner: string; region: string; status: 'Live' | 'Building' | 'Failed'; instances: number; cost: number; updated: Date }
const services = ['checkout', 'search', 'auth', 'payments', 'catalog', 'notifications', 'gateway', 'reports'];
const owners = ['Asha Patel', 'Rohan Mehta', 'Meera Joshi', 'Kabir Shah', 'Zoë Martin'];
const regions = ['Mumbai', 'Singapore', 'Frankfurt', 'Virginia'];
const statuses: Deploy['status'][] = ['Live', 'Live', 'Live', 'Building', 'Failed'];
const data: Deploy[] = Array.from({ length: 37 }, (_, i) => ({
  id: `d${i + 1}`,
  service: `${services[i % services.length]}-${Math.floor(i / services.length) + 1}`,
  owner: owners[(i * 7) % owners.length],
  region: regions[(i * 3) % regions.length],
  status: statuses[(i * 3) % statuses.length],
  instances: ((i * 13) % 12) + 1,
  cost: Math.round((((i * 37) % 90) + 10) * 101.5),
  updated: new Date(2026, 10, 21 - (i % 20), 9 + (i % 8)),
}));

const tone = { Live: 'success', Building: 'warning', Failed: 'error' } as const;
const columns: DataTableColumn<Deploy>[] = [
  { key: 'service', header: 'Service', sortable: true },
  { key: 'owner', header: 'Owner', sortable: true },
  { key: 'region', header: 'Region', sortable: true },
  { key: 'status', header: 'Status', sortable: true, width: 130, cell: (row) => <Badge tone={tone[row.status]} variant="soft">{row.status}</Badge> },
  { key: 'instances', header: 'Instances', sortable: true, width: 140 },
  { key: 'cost', header: 'Monthly cost', sortable: true, width: 170, cell: (row) => `₹${row.cost.toLocaleString('en-IN')}` },
  { key: 'updated', header: 'Updated', sortable: true, width: 140 },
];

/**
 * Sort (Shift+click for more columns), search, filter, page and select.
 * Built from divs on a CSS grid like MUI's Data Grid, with Spark UI's own
 * table logic (`useDataTable`) and React Aria for keyboard and screen
 * readers. Narrow containers turn rows into labelled cards.
 */
const meta: Meta<typeof DataTable<Deploy>> = {
  title: 'Data display/DataTable',
  component: DataTable,
  args: { 'aria-label': 'Deployments', data, columns, searchable: true, defaultSort: [{ column: 'updated', direction: 'descending' }] },
  argTypes: {
    density: { control: 'inline-radio', options: ['compact', 'normal', 'comfortable'] },
    responsive: { control: 'inline-radio', options: ['stack', 'scroll'] },
    selectionMode: { control: 'inline-radio', options: ['none', 'single', 'multiple'] },
    data: { control: false },
    columns: { control: false },
  },
};
export default meta;
type Story = StoryObj<typeof DataTable<Deploy>>;

export const Playground: Story = {};

/** Checkboxes, select-all on the page, and bulk actions for the selection. */
export const Selection: Story = {
  args: {
    selectionMode: 'multiple',
    onSelectionChange: fn(),
    bulkActions: (rows) => (
      <Button size="small" color="error" variant="outlined" onClick={() => alert(`Stop ${rows.length}`)}>
        Stop {rows.length}
      </Button>
    ),
  },
};

/** Click a row (or press Enter on it) to open it. */
export const RowAction: Story = { args: { onRowAction: fn() } };

/** A per-column filter wired to a Dropdown in the toolbar. */
export const WithFilter: Story = {
  render: function Render(args) {
    const [status, setStatus] = useState<string>('all');
    return (
      <DataTable
        {...args}
        filters={{ status: status === 'all' ? undefined : status }}
        toolbar={
          <Dropdown
            aria-label="Status"
            size="small"
            value={status}
            onChange={(v) => setStatus(String(v))}
            options={[{ value: 'all', label: 'All statuses' }, { value: 'Live', label: 'Live' }, { value: 'Building', label: 'Building' }, { value: 'Failed', label: 'Failed' }]}
          />
        }
      />
    );
  },
};

export const CompactStriped: Story = { args: { density: 'compact', striped: true, pageSize: 0, maxHeight: 360, searchable: false } };

/** In a narrow container (here 380px) rows become labelled cards. */
export const NarrowContainer: Story = {
  args: { selectionMode: 'multiple' },
  decorators: [(S) => <div style={{ maxWidth: 380 }}><S /></div>],
};

/** `responsive="scroll"` keeps the grid and scrolls sideways instead. */
export const ScrollOnNarrow: Story = {
  args: { responsive: 'scroll' },
  decorators: [(S) => <div style={{ maxWidth: 380 }}><S /></div>],
};

export const Loading: Story = { args: { data: [], loading: true } };
export const Empty: Story = { args: { data: [], emptyState: 'No deployments yet' } };

/** Server-side: `manual` mode. You sort, filter and page; the table shows state and reports changes. */
export const ServerSide: Story = {
  render: function Render(args) {
    const [query, setQuery] = useState({ page: 0, pageSize: 10, search: '', sort: [] as { column: string; direction: 'ascending' | 'descending' }[] });
    const [result, setResult] = useState({ rows: [] as Deploy[], total: 0, loading: true });
    useEffect(() => {
      setResult((r) => ({ ...r, loading: true }));
      const t = setTimeout(() => {
        let rows = data.filter((d) => d.service.includes(query.search.toLowerCase()));
        const s = query.sort[0];
        if (s) rows = [...rows].sort((a, b) => String(a[s.column as keyof Deploy]).localeCompare(String(b[s.column as keyof Deploy]), undefined, { numeric: true }) * (s.direction === 'ascending' ? 1 : -1));
        setResult({ rows: rows.slice(query.page * query.pageSize, (query.page + 1) * query.pageSize), total: rows.length, loading: false });
      }, 400);
      return () => clearTimeout(t);
    }, [query]);
    return (
      <DataTable
        {...args}
        manual
        data={result.rows}
        rowCount={result.total}
        loading={result.loading}
        page={query.page}
        onPageChange={(page) => setQuery((q) => ({ ...q, page }))}
        pageSize={query.pageSize}
        onPageSizeChange={(pageSize) => setQuery((q) => ({ ...q, pageSize, page: 0 }))}
        search={query.search}
        onSearchChange={(search) => setQuery((q) => ({ ...q, search, page: 0 }))}
        sort={query.sort}
        onSortChange={(sort) => setQuery((q) => ({ ...q, sort, page: 0 }))}
      />
    );
  },
};

/** 10,000 rows, rendering only the ones in view. Arrow keys scroll focus into view. */
const many: Deploy[] = Array.from({ length: 10000 }, (_, i) => ({ ...data[i % data.length], id: `v${i + 1}`, service: `${services[i % services.length]}-${i + 1}` }));
export const Virtualized: Story = {
  args: { data: many, virtualize: true, maxHeight: 420, searchable: true, selectionMode: 'multiple', defaultSort: [] },
};

/** Drag a column edge (or Tab to it and use the arrow keys). Service stays pinned at the start, cost at the end. */
export const ResizeAndPin: Story = {
  args: {
    resizableColumns: true,
    selectionMode: 'multiple',
    responsive: 'scroll',
    columns: columns.map((c) => (c.key === 'service' ? { ...c, pin: 'start' as const, width: 180 } : c.key === 'cost' ? { ...c, pin: 'end' as const } : { ...c, width: c.width ?? 200 })),
  },
};

/** Each row opens a detail panel underneath. */
export const ExpandableRows: Story = {
  args: {
    defaultExpandedKeys: ['d1'],
    renderExpanded: (row: Deploy) => (
      <dl style={{ display: 'grid', gridTemplateColumns: 'max-content 1fr', gap: '0.25rem 1rem', margin: 0 }}>
        <dt>Owner</dt><dd style={{ margin: 0 }}>{row.owner}</dd>
        <dt>Region</dt><dd style={{ margin: 0 }}>{row.region}</dd>
        <dt>Instances</dt><dd style={{ margin: 0 }}>{row.instances}</dd>
      </dl>
    ),
  },
};

/** Double-click, Enter or F2 on Owner or Instances to edit; Enter saves, Escape cancels. */
export const InlineEditing: Story = {
  render: (args) => {
    const [rows, setRows] = useState(data);
    return (
      <DataTable
        {...args}
        data={rows}
        columns={columns.map((c) =>
          c.key === 'owner'
            ? { ...c, editable: true, validate: (v) => (String(v ?? '').trim() ? undefined : 'Owner is required') }
            : c.key === 'instances'
              ? { ...c, editable: true, validate: (v) => (typeof v === 'number' && v >= 1 && v <= 64 ? undefined : 'Between 1 and 64') }
              : c,
        )}
        onCellEdit={(row, key, value) => setRows((all) => all.map((r) => (r.id === row.id ? { ...r, [key]: value } : r)))}
      />
    );
  },
};

/** Give it rows and columns. Sorting, search, paging and keyboard navigation come along for free. */
import { DataTable, Badge } from '@sparkwire/core';

const rows = [
  { id: 1, name: 'api-gateway', owner: 'Asha Patel', status: 'Live', cost: 12400 },
  { id: 2, name: 'payments', owner: 'Rohan Shah', status: 'Live', cost: 18950 },
  { id: 3, name: 'search', owner: 'Meera Joshi', status: 'Building', cost: 6200 },
  { id: 4, name: 'notifications', owner: 'Anmol Mehta', status: 'Failed', cost: 3100 },
  { id: 5, name: 'reports', owner: 'Kabir Singh', status: 'Live', cost: 9800 },
];
const tone = { Live: 'success', Building: 'warning', Failed: 'error' } as const;

export default function Basic() {
  return (
    <DataTable
      aria-label="Services"
      data={rows}
      searchable
      pageSize={0}
      columns={[
        { key: 'name', header: 'Service', sortable: true },
        { key: 'owner', header: 'Owner', sortable: true },
        { key: 'status', header: 'Status', cell: (r) => <Badge tone={tone[r.status as keyof typeof tone]} variant="soft" led>{r.status}</Badge> },
        { key: 'cost', header: 'Monthly cost', sortable: true, cell: (r) => `₹${r.cost.toLocaleString('en-IN')}` },
      ]}
    />
  );
}

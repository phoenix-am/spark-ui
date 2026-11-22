/** Tuck the details under each row instead of opening another page. */
import { DataTable } from '@sparkwire/core';

const rows = [
  { id: 'a', order: '#4821', customer: 'Asha Patel', total: '₹3,240', items: 'Notebook ×2, Fountain pen' },
  { id: 'b', order: '#4822', customer: 'Rohan Shah', total: '₹890', items: 'Sticky notes ×5' },
];

export default function Expandable() {
  return (
    <DataTable
      aria-label="Orders"
      data={rows}
      pageSize={0}
      renderExpanded={(r) => <p style={{ margin: 0 }}>Items: {r.items}</p>}
      columns={[
        { key: 'order', header: 'Order' },
        { key: 'customer', header: 'Customer' },
        { key: 'total', header: 'Total', align: 'end' },
      ]}
    />
  );
}

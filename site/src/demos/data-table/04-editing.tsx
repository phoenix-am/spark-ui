/** Double-click a cell (or press Enter) to edit it. Validation runs before anything is saved. */
import { useState } from 'react';
import { DataTable } from '@sparkwire/core';

export default function Editing() {
  const [rows, setRows] = useState([
    { id: 1, item: 'Standing desk', qty: 2, price: 24000 },
    { id: 2, item: 'Monitor arm', qty: 4, price: 3500 },
    { id: 3, item: 'Desk lamp', qty: 6, price: 1800 },
  ]);
  return (
    <DataTable
      aria-label="Order"
      data={rows}
      pageSize={0}
      onCellEdit={(row, key, value) => setRows((all) => all.map((r) => (r.id === row.id ? { ...r, [key]: value } : r)))}
      columns={[
        { key: 'item', header: 'Item', editable: true },
        { key: 'qty', header: 'Qty', editable: true, validate: (v) => (typeof v === 'number' && v > 0 ? undefined : 'At least 1') },
        { key: 'price', header: 'Price', cell: (r) => `₹${r.price.toLocaleString('en-IN')}` },
      ]}
    />
  );
}

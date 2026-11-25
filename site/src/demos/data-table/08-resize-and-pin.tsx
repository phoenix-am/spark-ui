/** Drag a column edge to resize it (or Tab to the handle and use the arrow keys). Pinned columns stay put while the grid scrolls sideways. */
import { DataTable } from '@sparkwire/core';

const rows = Array.from({ length: 5 }, (_, i) => ({ id: i, sku: `SKU-${1000 + i}`, name: ['Desk', 'Chair', 'Lamp', 'Shelf', 'Rug'][i], warehouse: 'Ahmedabad', supplier: 'Acme Furnishings', stock: 12 * (i + 1), price: 2400 + i * 900 }));

export default function ResizeAndPin() {
  return (
    <DataTable
      aria-label="Inventory"
      data={rows}
      pageSize={0}
      responsive="scroll"
      resizableColumns
      onColumnResize={(key, width) => console.log(key, width)}
      columns={[
        { key: 'sku', header: 'SKU', pin: 'start', width: 120 },
        { key: 'name', header: 'Item', width: 160 },
        { key: 'warehouse', header: 'Warehouse', width: 180 },
        { key: 'supplier', header: 'Supplier', width: 220 },
        { key: 'stock', header: 'Stock', width: 120 },
        { key: 'price', header: 'Price', pin: 'end', width: 120, cell: (r) => `₹${r.price.toLocaleString('en-IN')}` },
      ]}
    />
  );
}

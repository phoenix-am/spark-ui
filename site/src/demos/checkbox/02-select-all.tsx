/** The indeterminate state means “some, but not all”. Perfect for a select-all box above a list. */
import { useState } from 'react';
import { Checkbox } from '@sparkwire/core';

const items = ['Invoices', 'Receipts', 'Contracts'];

export default function SelectAll() {
  const [picked, setPicked] = useState(['Invoices']);
  const all = picked.length === items.length;
  return (
    <div style={{ display: 'grid', gap: 8 }}>
      <Checkbox
        label="All documents"
        checked={all}
        indeterminate={picked.length > 0 && !all}
        onChange={() => setPicked(all ? [] : items)}
      />
      <div style={{ display: 'grid', gap: 8, paddingInlineStart: 28 }}>
        {items.map((item) => (
          <Checkbox
            key={item}
            label={item}
            checked={picked.includes(item)}
            onChange={() => setPicked((p) => (p.includes(item) ? p.filter((x) => x !== item) : [...p, item]))}
          />
        ))}
      </div>
    </div>
  );
}

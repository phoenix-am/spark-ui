/** Fetch results as people type with `onSearchChange`, show `loading`, and handle the picked item in `onSelect`. */
import { useEffect, useState } from 'react';
import { CommandPalette, Button, type Command } from '@sparkwire/core';

const DOCS = ['Getting started', 'Theming', 'DataTable', 'DatePicker', 'Accessibility', 'Tailwind'];

export default function Async() {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [items, setItems] = useState<Command[]>([]);
  const [loading, setLoading] = useState(false);
  const [last, setLast] = useState<string>();
  useEffect(() => {
    setLoading(true);
    const t = setTimeout(() => {
      setItems(DOCS.filter((d) => d.toLowerCase().includes(query.toLowerCase())).map((d) => ({ id: d, label: d })));
      setLoading(false);
    }, 300);
    return () => clearTimeout(t);
  }, [query]);
  return (
    <div style={{ display: 'grid', gap: 12, justifyItems: 'center' }}>
      <Button variant="outlined" onClick={() => setOpen(true)}>Search the docs</Button>
      <output style={{ fontSize: 13, color: 'var(--spark-text-secondary)' }}>{last ? `Opened: ${last}` : 'Nothing picked yet'}</output>
      <CommandPalette
        open={open}
        onOpenChange={setOpen}
        hotkey={false}
        filter={false}
        placeholder="Search pages…"
        loading={loading}
        onSearchChange={setQuery}
        onSelect={(cmd) => setLast(cmd.label)}
        items={[{ heading: 'Pages', items }]}
      />
    </div>
  );
}

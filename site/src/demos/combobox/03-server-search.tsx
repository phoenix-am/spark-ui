/** Search on your server: turn off the built-in `filter`, react to `onInputChange`, and show `loading` while results arrive. */
import { useEffect, useState } from 'react';
import { Combobox } from '@sparkwire/core';

const PEOPLE = ['Anmol Mehta', 'Asha Patel', 'Rohan Shah', 'Meera Joshi', 'Kabir Singh', 'Zoë Martin', 'Ishaan Rao', 'Priya Nair'];
// Stand-in for an API call.
const search = (q: string) => new Promise<string[]>((r) => setTimeout(() => r(PEOPLE.filter((p) => p.toLowerCase().includes(q.toLowerCase()))), 400));

export default function ServerSearch() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [picked, setPicked] = useState<string | null>(null);
  useEffect(() => {
    if (!query) return setResults([]);
    setLoading(true);
    let live = true;
    search(query).then((r) => live && (setResults(r), setLoading(false)));
    return () => {
      live = false;
    };
  }, [query]);
  return (
    <div style={{ display: 'grid', gap: 12, width: '100%', maxWidth: 300 }}>
      <Combobox
        label="Reviewer"
        filter={false}
        inputValue={query}
        onInputChange={setQuery}
        loading={loading}
        value={picked}
        onChange={setPicked}
        options={results.map((p) => ({ value: p, label: p }))}
        emptyState={query ? 'Nobody by that name' : 'Start typing a name'}
      />
      <output style={{ fontSize: 13, color: 'var(--spark-text-secondary)' }}>Picked: {picked ?? 'nobody yet'}</output>
    </div>
  );
}

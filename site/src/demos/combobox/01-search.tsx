/** When the list is long, let people type. Matching ignores case and accents, so “zoe” finds “Zoë”. */
import { Combobox } from '@sparkwire/core';

const cities = ['Ahmedabad', 'Amreli', 'Bengaluru', 'Chennai', 'Delhi', 'Hyderabad', 'Kolkata', 'Mumbai', 'Pune', 'Surat'];

export default function Search() {
  return (
    <div style={{ width: '100%', maxWidth: 300 }}>
      <Combobox label="City" placeholder="Start typing…" options={cities.map((c) => ({ value: c, label: c }))} />
    </div>
  );
}

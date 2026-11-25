/** Tighten or loosen rows with `density`, shade alternate rows with `striped`, and show placeholders while data loads. */
import { useState } from 'react';
import { DataTable, ToggleGroup, ToggleGroupItem, Switch } from '@sparkwire/core';

const rows = [
  { id: 1, city: 'Mumbai', population: 12_478_447 },
  { id: 2, city: 'Delhi', population: 11_034_555 },
  { id: 3, city: 'Bengaluru', population: 8_443_675 },
  { id: 4, city: 'Ahmedabad', population: 5_577_940 },
];

export default function DensityAndLoading() {
  const [density, setDensity] = useState<'compact' | 'normal' | 'comfortable'>('normal');
  const [loading, setLoading] = useState(false);
  return (
    <div style={{ display: 'grid', gap: 12, width: '100%' }}>
      <div style={{ display: 'flex', gap: 16, alignItems: 'center', flexWrap: 'wrap' }}>
        <ToggleGroup aria-label="Density" size="small" value={density} onChange={(v) => v && setDensity(v as typeof density)}>
          <ToggleGroupItem value="compact">Compact</ToggleGroupItem>
          <ToggleGroupItem value="normal">Normal</ToggleGroupItem>
          <ToggleGroupItem value="comfortable">Comfortable</ToggleGroupItem>
        </ToggleGroup>
        <Switch size="small" label="Loading" checked={loading} onChange={setLoading} />
      </div>
      <DataTable
        aria-label="Cities"
        data={loading ? [] : rows}
        loading={loading}
        density={density}
        striped
        pageSize={0}
        columns={[
          { key: 'city', header: 'City', sortable: true },
          { key: 'population', header: 'Population', sortable: true },
        ]}
      />
    </div>
  );
}

/** Format values with Intl (`valueFormat`) and shorten x labels (`formatX`). Tooltips and the data table use the same formatting. */
import { LineChart } from '@sparkwire/core';

const data = [
  { date: '2026-01-01', revenue: 182000 },
  { date: '2026-02-01', revenue: 214000 },
  { date: '2026-03-01', revenue: 241000 },
  { date: '2026-04-01', revenue: 229000 },
  { date: '2026-05-01', revenue: 276000 },
];

export default function Formatting() {
  return (
    <div style={{ width: '100%', maxWidth: 640 }}>
      <LineChart
        title="Revenue"
        data={data}
        x="date"
        area
        zeroBaseline
        series={[{ key: 'revenue', label: 'Revenue' }]}
        valueFormat={{ style: 'currency', currency: 'INR', notation: 'compact' }}
        formatX={(v) => new Date(String(v)).toLocaleDateString('en-IN', { month: 'short' })}
      />
    </div>
  );
}

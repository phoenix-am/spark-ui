/** Bars for comparing amounts. Stack them to show how the parts add up. */
import { BarChart } from '@sparkwire/core';

const data = [
  { quarter: 'Q1', web: 32, mobile: 18, api: 9 },
  { quarter: 'Q2', web: 38, mobile: 24, api: 12 },
  { quarter: 'Q3', web: 41, mobile: 31, api: 15 },
  { quarter: 'Q4', web: 47, mobile: 36, api: 21 },
];

export default function Bar() {
  return (
    <div style={{ width: '100%', maxWidth: 640 }}>
      <BarChart
        title="Revenue by channel (₹ lakh)"
        data={data}
        x="quarter"
        stacked
        series={[{ key: 'web', label: 'Web' }, { key: 'mobile', label: 'Mobile' }, { key: 'api', label: 'API' }]}
      />
    </div>
  );
}

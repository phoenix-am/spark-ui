/** Percentages, currencies or units through `valueFormat`. */
import { BarChart } from '@sparkwire/core';

const data = [
  { browser: 'Chrome', share: 0.64 },
  { browser: 'Safari', share: 0.19 },
  { browser: 'Edge', share: 0.05 },
  { browser: 'Firefox', share: 0.03 },
];

export default function Formatting() {
  return (
    <div style={{ width: '100%', maxWidth: 560 }}>
      <BarChart title="Browser share" data={data} x="browser" series={[{ key: 'share', label: 'Share' }]} valueFormat={{ style: 'percent' }} />
    </div>
  );
}

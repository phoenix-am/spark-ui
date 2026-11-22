/** Lines for trends over time. Hover or focus the chart and use the arrow keys to read exact values. */
import { LineChart } from '@sparkwire/core';

const data = [
  { month: 'Jan', signups: 420, churn: 40 },
  { month: 'Feb', signups: 510, churn: 46 },
  { month: 'Mar', signups: 690, churn: 38 },
  { month: 'Apr', signups: 640, churn: 52 },
  { month: 'May', signups: 820, churn: 44 },
  { month: 'Jun', signups: 980, churn: 41 },
];

export default function Line() {
  return (
    <div style={{ width: '100%', maxWidth: 640 }}>
      <LineChart title="Signups vs churn" data={data} x="month" series={[{ key: 'signups', label: 'Signups' }, { key: 'churn', label: 'Churned' }]} />
    </div>
  );
}

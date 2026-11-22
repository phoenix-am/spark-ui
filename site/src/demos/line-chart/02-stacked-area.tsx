/** Stack the series to show how a total is made up as it changes. */
import { LineChart } from '@sparkwire/core';

const data = [
  { day: 'Mon', direct: 320, search: 540, social: 210 },
  { day: 'Tue', direct: 360, search: 610, social: 260 },
  { day: 'Wed', direct: 340, search: 590, social: 300 },
  { day: 'Thu', direct: 410, search: 680, social: 280 },
  { day: 'Fri', direct: 450, search: 720, social: 340 },
];

export default function StackedArea() {
  return (
    <div style={{ width: '100%', maxWidth: 640 }}>
      <LineChart
        title="Visitors by source"
        data={data}
        x="day"
        stacked
        series={[{ key: 'direct', label: 'Direct' }, { key: 'search', label: 'Search' }, { key: 'social', label: 'Social' }]}
      />
    </div>
  );
}

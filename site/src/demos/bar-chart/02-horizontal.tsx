/** Horizontal bars give long labels room to breathe. */
import { BarChart } from '@sparkwire/core';

const data = [
  { page: 'Getting started', views: 4820 },
  { page: 'DataTable', views: 3910 },
  { page: 'Theming', views: 2640 },
  { page: 'DatePicker', views: 2210 },
];

export default function Horizontal() {
  return (
    <div style={{ width: '100%', maxWidth: 560 }}>
      <BarChart title="Most visited pages" data={data} x="page" horizontal series={[{ key: 'views', label: 'Views' }]} />
    </div>
  );
}

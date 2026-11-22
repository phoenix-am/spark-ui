import { BarChart } from '@sparkwire/core';
import type { PlaygroundConfig } from '../../lib/demos';

export default {
  component: BarChart,
  props: { title: 'Tickets by team', stacked: false, horizontal: false, height: 260 },
  fixed: {
    x: 'team',
    data: [
      { team: 'Web', open: 12, closed: 31 },
      { team: 'Mobile', open: 8, closed: 22 },
      { team: 'API', open: 5, closed: 17 },
      { team: 'Infra', open: 9, closed: 14 },
    ],
    series: [
      { key: 'open', label: 'Open' },
      { key: 'closed', label: 'Closed' },
    ],
  },
  hide: ['tableView', 'description'],
  wrap: (n) => <div style={{ width: '100%', maxWidth: 560 }}>{n}</div>,
} satisfies PlaygroundConfig;

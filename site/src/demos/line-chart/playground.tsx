import { LineChart } from '@sparkwire/core';
import type { PlaygroundConfig } from '../../lib/demos';

export default {
  component: LineChart,
  props: { title: 'Active users', area: false, curved: true, showPoints: false, height: 260 },
  fixed: {
    x: 'week',
    data: [
      { week: 'W1', web: 1200, mobile: 800 },
      { week: 'W2', web: 1420, mobile: 940 },
      { week: 'W3', web: 1380, mobile: 1100 },
      { week: 'W4', web: 1610, mobile: 1290 },
      { week: 'W5', web: 1780, mobile: 1350 },
    ],
    series: [
      { key: 'web', label: 'Web' },
      { key: 'mobile', label: 'Mobile' },
    ],
  },
  hide: ['tableView', 'description'],
  wrap: (n) => <div style={{ width: '100%', maxWidth: 560 }}>{n}</div>,
} satisfies PlaygroundConfig;

import { DonutChart } from '@sparkwire/core';
import type { PlaygroundConfig } from '../../lib/demos';

export default {
  component: DonutChart,
  props: { title: 'Budget', centerLabel: '₹12L', centerCaption: 'this quarter', size: 200, thickness: 28 },
  fixed: { data: [{ label: 'Salaries', value: 7.2 }, { label: 'Cloud', value: 2.6 }, { label: 'Marketing', value: 1.4 }, { label: 'Other', value: 0.8 }] },
} satisfies PlaygroundConfig;

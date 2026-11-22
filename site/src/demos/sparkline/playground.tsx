import { Sparkline } from '@sparkwire/core';
import type { PlaygroundConfig } from '../../lib/demos';

export default {
  component: Sparkline,
  props: { 'aria-label': 'Sales this month, rising', area: true, showLast: true, width: 180, height: 48 },
  fixed: { data: [4, 6, 5, 9, 8, 12, 11, 15, 14, 18] },
  hide: ['color'],
} satisfies PlaygroundConfig;

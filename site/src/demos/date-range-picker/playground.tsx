import { DateRangePicker } from '@sparkwire/core';
import type { PlaygroundConfig } from '../../lib/demos';

export default {
  component: DateRangePicker,
  props: { label: 'Stay', clearable: true, visibleMonths: 2 },
  fixed: { presets: ['thisWeek', 'thisMonth', '+7d'] },
  hide: ['locale', 'calendar', 'startName', 'endName'],
  wrap: (n) => <div style={{ width: 360 }}>{n}</div>,
} satisfies PlaygroundConfig;

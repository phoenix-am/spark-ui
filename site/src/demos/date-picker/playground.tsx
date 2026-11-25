import { DatePicker } from '@sparkwire/core';
import type { PlaygroundConfig } from '../../lib/demos';

export default {
  component: DatePicker,
  props: { label: 'Due date', clearable: true },
  fixed: { presets: ['today', 'tomorrow', '+1w'] },
  hide: ['locale', 'calendar'],
  wrap: (n) => <div style={{ width: '100%', maxWidth: 300 }}>{n}</div>,
} satisfies PlaygroundConfig;

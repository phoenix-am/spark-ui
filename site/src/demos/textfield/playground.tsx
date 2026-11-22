import { Textfield } from '@sparkwire/core';
import type { PlaygroundConfig } from '../../lib/demos';

export default {
  component: Textfield,
  props: { label: 'Work email', placeholder: 'you@company.com', helperText: "We'll never share it." },
  hide: ['type', 'isCurrency'],
  wrap: (n) => <div style={{ width: 340 }}>{n}</div>,
} satisfies PlaygroundConfig;

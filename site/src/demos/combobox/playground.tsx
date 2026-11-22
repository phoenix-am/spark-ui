import { Combobox } from '@sparkwire/core';
import type { PlaygroundConfig } from '../../lib/demos';

export default {
  component: Combobox,
  props: { label: 'Assignee', placeholder: 'Search people', clearable: true },
  fixed: { options: ['Anmol Mehta', 'Asha Patel', 'Rohan Shah', 'Meera Joshi', 'Kabir Singh', 'Zoë Martin'].map((n) => ({ value: n, label: n })) },
  wrap: (n) => <div style={{ width: 300 }}>{n}</div>,
} satisfies PlaygroundConfig;

import { Dropdown } from '@sparkwire/core';
import type { PlaygroundConfig } from '../../lib/demos';

export default {
  component: Dropdown,
  props: { label: 'Framework', placeholder: 'Pick one', size: 'medium' },
  fixed: { options: [{ value: 'react', label: 'React' }, { value: 'vue', label: 'Vue' }, { value: 'svelte', label: 'Svelte' }, { value: 'solid', label: 'Solid' }] },
  wrap: (n) => <div style={{ width: 300 }}>{n}</div>,
} satisfies PlaygroundConfig;

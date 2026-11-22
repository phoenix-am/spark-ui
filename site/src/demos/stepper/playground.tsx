import { Stepper } from '@sparkwire/core';
import type { PlaygroundConfig } from '../../lib/demos';

export default {
  component: Stepper,
  props: { active: 1, orientation: 'horizontal' },
  fixed: { steps: [{ label: 'Account' }, { label: 'Workspace', description: 'Name and URL' }, { label: 'Invite team' }, { label: 'Done' }] },
  hide: ['clickable'],
  wrap: (n) => <div style={{ width: '100%', maxWidth: 600 }}>{n}</div>,
} satisfies PlaygroundConfig;

import { Alert } from '@sparkwire/core';
import type { PlaygroundConfig } from '../../lib/demos';

export default {
  component: Alert,
  props: { tone: 'info', variant: 'soft', title: 'New version available', children: 'Reload to get the latest fixes.' },
  hide: ['live'],
  wrap: (n) => <div style={{ width: '100%', maxWidth: 520 }}>{n}</div>,
} satisfies PlaygroundConfig;

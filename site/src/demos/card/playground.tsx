import { Card } from '@sparkwire/core';
import type { PlaygroundConfig } from '../../lib/demos';

export default {
  component: Card,
  props: { padding: 'large', interactive: false, live: false },
  fixed: { children: <><strong>Weekly digest</strong><p style={{ margin: '8px 0 0', opacity: 0.75 }}>Every Monday, the five things your team shipped.</p></> },
  hide: ['as'],
  wrap: (n) => <div style={{ width: '100%', maxWidth: 340 }}>{n}</div>,
} satisfies PlaygroundConfig;

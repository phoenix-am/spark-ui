import { Skeleton } from '@sparkwire/core';
import type { PlaygroundConfig } from '../../lib/demos';

export default { component: Skeleton, props: { shape: 'text', lines: 3 }, wrap: (n) => <div style={{ width: '100%', maxWidth: 320 }}>{n}</div> } satisfies PlaygroundConfig;

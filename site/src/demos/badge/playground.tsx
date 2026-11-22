import { Badge } from '@sparkwire/core';
import type { PlaygroundConfig } from '../../lib/demos';

export default { component: Badge, props: { children: 'Live', tone: 'success', variant: 'soft', led: true } } satisfies PlaygroundConfig;

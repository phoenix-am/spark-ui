import { Progress } from '@sparkwire/core';
import type { PlaygroundConfig } from '../../lib/demos';

export default { component: Progress, props: { label: 'Uploading', value: 64, showValue: true, size: 'medium' }, wrap: (n) => <div style={{ width: 320 }}>{n}</div> } satisfies PlaygroundConfig;

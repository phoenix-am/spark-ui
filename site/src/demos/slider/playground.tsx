import { Slider } from '@sparkwire/core';
import type { PlaygroundConfig } from '../../lib/demos';

export default { component: Slider, props: { label: 'Volume', defaultValue: 40 }, wrap: (n) => <div style={{ width: '100%', maxWidth: 320 }}>{n}</div> } satisfies PlaygroundConfig;

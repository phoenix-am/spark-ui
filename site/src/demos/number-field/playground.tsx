import { NumberField } from '@sparkwire/core';
import type { PlaygroundConfig } from '../../lib/demos';

export default { component: NumberField, props: { label: 'Seats', min: 1, max: 100 }, fixed: { defaultValue: 5 }, wrap: (n) => <div style={{ width: '100%', maxWidth: 240 }}>{n}</div> } satisfies PlaygroundConfig;

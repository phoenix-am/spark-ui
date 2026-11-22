import { TimePicker } from '@sparkwire/core';
import type { PlaygroundConfig } from '../../lib/demos';

export default { component: TimePicker, props: { label: 'Meeting time', step: 15 }, fixed: { defaultValue: '10:30' }, wrap: (n) => <div style={{ width: 240 }}>{n}</div> } satisfies PlaygroundConfig;

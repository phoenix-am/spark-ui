import { Textarea } from '@sparkwire/core';
import type { PlaygroundConfig } from '../../lib/demos';

export default { component: Textarea, props: { label: 'Feedback', placeholder: 'What could we do better?', autoResize: true, showCount: true }, fixed: { maxLength: 280 }, wrap: (n) => <div style={{ width: '100%', maxWidth: 380 }}>{n}</div> } satisfies PlaygroundConfig;

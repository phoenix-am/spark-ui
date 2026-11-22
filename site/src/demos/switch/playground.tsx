import { Switch } from '@sparkwire/core';
import type { PlaygroundConfig } from '../../lib/demos';

export default { component: Switch, props: { label: 'Dark mode', defaultChecked: true } } satisfies PlaygroundConfig;

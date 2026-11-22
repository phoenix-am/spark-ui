import { RadioGroup } from '@sparkwire/core';
import type { PlaygroundConfig } from '../../lib/demos';

export default {
  component: RadioGroup,
  props: { label: 'Plan', variant: 'cards' },
  fixed: {
    defaultValue: 'pro',
    options: [
      { value: 'hobby', label: 'Hobby', description: 'For side projects' },
      { value: 'pro', label: 'Pro', description: 'For growing teams' },
      { value: 'enterprise', label: 'Enterprise', description: 'SSO, audit logs, SLAs' },
    ],
  },
} satisfies PlaygroundConfig;

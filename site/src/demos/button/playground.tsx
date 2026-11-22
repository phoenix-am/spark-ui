import { Button } from '@sparkwire/core';
import type { PlaygroundConfig } from '../../lib/demos';

export default {
  component: Button,
  props: { children: 'Deploy to production', variant: 'contained', color: 'brand', size: 'medium' },
} satisfies PlaygroundConfig;

import { Tooltip, Button } from '@sparkwire/core';
import type { PlaygroundConfig } from '../../lib/demos';

export default {
  component: Tooltip,
  props: { title: 'Copies the link to your clipboard', placement: 'top' },
  fixed: { children: <Button variant="outlined">Share</Button> },
} satisfies PlaygroundConfig;

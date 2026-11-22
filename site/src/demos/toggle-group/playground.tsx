import { ToggleGroup, ToggleGroupItem } from '@sparkwire/core';
import type { PlaygroundConfig } from '../../lib/demos';

export default {
  component: ToggleGroup,
  props: { variant: 'segmented', size: 'medium' },
  fixed: {
    'aria-label': 'View',
    defaultValue: 'board',
    children: [
      <ToggleGroupItem key="list" value="list">List</ToggleGroupItem>,
      <ToggleGroupItem key="board" value="board">Board</ToggleGroupItem>,
      <ToggleGroupItem key="calendar" value="calendar">Calendar</ToggleGroupItem>,
    ],
  },
  hide: ['selectionMode'],
} satisfies PlaygroundConfig;

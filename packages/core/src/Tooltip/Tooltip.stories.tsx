import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { ThemeProvider } from '@spark-ui/system';
import { Tooltip } from './Tooltip';
import { Button } from '../Button';

const meta: Meta<typeof Tooltip> = { component: Tooltip, title: 'Spark UI/Tooltip' };
export default meta;

export const Placements: StoryObj<typeof Tooltip> = {
  render: () => (
    <ThemeProvider>
      <div style={{ display: 'flex', gap: 24, padding: 60 }}>
        {(['top', 'bottom', 'left', 'right'] as const).map((p) => (
          <Tooltip key={p} title={`Tooltip on ${p}`} placement={p}>
            <Button variant="outlined">{p}</Button>
          </Tooltip>
        ))}
      </div>
    </ThemeProvider>
  ),
};

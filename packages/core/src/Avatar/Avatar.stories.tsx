import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { ThemeProvider } from '@spark-ui/system';
import { Avatar, AvatarGroup } from './Avatar';

const meta: Meta = { title: 'Spark UI/Avatar' };
export default meta;

export const Statuses: StoryObj = {
  render: () => (
    <ThemeProvider>
      <div style={{ display: 'flex', gap: 16, alignItems: 'center' }}>
        <Avatar name="Asha Patel" status="online" size="large" />
        <Avatar name="Rohan Mehta" status="busy" />
        <Avatar name="Meera Joshi" status="away" />
        <Avatar name="Dev Shah" status="offline" size="small" />
      </div>
    </ThemeProvider>
  ),
};

export const Group: StoryObj = {
  render: () => (
    <ThemeProvider>
      <AvatarGroup
        max={3}
        people={[{ name: 'Asha Patel' }, { name: 'Rohan Mehta' }, { name: 'Meera Joshi' }, { name: 'Dev Shah' }, { name: 'Kiran Rao' }]}
      />
    </ThemeProvider>
  ),
};

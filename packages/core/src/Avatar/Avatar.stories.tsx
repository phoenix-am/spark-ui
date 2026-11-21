import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { Avatar, AvatarGroup } from '.';

/** A photo or initials, with a status LED. An online user's LED pulses. */
const meta: Meta<typeof Avatar> = {
  title: 'Data display/Avatar',
  component: Avatar,
  args: { name: 'Asha Patel', size: 'large', status: 'online' },
  argTypes: {
    size: { control: 'inline-radio', options: ['small', 'medium', 'large', 'xlarge'] },
    status: { control: 'inline-radio', options: [undefined, 'online', 'busy', 'away', 'offline'] },
  },
};
export default meta;
type Story = StoryObj<typeof Avatar>;

export const Playground: Story = {};
export const Statuses: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: 16, alignItems: 'center' }}>
      <Avatar name="Asha Patel" status="online" size="large" />
      <Avatar name="Rohan Mehta" status="busy" size="large" />
      <Avatar name="Meera Joshi" status="away" size="large" />
      <Avatar name="Dev Shah" status="offline" size="large" />
    </div>
  ),
};
export const Sizes: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: 16, alignItems: 'center' }}>
      {(['small', 'medium', 'large', 'xlarge'] as const).map((s) => (
        <Avatar key={s} name="Kiran Rao" size={s} status="online" />
      ))}
    </div>
  ),
};
export const BrokenImageFallsBackToInitials: Story = { args: { src: 'https://invalid.example/missing.png', name: 'Rohan Mehta' } };
export const Group: Story = {
  render: () => (
    <AvatarGroup
      max={3}
      people={[{ name: 'Asha Patel' }, { name: 'Rohan Mehta' }, { name: 'Meera Joshi' }, { name: 'Dev Shah' }, { name: 'Kiran Rao' }]}
    />
  ),
};

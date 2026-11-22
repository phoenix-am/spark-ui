import React, { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { fn } from '@storybook/test';
import { File, Folder, Home, Settings, User, Users, Mail, Star, Archive } from '@sparkwire/icons';
import { Sidebar, SidebarProps } from '.';
import { Avatar } from '../Avatar';
import { Button } from '../Button';

const items: SidebarProps['items'] = [
  { id: 'home', label: 'Home', icon: <Home />, href: '#home' },
  { id: 'inbox', label: 'Inbox', icon: <Mail />, badge: 4 },
  { heading: 'Workspace', items: [
    { id: 'projects', label: 'Projects', icon: <Folder />, items: [
      { id: 'p-web', label: 'Website' },
      { id: 'p-app', label: 'Mobile app' },
      { id: 'p-ui', label: 'Spark UI', badge: 'New' },
    ] },
    { id: 'docs', label: 'Documents', icon: <File /> },
    { id: 'starred', label: 'Starred', icon: <Star /> },
    { id: 'archive', label: 'Archive', icon: <Archive />, disabled: true },
  ] },
  { heading: 'Team', items: [
    { id: 'members', label: 'Members', icon: <Users /> },
    { id: 'settings', label: 'Settings', icon: <Settings /> },
  ] },
];

const Logo = (collapsed: boolean) => (
  <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontWeight: 800, color: 'var(--spark-energy-ink)' }}>
    <span style={{ fontSize: 18 }}>⚡</span>{!collapsed && <span style={{ color: 'var(--spark-text-primary)' }}>Sparkwire</span>}
  </div>
);
const Me = (collapsed: boolean) => (
  <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '0 6px' }}>
    <Avatar name="Asha Patel" size="small" />
    {!collapsed && <div style={{ fontSize: 13 }}><div style={{ fontWeight: 600 }}>Asha Patel</div><div style={{ color: 'var(--spark-text-secondary)' }}>Admin</div></div>}
  </div>
);

/**
 * App navigation: items on a wire, the active one lit. Sections, nested
 * groups, badges, links, a collapsed icon-only rail (with tooltips), and a
 * drawer on small screens. A real `<nav>` with lists.
 */
const meta: Meta<typeof Sidebar> = {
  title: 'Navigation/Sidebar',
  component: Sidebar,
  args: { items, defaultValue: 'p-ui', header: Logo, footer: Me, onChange: fn() },
  argTypes: { items: { control: false }, header: { control: false }, footer: { control: false } },
  parameters: { layout: 'fullscreen' },
  decorators: [(S) => <div style={{ height: 560, display: 'flex' }}><S /><main style={{ flex: 1, padding: 24, color: 'var(--spark-text-secondary)' }}>Page content</main></div>],
};
export default meta;
type Story = StoryObj<typeof Sidebar>;

export const Playground: Story = {};
export const Collapsed: Story = { args: { defaultCollapsed: true } };

/** Below the breakpoint the sidebar becomes a drawer opened from your own menu button. */
export const Mobile: Story = {
  args: { mobileBreakpoint: 10000 },
  render: function Render(args) {
    const [open, setOpen] = useState(false);
    return (
      <>
        <Button variant="outlined" onClick={() => setOpen(true)} aria-label="Open menu">☰ Menu</Button>
        <Sidebar {...args} mobileOpen={open} onMobileOpenChange={setOpen} />
      </>
    );
  },
};

export const Simple: Story = { args: { items: [{ id: 'a', label: 'Overview', icon: <Home /> }, { id: 'b', label: 'Profile', icon: <User /> }], defaultValue: 'a', header: undefined, footer: undefined, collapsible: false } };

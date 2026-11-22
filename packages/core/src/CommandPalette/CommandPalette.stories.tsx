import React, { useEffect, useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { fn } from '@storybook/test';
import { Copy, Download, Edit, FilePlus, Home, LogOut, Mail, Moon, Search, Settings, Share, User, Users } from '@sparkwire/icons';
import { CommandPalette, Command } from '.';
import { Button } from '../Button';

const items = [
  { heading: 'Suggestions', items: [
    { id: 'new', label: 'New project', icon: <FilePlus />, shortcut: '⌘N' },
    { id: 'invite', label: 'Invite teammates', icon: <Users />, keywords: ['share', 'members'] },
    { id: 'theme', label: 'Toggle dark mode', icon: <Moon />, keywords: ['light', 'theme'], shortcut: '⌘⇧L' },
  ] },
  { heading: 'Pages', items: [
    { id: 'home', label: 'Home', icon: <Home />, href: '#home' },
    { id: 'profile', label: 'Profile', icon: <User />, description: 'Name, photo and email' },
    { id: 'settings', label: 'Settings', icon: <Settings />, keywords: ['preferences'], shortcut: '⌘,' },
  ] },
  { heading: 'Actions', items: [
    { id: 'edit', label: 'Rename file', icon: <Edit /> },
    { id: 'copy', label: 'Copy link', icon: <Copy /> },
    { id: 'share', label: 'Share by email', icon: <Mail /> },
    { id: 'export', label: 'Export as CSV', icon: <Download />, disabled: true, description: 'Upgrade to export' },
    { id: 'logout', label: 'Log out', icon: <LogOut /> },
  ] },
];

/**
 * A ⌘K launcher (Ctrl+K on Windows and Linux). Type to filter (case- and
 * accent-insensitive; keywords count too), arrows move the lit node, Enter
 * runs, Escape closes and returns focus.
 */
const meta: Meta<typeof CommandPalette> = {
  title: 'Navigation/CommandPalette',
  component: CommandPalette,
  args: { items, onSelect: fn() },
  argTypes: { items: { control: false } },
  render: function Render(args) {
    const [open, setOpen] = useState(Boolean(args.defaultOpen));
    return (
      <>
        <Button variant="outlined" startIcon={<Search />} onClick={() => setOpen(true)}>
          Search… <kbd style={{ marginInlineStart: 12, opacity: 0.7, font: 'inherit', fontSize: 12 }}>⌘K</kbd>
        </Button>
        <CommandPalette {...args} open={open} onOpenChange={setOpen} />
      </>
    );
  },
};
export default meta;
type Story = StoryObj<typeof CommandPalette>;

export const Playground: Story = {};
export const OpenByDefault: Story = { args: { defaultOpen: true } };

/** Results from a (pretend) server: `filter={false}`, fetch in `onSearchChange`, show `loading`. */
export const AsyncResults: Story = {
  render: function Render(args) {
    const [open, setOpen] = useState(true);
    const [q, setQ] = useState('');
    const [loading, setLoading] = useState(false);
    const [results, setResults] = useState<Command[]>([]);
    useEffect(() => {
      setLoading(true);
      const t = setTimeout(() => {
        const people = ['Asha Patel', 'Rohan Mehta', 'Meera Joshi', 'Kabir Shah', 'Zoë Martin'];
        setResults(people.filter((p) => p.toLowerCase().includes(q.toLowerCase())).map((p) => ({ id: p, label: p, icon: <User />, description: 'Team member' })));
        setLoading(false);
      }, 400);
      return () => clearTimeout(t);
    }, [q]);
    return (
      <>
        <Button variant="outlined" onClick={() => setOpen(true)}>Find people</Button>
        <CommandPalette {...args} items={[{ heading: 'People', items: results }]} filter={false} loading={loading} onSearchChange={setQ} open={open} onOpenChange={setOpen} placeholder="Search people…" />
      </>
    );
  },
};

export const WithoutFooter: Story = { args: { defaultOpen: true, hideFooter: true, items: [{ id: 'share', label: 'Share', icon: <Share /> }, { id: 'copy', label: 'Copy', icon: <Copy /> }] } };

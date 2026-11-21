import React, { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { fn } from '@storybook/test';
import { Archive, Copy, Download, Edit, Link, Mail, MoreVertical, Share, Trash } from '@sparkwire/icons';
import { Menu } from '.';
import { Button } from '../Button';

/**
 * Actions behind a button. Arrow keys and typeahead move, Enter runs, Escape
 * closes and returns focus. Submenus open with the right arrow. For picking
 * a value, use Dropdown instead.
 */
const meta: Meta<typeof Menu> = {
  title: 'Navigation/Menu',
  component: Menu,
  args: {
    label: 'Actions',
    onAction: fn(),
    items: [
      { key: 'edit', label: 'Edit', icon: <Edit />, shortcut: '⌘E' },
      { key: 'duplicate', label: 'Duplicate', icon: <Copy />, shortcut: '⌘D' },
      { key: 'archive', label: 'Archive', icon: <Archive /> },
      { key: 'delete', label: 'Delete', icon: <Trash />, danger: true, shortcut: '⌫' },
    ],
  },
  argTypes: { items: { control: false }, trigger: { control: false }, placement: { control: 'select', options: ['bottom start', 'bottom end', 'top start', 'top end'] } },
  decorators: [(Story) => <div style={{ minHeight: 320 }}><Story /></div>],
};
export default meta;
type Story = StoryObj<typeof Menu>;

export const Playground: Story = {};

/** Sections with headings, descriptions and a disabled item. */
export const Sections: Story = {
  args: {
    label: 'Project',
    items: [
      { title: 'Edit', items: [
        { key: 'rename', label: 'Rename', icon: <Edit /> },
        { key: 'duplicate', label: 'Duplicate', icon: <Copy />, description: 'Copies settings, not data' },
      ] },
      { title: 'Danger zone', items: [
        { key: 'transfer', label: 'Transfer ownership', disabled: true },
        { key: 'delete', label: 'Delete project', icon: <Trash />, danger: true },
      ] },
    ],
  },
};

/** Submenus open to the side. Right arrow goes in, left arrow comes back. */
export const Submenu: Story = {
  args: {
    label: 'File',
    items: [
      { key: 'download', label: 'Download', icon: <Download /> },
      { key: 'share', label: 'Share', icon: <Share />, items: [
        { key: 'share-email', label: 'Email', icon: <Mail /> },
        { key: 'share-link', label: 'Copy link', icon: <Link /> },
      ] },
      { key: 'delete', label: 'Delete', icon: <Trash />, danger: true },
    ],
  },
};

/** Use any trigger, e.g. an icon-only "more" button. Give the menu an aria-label. */
export const CustomTrigger: Story = {
  args: {
    'aria-label': 'Row actions',
    placement: 'bottom end',
    trigger: <Button variant="text" aria-label="Row actions" spark={false}><MoreVertical /></Button>,
  },
};

/** Checkable items: `single` works like radio buttons, `multiple` like checkboxes. */
export const Checkable: Story = {
  render: function Render(args) {
    const [cols, setCols] = useState(new Set(['name', 'status']));
    return (
      <Menu
        {...args}
        label={`Columns (${cols.size})`}
        selectionMode="multiple"
        selectedKeys={cols}
        onSelectionChange={setCols}
        items={[
          { key: 'name', label: 'Name' },
          { key: 'status', label: 'Status' },
          { key: 'owner', label: 'Owner' },
          { key: 'updated', label: 'Last updated' },
        ]}
      />
    );
  },
};

export const Disabled: Story = { args: { disabled: true } };

import React, { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { Drawer, DrawerProps } from '.';
import { Button } from '../Button';
import { Switch } from '../Switch';
import { Textfield } from '../Textfield';
import { Dropdown } from '../Dropdown';

/**
 * A panel that slides in from an edge; current runs along its inner edge.
 * `start`/`end` follow reading direction. Focus is trapped and returned,
 * Escape or a backdrop click closes it.
 */
const meta: Meta<typeof Drawer> = {
  title: 'Overlays/Drawer',
  component: Drawer,
  args: { title: 'Filters', description: 'Narrow down the list.', placement: 'end', size: 'medium' },
  argTypes: {
    placement: { control: 'inline-radio', options: ['start', 'end', 'top', 'bottom'] },
    size: { control: 'inline-radio', options: ['small', 'medium', 'large', 'full'] },
    open: { control: false },
    onClose: { control: false },
  },
  render: function Render(args: DrawerProps) {
    const [open, setOpen] = useState(false);
    return (
      <>
        <Button onClick={() => setOpen(true)}>Open drawer</Button>
        <Drawer
          {...args}
          open={open}
          onClose={() => setOpen(false)}
          actions={
            <>
              <Button variant="text" onClick={() => setOpen(false)}>Cancel</Button>
              <Button onClick={() => setOpen(false)}>Apply</Button>
            </>
          }
        >
          <div style={{ display: 'grid', gap: 12 }}>
            <Textfield label="Search" placeholder="Service name" />
            <Dropdown label="Region" options={[{ value: 'in', label: 'Mumbai' }, { value: 'sg', label: 'Singapore' }]} />
            <Switch label="Only failed deploys" />
          </div>
        </Drawer>
      </>
    );
  },
};
export default meta;
type Story = StoryObj<typeof Drawer>;

export const Playground: Story = {};
export const FromStart: Story = { args: { placement: 'start', title: 'Menu', description: undefined, size: 'small' } };
/** A bottom sheet, handy on phones. */
export const BottomSheet: Story = { args: { placement: 'bottom', size: '50vh', title: 'Share' } };
export const Large: Story = { args: { size: 'large', title: 'Deployment details' } };

import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { Settings, Activity, Home } from '@sparkwire/icons';
import { Tabs, TabList, Tab, TabPanel } from '.';

/**
 * All tabs sit on one wire; the active tab is the lit segment, and it slides
 * when you switch. Arrow keys, Home and End move between tabs (mirrored in
 * right-to-left languages). Built on React Aria.
 */
const meta: Meta<typeof Tabs> = {
  title: 'Navigation/Tabs',
  component: Tabs,
  subcomponents: { TabList, Tab, TabPanel } as Record<string, React.ComponentType<unknown>>,
  args: { defaultValue: 'overview' },
  argTypes: {
    color: { control: 'inline-radio', options: ['brand', 'success', 'warning', 'error'] },
    orientation: { control: 'inline-radio', options: ['horizontal', 'vertical'] },
    activation: { control: 'inline-radio', options: ['automatic', 'manual'] },
  },
  render: (args) => (
    <Tabs {...args}>
      <TabList aria-label="Project">
        <Tab value="overview">Overview</Tab>
        <Tab value="activity">Activity</Tab>
        <Tab value="settings">Settings</Tab>
        <Tab value="billing" disabled>Billing</Tab>
      </TabList>
      <TabPanel value="overview">3 services running, all green.</TabPanel>
      <TabPanel value="activity">Deployed 12 minutes ago by Asha.</TabPanel>
      <TabPanel value="settings">Region: Mumbai (ap-south-1).</TabPanel>
    </Tabs>
  ),
};
export default meta;
type Story = StoryObj<typeof Tabs>;

export const Playground: Story = {};
export const Success: Story = { args: { color: 'success' } };
export const WithIcons: Story = {
  render: (args) => (
    <Tabs {...args}>
      <TabList aria-label="Sections">
        <Tab value="overview" icon={<Home />}>Overview</Tab>
        <Tab value="activity" icon={<Activity />}>Activity</Tab>
        <Tab value="settings" icon={<Settings />}>Settings</Tab>
      </TabList>
      <TabPanel value="overview">Overview panel</TabPanel>
      <TabPanel value="activity">Activity panel</TabPanel>
      <TabPanel value="settings">Settings panel</TabPanel>
    </Tabs>
  ),
};

/** The wire runs down the side; Up and Down move between tabs. */
export const Vertical: Story = { args: { orientation: 'vertical' } };

/** Arrow keys only move focus; Enter or Space switches. Use when a panel is slow to render. */
export const ManualActivation: Story = { args: { activation: 'manual' } };

import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { ThemeProvider } from '@spark-ui/system';
import { Tabs, TabList, Tab, TabPanel } from './Tabs';

const meta: Meta<typeof Tabs> = { component: Tabs, title: 'Spark UI/Tabs' };
export default meta;

export const Base: StoryObj<typeof Tabs> = {
  render: () => (
    <ThemeProvider>
      <Tabs defaultValue="overview">
        <TabList aria-label="Project">
          <Tab value="overview">Overview</Tab>
          <Tab value="activity">Activity</Tab>
          <Tab value="settings">Settings</Tab>
          <Tab value="billing" disabled>Billing</Tab>
        </TabList>
        <TabPanel value="overview">Overview panel</TabPanel>
        <TabPanel value="activity">Activity panel</TabPanel>
        <TabPanel value="settings">Settings panel</TabPanel>
      </Tabs>
    </ThemeProvider>
  ),
};

/** Switch between views of the same thing without leaving the page. Arrow keys move between tabs. */
import { Tabs, TabList, Tab, TabPanel } from '@sparkwire/core';

export default function Basic() {
  return (
    <div style={{ width: '100%', maxWidth: 520 }}>
      <Tabs defaultValue="overview">
        <TabList aria-label="Project">
          <Tab value="overview">Overview</Tab>
          <Tab value="deployments">Deployments</Tab>
          <Tab value="settings">Settings</Tab>
        </TabList>
        <TabPanel value="overview">Traffic is up 12% this week.</TabPanel>
        <TabPanel value="deployments">Last deploy: 14 minutes ago.</TabPanel>
        <TabPanel value="settings">Domains, environment variables and team access.</TabPanel>
      </Tabs>
    </div>
  );
}

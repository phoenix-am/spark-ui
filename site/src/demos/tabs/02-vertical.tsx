import { Tabs, TabList, Tab, TabPanel } from '@sparkwire/core';

export default function Vertical() {
  return (
    <div style={{ width: '100%', maxWidth: 520 }}>
      <Tabs defaultValue="profile" orientation="vertical">
        <TabList aria-label="Account">
          <Tab value="profile">Profile</Tab>
          <Tab value="security">Security</Tab>
          <Tab value="billing">Billing</Tab>
        </TabList>
        <TabPanel value="profile">Your name, photo and bio.</TabPanel>
        <TabPanel value="security">Passwords, passkeys and sessions.</TabPanel>
        <TabPanel value="billing">Plan, invoices and payment method.</TabPanel>
      </Tabs>
    </div>
  );
}

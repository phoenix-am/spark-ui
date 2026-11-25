/** Control the active tab, change its colour, and use `manual` activation so arrow keys move focus without switching until Enter or Space. */
import { useState } from 'react';
import { Tabs, TabList, Tab, TabPanel } from '@sparkwire/core';

export default function Controlled() {
  const [tab, setTab] = useState('open');
  return (
    <div style={{ width: '100%', maxWidth: 520 }}>
      <Tabs value={tab} onChange={setTab} color="success" activation="manual">
        <TabList aria-label="Issues">
          <Tab value="open">Open</Tab>
          <Tab value="closed">Closed</Tab>
          <Tab value="archived" disabled>Archived</Tab>
        </TabList>
        <TabPanel value="open">14 open issues.</TabPanel>
        <TabPanel value="closed">203 closed issues.</TabPanel>
        <TabPanel value="archived">Archived issues.</TabPanel>
      </Tabs>
    </div>
  );
}

/** Control the active item and the collapsed state; `footer` holds an account menu or an upgrade prompt. */
import { useState } from 'react';
import { Sidebar, Button } from '@sparkwire/core';

const dot = <span style={{ width: 8, height: 8, borderRadius: 4, background: 'currentColor', display: 'inline-block' }} />;

export default function Controlled() {
  const [page, setPage] = useState('inbox');
  const [collapsed, setCollapsed] = useState(false);
  return (
    <div style={{ height: 360, width: '100%', display: 'flex', border: '1px solid var(--spark-surface-border)', borderRadius: 12, overflow: 'hidden' }}>
      <Sidebar
        value={page}
        onChange={setPage}
        collapsible
        collapsed={collapsed}
        onCollapsedChange={setCollapsed}
        header={<strong>Mail</strong>}
        footer={<Button size="small" variant="text">Settings</Button>}
        items={[{ items: [{ id: 'inbox', label: 'Inbox', icon: dot, badge: 12 }, { id: 'sent', label: 'Sent', icon: dot }, { id: 'archive', label: 'Archive', icon: dot }] }]}
      />
      <div style={{ flex: 1, padding: 24 }}>
        Showing <strong>{page}</strong>. Sidebar is {collapsed ? 'collapsed' : 'expanded'}.
      </div>
    </div>
  );
}

/** The main navigation for an app. It collapses to icons on demand and turns into a drawer on phones. */
import { Sidebar } from '@sparkwire/core';

const dot = <span style={{ width: 8, height: 8, borderRadius: 4, background: 'currentColor', display: 'inline-block' }} />;

export default function AppNav() {
  return (
    <div style={{ height: 380, width: '100%', display: 'flex', border: '1px solid var(--spark-surface-border)', borderRadius: 12, overflow: 'hidden' }}>
      <Sidebar
        collapsible
        defaultValue="overview"
        header={<strong>Acme</strong>}
        items={[
          { heading: 'Workspace', items: [{ id: 'overview', label: 'Overview', icon: dot }, { id: 'projects', label: 'Projects', icon: dot }, { id: 'team', label: 'Team', icon: dot }] },
          { heading: 'Account', items: [{ id: 'billing', label: 'Billing', icon: dot }, { id: 'settings', label: 'Settings', icon: dot }] },
        ]}
      />
      <div style={{ flex: 1, padding: 24 }}>Your page goes here.</div>
    </div>
  );
}

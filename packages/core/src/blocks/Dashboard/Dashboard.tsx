import React, { useState } from 'react';
import { Sidebar } from '../../Sidebar';
import { Card } from '../../Card';
import { Badge } from '../../Indicators';
import { Avatar } from '../../Avatar';
import { Button } from '../../Button';
import { ToggleGroup } from '../../ToggleGroup';
import { LineChart, BarChart, Sparkline } from '../../Charts';
import { DataTable } from '../../DataTable';
import type { DataTableColumn } from '../../DataTable';

/**
 * Dashboard block: sidebar, KPI tiles with sparklines, a revenue chart, a
 * channel breakdown and a recent-orders table. Copy it with
 * `npx sparkwire add dashboard`, then replace the sample data with yours.
 */
const icon = (d: string) => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d={d} />
  </svg>
);

const months = ['Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov'];
const revenue = months.map((month, i) => ({ month, online: 18 + i * 3 + (i % 2) * 2, stores: 12 + i * 1.5 }));
const channels = [
  { channel: 'Search', orders: 1840 },
  { channel: 'Direct', orders: 1210 },
  { channel: 'Social', orders: 860 },
  { channel: 'Email', orders: 430 },
];
type Order = { id: string; customer: string; city: string; amount: number; status: 'Paid' | 'Pending' | 'Refunded' };
const orders: Order[] = [
  { id: 'ORD-2041', customer: 'Aarav Shah', city: 'Ahmedabad', amount: 4999, status: 'Paid' },
  { id: 'ORD-2040', customer: 'Diya Patel', city: 'Surat', amount: 1299, status: 'Pending' },
  { id: 'ORD-2039', customer: 'Kabir Mehta', city: 'Rajkot', amount: 8450, status: 'Paid' },
  { id: 'ORD-2038', customer: 'Ananya Iyer', city: 'Chennai', amount: 2150, status: 'Refunded' },
  { id: 'ORD-2037', customer: 'Vihaan Rao', city: 'Bengaluru', amount: 3620, status: 'Paid' },
];
const inr = new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 });
const tone = { Paid: 'success', Pending: 'warning', Refunded: 'error' } as const;
const columns: DataTableColumn<Order>[] = [
  { key: 'id', header: 'Order', sortable: true },
  { key: 'customer', header: 'Customer', sortable: true, searchable: true, cell: (r) => <span style={{ display: 'inline-flex', alignItems: 'center', gap: 8 }}><Avatar name={r.customer} size="small" />{r.customer}</span> },
  { key: 'city', header: 'City', sortable: true },
  { key: 'amount', header: 'Amount', sortable: true, cell: (r) => inr.format(r.amount) },
  { key: 'status', header: 'Status', cell: (r) => <Badge tone={tone[r.status]}>{r.status}</Badge> },
];

const kpis = [
  { label: 'Revenue', value: '₹38.4L', delta: '+12.4%', up: true, trend: [22, 24, 23, 27, 29, 31, 34] },
  { label: 'Orders', value: '4,340', delta: '+8.1%', up: true, trend: [510, 560, 590, 640, 680, 700, 720] },
  { label: 'Avg. order', value: '₹885', delta: '+3.9%', up: true, trend: [820, 830, 845, 840, 860, 870, 885] },
  { label: 'Refund rate', value: '1.8%', delta: '−0.4 pts', up: false, trend: [2.6, 2.4, 2.3, 2.2, 2.0, 1.9, 1.8] },
];

export function Dashboard() {
  const [range, setRange] = useState<string | null>('6m');
  const [menuOpen, setMenuOpen] = useState(false);
  return (
    <div className="sp-block-dashboard">
      <Sidebar
        aria-label="Dashboard"
        defaultValue="overview"
        mobileOpen={menuOpen}
        onMobileOpenChange={setMenuOpen}
        header={(collapsed) => <strong className="sp-block-brand">{collapsed ? 'S' : 'Sparkwire'}</strong>}
        items={[
          { id: 'overview', label: 'Overview', icon: icon('M3 12l9-9 9 9M5 10v10h14V10') },
          { id: 'orders', label: 'Orders', icon: icon('M6 2h12l1 6H5zM5 8h14v13H5z'), badge: '12' },
          { id: 'customers', label: 'Customers', icon: icon('M16 21v-2a4 4 0 0 0-8 0v2M12 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8') },
          { heading: 'Reports', items: [
            { id: 'sales', label: 'Sales', icon: icon('M3 3v18h18M7 14l4-4 4 4 5-6') },
            { id: 'settings', label: 'Settings', icon: icon('M12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6zM19.4 15a1.7 1.7 0 0 0 .3 1.8l.1.1a2 2 0 1 1-2.8 2.8l-.1-.1a1.7 1.7 0 0 0-1.8-.3 1.7 1.7 0 0 0-1 1.5V21a2 2 0 1 1-4 0v-.1a1.7 1.7 0 0 0-1.1-1.5 1.7 1.7 0 0 0-1.8.3l-.1.1a2 2 0 1 1-2.8-2.8l.1-.1a1.7 1.7 0 0 0 .3-1.8 1.7 1.7 0 0 0-1.5-1H3a2 2 0 1 1 0-4h.1a1.7 1.7 0 0 0 1.5-1.1 1.7 1.7 0 0 0-.3-1.8l-.1-.1a2 2 0 1 1 2.8-2.8l.1.1a1.7 1.7 0 0 0 1.8.3H9a1.7 1.7 0 0 0 1-1.5V3a2 2 0 1 1 4 0v.1a1.7 1.7 0 0 0 1 1.5 1.7 1.7 0 0 0 1.8-.3l.1-.1a2 2 0 1 1 2.8 2.8l-.1.1a1.7 1.7 0 0 0-.3 1.8V9a1.7 1.7 0 0 0 1.5 1H21a2 2 0 1 1 0 4h-.1a1.7 1.7 0 0 0-1.5 1z') },
          ] },
        ]}
        footer={(collapsed) => <span className="sp-block-user"><Avatar name="Anmol Mehta" size="small" status="online" />{!collapsed && 'Anmol Mehta'}</span>}
      />
      <main className="sp-block-main">
        <header className="sp-block-header">
          <button type="button" className="sp-block-menu" aria-label="Open menu" aria-expanded={menuOpen} onClick={() => setMenuOpen(true)}>
            {icon('M4 6h16M4 12h16M4 18h16')}
          </button>
          <div className="sp-block-title">
            <h1>Overview</h1>
            <p>Sales across all channels</p>
          </div>
          <div className="sp-block-actions">
            <ToggleGroup aria-label="Range" value={range} onChange={setRange} size="small">
              <ToggleGroup.Item value="30d">30 days</ToggleGroup.Item>
              <ToggleGroup.Item value="6m">6 months</ToggleGroup.Item>
              <ToggleGroup.Item value="1y">1 year</ToggleGroup.Item>
            </ToggleGroup>
            <Button size="small">Export</Button>
          </div>
        </header>

        <section className="sp-block-kpis" aria-label="Key figures">
          {kpis.map((k) => (
            <Card key={k.label} padding="medium">
              <div className="sp-block-kpi">
                <span className="sp-block-kpi__label">{k.label}</span>
                <span className="sp-block-kpi__value">{k.value}</span>
                <span className="sp-block-kpi__row">
                  <Badge tone={k.up === (k.label !== 'Refund rate') ? 'success' : 'error'} led={false}>{k.delta}</Badge>
                  <Sparkline aria-label={`${k.label}, last 7 periods`} data={k.trend} area />
                </span>
              </div>
            </Card>
          ))}
        </section>

        <section className="sp-block-charts">
          <Card padding="medium">
            <LineChart title="Revenue (₹ lakh)" data={revenue} x="month" series={[{ key: 'online', label: 'Online' }, { key: 'stores', label: 'Stores' }]} area height={240} />
          </Card>
          <Card padding="medium">
            <BarChart title="Orders by channel" data={channels} x="channel" series={[{ key: 'orders', label: 'Orders' }]} horizontal height={240} tableView={false} />
          </Card>
        </section>

        <Card padding="medium">
          <DataTable aria-label="Recent orders" data={orders} columns={columns} searchable density="compact" pageSizeOptions={[5, 10]} />
        </Card>
      </main>
    </div>
  );
}

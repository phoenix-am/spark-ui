import type { Meta, StoryObj } from '@storybook/react';
import { LineChart, BarChart, DonutChart, Sparkline } from '.';

/**
 * Our own SVG charts, no chart library. A validated colour-blind-safe
 * palette (`--spark-chart-1…8`, separate light and dark steps) assigned in
 * fixed order; thin marks; one y axis; tooltips on hover and keyboard
 * (focus a chart, then arrow keys); legend toggles; a data-table view.
 */
const meta: Meta = { title: 'Data/Charts', decorators: [(S) => <div style={{ maxWidth: 720 }}><S /></div>] };
export default meta;

const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
const revenue = months.map((m, i) => ({ month: m, web: 42 + i * 6 + Math.round(10 * Math.sin(i)), mobile: 30 + i * 4 + Math.round(8 * Math.cos(i)), partners: 12 + i * 2 }));
const inr = { style: 'currency', currency: 'INR', notation: 'compact', maximumFractionDigits: 1 } as const;
const lakh = revenue.map((r) => ({ ...r, web: r.web * 100000, mobile: r.mobile * 100000, partners: r.partners * 100000 }));
const series = [
  { key: 'web', label: 'Web' },
  { key: 'mobile', label: 'Mobile' },
  { key: 'partners', label: 'Partners' },
] as const;

export const Line: StoryObj = {
  render: () => <LineChart title="Revenue by channel" description="All three channels grew through the year; web leads." data={lakh} x="month" series={[...series]} valueFormat={inr} />,
};
export const SingleSeries: StoryObj = {
  render: () => <LineChart title="Web revenue" data={lakh} x="month" series={[series[0]]} valueFormat={inr} area />,
};
export const StackedArea: StoryObj = {
  render: () => <LineChart title="Revenue mix" data={lakh} x="month" series={[...series]} valueFormat={inr} stacked />,
};
export const GroupedBars: StoryObj = {
  render: () => <BarChart title="Quarterly sign-ups" data={[{ q: 'Q1', free: 820, pro: 240 }, { q: 'Q2', free: 960, pro: 310 }, { q: 'Q3', free: 1240, pro: 420 }, { q: 'Q4', free: 1100, pro: 510 }]} x="q" series={[{ key: 'free', label: 'Free' }, { key: 'pro', label: 'Pro' }]} />,
};
export const StackedBars: StoryObj = {
  render: () => <BarChart title="Revenue mix by month" data={lakh.slice(0, 6)} x="month" series={[...series]} valueFormat={inr} stacked />,
};
export const HorizontalBars: StoryObj = {
  render: () => (
    <BarChart
      title="Top cities by orders"
      height={240}
      horizontal
      data={[{ city: 'Ahmedabad', orders: 4210 }, { city: 'Mumbai', orders: 3890 }, { city: 'Bengaluru', orders: 3320 }, { city: 'Surat', orders: 2140 }, { city: 'Rajkot', orders: 1280 }]}
      x="city"
      series={[{ key: 'orders', label: 'Orders' }]}
    />
  ),
};
export const Donut: StoryObj = {
  render: () => (
    <DonutChart
      title="Traffic sources"
      data={[{ label: 'Organic search', value: 48200 }, { label: 'Direct', value: 26100 }, { label: 'Social', value: 14800 }, { label: 'Referral', value: 7400 }, { label: 'Email', value: 3500 }]}
    />
  ),
};
export const Sparklines: StoryObj = {
  render: () => (
    <div style={{ display: 'grid', gap: 12, gridTemplateColumns: 'repeat(3, max-content)', alignItems: 'center', fontSize: 14 }}>
      <span>Sign-ups</span><strong>1,284</strong><Sparkline aria-label="Sign-ups, last 12 weeks" data={[40, 42, 38, 51, 49, 60, 58, 66, 71, 69, 80, 88]} area />
      <span>Churn</span><strong>2.1%</strong><Sparkline aria-label="Churn, last 12 weeks" data={[3.1, 3, 2.9, 3.2, 2.8, 2.6, 2.7, 2.4, 2.5, 2.3, 2.2, 2.1]} color="var(--spark-chart-2)" />
      <span>Latency</span><strong>182 ms</strong><Sparkline aria-label="Latency, last 12 weeks" data={[210, 205, 220, 198, 190, 195, 188, 186, 192, 184, 181, 182]} color="var(--spark-chart-3)" />
    </div>
  ),
};

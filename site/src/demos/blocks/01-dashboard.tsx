/** A complete dashboard: navigation, stats, a chart and a table. Copy it in and swap in your data. */
import { Dashboard } from '@/components/spark-ui/blocks/Dashboard';

export default function DashboardBlock() {
  return (
    <div style={{ width: '100%', height: 640, overflow: 'auto', borderRadius: 12 }}>
      <Dashboard />
    </div>
  );
}

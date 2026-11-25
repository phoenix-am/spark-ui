/** A surface for grouping related content. Add a header for a title, a subtitle and an action. */
import { Card, CardHeader, Button } from '@sparkwire/core';

export default function Basic() {
  return (
    <div style={{ width: '100%', maxWidth: 360 }}>
      <Card padding="large">
        <CardHeader title="Billing" subtitle="Pro plan · renews 1 Dec" action={<Button size="small" variant="outlined">Manage</Button>} />
        <p style={{ margin: '16px 0 0' }}>You've used 68% of this month's build minutes.</p>
      </Card>
    </div>
  );
}

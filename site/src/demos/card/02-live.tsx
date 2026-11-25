/** A live card has current running around its edge. Use it sparingly for the one thing that's happening right now. */
import { Card, Badge } from '@sparkwire/core';

export default function Live() {
  return (
    <div style={{ width: '100%', maxWidth: 360 }}>
      <Card padding="large" live>
        <Badge tone="warning" variant="soft" led pulse>Deploying</Badge>
        <p style={{ margin: '12px 0 0' }}>Rolling out v2.4.0 to 3 regions…</p>
      </Card>
    </div>
  );
}

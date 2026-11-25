/** While content loads, show its shape so the page doesn't jump when it arrives. */
import { Card, Skeleton } from '@sparkwire/core';

export default function Loading() {
  return (
    <div style={{ width: '100%', maxWidth: 360 }}>
      <Card padding="large">
        <div style={{ display: 'flex', gap: 12, alignItems: 'center', marginBottom: 16 }}>
          <Skeleton shape="circle" width={40} height={40} />
          <Skeleton width="60%" />
        </div>
        <Skeleton lines={3} />
      </Card>
    </div>
  );
}

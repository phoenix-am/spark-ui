/** Match the shape of what's coming, here a list of people, so the page doesn't jump when it loads. */
import { Skeleton } from '@sparkwire/core';

export default function List() {
  return (
    <div style={{ display: 'grid', gap: 16, width: '100%', maxWidth: 320 }}>
      {[0, 1, 2].map((i) => (
        <div key={i} style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
          <Skeleton shape="circle" width={36} height={36} />
          <div style={{ flex: 1 }}>
            <Skeleton width="50%" />
            <Skeleton width="80%" />
          </div>
        </div>
      ))}
    </div>
  );
}

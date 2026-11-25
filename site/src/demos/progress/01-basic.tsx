/** Show how far along something is when you know the total. */
import { Progress } from '@sparkwire/core';

export default function ProgressDemo() {
  return (
    <div style={{ display: 'grid', gap: 16, width: '100%', maxWidth: 320 }}>
      <Progress label="Uploading" value={42} showValue />
      <Progress label="Disk" value={91} showValue tone="warning" />
    </div>
  );
}

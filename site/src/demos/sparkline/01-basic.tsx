/** A tiny trend line that fits in a table cell or next to a number. */
import { Sparkline } from '@sparkwire/core';

export default function SparklineDemo() {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
      <strong style={{ fontSize: 28 }}>₹4.2L</strong>
      <Sparkline aria-label="Revenue trend, rising" data={[12, 18, 14, 22, 19, 27, 31, 29, 36]} area width={140} height={40} showLast />
    </div>
  );
}

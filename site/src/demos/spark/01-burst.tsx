/** The signature effect. Put a Spark inside anything clickable and burst it from the pointer. */
import { useRef } from 'react';
import { Spark, type SparkHandle } from '@sparkwire/core';

export default function Burst() {
  const ref = useRef<SparkHandle>(null);
  return (
    <button
      type="button"
      onClick={(e) => ref.current?.burst(e)}
      style={{ position: 'relative', width: 280, height: 140, borderRadius: 16, border: '1px dashed var(--spark-surface-border-strong)', background: 'var(--spark-surface-raised)', color: 'inherit', font: 'inherit', cursor: 'pointer' }}
    >
      Click anywhere in here
      <Spark ref={ref} count={14} spread={90} />
    </button>
  );
}

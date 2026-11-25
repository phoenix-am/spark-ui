/** Choose the particles' `colors`, how many there are (`count`) and how far they fly (`spread`). */
import { useRef } from 'react';
import { Spark, type SparkHandle } from '@sparkwire/core';

export default function Colours() {
  const ref = useRef<SparkHandle>(null);
  return (
    <button
      type="button"
      onClick={(e) => ref.current?.burst(e)}
      style={{ position: 'relative', padding: '12px 24px', borderRadius: 999, border: 0, background: 'linear-gradient(90deg, #7c3aed, #db2777)', color: '#fff', font: 'inherit', fontWeight: 600, cursor: 'pointer' }}
    >
      Celebrate
      <Spark ref={ref} count={24} spread={120} colors={['#f0abfc', '#c084fc', '#fda4af', '#fde68a']} />
    </button>
  );
}

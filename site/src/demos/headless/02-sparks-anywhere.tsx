/** `useSpark()` gives you the spark burst for your own elements. Here: a like button that celebrates. */
import { useState } from 'react';
import { useSpark } from '@sparkwire/core/headless';

export default function SparksAnywhere() {
  const { sparks, burst } = useSpark();
  const [likes, setLikes] = useState(41);
  return (
    <button
      type="button"
      onClick={(e) => {
        setLikes(likes + 1);
        burst(e);
      }}
      style={{ position: 'relative', display: 'inline-flex', alignItems: 'center', gap: 8, padding: '10px 18px', borderRadius: 999, border: '1px solid var(--spark-surface-border-strong)', background: 'var(--spark-surface-raised)', color: 'inherit', font: 'inherit', cursor: 'pointer' }}
    >
      ♥ {likes}
      {sparks}
    </button>
  );
}

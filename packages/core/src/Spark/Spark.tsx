import React, { forwardRef, useCallback, useEffect, useImperativeHandle, useRef, useState } from 'react';
import { prefersReducedMotion } from '@spark-ui/utils';

export interface SparkProps {
  /** Particle colours. Defaults to the theme's `--spark-energy-spark-1…3`. */
  colors?: string[];
  /** Particles per burst. Default 10. */
  count?: number;
  /** Burst duration in milliseconds. Default 700. */
  duration?: number;
  /** How far particles travel, in px. Default 70. */
  spread?: number;
}

export interface SparkHandle {
  /** Fire a burst from the pointer position (or the centre for keyboard clicks). */
  burst: (event?: React.MouseEvent<HTMLElement>) => void;
}

interface Particle {
  id: number;
  x: number;
  y: number;
  dx: number;
  dy: number;
  size: number;
  color: string;
}

let nextId = 0;
const themeSparks = ['var(--spark-energy-spark-1)', 'var(--spark-energy-spark-2)', 'var(--spark-energy-spark-3)'];

/**
 * Spark: the signature Live Wire effect. Place it inside a `position: relative`
 * element and call `burst()` from its click handler. Renders nothing for users
 * who prefer reduced motion.
 */
export const Spark = forwardRef<SparkHandle, SparkProps>(function Spark(
  { colors, count = 10, duration = 700, spread = 70 },
  ref,
) {
  const palette = colors ?? themeSparks;
  const layerRef = useRef<HTMLSpanElement>(null);
  const [particles, setParticles] = useState<Particle[]>([]);
  const timers = useRef<number[]>([]);

  useEffect(
    () => () => {
      timers.current.forEach((t) => window.clearTimeout(t));
    },
    [],
  );

  const burst = useCallback(
    (event?: React.MouseEvent<HTMLElement>) => {
      const layer = layerRef.current;
      if (!layer || prefersReducedMotion()) return;
      const rect = layer.getBoundingClientRect();
      // Keyboard-triggered clicks report 0,0: fire from the centre instead.
      const fromPointer = event && (event.clientX !== 0 || event.clientY !== 0);
      const x = fromPointer ? event!.clientX - rect.left : rect.width / 2;
      const y = fromPointer ? event!.clientY - rect.top : rect.height / 2;

      const batch: Particle[] = Array.from({ length: count }, (_, i) => {
        const angle = (Math.PI * 2 * i) / count + (Math.random() - 0.5) * 0.6;
        const dist = spread * (0.55 + Math.random() * 0.6);
        return {
          id: nextId++,
          x,
          y,
          dx: Math.cos(angle) * dist,
          dy: Math.sin(angle) * dist,
          size: 3 + Math.round(Math.random() * 3),
          color: palette[i % palette.length],
        };
      });

      setParticles((prev) => [...prev, ...batch]);
      const ids = new Set(batch.map((p) => p.id));
      timers.current.push(
        window.setTimeout(() => setParticles((prev) => prev.filter((p) => !ids.has(p.id))), duration + 50),
      );
    },
    [count, spread, palette, duration],
  );

  useImperativeHandle(ref, () => ({ burst }), [burst]);

  return (
    <span ref={layerRef} aria-hidden="true" className="sp-spark">
      {particles.map((p) => (
        <span
          key={p.id}
          className="sp-spark__particle"
          style={
            {
              left: p.x,
              top: p.y,
              width: p.size,
              height: p.size,
              background: p.color,
              boxShadow: `0 0 6px ${p.color}`,
              animationDuration: `${duration}ms`,
              '--sp-dx': `${p.dx}px`,
              '--sp-dy': `${p.dy}px`,
            } as React.CSSProperties
          }
        />
      ))}
    </span>
  );
});

Spark.displayName = 'Spark';

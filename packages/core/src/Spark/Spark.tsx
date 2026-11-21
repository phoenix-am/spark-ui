import React, { forwardRef, useCallback, useEffect, useImperativeHandle, useRef, useState } from 'react';
import { css, keyframes } from '@emotion/react';
import { useTheme } from '@spark-ui/system';
import { prefersReducedMotion } from '@spark-ui/utils';

const fly = keyframes`
  0%   { transform: translate(-50%, -50%) scale(1); opacity: 1; }
  100% { transform: translate(calc(-50% + var(--spark-dx)), calc(-50% + var(--spark-dy))) scale(0.2); opacity: 0; }
`;

export interface SparkProps {
  /** Particle colours. Defaults to `theme.energy.sparks`. */
  colors?: string[];
  /** Particles per burst. */
  count?: number;
  /** Burst duration in ms. Defaults to `theme.motion.spark`. */
  duration?: number;
  /** How far particles travel, in px. */
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

/**
 * Spark: the signature Live Wire effect. Place it inside a `position: relative`
 * element and call `burst()` from its click handler. Renders nothing for users
 * who prefer reduced motion.
 */
export const Spark = forwardRef<SparkHandle, SparkProps>(function Spark(
  { colors, count = 10, duration, spread = 70 },
  ref,
) {
  const { theme } = useTheme();
  const palette = colors ?? theme.energy.sparks;
  const ms = duration ?? theme.motion.spark;
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
        window.setTimeout(() => setParticles((prev) => prev.filter((p) => !ids.has(p.id))), ms + 50),
      );
    },
    [count, spread, palette, ms],
  );

  useImperativeHandle(ref, () => ({ burst }), [burst]);

  return (
    <span
      ref={layerRef}
      aria-hidden="true"
      css={css`
        position: absolute;
        inset: 0;
        pointer-events: none;
        overflow: visible;
        z-index: 1;
      `}
    >
      {particles.map((p) => (
        <span
          key={p.id}
          style={
            {
              left: p.x,
              top: p.y,
              width: p.size,
              height: p.size,
              background: p.color,
              boxShadow: `0 0 6px ${p.color}`,
              '--spark-dx': `${p.dx}px`,
              '--spark-dy': `${p.dy}px`,
            } as React.CSSProperties
          }
          css={css`
            position: absolute;
            border-radius: 50%;
            animation: ${fly} ${ms}ms ${theme.motion.easing} forwards;
          `}
        />
      ))}
    </span>
  );
});

Spark.displayName = 'Spark';

import React, { useEffect, useRef, useState, forwardRef, useImperativeHandle } from 'react';
import { css } from '@emotion/react';

interface RippleProps {
  color?: string;
  duration?: number;
}


export interface RippleHandle extends HTMLDivElement {
  createRipple: (event: React.MouseEvent<HTMLButtonElement>) => void;
}

export const Ripple = forwardRef<RippleHandle, RippleProps>(
  ({ color = 'rgba(0, 0, 0, 0.3)', duration = 600 }, ref) => {
    const [ripples, setRipples] = useState<React.ReactNode[]>([]);
    const containerRef = useRef<HTMLDivElement>(null);

    useImperativeHandle(ref, () => ({
      ...containerRef.current!,
      createRipple: (event: React.MouseEvent<HTMLButtonElement>) => {
        const rect = containerRef.current!.getBoundingClientRect();
        const size = Math.max(rect.width, rect.height);
        const x = event.clientX - rect.left - size / 2;
        const y = event.clientY - rect.top - size / 2;

        const newRipple = (
          <span
            key={Date.now()}
            css={css`
              position: absolute;
              border-radius: 50%;
              width: ${size}px;
              height: ${size}px;
              background-color: ${color};
              opacity: 0;
              animation: ripple ${duration}ms ease-out forwards;
              top: ${y}px;
              left: ${x}px;

              @keyframes ripple {
                0% {
                  transform: scale(0);
                  opacity: 0.5;
                }
                100% {
                  transform: scale(2);
                  opacity: 0;
                }
              }
            `}
          />
        );

        setRipples((prev) => [...prev, newRipple]);
      },
    }));

    useEffect(() => {
      const cleanup = setTimeout(() => {
        setRipples((prev) => prev.slice(1));
      }, duration);

      return () => clearTimeout(cleanup);
    }, [ripples, duration]);

    return (
      <div
        ref={containerRef}
        css={css`
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          overflow: hidden;
          pointer-events: none;
        `}
      >
        {ripples}
      </div>
    );
  }
);

Ripple.displayName = 'Ripple';

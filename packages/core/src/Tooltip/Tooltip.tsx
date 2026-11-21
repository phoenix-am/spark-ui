import React, { cloneElement, isValidElement, useEffect, useId, useRef, useState } from 'react';
import { css, keyframes } from '@emotion/react';
import { useTheme } from '@spark-ui/system';

const zap = keyframes`
  from { opacity: 0; transform: var(--tt-from); }
  to { opacity: 1; transform: none; }
`;

export interface TooltipProps {
  /** Tooltip text. Keep it short; it is read as the trigger's description. */
  title: React.ReactNode;
  placement?: 'top' | 'bottom' | 'left' | 'right';
  /** Delay before showing, in ms. */
  delay?: number;
  /** A single focusable element, e.g. a Button. */
  children: React.ReactElement;
}

const offsets = {
  top: { pos: 'bottom: calc(100% + 8px); left: 50%; translate: -50% 0;', from: 'translateY(4px)' },
  bottom: { pos: 'top: calc(100% + 8px); left: 50%; translate: -50% 0;', from: 'translateY(-4px)' },
  left: { pos: 'right: calc(100% + 8px); top: 50%; translate: 0 -50%;', from: 'translateX(4px)' },
  right: { pos: 'left: calc(100% + 8px); top: 50%; translate: 0 -50%;', from: 'translateX(-4px)' },
};

/**
 * Tooltip: a short charged label that arcs out from its trigger on hover or
 * keyboard focus. Escape dismisses it.
 */
export function Tooltip({ title, placement = 'top', delay = 250, children }: TooltipProps) {
  const { theme } = useTheme();
  const [open, setOpen] = useState(false);
  const timer = useRef<number>();
  const id = useId();

  const show = () => {
    window.clearTimeout(timer.current);
    timer.current = window.setTimeout(() => setOpen(true), delay);
  };
  const hide = () => {
    window.clearTimeout(timer.current);
    setOpen(false);
  };

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && hide();
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [open]);

  useEffect(() => () => window.clearTimeout(timer.current), []);

  const o = offsets[placement];
  const trigger = isValidElement(children)
    ? cloneElement(children as React.ReactElement<Record<string, unknown>>, {
        'aria-describedby': open ? id : undefined,
      })
    : children;

  return (
    <span
      onMouseEnter={show}
      onMouseLeave={hide}
      onFocus={show}
      onBlur={hide}
      css={css`position: relative; display: inline-flex;`}
    >
      {trigger}
      {open && (
        <span
          role="tooltip"
          id={id}
          style={{ '--tt-from': o.from } as React.CSSProperties}
          css={css`
            position: absolute;
            ${o.pos}
            z-index: ${theme.zIndex.tooltip};
            width: max-content;
            max-width: 240px;
            padding: 0.4rem 0.65rem;
            border-radius: ${theme.borderRadius.small};
            background: ${theme.energy.hot};
            color: ${theme.text.onEnergy};
            font-family: ${theme.typography.fontFamily};
            font-size: 0.8125rem;
            font-weight: 600;
            line-height: 1.4;
            box-shadow: 0 0 16px ${theme.energy.glow};
            pointer-events: none;
            animation: ${zap} ${theme.motion.fast} ${theme.motion.easing} both;
            @media (prefers-reduced-motion: reduce) {
              animation: none;
            }
          `}
        >
          {title}
        </span>
      )}
    </span>
  );
}

export default Tooltip;

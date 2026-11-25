import React, { cloneElement, isValidElement, useRef, useState } from 'react';
import { mergeProps, useTooltip, useTooltipTrigger } from 'react-aria';
import { useTooltipTriggerState } from 'react-stately';
import { useDefaults } from '../internal/defaults';
import { cx } from '../internal/cx';
import { useIsoLayoutEffect } from '../internal/useIsoLayoutEffect';

type Placement = 'top' | 'bottom' | 'left' | 'right';
const OPPOSITE: Record<Placement, Placement> = { top: 'bottom', bottom: 'top', left: 'right', right: 'left' };
/** Space kept between the bubble and the edge of the window. */
const EDGE = 8;

export interface TooltipProps {
  /** Tooltip text. Keep it short; it is read as the trigger's description. */
  title: React.ReactNode;
  /** Preferred side of the trigger. Default `top`. Flips to the other side when there's no room, and slides along to stay inside the window. */
  placement?: Placement;
  /** Delay before showing on hover, in ms. Default 250. Keyboard focus shows it at once. */
  delay?: number;
  /** A single focusable element, e.g. a Button. */
  children: React.ReactElement;
  /** Class for the tooltip bubble. */
  className?: string;
}

/**
 * A short hint on hover or keyboard focus. Keep it to a few words and never
 * hide anything essential in one, since touch users may never see it.
 *
 * A short charged label that arcs out from its trigger on hover or
 * keyboard focus. Behaviour comes from React Aria: hover delay with warm-up
 * across nearby tooltips, instant on keyboard focus, Escape dismisses.
 *
 * Style hooks: `.sp-tooltip` (wrapper), `.sp-tooltip__bubble[data-placement]`.
 */
export function Tooltip(inProps: TooltipProps) {
  const { title, placement = 'top', delay = 250, children, className } = useDefaults('Tooltip', inProps);
  const wrapperRef = useRef<HTMLSpanElement>(null);
  const state = useTooltipTriggerState({ delay, closeDelay: 0 });
  const { triggerProps, tooltipProps } = useTooltipTrigger({ delay, closeDelay: 0 }, state, wrapperRef);
  const { tooltipProps: bubbleProps } = useTooltip(tooltipProps, state);
  const bubbleRef = useRef<HTMLSpanElement>(null);
  const [fit, setFit] = useState<{ side: Placement; shift: number }>({ side: placement, shift: 0 });

  // Before paint, measure where the bubble landed: flip it if it leaves the window on its
  // side, then nudge it along the edge so it stays fully visible.
  useIsoLayoutEffect(() => {
    if (!state.isOpen) {
      if (fit.side !== placement || fit.shift) setFit({ side: placement, shift: 0 });
      return;
    }
    const el = bubbleRef.current;
    const anchor = wrapperRef.current;
    if (!el || !anchor || typeof window === 'undefined') return;
    const vw = window.innerWidth;
    const vh = window.innerHeight;
    const a = anchor.getBoundingClientRect();
    const b = el.getBoundingClientRect();
    const room: Record<Placement, number> = { top: a.top, bottom: vh - a.bottom, left: a.left, right: vw - a.right };
    const need = placement === 'top' || placement === 'bottom' ? b.height + EDGE * 2 : b.width + EDGE * 2;
    const side = room[placement] < need && room[OPPOSITE[placement]] > room[placement] ? OPPOSITE[placement] : placement;
    let shift = 0;
    if (side === 'top' || side === 'bottom') {
      const left = a.left + a.width / 2 - b.width / 2;
      if (left < EDGE) shift = EDGE - left;
      else if (left + b.width > vw - EDGE) shift = vw - EDGE - (left + b.width);
    } else {
      const top = a.top + a.height / 2 - b.height / 2;
      if (top < EDGE) shift = EDGE - top;
      else if (top + b.height > vh - EDGE) shift = vh - EDGE - (top + b.height);
    }
    if (side !== fit.side || Math.round(shift) !== Math.round(fit.shift)) setFit({ side, shift: Math.round(shift) });
  }, [state.isOpen, placement, fit.side, fit.shift]);

  // React Aria's focus handling only listens on the focusable element itself
  // (it ignores focus bubbling up from children), so merge the trigger props
  // into the child. The wrapper only positions the bubble.
  const trigger = isValidElement(children)
    ? cloneElement(
        children as React.ReactElement<Record<string, unknown>>,
        mergeProps((children as React.ReactElement<Record<string, unknown>>).props, triggerProps),
      )
    : children;

  return (
    <span ref={wrapperRef} className="sp-tooltip">
      {trigger}
      {state.isOpen && (
        <span
          {...bubbleProps}
          ref={bubbleRef}
          data-placement={fit.side}
          className={cx('sp-tooltip__bubble', className)}
          style={fit.shift ? ({ '--sp-shift': `${fit.shift}px` } as React.CSSProperties) : undefined}
        >
          {title}
        </span>
      )}
    </span>
  );
}

export default Tooltip;

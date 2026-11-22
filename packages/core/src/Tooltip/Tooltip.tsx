import React, { cloneElement, isValidElement, useRef } from 'react';
import { mergeProps, useTooltip, useTooltipTrigger } from 'react-aria';
import { useTooltipTriggerState } from 'react-stately';
import { useDefaults } from '../internal/defaults';
import { cx } from '../internal/cx';

export interface TooltipProps {
  /** Tooltip text. Keep it short; it is read as the trigger's description. */
  title: React.ReactNode;
  /** Side of the trigger to show on. Default `top`. */
  placement?: 'top' | 'bottom' | 'left' | 'right';
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
        <span {...bubbleProps} data-placement={placement} className={cx('sp-tooltip__bubble', className)}>
          {title}
        </span>
      )}
    </span>
  );
}

export default Tooltip;

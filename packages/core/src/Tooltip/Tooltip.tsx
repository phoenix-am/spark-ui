import React, { cloneElement, isValidElement, useEffect, useId, useRef, useState } from 'react';

export interface TooltipProps {
  /** Tooltip text. Keep it short; it is read as the trigger's description. */
  title: React.ReactNode;
  /** Side of the trigger to show on. Default `top`. */
  placement?: 'top' | 'bottom' | 'left' | 'right';
  /** Delay before showing, in ms. Default 250. */
  delay?: number;
  /** A single focusable element, e.g. a Button. */
  children: React.ReactElement;
  /** Class for the tooltip bubble. */
  className?: string;
}

/**
 * Tooltip: a short charged label that arcs out from its trigger on hover or
 * keyboard focus. Escape dismisses it.
 *
 * Style hooks: `.sp-tooltip` (wrapper), `.sp-tooltip__bubble[data-placement]`.
 */
export function Tooltip({ title, placement = 'top', delay = 250, children, className }: TooltipProps) {
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

  const trigger = isValidElement(children)
    ? cloneElement(children as React.ReactElement<Record<string, unknown>>, {
        'aria-describedby': open ? id : undefined,
      })
    : children;

  return (
    <span className="sp-tooltip" onMouseEnter={show} onMouseLeave={hide} onFocus={show} onBlur={hide}>
      {trigger}
      {open && (
        <span role="tooltip" id={id} data-placement={placement} className={['sp-tooltip__bubble', className].filter(Boolean).join(' ')}>
          {title}
        </span>
      )}
    </span>
  );
}

export default Tooltip;

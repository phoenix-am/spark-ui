import React, { ElementType, forwardRef, useRef } from 'react';
import { Spark, SparkHandle } from '../Spark';
import { cx } from '../internal/cx';

export interface ButtonBaseProps extends React.ButtonHTMLAttributes<HTMLElement> {
  /** Render as another element or component, e.g. `"a"` or a router Link. */
  as?: ElementType;
  /** Dead circuit: no clicks, no sparks. Uses `disabled` on buttons, `aria-disabled` otherwise. */
  disabled?: boolean;
  /** Throw sparks from the press point on click. Default `true`. */
  spark?: boolean;
  /** Spark colours. Default: the theme's spark colours. */
  sparkColors?: string[];
  /** Link target when rendered as an anchor. */
  href?: string;
  [key: `data-${string}`]: unknown;
}

/**
 * ButtonBase: the pressable foundation under Button, IconButton and menu
 * triggers. Handles disabled state for any element, `type="button"` by
 * default, and the spark burst. No visual style of its own beyond
 * `.sp-button-base`; build your own buttons on it.
 */
export const ButtonBase = forwardRef<HTMLElement, ButtonBaseProps>(function ButtonBase(
  { as: Component = 'button', disabled = false, spark = true, sparkColors, onClick, className, children, type, ...rest },
  ref,
) {
  const sparkRef = useRef<SparkHandle>(null);
  const isButton = Component === 'button';
  return (
    <Component
      ref={ref}
      className={cx('sp-button-base', className)}
      data-disabled={disabled || undefined}
      disabled={isButton ? disabled : undefined}
      aria-disabled={!isButton && disabled ? true : undefined}
      type={isButton ? type ?? 'button' : type}
      onClick={(event: React.MouseEvent<HTMLElement>) => {
        if (disabled) {
          event.preventDefault();
          return;
        }
        if (spark) sparkRef.current?.burst(event);
        onClick?.(event as React.MouseEvent<HTMLButtonElement>);
      }}
      {...rest}
    >
      {children}
      {spark && <Spark ref={sparkRef} colors={sparkColors} />}
    </Component>
  );
});

export default ButtonBase;

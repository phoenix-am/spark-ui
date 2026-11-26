import React, { ElementType, forwardRef } from 'react';
import { PolymorphicButtonProps } from './Button.types';
import { ButtonBase } from '../base/ButtonBase';
import { useDefaults, slot, ClassNames } from '../internal/defaults';

/**
 * The button you'll reach for most. It handles clicks, keyboard presses and
 * focus the way people expect, comes in three weights (contained, outlined,
 * text) and four colours, and throws a little burst of sparks from wherever
 * it's pressed. Need a link that looks like a button? Render it as one with
 * `as` or `render`.
 *
 * Throws sparks from the press point. Outlined and text buttons show
 * current flowing along a wire on hover; a disabled button is a dead circuit.
 * Built on ButtonBase; forwards `ref` to the rendered element.
 */
const ButtonInner = (inProps: PolymorphicButtonProps<ElementType>, ref: React.ForwardedRef<HTMLElement>) => {
  const {
    as,
    variant = 'contained',
    color = 'brand',
    size = 'medium',
    disabled = false,
    className,
    startIcon,
    endIcon,
    children,
    fullWidth = false,
    disableElevation = false,
    spark,
    classNames,
    ...rest
  } = useDefaults('Button', inProps);
  const slots = classNames as ClassNames<'root' | 'icon'> | undefined;

  return (
    <ButtonBase
      ref={ref}
      as={as}
      disabled={disabled}
      spark={spark ?? true}
      sparkColors={color === 'brand' ? undefined : ['var(--sp-fill)', 'var(--spark-energy-hot)', 'var(--sp-hover)']}
      className={slot('sp-button', slots, 'root', className)}
      data-variant={variant}
      data-tone={color}
      data-size={size}
      data-full-width={fullWidth || undefined}
      data-flat={disableElevation || undefined}
      {...(rest as React.ButtonHTMLAttributes<HTMLElement>)}
    >
      {startIcon && <span className={slot('sp-button__icon slot-startIcon', slots, 'icon')}>{startIcon}</span>}
      {children}
      {endIcon && <span className={slot('sp-button__icon slot-endIcon', slots, 'icon')}>{endIcon}</span>}
    </ButtonBase>
  );
};

const Button = forwardRef(ButtonInner) as <C extends ElementType = 'button'>(
  props: PolymorphicButtonProps<C> & { ref?: React.Ref<HTMLElement> },
) => React.ReactElement | null;

export default Button;

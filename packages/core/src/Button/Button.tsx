import React, { ElementType, useRef } from 'react';
import { PolymorphicButtonProps } from './Button.types';
import { Spark, SparkHandle } from '../Spark';
import { cx } from '../internal/cx';
import { useDefaults, slot, ClassNames } from '../internal/defaults';

/**
 * Button: throws sparks from the press point. Outlined and text buttons show
 * current flowing along a wire on hover; a disabled button is a dead circuit.
 */
const Button = <C extends ElementType = 'button'>(inProps: PolymorphicButtonProps<C>) => {
  const {
  as: Component = 'button',
  variant = 'contained',
  color = 'brand',
  size = 'medium',
  onClick,
  disabled = false,
  className,
  startIcon,
  endIcon,
  children,
  fullWidth = false,
  disableElevation = false,
  spark,
  ripple,
  classNames,
  ...rest
} = useDefaults('Button', inProps);
  const sparkRef = useRef<SparkHandle>(null);
  const sparksOn = spark ?? ripple ?? true;
  const isButton = Component === 'button';

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    if (disabled) {
      event.preventDefault();
      return;
    }
    if (sparksOn) sparkRef.current?.burst(event);
    onClick?.(event as never);
  };

  return (
    <Component
      className={slot('sp-button', classNames as ClassNames<'root' | 'icon'> | undefined, 'root', className)}
      data-variant={variant}
      data-tone={color}
      data-size={size}
      data-full-width={fullWidth || undefined}
      data-flat={disableElevation || undefined}
      data-disabled={disabled || undefined}
      onClick={handleClick}
      disabled={isButton ? disabled : undefined}
      aria-disabled={!isButton && disabled ? true : undefined}
      type={isButton ? (rest as { type?: string }).type ?? 'button' : undefined}
      {...rest}
    >
      {startIcon && <span className={slot('sp-button__icon slot-startIcon', classNames as ClassNames<'icon'> | undefined, 'icon')}>{startIcon}</span>}
      {children}
      {endIcon && <span className={slot('sp-button__icon slot-endIcon', classNames as ClassNames<'icon'> | undefined, 'icon')}>{endIcon}</span>}
      {sparksOn && (
        <Spark
          ref={sparkRef}
          colors={color === 'brand' ? undefined : ['var(--sp-fill)', 'var(--spark-energy-hot)', 'var(--sp-hover)']}
        />
      )}
    </Component>
  );
};

export default Button;

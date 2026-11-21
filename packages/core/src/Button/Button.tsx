import React, { ElementType, useRef } from 'react';
import { PolymorphicButtonProps } from './Button.types';
import { Spark, SparkHandle } from '../Spark';
import { cx } from '../internal/cx';

/**
 * Button: throws sparks from the press point. Outlined and text buttons show
 * current flowing along a wire on hover; a disabled button is a dead circuit.
 */
const Button = <C extends ElementType = 'button'>({
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
  ...rest
}: PolymorphicButtonProps<C>) => {
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
      className={cx('sp-button', className)}
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
      {startIcon && <span className="sp-button__icon slot-startIcon">{startIcon}</span>}
      {children}
      {endIcon && <span className="sp-button__icon slot-endIcon">{endIcon}</span>}
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

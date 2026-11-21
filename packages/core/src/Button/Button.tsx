import React, { ElementType, useRef } from 'react';
import { useTheme } from '@spark-ui/system';
import { ButtonStyles } from './Button.styles';
import { PolymorphicButtonProps } from './Button.types';
import { applySlots } from '@spark-ui/utils';
import { Spark, SparkHandle } from '../Spark';
import { getTone } from '../internal/tone';

const Button = <C extends ElementType = 'button'>({
  as: Component = 'button',
  variant = 'contained',
  color = 'brand',
  size = 'medium',
  onClick,
  disabled = false,
  className = '',
  startIcon,
  endIcon,
  children,
  fullWidth = false,
  disableElevation = false,
  spark,
  ripple,
  ...rest
}: PolymorphicButtonProps<C>) => {
  const { theme } = useTheme();
  const styles = ButtonStyles({ variant, color, size, fullWidth, disableElevation, theme });
  const sparkRef = useRef<SparkHandle>(null);
  const sparksOn = spark ?? ripple ?? true;
  const tone = getTone(color, theme);

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    if (disabled) return;
    if (sparksOn) sparkRef.current?.burst(event);
    onClick?.(event as never);
  };

  const element = (
    <Component
      css={styles}
      onClick={handleClick}
      className={className}
      disabled={Component === 'button' ? disabled : undefined}
      aria-disabled={disabled || undefined}
      type={Component === 'button' ? (rest as { type?: string }).type ?? 'button' : undefined}
      {...rest}
    >
      {children}
      {sparksOn && (
        <Spark
          ref={sparkRef}
          colors={color === 'brand' ? theme.energy.sparks : [tone.fill, theme.energy.hot, tone.hover]}
        />
      )}
    </Component>
  );

  return applySlots({ slots: { startIcon, endIcon }, component: element });
};

export default Button;

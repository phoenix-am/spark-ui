import React, { ElementType, useRef } from 'react';
import { useTheme } from '@spark-ui/system';
import { ButtonStyles } from './Button.styles';
import { PolymorphicButtonProps } from './Button.types';
import { applySlots } from '@spark-ui/utils';
import { Ripple } from './TouchRipple';

const Button = <C extends ElementType = 'button'>({
  as: Component = 'button',
  variant = 'contained',
  color = 'primary',
  size = 'medium',
  onClick,
  disabled = false,
  className = '',
  startIcon,
  endIcon,
  children,
  ...rest
}: PolymorphicButtonProps<C>) => {
  const themes = useTheme();
  const styles = ButtonStyles({ variant, color, size, theme: themes.theme });

  const rippleRef = useRef<{ createRipple: (event: React.MouseEvent<HTMLButtonElement>) => void }>(null);

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    if (rippleRef.current) {
      rippleRef.current.createRipple(event);
    }

    if (onClick) {
      onClick(event);
    }
  };

  // Dynamically handle slots
  const slots = {
    startIcon,
    endIcon,
  };

  const element = (
    <Component
      css={styles}
      onClick={handleClick}
      className={className}
      disabled={disabled}
      aria-disabled={disabled}
      aria-label={typeof children === 'string' ? children : undefined}
      {...rest}
    >
      {children}
      <Ripple ref={rippleRef as any} />
    </Component>
  );

  return applySlots({ slots, component: element });
};

export default Button;

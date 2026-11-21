import { ReactNode, ElementType } from 'react';
import { OverrideProps } from '@spark-ui/utils';
import { Theme } from '@spark-ui/styles';

export type ButtonVariant = 'text' | 'outlined' | 'contained';
export type ButtonSize = 'small' | 'medium' | 'large';
export type ButtonColor = 'brand' | 'error' | 'success' | 'warning';

// Base interface for Button props
export interface ButtonPropsBase {
  children?: ReactNode;
  className?: string;
  disabled?: boolean;
  startIcon?: ReactNode;
  endIcon?: ReactNode;
  fullWidth?: boolean;
  /** Throw sparks from the press point on click. Default `true`. */
  spark?: boolean;
  /** @deprecated Use `spark`. Kept so existing code keeps working. */
  ripple?: boolean;
}

// Type map for Button with default component and props
export type ButtonTypeMap<P = {}, D extends ElementType = 'button'> = {
  props: P &
    ButtonPropsBase & {
      variant?: ButtonVariant;
      color?: ButtonColor;
      size?: ButtonSize;
      href?: string;
      disableElevation?: boolean;
    };
  defaultComponent: D;
};

// Utility type for polymorphic Button props
export type PolymorphicButtonProps<
  D extends ElementType = ButtonTypeMap['defaultComponent'],
  P = {}
> = OverrideProps<ButtonTypeMap<P, D>, D> & {
  /** Render as another element or component, e.g. `as="a"`. */
  as?: ElementType;
};

// Slot props for Button (if applicable)
export type ButtonSlotProps = {
  root?: PolymorphicButtonProps;
  startIcon?: ReactNode;
  endIcon?: ReactNode;
};

export interface WithTheme {
  theme: Theme;
}

export type { ElementType, ReactNode };

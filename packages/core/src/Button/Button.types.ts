import { ReactNode, ElementType } from 'react';
import { OverrideProps } from '@spark-ui/utils';
import { Theme } from '@spark-ui/styles';

// Define Button variants, colors, and sizes using Theme's colors
export type ButtonVariant = 'text' | 'outlined' | 'contained';
export type ButtonSize = 'small' | 'medium' | 'large';
export type ButtonColor =
  | 'primary'
  | 'secondary'
  | 'error'
  | 'success'
  | 'warning'
  | 'info';

// Base interface for Button props
export interface ButtonPropsBase {
  children?: ReactNode;
  className?: string;
  disabled?: boolean;
  startIcon?: ReactNode;
  endIcon?: ReactNode;
  fullWidth?: boolean;
}

// Type map for Button with default component and props
export type ButtonTypeMap<P = {}, D extends ElementType = 'button'> = {
  props: P & ButtonPropsBase & {
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
  component?: ElementType;
};

// Slot props for Button (if applicable)
export type ButtonSlotProps = {
  root?: PolymorphicButtonProps;
  startIcon?: ReactNode;
  endIcon?: ReactNode;
};

// Example theme-based prop to showcase the use of the `Theme`
export interface WithTheme {
  theme: Theme;
}

// These exports are needed to comply with the MUI-based architecture style.
export type { ElementType, ReactNode };

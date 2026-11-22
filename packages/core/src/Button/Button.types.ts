import { ReactNode, ElementType } from 'react';
import type { RenderProp } from '../internal/render';
import { OverrideProps } from '@sparkwire/utils';

/**
 * Add your own variants (defined in SparkProvider's `components.Button.variants`)
 * and get them type-checked:
 *
 * ```ts
 * declare module '@sparkwire/core' {
 *   interface ButtonVariantOverrides { danger: true }
 * }
 * ```
 */
// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface ButtonVariantOverrides {}
export type ButtonVariant = 'text' | 'outlined' | 'contained' | keyof ButtonVariantOverrides;
export type ButtonSize = 'small' | 'medium' | 'large';
export type ButtonColor = 'brand' | 'error' | 'success' | 'warning';

// Base interface for Button props
export interface ButtonPropsBase {
  children?: ReactNode;
  className?: string;
  /** Dead circuit: no clicks, no sparks, dashed outline. */
  disabled?: boolean;
  /** Icon before the label. Coloured with the text. */
  startIcon?: ReactNode;
  /** Icon after the label. Coloured with the text. */
  endIcon?: ReactNode;
  /** Stretch to the container's width. */
  fullWidth?: boolean;
  /** Throw sparks from the press point on click. Default `true`. */
  spark?: boolean;
  /** @deprecated Use `spark`. Kept so existing code keeps working. */
  ripple?: boolean;
  /** Extra classes for each part: root, icon. */
  classNames?: Partial<Record<'root' | 'icon', string>>;
  /** Render a different element with the button's behaviour and look, e.g. `render={<Link href="/pricing" />}`. */
  render?: RenderProp<{ disabled: boolean }>;
}

// Type map for Button with default component and props
export type ButtonTypeMap<P = {}, D extends ElementType = 'button'> = {
  props: P &
    ButtonPropsBase & {
      /** `contained` (filled, default), `outlined` or `text`. */
      variant?: ButtonVariant;
      /** Tone of the current. Default `brand`. */
      color?: ButtonColor;
      /** Height 36, 44 or 52px. Default `medium`. */
      size?: ButtonSize;
      /** Use with `as="a"` to render a link that looks like a button. */
      href?: string;
      /** Remove the glow around contained buttons. */
      disableElevation?: boolean;
    };
  defaultComponent: D;
};

// Utility type for polymorphic Button props
export type PolymorphicButtonProps<
  D extends ElementType = ButtonTypeMap['defaultComponent'],
  P = {}
> = OverrideProps<ButtonTypeMap<P, D>, D> & {
  /** Render as another element or component, e.g. `as="a"` or a router `Link`; its props are then accepted too. */
  as?: D;
};

// Slot props for Button (if applicable)
export type ButtonSlotProps = {
  root?: PolymorphicButtonProps;
  startIcon?: ReactNode;
  endIcon?: ReactNode;
};


export type { ElementType, ReactNode };

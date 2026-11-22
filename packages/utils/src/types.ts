import type { ComponentPropsWithRef, ElementType } from 'react';

/**
 * Props of a polymorphic component: the component's own props, plus the props
 * of the element it renders as (minus any the component redefines).
 */
export type OverrideProps<
  M extends { props: object; defaultComponent: ElementType },
  C extends ElementType
> = M['props'] & Omit<ComponentPropsWithRef<C>, keyof M['props']>;

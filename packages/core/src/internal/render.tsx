import React, { cloneElement, createElement, isValidElement } from 'react';
import { mergeProps, mergeRefs } from 'react-aria';

/**
 * Swap the element a component renders, keeping its behaviour and styling:
 *
 * ```tsx
 * <Button render={<Link href="/pricing" />}>Pricing</Button>      // Next.js link styled as a button
 * <Card render={<motion.article layout />}>…</Card>                 // animated card
 * <Badge render={(props, state) => <a href="/inbox" {...props} />}>3</Badge>
 * ```
 *
 * An element gets the component's props merged in: class names are joined,
 * styles combined, event handlers chained (both run) and refs merged. A
 * function receives the props and the component's state and returns the
 * element itself, for full control.
 */
export type RenderProp<State = Record<string, unknown>> =
  | React.ReactElement
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  | ((props: React.HTMLAttributes<any> & { ref?: React.Ref<any> }, state: State) => React.ReactElement);

/** The ref an element was created with (React 19 keeps it in props, React 18 on the element). */
function elementRef(el: React.ReactElement): React.Ref<unknown> | undefined {
  const props = el.props as { ref?: React.Ref<unknown> };
  return props.ref ?? (el as unknown as { ref?: React.Ref<unknown> }).ref ?? undefined;
}

export function renderElement<State extends object>(
  defaultTag: React.ElementType,
  render: RenderProp<State> | undefined,
  props: Record<string, unknown> & { ref?: React.Ref<HTMLElement>; children?: React.ReactNode },
  state: State = {} as State,
): React.ReactElement {
  if (!render) return createElement(defaultTag, props);
  if (typeof render === 'function') return render(props as never, state);
  if (!isValidElement(render)) return createElement(defaultTag, props);

  const own = render.props as Record<string, unknown> & { style?: React.CSSProperties; children?: React.ReactNode };
  const { ref, children, style, ...rest } = props as typeof props & { style?: React.CSSProperties };
  const merged = mergeProps(rest, own) as Record<string, unknown>;
  merged.style = style || own.style ? { ...style, ...own.style } : undefined;
  merged.ref = mergeRefs(ref ?? null, (elementRef(render) as React.Ref<HTMLElement>) ?? null);
  // The component's content wins; an element's own children are kept only when the component has none.
  return cloneElement(render, merged, children ?? own.children);
}

import * as React from 'react';

interface SlotProps {
  [slotName: string]: React.ReactNode;
}

interface ApplySlotsProps<C extends React.ElementType> {
  slots: SlotProps;
  component: React.ReactElement<any, C>;
}

export function applySlots<T extends React.ElementType>({
  slots,
  component,
}: ApplySlotsProps<T>): React.ReactElement {
  const { children, className, css: componentCss, ...restProps } = component.props;

  return React.cloneElement(component, {
    ...restProps,
    css: componentCss,
    children: (
      <>
        {slots.startIcon && <span className="slot-startIcon">{slots.startIcon}</span>}
        {slots.avatar && <span className="slot-avatar">{slots.avatar}</span>}
        {children}
        {slots.endIcon && <span className="slot-endIcon">{slots.endIcon}</span>}
      </>
    ),
  });
}

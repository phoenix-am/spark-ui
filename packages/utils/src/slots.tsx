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

  // Generate slot elements based on slot names
  const slotElements = Object.keys(slots).map((slotName) => {
    const slotContent = slots[slotName];
    if (!slotContent) return null;

    return (
      <span key={slotName} className={`slot-${slotName}`}>
        {slotContent}
      </span>
    );
  });

  return React.cloneElement(component, {
    ...restProps,
    className,
    css: componentCss,
    children: (
      <>
        {slotElements}
        {children}
      </>
    ),
  });
}

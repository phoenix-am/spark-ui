import React, { forwardRef, useRef } from 'react';
import { Overlay as AriaOverlay, mergeRefs, usePopover } from 'react-aria';
import { useMessages } from '../internal/messages';
import type { AriaPopoverProps } from 'react-aria';
import type { OverlayTriggerState } from 'react-stately';
import { usePortalTheme } from '../internal/usePortalTheme';
import { cx } from '../internal/cx';

/** Like React Aria's DismissButton (a hidden close button for screen readers), with a translated name. */
function DismissButton({ onDismiss }: { onDismiss: () => void }) {
  const m = useMessages();
  return (
    <button type="button" tabIndex={-1} aria-label={m.dismiss} onClick={onDismiss} className="sp-visually-hidden" style={{ position: 'absolute', width: 1, height: 1, padding: 0, margin: -1, overflow: 'hidden', clip: 'rect(0 0 0 0)', whiteSpace: 'nowrap', border: 0 }} />
  );
}

export interface PopoverProps extends Omit<AriaPopoverProps, 'popoverRef' | 'triggerRef'> {
  /** Open state, from `useOverlayTriggerState` or a component state (select, combobox, menu). */
  state: OverlayTriggerState;
  /** The element the popover is attached to. Its theme is copied to the popover. */
  triggerRef: React.RefObject<Element | null>;
  /** Make the popover at least as wide as the trigger. */
  matchTriggerWidth?: boolean;
  /** Leave focus handling to the content (used by submenus). */
  disableFocusManagement?: boolean;
  /** Extra class names for the outermost element. */
  className?: string;
  /** Inline styles for the outermost element. */
  style?: React.CSSProperties;
  /** The popover's content. */
  children: React.ReactNode;
}

/**
 * A floating panel anchored to a trigger, with focus management and dismissal
 * handled. The building block under Dropdown, Menu and the date pickers.
 *
 * A floating panel attached to a trigger, under Dropdown, Combobox,
 * Menu and DatePicker. Positions itself and flips to stay on screen, renders
 * in a portal that keeps the current theme, closes on outside click and
 * Escape, and has hidden dismiss buttons for screen readers.
 *
 * Style hooks: `.sp-popover[data-placement]`.
 */
export const Popover = forwardRef<HTMLDivElement, PopoverProps>(function Popover(
  { state, triggerRef, matchTriggerWidth, disableFocusManagement, className, style, children, placement = 'bottom start', offset = 6, isNonModal, ...rest },
  ref,
) {
  const popoverRef = useRef<HTMLDivElement>(null);
  const { popoverProps, underlayProps, placement: actual } = usePopover(
    { ...rest, placement, offset, isNonModal, popoverRef, triggerRef: triggerRef as React.RefObject<Element> },
    state,
  );
  const { themeProps } = usePortalTheme(true, triggerRef);
  const width = matchTriggerWidth ? (triggerRef.current as HTMLElement | null)?.offsetWidth : undefined;
  return (
    <AriaOverlay disableFocusManagement={disableFocusManagement}>
      <div {...themeProps} style={{ ...themeProps.style, display: 'contents' }}>
        {!isNonModal && <div {...underlayProps} style={{ position: 'fixed', inset: 0 }} />}
        <div
          {...popoverProps}
          ref={mergeRefs(popoverRef, ref) as React.Ref<HTMLDivElement>}
          className={cx('sp-popover', className)}
          data-placement={actual ?? undefined}
          style={{ ...popoverProps.style, minWidth: width, ...style }}
        >
          {!isNonModal && <DismissButton onDismiss={state.close} />}
          {children}
          <DismissButton onDismiss={state.close} />
        </div>
      </div>
    </AriaOverlay>
  );
});

export default Popover;

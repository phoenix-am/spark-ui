import React, { useRef } from 'react';
import { createPortal } from 'react-dom';
import { FocusScope, useModalOverlay } from 'react-aria';
import { useOverlayTriggerState } from 'react-stately';
import { usePortalTheme } from '../internal/usePortalTheme';
import { cx } from '../internal/cx';

export interface OverlayProps {
  /** Whether the overlay is shown. */
  open: boolean;
  /** Called on Escape or (when `dismissable`) a click outside the panel. */
  onClose: () => void;
  /** Close on a click outside the panel. Default `true`. */
  dismissable?: boolean;
  /** Ignore Escape. Default `false`. */
  keyboardDismissDisabled?: boolean;
  /** Class for the full-screen root. */
  className?: string;
  /** Class for the dimmed backdrop. */
  backdropClassName?: string;
  /**
   * Render the panel. Spread `panelProps` on it and attach `panelRef`.
   * Use a component here if you need hooks (e.g. `useDialog`).
   */
  children: (panel: { panelProps: React.HTMLAttributes<HTMLElement>; panelRef: React.RefObject<HTMLDivElement> }) => React.ReactNode;
}

/**
 * Overlay: the full-screen layer under Modal (and future Drawer and
 * Sheet). Renders in a portal that keeps the current theme, dims the page,
 * traps and restores focus, hides the page from screen readers, blocks
 * scrolling, and closes on Escape or an outside click.
 *
 * Style hooks: `.sp-overlay`, `.sp-overlay__backdrop`.
 */
export function Overlay({ open, ...rest }: OverlayProps) {
  const { anchorRef, themeProps } = usePortalTheme(open);
  const anchor = <span ref={anchorRef} hidden />;
  if (!open || typeof document === 'undefined') return anchor;
  return (
    <>
      {anchor}
      {createPortal(<OverlaySurface {...rest} themeProps={themeProps} />, document.body)}
    </>
  );
}

function OverlaySurface({
  onClose,
  dismissable = true,
  keyboardDismissDisabled = false,
  className,
  backdropClassName,
  children,
  themeProps,
}: Omit<OverlayProps, 'open'> & { themeProps: ReturnType<typeof usePortalTheme>['themeProps'] }) {
  const panelRef = useRef<HTMLDivElement>(null);
  const state = useOverlayTriggerState({ isOpen: true, onOpenChange: (isOpen) => !isOpen && onClose() });
  const { modalProps, underlayProps } = useModalOverlay(
    { isDismissable: dismissable, isKeyboardDismissDisabled: keyboardDismissDisabled },
    state,
    panelRef,
  );
  return (
    <div className={cx('sp-overlay', className)} data-state="open" {...themeProps} {...underlayProps}>
      <div aria-hidden="true" className={cx('sp-overlay__backdrop', backdropClassName)} />
      <FocusScope contain restoreFocus autoFocus>
        {children({ panelProps: modalProps, panelRef })}
      </FocusScope>
    </div>
  );
}

export default Overlay;

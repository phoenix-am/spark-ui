import React, { useEffect, useId, useRef } from 'react';
import { createPortal } from 'react-dom';
import { usePortalTheme } from '../internal/usePortalTheme';

const FOCUSABLE =
  'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])';

export interface ModalProps {
  /** Whether the dialog is shown. */
  open: boolean;
  /** Called on Escape, the close button, or a backdrop click. */
  onClose: () => void;
  /** Dialog heading; also its accessible name. */
  title: React.ReactNode;
  /** Supporting text under the title; read as the dialog's description. */
  description?: React.ReactNode;
  children?: React.ReactNode;
  /** Buttons, usually. Rendered right-aligned in the footer. */
  actions?: React.ReactNode;
  /** Max width: small 400px, medium 520px, large 720px. */
  size?: 'small' | 'medium' | 'large';
  /** Close when the backdrop is clicked. Default `true`. */
  closeOnBackdrop?: boolean;
  /** Class for the dialog panel. */
  className?: string;
}

/**
 * Modal: a power cut. The page dims with a flicker and the dialog is the only
 * thing left lit. Traps focus, closes on Escape and gives focus back on close.
 *
 * Style hooks: `.sp-modal`, `__backdrop`, `__panel[data-size]`, `__current`,
 * `__header`, `__title`, `__description`, `__close`, `__body`, `__actions`.
 */
export function Modal({ open, onClose, title, description, children, actions, size = 'medium', closeOnBackdrop = true, className }: ModalProps) {
  const panelRef = useRef<HTMLDivElement>(null);
  const restoreRef = useRef<HTMLElement | null>(null);
  const titleId = useId();
  const descId = useId();
  const { anchorRef, themeProps } = usePortalTheme(open);
  const onCloseRef = useRef(onClose);
  onCloseRef.current = onClose;

  useEffect(() => {
    if (!open) return;
    restoreRef.current = document.activeElement as HTMLElement;
    const { overflow } = document.body.style;
    document.body.style.overflow = 'hidden';

    const panel = panelRef.current;
    const first = panel?.querySelector<HTMLElement>(FOCUSABLE);
    (first ?? panel)?.focus();

    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.stopPropagation();
        onCloseRef.current();
      }
      if (e.key === 'Tab' && panel) {
        const items = Array.from(panel.querySelectorAll<HTMLElement>(FOCUSABLE));
        if (!items.length) return;
        const firstEl = items[0];
        const lastEl = items[items.length - 1];
        if (e.shiftKey && document.activeElement === firstEl) {
          e.preventDefault();
          lastEl.focus();
        } else if (!e.shiftKey && document.activeElement === lastEl) {
          e.preventDefault();
          firstEl.focus();
        }
      }
    };
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = overflow;
      restoreRef.current?.focus?.();
    };
  }, [open]);

  const anchor = <span ref={anchorRef} hidden />;
  if (!open || typeof document === 'undefined') return anchor;

  return (
    <>
    {anchor}
    {createPortal(
    <div className="sp-modal" data-state="open" {...themeProps}>
      <div aria-hidden="true" className="sp-modal__backdrop" onClick={closeOnBackdrop ? onClose : undefined} />
      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        aria-describedby={description ? descId : undefined}
        tabIndex={-1}
        data-size={size}
        className={['sp-modal__panel', className].filter(Boolean).join(' ')}
      >
        <div aria-hidden="true" className="sp-modal__current sp-current" />
        <div className="sp-modal__header">
          <div className="sp-modal__heading">
            <h2 id={titleId} className="sp-modal__title">
              {title}
            </h2>
            {description && (
              <p id={descId} className="sp-modal__description">
                {description}
              </p>
            )}
          </div>
          <button type="button" aria-label="Close" onClick={onClose} className="sp-modal__close">
            <svg width="16" height="16" viewBox="0 0 16 16" aria-hidden="true">
              <path d="M3 3l10 10M13 3L3 13" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
            </svg>
          </button>
        </div>
        {children && <div className="sp-modal__body">{children}</div>}
        <div className="sp-modal__actions">{actions}</div>
      </div>
    </div>,
    document.body,
  )}
    </>
  );
}

export default Modal;

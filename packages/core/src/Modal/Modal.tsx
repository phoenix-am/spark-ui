import React, { useEffect, useId, useRef } from 'react';
import { createPortal } from 'react-dom';
import { css, keyframes } from '@emotion/react';
import { useTheme } from '@spark-ui/system';
import { alpha } from '@spark-ui/utils';
import { currentLine } from '../internal/tone';

/** The lights flicker and drop, like a power cut, as the modal takes over. */
const powerCut = keyframes`
  0% { opacity: 0; }
  20% { opacity: 0.85; }
  30% { opacity: 0.4; }
  45% { opacity: 0.9; }
  100% { opacity: 1; }
`;
const rise = keyframes`
  from { opacity: 0; transform: translateY(12px) scale(0.98); }
  to { opacity: 1; transform: none; }
`;

const FOCUSABLE =
  'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])';

export interface ModalProps {
  open: boolean;
  onClose: () => void;
  title: React.ReactNode;
  description?: React.ReactNode;
  children?: React.ReactNode;
  /** Buttons, usually. Rendered right-aligned in the footer. */
  actions?: React.ReactNode;
  size?: 'small' | 'medium' | 'large';
  /** Close when the backdrop is clicked. Default `true`. */
  closeOnBackdrop?: boolean;
}

const widths = { small: '400px', medium: '520px', large: '720px' };

/**
 * Modal: a power cut. The page dims with a flicker and the dialog is the only
 * thing left lit. Traps focus, closes on Escape and gives focus back on close.
 */
export function Modal({ open, onClose, title, description, children, actions, size = 'medium', closeOnBackdrop = true }: ModalProps) {
  const { theme } = useTheme();
  const panelRef = useRef<HTMLDivElement>(null);
  const restoreRef = useRef<HTMLElement | null>(null);
  const titleId = useId();
  const descId = useId();
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

  if (!open || typeof document === 'undefined') return null;

  return createPortal(
    <div
      css={css`
        position: fixed;
        inset: 0;
        z-index: ${theme.zIndex.modal};
        display: flex;
        align-items: center;
        justify-content: center;
        padding: 1rem;
        font-family: ${theme.typography.fontFamily};
      `}
    >
      <div
        aria-hidden="true"
        onClick={closeOnBackdrop ? onClose : undefined}
        css={css`
          position: absolute;
          inset: 0;
          background: ${alpha('#000000', 0.78)};
          animation: ${powerCut} 420ms linear both;
          @media (prefers-reduced-motion: reduce) {
            animation: none;
          }
        `}
      />
      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        aria-describedby={description ? descId : undefined}
        tabIndex={-1}
        css={css`
          position: relative;
          width: 100%;
          max-width: ${widths[size]};
          max-height: calc(100vh - 2rem);
          overflow: auto;
          box-sizing: border-box;
          background: ${theme.surface.raised};
          border: 1px solid ${theme.surface.borderStrong};
          border-radius: ${theme.borderRadius.large};
          box-shadow: ${theme.shadows['2xlarge']}, 0 0 60px ${alpha(theme.energy.current, 0.12)};
          color: ${theme.text.primary};
          animation: ${rise} ${theme.motion.normal} ${theme.motion.easing} 120ms both;
          outline: none;
          @media (prefers-reduced-motion: reduce) {
            animation: none;
          }
        `}
      >
        <div
          aria-hidden="true"
          css={css`
            height: 3px;
            background-color: ${alpha(theme.energy.current, 0.3)};
            ${currentLine(theme.energy.current)};
          `}
        />
        <div css={css`padding: 1.5rem 1.5rem 0; display: flex; gap: 1rem; align-items: flex-start;`}>
          <div css={css`flex: 1; min-width: 0;`}>
            <h2 id={titleId} css={css`margin: 0; font-size: 1.25rem; font-weight: 700;`}>
              {title}
            </h2>
            {description && (
              <p id={descId} css={css`margin: 0.375rem 0 0; color: ${theme.text.secondary}; font-size: ${theme.typography.fontSize.small}; line-height: 1.6;`}>
                {description}
              </p>
            )}
          </div>
          <button
            type="button"
            aria-label="Close"
            onClick={onClose}
            css={css`
              flex: none;
              width: 2.25rem;
              height: 2.25rem;
              display: inline-flex;
              align-items: center;
              justify-content: center;
              border: none;
              border-radius: ${theme.borderRadius.small};
              background: transparent;
              color: ${theme.text.secondary};
              cursor: pointer;
              &:hover {
                background: ${theme.surface.border};
                color: ${theme.text.primary};
              }
              &:focus-visible {
                outline: 2px solid ${theme.energy.current};
              }
            `}
          >
            <svg width="16" height="16" viewBox="0 0 16 16" aria-hidden="true">
              <path d="M3 3l10 10M13 3L3 13" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
            </svg>
          </button>
        </div>
        {children && <div css={css`padding: 1rem 1.5rem 0; line-height: 1.6;`}>{children}</div>}
        <div css={css`display: flex; flex-wrap: wrap; justify-content: flex-end; gap: 0.75rem; padding: 1.5rem;`}>{actions}</div>
      </div>
    </div>,
    document.body,
  );
}

export default Modal;

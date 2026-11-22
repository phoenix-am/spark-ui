import React from 'react';
import { useMessages } from '../internal/messages';
import { useDialog } from 'react-aria';
import { Overlay } from '../base/Overlay';
import { useDefaults, slot, ClassNames } from '../internal/defaults';

export interface ModalProps {
  /** Whether the dialog is shown. */
  open: boolean;
  /** Called on Escape, the close button, or a click outside the dialog. */
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
  /** Close when the user clicks outside the dialog. Default `true`. */
  closeOnBackdrop?: boolean;
  /** Class for the dialog panel. */
  className?: string;
  /** Extra classes for each part: root, backdrop, panel, header, title, description, close, body, actions. */
  classNames?: ClassNames<'root' | 'backdrop' | 'panel' | 'header' | 'title' | 'description' | 'close' | 'body' | 'actions'>;
}

/**
 * A dialog for decisions that need full attention, like confirming a delete.
 * Focus stays inside while it's open, Escape closes it, and focus returns to
 * where it came from.
 *
 * A power cut. The page dims with a flicker and the dialog is the only
 * thing left lit. Behaviour comes from React Aria: focus is contained and
 * restored, the page behind is hidden from screen readers and can't scroll,
 * and Escape or an outside click closes it. Built on the Overlay base.
 *
 * Style hooks: `.sp-modal`, `__backdrop`, `__panel[data-size]`, `__current`,
 * `__header`, `__title`, `__description`, `__close`, `__body`, `__actions`.
 */
export function Modal(inProps: ModalProps) {
  const { open, onClose, closeOnBackdrop = true, classNames, ...rest } = useDefaults('Modal', inProps);
  return (
    <Overlay
      open={open}
      onClose={onClose}
      dismissable={closeOnBackdrop}
      className={slot('sp-modal', classNames, 'root')}
      backdropClassName={slot('sp-modal__backdrop', classNames, 'backdrop')}
    >
      {({ panelProps, panelRef }) => (
        <ModalPanel {...rest} onClose={onClose} classNames={classNames} panelProps={panelProps} panelRef={panelRef} />
      )}
    </Overlay>
  );
}

function ModalPanel({
  onClose,
  title,
  description,
  children,
  actions,
  size = 'medium',
  className,
  classNames,
  panelProps,
  panelRef,
}: Omit<ModalProps, 'open'> & { panelProps: React.HTMLAttributes<HTMLElement>; panelRef: React.RefObject<HTMLDivElement> }) {
  const m = useMessages();
  const { dialogProps, titleProps } = useDialog({}, panelRef);
  const descId = React.useId();

  return (
    <div
      {...panelProps}
      {...dialogProps}
      ref={panelRef}
      aria-describedby={description ? descId : undefined}
      data-size={size}
      className={slot('sp-modal__panel', classNames, 'panel', className)}
    >
      <div aria-hidden="true" className="sp-modal__current sp-current" />
      <div className={slot('sp-modal__header', classNames, 'header')}>
        <div className="sp-modal__heading">
          <h2 {...titleProps} className={slot('sp-modal__title', classNames, 'title')}>
            {title}
          </h2>
          {description && (
            <p id={descId} className={slot('sp-modal__description', classNames, 'description')}>
              {description}
            </p>
          )}
        </div>
        <button type="button" aria-label={m.close} onClick={onClose} className={slot('sp-modal__close', classNames, 'close')}>
          <svg width="16" height="16" viewBox="0 0 16 16" aria-hidden="true">
            <path d="M3 3l10 10M13 3L3 13" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
          </svg>
        </button>
      </div>
      {children && <div className={slot('sp-modal__body', classNames, 'body')}>{children}</div>}
      <div className={slot('sp-modal__actions', classNames, 'actions')}>{actions}</div>
    </div>
  );
}

export default Modal;

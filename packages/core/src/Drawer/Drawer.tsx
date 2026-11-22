import React, { useId } from 'react';
import { useMessages } from '../internal/messages';
import { useDialog } from 'react-aria';
import { Overlay } from '../base/Overlay';
import { useDefaults, slot, ClassNames } from '../internal/defaults';

export interface DrawerProps {
  /** Whether the drawer is open. */
  open: boolean;
  /** Called on Escape, the close button or (when `dismissable`) a click on the backdrop. */
  onClose: () => void;
  /**
   * Edge it slides from. `start`/`end` follow reading direction (`end` is the
   * right in English, the left in Arabic). Default `end`.
   */
  placement?: 'start' | 'end' | 'top' | 'bottom';
  /** `small` (20rem), `medium` (28rem, default), `large` (40rem), `full`, or any CSS length. */
  size?: 'small' | 'medium' | 'large' | 'full' | (string & {});
  /** Heading; also the dialog's accessible name. */
  title?: React.ReactNode;
  /** Accessible name when there is no visible title. */
  'aria-label'?: string;
  /** Text under the title. */
  description?: React.ReactNode;
  children?: React.ReactNode;
  /** Footer content, e.g. Cancel and Save buttons. */
  actions?: React.ReactNode;
  /** Close on a click on the backdrop. Default `true`. */
  dismissable?: boolean;
  /** Show the × button. Default `true`. */
  closeButton?: boolean;
  className?: string;
  /** Extra classes for each part: root, backdrop, panel, header, title, description, body, actions, close. */
  classNames?: ClassNames<'root' | 'backdrop' | 'panel' | 'header' | 'title' | 'description' | 'body' | 'actions' | 'close'>;
}

const SIZES: Record<string, string> = { small: '20rem', medium: '28rem', large: '40rem', full: '100%' };

/**
 * Drawer: a panel that slides in from an edge, for filters, details, forms
 * or navigation on small screens. Current runs along its inner edge as it
 * powers on. Built on the Overlay base: focus is trapped and returned,
 * the page behind is hidden from screen readers and doesn't scroll, and
 * Escape or a backdrop click closes it.
 *
 * Style hooks: `.sp-drawer[data-placement]`, `__backdrop`, `__panel`,
 * `__header`, `__title`, `__description`, `__body`, `__actions`, `__close`.
 * Variable: `--sp-drawer-size`.
 */
export function Drawer(inProps: DrawerProps) {
  const { open, onClose, dismissable = true, placement = 'end', classNames, ...rest } = useDefaults('Drawer', inProps);
  return (
    <Overlay
      open={open}
      onClose={onClose}
      dismissable={dismissable}
      className={slot('sp-drawer', classNames, 'root')}
      backdropClassName={slot('sp-drawer__backdrop', classNames, 'backdrop')}
    >
      {({ panelProps, panelRef }) => (
        <Panel {...rest} placement={placement} onClose={onClose} classNames={classNames} panelProps={panelProps} panelRef={panelRef} />
      )}
    </Overlay>
  );
}

function Panel({
  placement,
  size = 'medium',
  title,
  'aria-label': ariaLabel,
  description,
  children,
  actions,
  closeButton = true,
  onClose,
  className,
  classNames,
  panelProps,
  panelRef,
}: Omit<DrawerProps, 'open' | 'dismissable'> & { panelProps: React.HTMLAttributes<HTMLElement>; panelRef: React.RefObject<HTMLDivElement> }) {
  const m = useMessages();
  const { dialogProps, titleProps } = useDialog({ 'aria-label': title ? undefined : ariaLabel }, panelRef);
  const descId = useId();
  return (
    <div
      {...panelProps}
      {...dialogProps}
      ref={panelRef}
      aria-describedby={description ? descId : undefined}
      className={slot('sp-drawer__panel', classNames, 'panel', className)}
      data-placement={placement}
      style={{ '--sp-drawer-size': SIZES[size] ?? size } as React.CSSProperties}
    >
      <span aria-hidden="true" className="sp-drawer__current sp-current" />
      {(title || closeButton) && (
        <div className={slot('sp-drawer__header', classNames, 'header')}>
          <div className="sp-drawer__heading">
            {title && (
              <h2 {...titleProps} className={slot('sp-drawer__title', classNames, 'title')}>
                {title}
              </h2>
            )}
            {description && (
              <p id={descId} className={slot('sp-drawer__description', classNames, 'description')}>
                {description}
              </p>
            )}
          </div>
          {closeButton && (
            <button type="button" aria-label={m.close} onClick={onClose} className={slot('sp-drawer__close sp-modal__close', classNames, 'close')}>
              <svg width="16" height="16" viewBox="0 0 16 16" aria-hidden="true">
                <path d="M3 3l10 10M13 3L3 13" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
              </svg>
            </button>
          )}
        </div>
      )}
      <div className={slot('sp-drawer__body', classNames, 'body')}>{children}</div>
      {actions && <div className={slot('sp-drawer__actions', classNames, 'actions')}>{actions}</div>}
    </div>
  );
}

export default Drawer;

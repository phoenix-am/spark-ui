import React, { useState } from 'react';
import { useMessages } from '../internal/messages';
import { useDefaults, slot, ClassNames } from '../internal/defaults';

export type AlertTone = 'info' | 'success' | 'warning' | 'error';

export interface AlertProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'title'> {
  /** Default `info`. Each tone ships with its own icon, so meaning is never colour alone. */
  tone?: AlertTone;
  title?: React.ReactNode;
  children?: React.ReactNode;
  /** Replace the tone icon, or `false` to hide it. */
  icon?: React.ReactNode | false;
  /** Buttons or links on the right (or below on narrow screens). */
  action?: React.ReactNode;
  /** Show a close button. Called after it hides. */
  onDismiss?: () => void;
  /** `soft` (default), `outlined`, or `banner` (full-width, square, for the top of a page). */
  variant?: 'soft' | 'outlined' | 'banner';
  /**
   * `polite` announces it when it appears, `assertive` interrupts (errors).
   * Default: `assertive` for error, otherwise none (static content).
   */
  live?: 'polite' | 'assertive' | 'off';
  dismissLabel?: string;
  classNames?: ClassNames<'root' | 'icon' | 'title' | 'body' | 'action' | 'dismiss'>;
}

const paths: Record<AlertTone, string> = {
  info: 'M12 8h.01M11 12h1v4h1',
  success: 'M8 12.5l2.5 2.5L16 9.5',
  warning: 'M12 8v5M12 16h.01',
  error: 'M9 9l6 6M15 9l-6 6',
};

function ToneIcon({ tone }: { tone: AlertTone }) {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      {tone === 'warning' ? <path d="M10.3 3.9 1.8 18a2 2 0 0 0 1.7 3h17a2 2 0 0 0 1.7-3L13.7 3.9a2 2 0 0 0-3.4 0z" /> : <circle cx="12" cy="12" r="9" />}
      <path d={paths[tone]} />
    </svg>
  );
}

/**
 * Alert: a message about the page or a task — info, success, warning or
 * error — with an icon, optional title, actions and a dismiss button. Use
 * `variant="banner"` for a site-wide strip. Errors are announced at once;
 * others are static unless you set `live`.
 *
 * Style hooks: `.sp-alert[data-tone][data-variant]`, `__icon`, `__title`, `__body`, `__action`, `__dismiss`.
 */
export function Alert(inProps: AlertProps) {
  const m = useMessages();
  const { tone = 'info', title, children, icon, action, onDismiss, variant = 'soft', live, dismissLabel = m.dismiss, className, classNames, ...rest } = useDefaults(
    'Alert',
    inProps,
  ) as AlertProps;
  const [open, setOpen] = useState(true);
  if (!open) return null;
  const mode = live ?? (tone === 'error' ? 'assertive' : 'off');
  const role = mode === 'assertive' ? 'alert' : mode === 'polite' ? 'status' : undefined;
  return (
    <div {...rest} role={role} className={slot('sp-alert', classNames, 'root', className)} data-tone={tone === 'info' ? 'brand' : tone} data-kind={tone} data-variant={variant}>
      {icon !== false && <span className={slot('sp-alert__icon', classNames, 'icon')}>{icon ?? <ToneIcon tone={tone} />}</span>}
      <div className="sp-alert__content">
        {title && <div className={slot('sp-alert__title', classNames, 'title')}>{title}</div>}
        {children && <div className={slot('sp-alert__body', classNames, 'body')}>{children}</div>}
      </div>
      {action && <div className={slot('sp-alert__action', classNames, 'action')}>{action}</div>}
      {onDismiss && (
        <button
          type="button"
          className={slot('sp-alert__dismiss', classNames, 'dismiss')}
          aria-label={dismissLabel}
          onClick={() => {
            setOpen(false);
            onDismiss();
          }}
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
            <path d="M6 6l12 12M18 6 6 18" />
          </svg>
        </button>
      )}
    </div>
  );
}

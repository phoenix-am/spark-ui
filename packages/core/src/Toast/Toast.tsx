import React, { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { Tone } from '../internal/tone';
import { usePortalTheme } from '../internal/usePortalTheme';

export interface ToastOptions {
  /** Bold first line. */
  title: React.ReactNode;
  /** Optional second line. */
  description?: React.ReactNode;
  /** Default `brand`. `error` toasts are announced immediately (role="alert"). */
  tone?: Tone;
  /** Auto-dismiss after this many ms. `0` keeps it until closed. Default 4000. */
  duration?: number;
  /** One action button, e.g. Undo. The toast closes after it runs. */
  action?: { label: string; onClick: () => void };
}

type ToastItem = ToastOptions & Required<Pick<ToastOptions, 'tone' | 'duration'>> & { id: number };

interface ToastApi {
  /** Show a toast; returns its id. */
  toast: (options: ToastOptions) => number;
  /** Close a toast by id. */
  dismiss: (id: number) => void;
}

const ToastContext = createContext<ToastApi | null>(null);

/** Show toasts from anywhere inside <ToastProvider>. */
export const useToast = (): ToastApi => {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error('useToast must be used inside <ToastProvider>');
  return ctx;
};

let seq = 0;

/**
 * Wrap your app once. Toasts stack bottom-right (max 5); the bottom bar
 * discharges as the timer runs and pauses on hover or focus.
 *
 * Style hooks: `.sp-toast-region`, `.sp-toast[data-tone]`, `__led`, `__title`,
 * `__description`, `__action`, `__close`, `__timer`.
 */
export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<ToastItem[]>([]);
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  const { anchorRef, themeProps } = usePortalTheme(items.length > 0);

  const dismiss = useCallback((id: number) => setItems((all) => all.filter((t) => t.id !== id)), []);
  const toast = useCallback((o: ToastOptions) => {
    const id = ++seq;
    setItems((all) => [...all.slice(-4), { tone: 'brand', duration: 4000, ...o, id }]);
    return id;
  }, []);
  const api = useMemo(() => ({ toast, dismiss }), [toast, dismiss]);

  return (
    <ToastContext.Provider value={api}>
      {children}
      <span ref={anchorRef} hidden />
      {mounted &&
        createPortal(
          <div role="region" aria-label="Notifications" className="sp-toast-region" {...themeProps}>
            {items.map((t) => (
              <ToastCard key={t.id} item={t} onClose={() => dismiss(t.id)} />
            ))}
          </div>,
          document.body,
        )}
    </ToastContext.Provider>
  );
}

function ToastCard({ item, onClose }: { item: ToastItem; onClose: () => void }) {
  const [paused, setPaused] = useState(false);
  const remaining = useRef(item.duration);
  const started = useRef(Date.now());

  useEffect(() => {
    if (!item.duration || paused) return;
    started.current = Date.now();
    const t = window.setTimeout(onClose, remaining.current);
    return () => {
      window.clearTimeout(t);
      remaining.current -= Date.now() - started.current;
    };
  }, [paused, item.duration, onClose]);

  return (
    <div
      role={item.tone === 'error' ? 'alert' : 'status'}
      className="sp-toast"
      data-tone={item.tone}
      data-paused={paused || undefined}
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocus={() => setPaused(true)}
      onBlur={() => setPaused(false)}
    >
      <span aria-hidden="true" className="sp-toast__led" />
      <div className="sp-toast__content">
        <strong className="sp-toast__title">{item.title}</strong>
        {item.description && <span className="sp-toast__description">{item.description}</span>}
        {item.action && (
          <button
            type="button"
            className="sp-toast__action"
            onClick={() => {
              item.action!.onClick();
              onClose();
            }}
          >
            {item.action.label}
          </button>
        )}
      </div>
      <button type="button" aria-label="Dismiss notification" onClick={onClose} className="sp-toast__close">
        <svg width="14" height="14" viewBox="0 0 16 16" aria-hidden="true">
          <path d="M3 3l10 10M13 3L3 13" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
        </svg>
      </button>
      {item.duration > 0 && (
        <span aria-hidden="true" className="sp-toast__timer" style={{ animationDuration: `${item.duration}ms` }} />
      )}
    </div>
  );
}

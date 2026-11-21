import React, { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { css, keyframes } from '@emotion/react';
import { useTheme } from '@spark-ui/system';
import { getTone, Tone } from '../internal/tone';

export interface ToastOptions {
  title: React.ReactNode;
  description?: React.ReactNode;
  tone?: Tone;
  /** Auto-dismiss after this many ms. `0` keeps it until closed. Default 4000. */
  duration?: number;
  action?: { label: string; onClick: () => void };
}

type ToastItem = ToastOptions & Required<Pick<ToastOptions, 'tone' | 'duration'>> & { id: number };

interface ToastApi {
  toast: (options: ToastOptions) => number;
  dismiss: (id: number) => void;
}

const ToastContext = createContext<ToastApi | null>(null);

/** Show toasts from anywhere inside <ToastProvider>. */
export const useToast = (): ToastApi => {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error('useToast must be used inside <ToastProvider>');
  return ctx;
};

const slideIn = keyframes`
  from { opacity: 0; transform: translateX(24px); }
  to { opacity: 1; transform: none; }
`;
const discharge = keyframes`from { transform: scaleX(1); } to { transform: scaleX(0); }`;

let seq = 0;

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const { theme } = useTheme();
  const [items, setItems] = useState<ToastItem[]>([]);
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

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
      {mounted &&
        createPortal(
          <div
            role="region"
            aria-label="Notifications"
            css={css`
              position: fixed;
              right: 1rem;
              bottom: 1rem;
              left: 1rem;
              z-index: ${theme.zIndex.modal + 100};
              display: flex;
              flex-direction: column;
              align-items: flex-end;
              gap: 0.625rem;
              pointer-events: none;
            `}
          >
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
  const { theme } = useTheme();
  const tone = getTone(item.tone, theme);
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

  const urgent = item.tone === 'error';

  return (
    <div
      role={urgent ? 'alert' : 'status'}
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocus={() => setPaused(true)}
      onBlur={() => setPaused(false)}
      css={css`
        pointer-events: auto;
        position: relative;
        overflow: hidden;
        width: min(380px, 100%);
        box-sizing: border-box;
        display: flex;
        gap: 0.75rem;
        align-items: flex-start;
        padding: 0.875rem 0.875rem 1rem 1rem;
        background: ${theme.surface.raised};
        border: 1px solid ${theme.surface.borderStrong};
        border-left: 3px solid ${tone.fill};
        border-radius: ${theme.borderRadius.medium};
        box-shadow: ${theme.shadows.large}, 0 0 24px ${tone.glow};
        font-family: ${theme.typography.fontFamily};
        color: ${theme.text.primary};
        animation: ${slideIn} ${theme.motion.normal} ${theme.motion.easing} both;
        @media (prefers-reduced-motion: reduce) {
          animation: none;
        }
      `}
    >
      <span
        aria-hidden="true"
        css={css`
          flex: none;
          width: 10px;
          height: 10px;
          margin-top: 5px;
          border-radius: 50%;
          background: ${tone.fill};
          box-shadow: 0 0 10px ${tone.glowStrong};
        `}
      />
      <div css={css`flex: 1; min-width: 0;`}>
        <strong css={css`display: block; font-size: 0.9375rem;`}>{item.title}</strong>
        {item.description && (
          <span css={css`display: block; margin-top: 0.2rem; font-size: 0.8125rem; line-height: 1.5; color: ${theme.text.secondary};`}>
            {item.description}
          </span>
        )}
        {item.action && (
          <button
            type="button"
            onClick={() => {
              item.action!.onClick();
              onClose();
            }}
            css={css`
              margin-top: 0.5rem;
              padding: 0.25rem 0;
              border: none;
              background: none;
              color: ${tone.fill};
              font: inherit;
              font-size: 0.8125rem;
              font-weight: 700;
              cursor: pointer;
              text-decoration: underline;
              text-underline-offset: 3px;
            `}
          >
            {item.action.label}
          </button>
        )}
      </div>
      <button
        type="button"
        aria-label="Dismiss notification"
        onClick={onClose}
        css={css`
          flex: none;
          width: 2rem;
          height: 2rem;
          margin: -0.25rem -0.25rem 0 0;
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
            outline: 2px solid ${tone.fill};
          }
        `}
      >
        <svg width="14" height="14" viewBox="0 0 16 16" aria-hidden="true">
          <path d="M3 3l10 10M13 3L3 13" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
        </svg>
      </button>
      {item.duration > 0 && (
        <span
          aria-hidden="true"
          css={css`
            position: absolute;
            left: 0;
            right: 0;
            bottom: 0;
            height: 2px;
            background: ${tone.fill};
            transform-origin: left;
            animation: ${discharge} ${item.duration}ms linear both;
            animation-play-state: ${paused ? 'paused' : 'running'};
          `}
        />
      )}
    </div>
  );
}

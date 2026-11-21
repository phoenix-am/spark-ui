import React, {
  createContext,
  useCallback,
  useContext,
  useId,
  useLayoutEffect,
  useRef,
  useState,
} from 'react';
import { css } from '@emotion/react';
import { useTheme } from '@spark-ui/system';
import { currentLine, getTone, Tone } from '../internal/tone';

interface TabsContextValue {
  value: string;
  select: (value: string) => void;
  baseId: string;
  color: Tone;
  register: (value: string, el: HTMLButtonElement | null) => void;
  tabs: React.MutableRefObject<Map<string, HTMLButtonElement>>;
}

const TabsContext = createContext<TabsContextValue | null>(null);
const useTabs = () => {
  const ctx = useContext(TabsContext);
  if (!ctx) throw new Error('Tab components must be used inside <Tabs>');
  return ctx;
};

export interface TabsProps {
  value?: string;
  defaultValue: string;
  onChange?: (value: string) => void;
  color?: Tone;
  children: React.ReactNode;
  className?: string;
}

/**
 * Tabs: every tab sits on one wire. The active tab is the lit segment, and the
 * current slides along the wire when you switch.
 */
export function Tabs({ value, defaultValue, onChange, color = 'brand', children, className }: TabsProps) {
  const [inner, setInner] = useState(defaultValue);
  const current = value ?? inner;
  const baseId = useId();
  const tabs = useRef(new Map<string, HTMLButtonElement>());

  const select = useCallback(
    (v: string) => {
      if (value === undefined) setInner(v);
      onChange?.(v);
    },
    [value, onChange],
  );
  const register = useCallback((v: string, el: HTMLButtonElement | null) => {
    if (el) tabs.current.set(v, el);
    else tabs.current.delete(v);
  }, []);

  return (
    <TabsContext.Provider value={{ value: current, select, baseId, color, register, tabs }}>
      <div className={className}>{children}</div>
    </TabsContext.Provider>
  );
}

export interface TabListProps {
  children: React.ReactNode;
  'aria-label'?: string;
}

export function TabList({ children, ...rest }: TabListProps) {
  const { theme } = useTheme();
  const { value, tabs, color, select } = useTabs();
  const tone = getTone(color, theme);
  const listRef = useRef<HTMLDivElement>(null);
  const [bar, setBar] = useState({ left: 0, width: 0 });

  useLayoutEffect(() => {
    const el = tabs.current.get(value);
    const list = listRef.current;
    if (!el || !list) return;
    const measure = () => setBar({ left: el.offsetLeft, width: el.offsetWidth });
    measure();
    const ro = typeof ResizeObserver !== 'undefined' ? new ResizeObserver(measure) : null;
    ro?.observe(list);
    return () => ro?.disconnect();
  }, [value, tabs]);

  const onKeyDown = (e: React.KeyboardEvent) => {
    const order = Array.from(tabs.current.entries()).filter(([, el]) => !el.disabled);
    const idx = order.findIndex(([v]) => v === value);
    let next = -1;
    if (e.key === 'ArrowRight') next = (idx + 1) % order.length;
    else if (e.key === 'ArrowLeft') next = (idx - 1 + order.length) % order.length;
    else if (e.key === 'Home') next = 0;
    else if (e.key === 'End') next = order.length - 1;
    if (next < 0) return;
    e.preventDefault();
    const [v, el] = order[next];
    select(v);
    el.focus();
  };

  return (
    <div
      ref={listRef}
      role="tablist"
      onKeyDown={onKeyDown}
      css={css`
        position: relative;
        display: flex;
        gap: 0.25rem;
        overflow-x: auto;
        scrollbar-width: none;
        padding-bottom: 2px;
        background: linear-gradient(${theme.energy.off}, ${theme.energy.off}) left bottom / 100% 2px no-repeat;
      `}
      {...rest}
    >
      {children}
      <span
        aria-hidden="true"
        css={css`
          position: absolute;
          bottom: 0;
          height: 2px;
          background-color: ${tone.glow};
          ${currentLine(tone.fill)};
          box-shadow: 0 0 10px ${tone.glow};
          transition: left ${theme.motion.normal} ${theme.motion.easing}, width ${theme.motion.normal} ${theme.motion.easing};
          @media (prefers-reduced-motion: reduce) {
            transition: none;
          }
        `}
        style={{ left: bar.left, width: bar.width }}
      />
    </div>
  );
}

export interface TabProps extends Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, 'value'> {
  value: string;
  icon?: React.ReactNode;
}

export function Tab({ value, icon, children, disabled, ...rest }: TabProps) {
  const { theme } = useTheme();
  const ctx = useTabs();
  const tone = getTone(ctx.color, theme);
  const active = ctx.value === value;

  return (
    <button
      ref={(el) => ctx.register(value, el)}
      type="button"
      role="tab"
      id={`${ctx.baseId}-tab-${value}`}
      aria-selected={active}
      aria-controls={`${ctx.baseId}-panel-${value}`}
      tabIndex={active ? 0 : -1}
      disabled={disabled}
      onClick={() => ctx.select(value)}
      css={css`
        display: inline-flex;
        align-items: center;
        gap: 0.5rem;
        min-height: 2.75rem;
        padding: 0 1.125rem;
        border: none;
        background: transparent;
        white-space: nowrap;
        font-family: ${theme.typography.fontFamily};
        font-size: ${theme.typography.fontSize.small};
        font-weight: ${active ? 700 : 500};
        color: ${disabled ? theme.text.disabled : active ? theme.text.primary : theme.text.secondary};
        cursor: ${disabled ? 'not-allowed' : 'pointer'};
        border-radius: ${theme.borderRadius.small} ${theme.borderRadius.small} 0 0;
        transition: color ${theme.motion.fast};

        svg > path {
          stroke: ${active ? tone.fill : 'currentColor'};
        }
        &:hover:not(:disabled) {
          color: ${theme.text.primary};
        }
        &:focus-visible {
          outline: 2px solid ${tone.fill};
          outline-offset: -2px;
        }
      `}
      {...rest}
    >
      {icon}
      {children}
    </button>
  );
}

export interface TabPanelProps extends React.HTMLAttributes<HTMLDivElement> {
  value: string;
}

export function TabPanel({ value, children, ...rest }: TabPanelProps) {
  const { theme } = useTheme();
  const ctx = useTabs();
  if (ctx.value !== value) return null;
  return (
    <div
      role="tabpanel"
      id={`${ctx.baseId}-panel-${value}`}
      aria-labelledby={`${ctx.baseId}-tab-${value}`}
      tabIndex={0}
      css={css`
        padding: 1rem 0;
        font-family: ${theme.typography.fontFamily};
        color: ${theme.text.primary};
        &:focus-visible {
          outline: 2px solid ${theme.energy.current};
          outline-offset: 2px;
        }
      `}
      {...rest}
    >
      {children}
    </div>
  );
}

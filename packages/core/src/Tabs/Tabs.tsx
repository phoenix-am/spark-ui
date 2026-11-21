import React, { createContext, useCallback, useContext, useId, useLayoutEffect, useRef, useState } from 'react';
import { Tone } from '../internal/tone';
import { cx } from '../internal/cx';

interface TabsContextValue {
  value: string;
  select: (value: string) => void;
  baseId: string;
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
  /** Controlled active tab. */
  value?: string;
  /** Initially active tab when uncontrolled. */
  defaultValue: string;
  onChange?: (value: string) => void;
  /** Colour of the lit segment. Default `brand`. */
  color?: Tone;
  children: React.ReactNode;
  className?: string;
}

/**
 * Tabs: every tab sits on one wire. The active tab is the lit segment, and the
 * current slides along the wire when you switch.
 *
 * Style hooks: `.sp-tabs`, `.sp-tab-list`, `.sp-tab[aria-selected]`,
 * `.sp-tab-list__current`, `.sp-tab-panel`.
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
    <TabsContext.Provider value={{ value: current, select, baseId, register, tabs }}>
      <div className={cx('sp-tabs', className)} data-tone={color}>
        {children}
      </div>
    </TabsContext.Provider>
  );
}

export interface TabListProps {
  children: React.ReactNode;
  /** Describe the set of tabs for screen readers. */
  'aria-label'?: string;
  className?: string;
}

export function TabList({ children, className, ...rest }: TabListProps) {
  const { value, tabs, select } = useTabs();
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
    <div ref={listRef} role="tablist" onKeyDown={onKeyDown} className={cx('sp-tab-list', className)} {...rest}>
      {children}
      <span aria-hidden="true" className="sp-tab-list__current sp-current" style={{ left: bar.left, width: bar.width }} />
    </div>
  );
}

export interface TabProps extends Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, 'value'> {
  /** Matches a TabPanel's `value`. */
  value: string;
  /** Icon shown before the label. */
  icon?: React.ReactNode;
}

export function Tab({ value, icon, children, disabled, className, ...rest }: TabProps) {
  const ctx = useTabs();
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
      data-state={active ? 'active' : 'inactive'}
      onClick={() => ctx.select(value)}
      className={cx('sp-tab', className)}
      {...rest}
    >
      {icon}
      {children}
    </button>
  );
}

export interface TabPanelProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Matches a Tab's `value`. */
  value: string;
}

export function TabPanel({ value, children, className, ...rest }: TabPanelProps) {
  const ctx = useTabs();
  if (ctx.value !== value) return null;
  return (
    <div
      role="tabpanel"
      id={`${ctx.baseId}-panel-${value}`}
      aria-labelledby={`${ctx.baseId}-tab-${value}`}
      tabIndex={0}
      className={cx('sp-tab-panel', className)}
      {...rest}
    >
      {children}
    </div>
  );
}

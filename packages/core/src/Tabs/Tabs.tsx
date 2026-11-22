import React, { createContext, useCallback, useContext, useRef, useState } from 'react';
import { useTab, useTabList, useTabPanel } from 'react-aria';
import { Item, useTabListState, TabListState } from 'react-stately';
import { Tone } from '../internal/tone';
import { cx } from '../internal/cx';
import { useDefaults } from '../internal/defaults';
import { useIsoLayoutEffect } from '../internal/useIsoLayoutEffect';

interface TabEntry {
  value: string;
  textValue: string;
  disabled: boolean;
  ref: React.RefObject<HTMLElement>;
}

interface TabsContextValue {
  state: TabListState<TabEntry>;
  orientation: 'horizontal' | 'vertical';
  activation: 'automatic' | 'manual';
  register: (entry: TabEntry) => () => void;
}

const TabsContext = createContext<TabsContextValue | null>(null);
const useTabs = () => {
  const ctx = useContext(TabsContext);
  if (!ctx) throw new Error('Tab components must be used inside <Tabs>');
  return ctx;
};

/** Keep tabs in document order, so arrow keys follow what people see. */
const byDocumentOrder = (a: TabEntry, b: TabEntry) => {
  const x = a.ref.current;
  const y = b.ref.current;
  if (!x || !y) return 0;
  return x.compareDocumentPosition(y) & Node.DOCUMENT_POSITION_FOLLOWING ? -1 : 1;
};

export interface TabsProps {
  /** Controlled active tab. */
  value?: string;
  /** Initially active tab when uncontrolled. Defaults to the first enabled tab. */
  defaultValue?: string;
  /** Called with the newly selected tab's value. */
  onChange?: (value: string) => void;
  /** Colour of the lit segment. Default `brand`. */
  color?: Tone;
  /** Lay tabs out in a row (default) or a column. Arrow keys follow. */
  orientation?: 'horizontal' | 'vertical';
  /**
   * `automatic` (default): arrow keys select as they move.
   * `manual`: arrow keys move focus; Enter or Space selects (use for slow panels).
   */
  activation?: 'automatic' | 'manual';
  /** A TabList and its TabPanels. */
  children: React.ReactNode;
  className?: string;
}

/**
 * Tabs: every tab sits on one wire. The active tab is the lit segment, and the
 * current slides along the wire when you switch. Behaviour comes from React
 * Aria: arrow keys (mirrored in right-to-left languages), Home/End, vertical
 * orientation, and automatic or manual activation.
 *
 * Works when rendered from a React Server Component: tabs register
 * themselves instead of being read out of `children`.
 *
 * Style hooks: `.sp-tabs[data-orientation]`, `.sp-tab-list`,
 * `.sp-tab[aria-selected][data-focus-visible]`, `.sp-tab-list__current`, `.sp-tab-panel`.
 */
export function Tabs(inProps: TabsProps) {
  const {
    value,
    defaultValue,
    onChange,
    color = 'brand',
    orientation = 'horizontal',
    activation = 'automatic',
    children,
    className,
  } = useDefaults('Tabs', inProps);

  const [entries, setEntries] = useState<TabEntry[]>([]);
  const register = useCallback((entry: TabEntry) => {
    setEntries((prev) => [...prev.filter((e) => e.value !== entry.value), entry].sort(byDocumentOrder));
    return () => setEntries((prev) => prev.filter((e) => e !== entry));
  }, []);

  const state = useTabListState<TabEntry>({
    items: entries,
    children: (e) => <Item key={e.value} textValue={e.textValue}>{e.textValue}</Item>,
    selectedKey: value,
    defaultSelectedKey: defaultValue,
    onSelectionChange: (key) => onChange?.(String(key)),
    disabledKeys: entries.filter((e) => e.disabled).map((e) => e.value),
  });

  return (
    <TabsContext.Provider value={{ state, orientation, activation, register }}>
      <div className={cx('sp-tabs', className)} data-tone={color} data-orientation={orientation}>
        {children}
      </div>
    </TabsContext.Provider>
  );
}

export interface TabListProps {
  /** <Tab> elements. */
  children: React.ReactNode;
  /** Describe the set of tabs for screen readers. */
  'aria-label'?: string;
  className?: string;
}

export function TabList({ className, children, ...rest }: TabListProps) {
  const { state, orientation, activation } = useTabs();
  const listRef = useRef<HTMLDivElement>(null);
  const [bar, setBar] = useState({ left: 0, width: 0, top: 0, height: 0 });
  const { tabListProps } = useTabList({ ...rest, orientation, keyboardActivation: activation }, state, listRef);

  useIsoLayoutEffect(() => {
    const list = listRef.current;
    if (!list || state.selectedKey == null) return;
    const el = list.querySelector<HTMLElement>(`[data-key="${CSS.escape(String(state.selectedKey))}"]`);
    if (!el) return;
    const measure = () => setBar({ left: el.offsetLeft, width: el.offsetWidth, top: el.offsetTop, height: el.offsetHeight });
    measure();
    const ro = typeof ResizeObserver !== 'undefined' ? new ResizeObserver(measure) : null;
    ro?.observe(list);
    return () => ro?.disconnect();
  }, [state.selectedKey, state.collection.size]);

  const barStyle = orientation === 'vertical' ? { top: bar.top, height: bar.height } : { left: bar.left, width: bar.width };

  return (
    <div {...tabListProps} ref={listRef} className={cx('sp-tab-list', className)}>
      {children}
      <span aria-hidden="true" className="sp-tab-list__current sp-current" style={barStyle} />
    </div>
  );
}

export interface TabProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'children'> {
  /** Matches a TabPanel's `value`. */
  value: string;
  /** Icon shown before the label. */
  icon?: React.ReactNode;
  disabled?: boolean;
  children?: React.ReactNode;
}

/** One tab. Use inside <TabList>. */
export function Tab({ value, icon, children, disabled = false, className, ...rest }: TabProps) {
  const { state, register } = useTabs();
  const ref = useRef<HTMLDivElement>(null);
  const textValue = typeof children === 'string' ? children : value;
  useIsoLayoutEffect(() => register({ value, textValue, disabled, ref }), [register, value, textValue, disabled]);
  const { tabProps, isSelected, isDisabled } = useTab({ key: value, isDisabled: disabled }, state, ref);
  return (
    <div
      {...rest}
      {...tabProps}
      ref={ref}
      data-key={value}
      data-state={isSelected ? 'active' : 'inactive'}
      data-disabled={isDisabled || undefined}
      className={cx('sp-tab', className)}
    >
      {icon}
      {children}
    </div>
  );
}

export interface TabPanelProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Matches a Tab's `value`. */
  value: string;
}

export function TabPanel({ value, children, className, ...rest }: TabPanelProps) {
  const { state } = useTabs();
  if (state.selectedKey == null || String(state.selectedKey) !== value) return null;
  return (
    <ActivePanel className={className} rest={rest}>
      {children}
    </ActivePanel>
  );
}

function ActivePanel({ children, className, rest }: { children: React.ReactNode; className?: string; rest: React.HTMLAttributes<HTMLDivElement> }) {
  const { state } = useTabs();
  const ref = useRef<HTMLDivElement>(null);
  const { tabPanelProps } = useTabPanel({}, state, ref);
  return (
    <div {...rest} {...tabPanelProps} ref={ref} className={cx('sp-tab-panel', className)}>
      {children}
    </div>
  );
}

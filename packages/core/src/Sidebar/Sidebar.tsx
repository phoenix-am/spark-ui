import React, { useEffect, useId, useState } from 'react';
import { useMessages } from '../internal/messages';
import { useLocale } from 'react-aria';
import { Drawer } from '../Drawer';
import { Tooltip } from '../Tooltip';
import { useDefaults, slot, ClassNames } from '../internal/defaults';

export interface SidebarItem {
  /** Unique id; `value` / `onChange` use it. */
  id: string;
  label: string;
  icon?: React.ReactNode;
  /** Make the item a link. */
  href?: string;
  /** Called when chosen (after `onChange`). */
  onSelect?: () => void;
  /** Small count or label at the end, e.g. `3` or "New". */
  badge?: React.ReactNode;
  disabled?: boolean;
  /** Nested items: the item becomes a group that opens and closes. */
  items?: SidebarItem[];
}

export interface SidebarSection {
  /** Heading over the section. */
  heading?: string;
  items: SidebarItem[];
}

export interface SidebarProps {
  /** Items, or sections of items with a heading. */
  items: Array<SidebarItem | SidebarSection>;
  /** Active item id (controlled). */
  value?: string;
  defaultValue?: string;
  onChange?: (id: string) => void;
  /** Icon-only rail (desktop). Controlled. */
  collapsed?: boolean;
  defaultCollapsed?: boolean;
  onCollapsedChange?: (collapsed: boolean) => void;
  /** Show the collapse button. Default `true`. */
  collapsible?: boolean;
  /** Top area, e.g. a logo. Receives whether the sidebar is collapsed. */
  header?: React.ReactNode | ((collapsed: boolean) => React.ReactNode);
  /** Bottom area, e.g. the signed-in user. */
  footer?: React.ReactNode | ((collapsed: boolean) => React.ReactNode);
  /** Viewport width (px) below which the sidebar becomes a drawer. Default 768. `0` turns this off. */
  mobileBreakpoint?: number;
  /** Drawer open state on small screens (controlled). Open it from your own menu button. */
  mobileOpen?: boolean;
  onMobileOpenChange?: (open: boolean) => void;
  /** Accessible name of the navigation. Default "Main". */
  'aria-label'?: string;
  className?: string;
  /** Extra classes for each part: root, header, nav, section, heading, item, footer, toggle. */
  classNames?: ClassNames<'root' | 'header' | 'nav' | 'section' | 'heading' | 'item' | 'footer' | 'toggle'>;
}

const isSection = (x: SidebarItem | SidebarSection): x is SidebarSection => !(x as SidebarItem).id && Array.isArray(x.items);

/** True below `px` wide. Server render and first paint assume desktop. */
function useNarrow(px: number) {
  const [narrow, setNarrow] = useState(false);
  useEffect(() => {
    if (!px || typeof window === 'undefined' || !window.matchMedia) return;
    const mq = window.matchMedia(`(max-width: ${px - 0.02}px)`);
    const update = () => setNarrow(mq.matches);
    update();
    mq.addEventListener?.('change', update);
    return () => mq.removeEventListener?.('change', update);
  }, [px]);
  return narrow;
}

const contains = (item: SidebarItem, id?: string): boolean => !!id && (item.id === id || !!item.items?.some((c) => contains(c, id)));

/**
 * Your app's main navigation. Group links into sections, collapse it to icons
 * when space is tight, and on phones it becomes a drawer that slides in.
 *
 * App navigation. Items sit on a wire down the side; the active
 * item is lit. Sections with headings, nested groups that open and close,
 * badges, links (with `aria-current="page"`), a collapsed icon-only rail
 * with tooltips, and a drawer on small screens. A real `<nav>` with lists,
 * so the browser's Tab order and screen-reader navigation just work.
 *
 * Style hooks: `.sp-sidebar[data-collapsed]`, `__header`, `__nav`,
 * `__section`, `__heading`, `__item[data-active][data-open]`, `__badge`,
 * `__toggle`, `__footer`. Widths: `--sp-sidebar-width`, `--sp-sidebar-rail`.
 */
export function Sidebar(inProps: SidebarProps) {
  const props = useDefaults('Sidebar', inProps);
  const m = useMessages();
  const { collapsed, defaultCollapsed = false, onCollapsedChange, mobileBreakpoint = 768, mobileOpen = false, onMobileOpenChange, value, defaultValue, onChange } = props;
  const [innerCollapsed, setInnerCollapsed] = useState(defaultCollapsed);
  const isCollapsed = collapsed ?? innerCollapsed;
  const setCollapsed = (v: boolean) => {
    if (collapsed === undefined) setInnerCollapsed(v);
    onCollapsedChange?.(v);
  };
  const [innerValue, setInnerValue] = useState(defaultValue);
  const active = value ?? innerValue;
  const select = (item: SidebarItem) => {
    if (value === undefined) setInnerValue(item.id);
    onChange?.(item.id);
    item.onSelect?.();
    onMobileOpenChange?.(false);
  };
  const narrow = useNarrow(mobileBreakpoint);

  if (narrow) {
    return (
      <Drawer open={mobileOpen} onClose={() => onMobileOpenChange?.(false)} placement="start" size="small" aria-label={props['aria-label'] ?? m.mainNavigation} closeButton>
        <SidebarContent {...props} collapsed={false} collapsible={false} active={active} select={select} mobile />
      </Drawer>
    );
  }
  return <SidebarContent {...props} collapsed={isCollapsed} setCollapsed={setCollapsed} active={active} select={select} />;
}

function SidebarContent({
  items,
  collapsed,
  setCollapsed,
  collapsible = true,
  header,
  footer,
  'aria-label': ariaLabelProp,
  className,
  classNames,
  active,
  select,
  mobile,
}: SidebarProps & { collapsed: boolean; setCollapsed?: (v: boolean) => void; active?: string; select: (item: SidebarItem) => void; mobile?: boolean }) {
  const { direction } = useLocale();
  const m = useMessages();
  const ariaLabel = ariaLabelProp ?? m.mainNavigation;
  // Consecutive loose items share one heading-less section; sections are copied, never mutated.
  const sections: Array<SidebarSection & { loose?: boolean }> = [];
  for (const x of items) {
    const last = sections[sections.length - 1];
    if (isSection(x)) sections.push({ heading: x.heading, items: x.items });
    else if (last?.loose) last.items = [...last.items, x];
    else sections.push({ items: [x], loose: true });
  }
  const render = (slotContent: SidebarProps['header']) => (typeof slotContent === 'function' ? slotContent(collapsed) : slotContent);

  return (
    <aside className={slot('sp-sidebar', classNames, 'root', className)} data-collapsed={collapsed || undefined} data-mobile={mobile || undefined} dir={direction}>
      {header && <div className={slot('sp-sidebar__header', classNames, 'header')}>{render(header)}</div>}
      <nav aria-label={ariaLabel} className={slot('sp-sidebar__nav', classNames, 'nav')}>
        {sections.map((s, i) => (
          <SectionView key={s.heading ?? i} section={s} collapsed={collapsed} active={active} select={select} classNames={classNames} expand={setCollapsed ? () => setCollapsed(false) : undefined} />
        ))}
      </nav>
      {footer && <div className={slot('sp-sidebar__footer', classNames, 'footer')}>{render(footer)}</div>}
      {collapsible && setCollapsed && (
        <button
          type="button"
          className={slot('sp-sidebar__toggle', classNames, 'toggle')}
          aria-label={collapsed ? m.expandSidebar : m.collapseSidebar}
          aria-expanded={!collapsed}
          onClick={() => setCollapsed(!collapsed)}
        >
          <svg width="16" height="16" viewBox="0 0 16 16" aria-hidden="true">
            <path d={collapsed === (direction === 'ltr') ? 'M6 3l5 5-5 5' : 'M10 3L5 8l5 5'} fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>
      )}
    </aside>
  );
}

function SectionView({ section, collapsed, active, select, classNames, expand }: { section: SidebarSection; collapsed: boolean; active?: string; select: (i: SidebarItem) => void; classNames?: SidebarProps['classNames']; expand?: () => void }) {
  const headingId = useId();
  return (
    <div className={slot('sp-sidebar__section', classNames, 'section')}>
      {section.heading && (
        <div id={headingId} className={slot('sp-sidebar__heading', classNames, 'heading')} aria-hidden={collapsed || undefined}>
          {section.heading}
        </div>
      )}
      <ul className="sp-sidebar__list" aria-labelledby={section.heading && !collapsed ? headingId : undefined}>
        {section.items.map((item) => (
          <ItemView key={item.id} item={item} depth={0} collapsed={collapsed} active={active} select={select} classNames={classNames} expand={expand} />
        ))}
      </ul>
    </div>
  );
}

function ItemView({ item, depth, collapsed, active, select, classNames, expand }: { item: SidebarItem; depth: number; collapsed: boolean; active?: string; select: (i: SidebarItem) => void; classNames?: SidebarProps['classNames']; expand?: () => void }) {
  const groupId = useId();
  const hasChildren = !!item.items?.length;
  const [open, setOpen] = useState(() => contains(item, active) && hasChildren);
  useEffect(() => {
    if (hasChildren && contains(item, active)) setOpen(true);
  }, [active]); // eslint-disable-line react-hooks/exhaustive-deps
  const isActive = item.id === active;
  const inside = <ItemInner item={item} hasChildren={hasChildren} open={open} />;
  const common = {
    className: slot('sp-sidebar__item', classNames, 'item'),
    'data-active': isActive || undefined,
    'data-current-branch': (!isActive && contains(item, active)) || undefined,
    'data-depth': depth || undefined,
    'aria-label': collapsed ? item.label : undefined,
  };

  let control: React.ReactElement;
  if (hasChildren) {
    control = (
      <button
        type="button"
        {...common}
        aria-expanded={open && !collapsed}
        aria-controls={open && !collapsed ? groupId : undefined}
        disabled={item.disabled}
        onClick={() => {
          // In the icon rail a group can't show its items, so open the sidebar first.
          if (collapsed && expand) {
            expand();
            setOpen(true);
          } else setOpen(!open);
        }}
        data-open={open || undefined}
      >
        {inside}
      </button>
    );
  } else if (item.href && !item.disabled) {
    control = (
      <a {...common} href={item.href} aria-current={isActive ? 'page' : undefined} onClick={() => select(item)}>
        {inside}
      </a>
    );
  } else {
    control = (
      <button type="button" {...common} aria-current={isActive ? 'page' : undefined} disabled={item.disabled} onClick={() => select(item)}>
        {inside}
      </button>
    );
  }

  return (
    <li>
      {collapsed && depth === 0 ? (
        <Tooltip title={item.label} placement="right">
          {control}
        </Tooltip>
      ) : (
        control
      )}
      {hasChildren && open && !collapsed && (
        <ul id={groupId} className="sp-sidebar__list sp-sidebar__list--nested">
          {item.items!.map((child) => (
            <ItemView key={child.id} item={child} depth={depth + 1} collapsed={collapsed} active={active} select={select} classNames={classNames} />
          ))}
        </ul>
      )}
    </li>
  );
}

function ItemInner({ item, hasChildren, open }: { item: SidebarItem; hasChildren: boolean; open: boolean }) {
  return (
    <>
      <span className="sp-sidebar__icon" aria-hidden="true">
        {item.icon ?? <span className="sp-sidebar__dot" />}
      </span>
      <span className="sp-sidebar__label">{item.label}</span>
      {item.badge !== undefined && <span className="sp-sidebar__badge">{item.badge}</span>}
      {hasChildren && (
        <svg className="sp-sidebar__chevron" data-open={open || undefined} width="14" height="14" viewBox="0 0 16 16" aria-hidden="true">
          <path d="M4 6l4 4 4-4" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      )}
    </>
  );
}

export default Sidebar;

import React, { cloneElement, isValidElement, useRef } from 'react';
import { mergeProps, useButton, useMenu, useMenuItem, useMenuSection, useMenuTrigger, useSeparator, useSubmenuTrigger } from 'react-aria';
import type { AriaMenuOptions } from 'react-aria';
import { Item, Section, useMenuTriggerState, useSubmenuTriggerState, useTreeState, RootMenuTriggerState, TreeState } from 'react-stately';
import type { Key, Node, Selection } from '@react-types/shared';
import { Popover } from '../base/Popover';
import { ListItemContent } from '../base/ListBox';
import { Button } from '../Button';
import { cx } from '../internal/cx';
import { useDefaults, slot, ClassNames } from '../internal/defaults';

export interface MenuItem {
  /** Passed to `onAction`. Unique within the whole menu, submenus included. */
  key: string;
  label: string;
  icon?: React.ReactNode;
  /** Secondary line under the label. */
  description?: React.ReactNode;
  /** Keyboard shortcut hint, e.g. "⌘E". Display only: wire up the shortcut yourself. */
  shortcut?: string;
  /** Destructive action (delete, remove): shown in the error colour. */
  danger?: boolean;
  disabled?: boolean;
  /** Make the item a link. */
  href?: string;
  /** Items of a submenu. Opens to the side; arrow keys move in and out. */
  items?: MenuEntry[];
}

export interface MenuSection {
  /** Optional heading. */
  title?: string;
  items: MenuItem[];
}

export type MenuEntry = MenuItem | MenuSection;

const isSection = (e: MenuEntry): e is MenuSection => !(e as MenuItem).key && Array.isArray(e.items);

export interface MenuProps {
  /** Text of the default trigger button. Ignored when `trigger` is set. */
  label?: React.ReactNode;
  /** Your own trigger, e.g. `<Button variant="text">` or an icon button. It must accept a ref. */
  trigger?: React.ReactElement;
  /** Accessible name for the menu. Defaults to the trigger's text. */
  'aria-label'?: string;
  /** Items, sections (`{ title, items }`) and submenus (`items` on an item). */
  items: MenuEntry[];
  /** Called with the chosen item's key. */
  onAction?: (key: string) => void;
  /** Make items checkable: `single` (like radio) or `multiple` (like checkboxes). Default `none`. */
  selectionMode?: 'none' | 'single' | 'multiple';
  /** Controlled checked keys. */
  selectedKeys?: Iterable<string>;
  /** Initial checked keys when uncontrolled. */
  defaultSelectedKeys?: Iterable<string>;
  /** Called with the checked keys. */
  onSelectionChange?: (keys: Set<string>) => void;
  /** Close after an item is chosen. Default `true` (`false` by default with `multiple`). */
  closeOnSelect?: boolean;
  /** Where the menu opens. Default `bottom start`. */
  placement?: 'bottom start' | 'bottom end' | 'top start' | 'top end';
  disabled?: boolean;
  onOpenChange?: (open: boolean) => void;
  className?: string;
  /** Extra classes for each part: trigger, popover, menu, item. */
  classNames?: ClassNames<'trigger' | 'popover' | 'menu' | 'item'>;
}

/**
 * Menu: a list of actions behind a button (Edit, Duplicate, Delete). Not for
 * picking a value: use Dropdown for that. Built on the Popover base and the
 * shared list-item look, with React Aria's menu behaviour: arrow keys,
 * typeahead, Enter/Space to run, Escape to close, submenus that open with
 * the right arrow (left in right-to-left), sections, links, checkable items,
 * and focus returning to the trigger.
 *
 * Style hooks: `.sp-menu`, `.sp-list-item[data-focused][data-danger][data-disabled][data-open]`,
 * `__end` (shortcut), `__chevron`, `__check`; trigger `.sp-menu-trigger`.
 */
export function Menu(inProps: MenuProps) {
  const {
    label,
    trigger,
    'aria-label': ariaLabel,
    items,
    onAction,
    selectionMode = 'none',
    selectedKeys,
    defaultSelectedKeys,
    onSelectionChange,
    closeOnSelect,
    placement = 'bottom start',
    disabled,
    onOpenChange,
    className,
    classNames,
  } = useDefaults('Menu', inProps);

  const state = useMenuTriggerState({ onOpenChange });
  const triggerRef = useRef<HTMLElement>(null);
  const { menuTriggerProps, menuProps } = useMenuTrigger({ isDisabled: disabled }, state, triggerRef);
  const { buttonProps } = useButton({ ...menuTriggerProps, isDisabled: disabled }, triggerRef);
  const name = ariaLabel ?? (typeof label === 'string' ? label : undefined);

  const triggerClass = slot('sp-menu-trigger', classNames, 'trigger');
  const triggerNode =
    trigger && isValidElement(trigger) ? (
      cloneElement(trigger as React.ReactElement<Record<string, unknown>>, {
        ...mergeProps((trigger.props as Record<string, unknown>) ?? {}, buttonProps),
        ref: triggerRef,
        className: cx((trigger.props as { className?: string }).className, triggerClass),
        'data-open': state.isOpen || undefined,
      })
    ) : (
      <Button
        {...(buttonProps as object)}
        ref={triggerRef as React.Ref<HTMLButtonElement>}
        variant="outlined"
        spark={false}
        disabled={disabled}
        className={triggerClass}
        data-open={state.isOpen || undefined}
        endIcon={
          <svg className="sp-menu-trigger__chevron" width="16" height="16" viewBox="0 0 16 16" aria-hidden="true">
            <path d="M4 6l4 4 4-4" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        }
      >
        {label}
      </Button>
    );

  return (
    <>
      {triggerNode}
      {state.isOpen && (
        <Popover state={state} triggerRef={triggerRef} placement={placement} className={slot('sp-menu__popover', classNames, 'popover', className)}>
          <MenuList
            {...menuProps}
            aria-label={name}
            entries={items}
            rootState={state}
            onAction={onAction}
            selectionMode={selectionMode}
            selectedKeys={selectedKeys}
            defaultSelectedKeys={defaultSelectedKeys}
            onSelectionChange={onSelectionChange ? (keys: Selection) => onSelectionChange(new Set(Array.from(keys as Set<Key>, String))) : undefined}
            shouldCloseOnSelect={closeOnSelect ?? selectionMode !== 'multiple'}
            menuClass={classNames?.menu}
            itemClass={classNames?.item}
          />
        </Popover>
      )}
    </>
  );
}

/* ----------------------------------------------------------------- list */

function renderEntries(entries: MenuEntry[]) {
  return entries.map((e, i) =>
    isSection(e) ? (
      <Section key={`section-${i}`} title={e.title} aria-label={e.title ? undefined : `Section ${i + 1}`}>
        {e.items.map(renderItem)}
      </Section>
    ) : (
      renderItem(e)
    ),
  );
}

function renderItem(item: MenuItem) {
  // Submenu triggers need child items in the collection so React Aria knows they open something.
  return item.items ? (
    <Item key={item.key} textValue={item.label} title={item.label} href={item.href}>
      {renderEntries(item.items)}
    </Item>
  ) : (
    <Item key={item.key} textValue={item.label} href={item.href}>
      {item.label}
    </Item>
  );
}

function indexItems(entries: MenuEntry[], map = new Map<string, MenuItem>()) {
  for (const e of entries) {
    if (isSection(e)) indexItems(e.items, map);
    else {
      map.set(e.key, e);
      if (e.items) indexItems(e.items, map);
    }
  }
  return map;
}

interface MenuListProps extends Omit<AriaMenuOptions<unknown>, 'onAction' | 'selectedKeys' | 'defaultSelectedKeys' | 'items' | 'children'> {
  entries: MenuEntry[];
  rootState: RootMenuTriggerState;
  onAction?: (key: string) => void;
  selectedKeys?: Iterable<Key> | 'all';
  defaultSelectedKeys?: Iterable<Key> | 'all';
  shouldCloseOnSelect?: boolean;
  menuClass?: string;
  itemClass?: string;
  submenuLevel?: number;
  listRef?: React.RefObject<HTMLUListElement>;
}

function MenuList({ entries, rootState, onAction, menuClass, itemClass, submenuLevel, listRef, ...props }: MenuListProps) {
  const ownRef = useRef<HTMLUListElement>(null);
  const ref = listRef ?? ownRef;
  const defs = indexItems(entries);
  const disabledKeys = Array.from(defs.values()).filter((d) => d.disabled).map((d) => d.key);
  const ariaProps = { ...props, children: renderEntries(entries), disabledKeys, onAction: (key: Key) => onAction?.(String(key)) };
  const state = useTreeState(ariaProps);
  const { menuProps } = useMenu(ariaProps, state, ref);

  return (
    <ul {...menuProps} ref={ref} className={cx('sp-menu', menuClass)} data-level={submenuLevel}>
      {Array.from(state.collection).map((node, i) =>
        node.type === 'section' ? (
          <MenuSectionView key={node.key} section={node} state={state} defs={defs} rootState={rootState} parentRef={ref} onAction={onAction} itemClass={itemClass} first={i === 0} />
        ) : (
          <MenuItemView key={node.key} node={node} state={state} defs={defs} rootState={rootState} parentRef={ref} onAction={onAction} itemClass={itemClass} />
        ),
      )}
    </ul>
  );
}

interface ItemViewShared {
  state: TreeState<unknown>;
  defs: Map<string, MenuItem>;
  rootState: RootMenuTriggerState;
  parentRef: React.RefObject<HTMLUListElement>;
  onAction?: (key: string) => void;
  itemClass?: string;
}

function MenuSectionView({ section, first, ...shared }: ItemViewShared & { section: Node<unknown>; first: boolean }) {
  const { itemProps, headingProps, groupProps } = useMenuSection({ heading: section.rendered, 'aria-label': section['aria-label'] });
  const { separatorProps } = useSeparator({ elementType: 'li' });
  return (
    <>
      {!first && <li {...separatorProps} className="sp-list-separator" />}
      <li {...itemProps} className="sp-list-section">
        {section.rendered && (
          <span {...headingProps} className="sp-list-section__heading">
            {section.rendered}
          </span>
        )}
        <ul {...groupProps} className="sp-list-section__group">
          {Array.from(shared.state.collection.getChildren!(section.key)).map((node) => (
            <MenuItemView key={node.key} node={node} {...shared} />
          ))}
        </ul>
      </li>
    </>
  );
}

function MenuItemView(props: ItemViewShared & { node: Node<unknown> }) {
  return props.node.hasChildNodes ? <SubmenuItem {...props} /> : <MenuItemRow {...props} />;
}

function MenuItemRow({
  node,
  state,
  defs,
  itemClass,
  extraProps,
  isOpen,
  itemRef,
}: ItemViewShared & { node: Node<unknown>; extraProps?: object; isOpen?: boolean; itemRef?: React.RefObject<HTMLLIElement> }) {
  const ownRef = useRef<HTMLLIElement>(null);
  const ref = itemRef ?? ownRef;
  const def = defs.get(String(node.key));
  const { menuItemProps, isFocused, isSelected, isDisabled } = useMenuItem({ key: node.key, ...extraProps }, state, ref);
  const checkable = state.selectionManager.selectionMode !== 'none';
  const Tag = (def?.href ? 'a' : 'li') as 'li';
  const row = (
    <Tag
      {...menuItemProps}
      ref={ref}
      className={cx('sp-list-item', itemClass)}
      data-focused={isFocused || undefined}
      data-selected={(checkable && isSelected) || undefined}
      data-disabled={isDisabled || undefined}
      data-danger={def?.danger || undefined}
      data-open={isOpen || undefined}
    >
      <ListItemContent
        icon={def?.icon}
        label={def?.label ?? node.textValue}
        description={def?.description}
        end={def?.shortcut ? <kbd>{def.shortcut}</kbd> : undefined}
      />
      {checkable && isSelected && (
        <svg className="sp-list-item__check" width="16" height="16" viewBox="0 0 16 16" aria-hidden="true">
          <path d="M3 8.5l3 3 7-7" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      )}
      {node.hasChildNodes && (
        <svg className="sp-list-item__chevron" width="14" height="14" viewBox="0 0 16 16" aria-hidden="true">
          <path d="M6 4l4 4-4 4" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      )}
    </Tag>
  );
  // Links sit inside a list item so the list stays valid HTML.
  return def?.href ? <li role="none">{row}</li> : row;
}

function SubmenuItem(props: ItemViewShared & { node: Node<unknown> }) {
  const { node, rootState, parentRef, onAction, itemClass, defs } = props;
  const triggerRef = useRef<HTMLLIElement>(null);
  const submenuRef = useRef<HTMLUListElement>(null);
  const subState = useSubmenuTriggerState({ triggerKey: node.key }, rootState);
  const { submenuTriggerProps, submenuProps, popoverProps } = useSubmenuTrigger({ node, parentMenuRef: parentRef, submenuRef }, subState, triggerRef);
  const def = defs.get(String(node.key));
  return (
    <>
      <MenuItemRow {...props} itemRef={triggerRef} extraProps={submenuTriggerProps} isOpen={subState.isOpen} />
      {subState.isOpen && def?.items && (
        <Popover
          {...popoverProps}
          state={subState}
          triggerRef={triggerRef}
          placement="end top"
          offset={-4}
          crossOffset={-6}
          className="sp-menu__popover sp-menu__popover--sub"
        >
          <MenuList {...submenuProps} listRef={submenuRef} entries={def.items} rootState={rootState} onAction={onAction} itemClass={itemClass} />
        </Popover>
      )}
    </>
  );
}

export default Menu;

import React, { useRef } from 'react';
import { mergeRefs, useListBox, useListBoxSection, useOption } from 'react-aria';
import type { AriaListBoxOptions } from 'react-aria';
import { Item, Section, ListState } from 'react-stately';
import type { Node } from '@react-types/shared';
import { cx } from '../internal/cx';

/** A section's items. Some React Aria collections lack getChildren(); every node has childNodes. */
function sectionChildren<T>(collection: object, section: Node<T>): Iterable<Node<T>> {
  const c = collection as { getChildren?: (key: Node<T>["key"]) => Iterable<Node<T>> };
  return typeof c.getChildren === "function" ? c.getChildren(section.key) : section.childNodes;
}


/* ------------------------------------------------------------ items */

export interface ListOption<V extends string | number = string | number> {
  /** Submitted and passed to `onChange`. Numbers come back as numbers. */
  value: V;
  /** Visible text; also used for typeahead and filtering. */
  label: string;
  /** Secondary line under the label. */
  description?: React.ReactNode;
  /** Icon before the label. */
  icon?: React.ReactNode;
  disabled?: boolean;
}

export interface ListOptionGroup<O extends ListOption = ListOption> {
  /** Heading for the group. */
  label: string;
  options: O[];
}

export type ListItems<O extends ListOption = ListOption> = Array<O | ListOptionGroup<O>>;

export const isGroup = <O extends ListOption>(o: O | ListOptionGroup<O>): o is ListOptionGroup<O> =>
  Array.isArray((o as ListOptionGroup<O>).options);

/** Every option, groups flattened. */
export const flattenOptions = <O extends ListOption>(items: ListItems<O>): O[] =>
  items.flatMap((o) => (isGroup(o) ? o.options : [o]));

/** Option values are React Aria keys; keep numbers as numbers when reading them back. */
export const findOption = <O extends ListOption>(items: ListItems<O>, key: React.Key | null | undefined) =>
  key == null ? undefined : flattenOptions(items).find((o) => String(o.value) === String(key));

/** Turn plain option objects into a React Aria collection (Items and Sections). */
export function renderListItems<O extends ListOption>(items: ListItems<O>) {
  return items.map((o, i) =>
    isGroup(o) ? (
      <Section key={`group-${i}-${o.label}`} title={o.label}>
        {o.options.map(renderOne)}
      </Section>
    ) : (
      renderOne(o)
    ),
  );
}

function renderOne<O extends ListOption>(o: O) {
  return (
    <Item key={String(o.value)} textValue={o.label}>
      <ListItemContent icon={o.icon} label={o.label} description={o.description} />
    </Item>
  );
}

export interface ListItemContentProps {
  icon?: React.ReactNode;
  label: React.ReactNode;
  description?: React.ReactNode;
  /** Shown at the end, e.g. a keyboard shortcut. */
  end?: React.ReactNode;
}

/**
 * The standard layout for an item in a list: an icon, a label, a description
 * and something at the end.
 *
 * The inside of a list row: icon, label, description and an end slot. Shared by options and menu items.
 */
export function ListItemContent({ icon, label, description, end }: ListItemContentProps) {
  return (
    <>
      {icon && (
        <span className="sp-list-item__icon" aria-hidden="true">
          {icon}
        </span>
      )}
      <span className="sp-list-item__text">
        <span className="sp-list-item__label">{label}</span>
        {description && <span className="sp-list-item__description">{description}</span>}
      </span>
      {end && <span className="sp-list-item__end">{end}</span>}
    </>
  );
}

/* ---------------------------------------------------------- listbox */

export interface ListBoxProps<T> extends AriaListBoxOptions<T> {
  /** List state from `useListState`, `useSelectState` or `useComboBoxState`. */
  state: ListState<T>;
  listBoxRef?: React.Ref<HTMLUListElement>;
  className?: string;
  /** Extra class for every option row. */
  optionClassName?: string;
  /** Inline style for every option row. */
  optionStyle?: React.CSSProperties;
  /** Shown when there are no options. */
  emptyState?: React.ReactNode;
}

/**
 * An accessible list of options with keyboard navigation and selection, the
 * engine behind Dropdown and Combobox.
 *
 * A list of options to choose from, under Dropdown and Combobox.
 * Each option is a node on a wire: the selected one lights up. Supports
 * groups with headings, icons, descriptions, disabled options and
 * screen-reader announcements.
 *
 * Style hooks: `.sp-listbox`, `.sp-list-section`, `__heading`,
 * `.sp-list-item[data-focused][data-selected][data-disabled]`, `__icon`,
 * `__label`, `__description`, `__check`, `.sp-listbox__empty`.
 */
export function ListBox<T>({ state, listBoxRef, className, optionClassName, optionStyle, emptyState, ...props }: ListBoxProps<T>) {
  const ref = useRef<HTMLUListElement>(null);
  const { listBoxProps } = useListBox(props, state, ref);
  const nodes = Array.from(state.collection);
  return (
    <ul {...listBoxProps} ref={mergeRefs(ref, listBoxRef ?? null) as React.Ref<HTMLUListElement>} className={cx('sp-listbox', className)}>
      {nodes.length === 0 && emptyState ? (
        <li className="sp-listbox__empty" role="presentation">
          {emptyState}
        </li>
      ) : (
        nodes.map((node) =>
          node.type === 'section' ? (
            <ListBoxSection key={node.key} section={node} state={state} optionClassName={optionClassName} optionStyle={optionStyle} />
          ) : (
            <ListBoxOption key={node.key} item={node} state={state} className={optionClassName} style={optionStyle} />
          ),
        )
      )}
    </ul>
  );
}

function ListBoxSection<T>({ section, state, optionClassName, optionStyle }: { section: Node<T>; state: ListState<T>; optionClassName?: string; optionStyle?: React.CSSProperties }) {
  const { itemProps, headingProps, groupProps } = useListBoxSection({ heading: section.rendered, 'aria-label': section['aria-label'] });
  return (
    <li {...itemProps} className="sp-list-section">
      {section.rendered && (
        <span {...headingProps} className="sp-list-section__heading">
          {section.rendered}
        </span>
      )}
      <ul {...groupProps} className="sp-list-section__group">
        {Array.from(sectionChildren(state.collection, section)).map((item) => (
          <ListBoxOption key={item.key} item={item} state={state} className={optionClassName} style={optionStyle} />
        ))}
      </ul>
    </li>
  );
}

function ListBoxOption<T>({ item, state, className, style }: { item: Node<T>; state: ListState<T>; className?: string; style?: React.CSSProperties }) {
  const ref = useRef<HTMLLIElement>(null);
  const { optionProps, isSelected, isFocused, isDisabled } = useOption({ key: item.key }, state, ref);
  return (
    <li
      {...optionProps}
      ref={ref}
      className={cx('sp-list-item', className)}
      style={style}
      data-selected={isSelected || undefined}
      data-focused={isFocused || undefined}
      data-disabled={isDisabled || undefined}
    >
      {item.rendered}
      {isSelected && (
        <svg className="sp-list-item__check" width="16" height="16" viewBox="0 0 16 16" aria-hidden="true">
          <path d="M3 8.5l3 3 7-7" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      )}
    </li>
  );
}

export default ListBox;

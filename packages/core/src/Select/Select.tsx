import React, { useRef } from 'react';
import { HiddenSelect, Overlay, mergeProps, useButton, useListBox, useOption, usePopover, useSelect, DismissButton } from 'react-aria';
import { Item, useSelectState, SelectState } from 'react-stately';
import type { Node } from '@react-types/shared';
import { usePortalTheme } from '../internal/usePortalTheme';
import { useDefaults, slot, ClassNames } from '../internal/defaults';

export interface SelectOption {
  /** Submitted and passed to `onChange`. */
  value: string;
  /** Visible text; also used for typeahead. */
  label: string;
  /** Secondary line under the label. */
  description?: string;
  disabled?: boolean;
}

export interface SelectProps {
  /** Visible label. Required for accessibility; hide it visually with CSS if needed. */
  label: string;
  options: SelectOption[];
  /** Controlled value (`null` for none). */
  value?: string | null;
  /** Initial value when uncontrolled. */
  defaultValue?: string;
  /** Called with the chosen option's value. */
  onChange?: (value: string) => void;
  /** Shown when nothing is selected. Default "Select an option". */
  placeholder?: string;
  /** Help text under the field. */
  helperText?: React.ReactNode;
  /** Error message. Marks the field invalid and replaces the help text. */
  error?: React.ReactNode;
  required?: boolean;
  disabled?: boolean;
  /** Form field name; a hidden native select submits the value. */
  name?: string;
  /** Default `medium`. */
  size?: 'small' | 'medium' | 'large';
  className?: string;
  /** Extra classes for each part: root, label, trigger, value, popover, option, helper. */
  classNames?: ClassNames<'root' | 'label' | 'trigger' | 'value' | 'popover' | 'option' | 'helper'>;
}

/**
 * Select: pick one option from a list. The chosen option's node lights up.
 * Behaviour comes from React Aria: typeahead on the closed and open list,
 * arrow keys, Home/End, Escape, screen-reader announcements, and a hidden
 * native select so plain forms and autofill work.
 *
 * Style hooks: `.sp-select[data-open][data-invalid][data-disabled]`, `__label`,
 * `__trigger`, `__value[data-placeholder]`, `__chevron`, `__popover`, `__list`,
 * `__option[data-selected][data-focused][data-disabled]`, `__helper`.
 */
export function Select(inProps: SelectProps) {
  const {
    label,
    options,
    value,
    defaultValue,
    onChange,
    placeholder = 'Select an option',
    helperText,
    error,
    required,
    disabled,
    name,
    size = 'medium',
    className,
    classNames,
  } = useDefaults('Select', inProps);

  const disabledKeys = options.filter((o) => o.disabled).map((o) => o.value);
  const ariaProps = {
    label,
    items: options,
    children: (o: SelectOption) => (
      <Item key={o.value} textValue={o.label}>
        {o.label}
      </Item>
    ),
    selectedKey: value,
    defaultSelectedKey: defaultValue,
    onSelectionChange: (key: React.Key | null) => key != null && onChange?.(String(key)),
    disabledKeys,
    isDisabled: disabled,
    isRequired: required,
    isInvalid: Boolean(error),
    description: helperText ? 'description' : undefined,
    errorMessage: error ? 'error' : undefined,
    name,
  };
  const state = useSelectState(ariaProps);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const { labelProps, triggerProps, valueProps, menuProps, descriptionProps, errorMessageProps } = useSelect(ariaProps, state, triggerRef);
  const { buttonProps } = useButton(triggerProps, triggerRef);
  const { anchorRef, themeProps } = usePortalTheme(state.isOpen);
  const invalid = Boolean(error);

  return (
    <div
      className={slot('sp-select', classNames, 'root', className)}
      data-tone={invalid ? 'error' : 'brand'}
      data-size={size}
      data-open={state.isOpen || undefined}
      data-invalid={invalid || undefined}
      data-disabled={disabled || undefined}
    >
      <span ref={anchorRef} hidden />
      <span {...labelProps} className={slot('sp-select__label', classNames, 'label')}>
        {label}
        {required && <span className="sp-field__required" aria-hidden="true"> *</span>}
      </span>
      <HiddenSelect state={state} triggerRef={triggerRef} label={label} name={name} isDisabled={disabled} />
      <button {...buttonProps} ref={triggerRef} className={slot('sp-select__trigger', classNames, 'trigger')}>
        <span {...valueProps} className={slot('sp-select__value', classNames, 'value')} data-placeholder={state.selectedItem ? undefined : true}>
          {state.selectedItem ? state.selectedItem.rendered : placeholder}
        </span>
        <svg className="sp-select__chevron" width="16" height="16" viewBox="0 0 16 16" aria-hidden="true">
          <path d="M4 6l4 4 4-4" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>
      {invalid ? (
        <p {...errorMessageProps} className={slot('sp-select__helper', classNames, 'helper')}>
          {error}
        </p>
      ) : (
        helperText && (
          <p {...descriptionProps} className={slot('sp-select__helper', classNames, 'helper')}>
            {helperText}
          </p>
        )
      )}
      {state.isOpen && (
        <SelectPopover state={state} triggerRef={triggerRef} themeProps={themeProps} className={slot('sp-select__popover', classNames, 'popover')}>
          <ListBox menuProps={menuProps} state={state} options={options} optionClass={classNames?.option} />
        </SelectPopover>
      )}
    </div>
  );
}

function SelectPopover({
  state,
  triggerRef,
  themeProps,
  className,
  children,
}: {
  state: SelectState<SelectOption>;
  triggerRef: React.RefObject<HTMLButtonElement>;
  themeProps: ReturnType<typeof usePortalTheme>['themeProps'];
  className: string;
  children: React.ReactNode;
}) {
  const popoverRef = useRef<HTMLDivElement>(null);
  const { popoverProps, underlayProps } = usePopover({ popoverRef, triggerRef, placement: 'bottom start', offset: 6 }, state);
  const width = triggerRef.current?.offsetWidth;
  return (
    <Overlay>
      <div {...themeProps} style={{ ...themeProps.style, display: 'contents' }}>
        <div {...underlayProps} style={{ position: 'fixed', inset: 0 }} />
        <div {...popoverProps} ref={popoverRef} className={className} style={{ ...popoverProps.style, minWidth: width }}>
          <DismissButton onDismiss={state.close} />
          {children}
          <DismissButton onDismiss={state.close} />
        </div>
      </div>
    </Overlay>
  );
}

function ListBox({
  menuProps,
  state,
  options,
  optionClass,
}: {
  menuProps: object;
  state: SelectState<SelectOption>;
  options: SelectOption[];
  optionClass?: string;
}) {
  const listRef = useRef<HTMLUListElement>(null);
  const { listBoxProps } = useListBox(menuProps, state, listRef);
  const byValue = new Map(options.map((o) => [o.value, o]));
  return (
    <ul {...listBoxProps} ref={listRef} className="sp-select__list">
      {Array.from(state.collection).map((item) => (
        <SelectOptionItem key={item.key} item={item} state={state} option={byValue.get(String(item.key))} className={optionClass} />
      ))}
    </ul>
  );
}

function SelectOptionItem({
  item,
  state,
  option,
  className,
}: {
  item: Node<SelectOption>;
  state: SelectState<SelectOption>;
  option?: SelectOption;
  className?: string;
}) {
  const ref = useRef<HTMLLIElement>(null);
  const { optionProps, isSelected, isFocused, isDisabled } = useOption({ key: item.key }, state, ref);
  return (
    <li
      {...mergeProps(optionProps)}
      ref={ref}
      className={['sp-select__option', className].filter(Boolean).join(' ')}
      data-selected={isSelected || undefined}
      data-focused={isFocused || undefined}
      data-disabled={isDisabled || undefined}
    >
      <span className="sp-select__option-text">
        <span>{item.rendered}</span>
        {option?.description && <span className="sp-select__option-description">{option.description}</span>}
      </span>
      {isSelected && (
        <svg className="sp-select__check" width="16" height="16" viewBox="0 0 16 16" aria-hidden="true">
          <path d="M3 8.5l3 3 7-7" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      )}
    </li>
  );
}

export default Select;

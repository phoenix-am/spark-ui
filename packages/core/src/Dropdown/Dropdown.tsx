import React, { useRef } from 'react';
import { useMessages } from '../internal/messages';
import { HiddenSelect, useButton, useSelect } from 'react-aria';
import { useSelectState } from 'react-stately';
import { Popover } from '../base/Popover';
import { ListBox, ListItems, ListOption, findOption, renderListItems, isGroup } from '../base/ListBox';
import { useDefaults, slot, ClassNames } from '../internal/defaults';

/** Person icon for the deprecated `forTeams` prop (inlined so the component needs no icon package). */
const User = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
    <circle cx="12" cy="7" r="4" />
  </svg>
);

export type DropdownOption<V extends string | number = string | number> = ListOption<V>;
export type DropdownOptionGroup<V extends string | number = string | number> = { label: string; options: DropdownOption<V>[] };

export interface DropdownProps<V extends string | number = string | number> {
  /** Visible label. Use `aria-label` instead if there is no visible label. */
  label?: string;
  /** Accessible name when there is no visible label. */
  'aria-label'?: string;
  /** Options, or groups of options with a heading: `{ label: 'Asia', options: [...] }`. */
  options: Array<DropdownOption<V> | DropdownOptionGroup<V>>;
  /** Controlled value (`null` for none). */
  value?: V | null;
  /** Initial value when uncontrolled. */
  defaultValue?: V;
  /** Called with the chosen option's value; its type follows the options (numbers stay numbers). */
  onChange?: (value: V) => void;
  /** Called when the list opens or closes. */
  onOpenChange?: (open: boolean) => void;
  /** Shown when nothing is selected. Default "Select an option". */
  placeholder?: string;
  /** Help text under the field (shown in the error colour when `error` is `true`). */
  helperText?: React.ReactNode;
  /** An error message, or `true` to mark the field invalid and show `helperText` as the error. */
  error?: React.ReactNode | boolean;
  required?: boolean;
  disabled?: boolean;
  /** Form field name; a hidden native select submits the value. */
  name?: string;
  /** Height 36, 46 or 54px. Default `medium`. */
  size?: 'small' | 'medium' | 'large';
  /** Icon at the start of the field. */
  startIcon?: React.ReactNode;
  /** Shown when there are no options. Default "No options". */
  emptyState?: React.ReactNode;
  onFocus?: (event: React.FocusEvent) => void;
  onBlur?: (event: React.FocusEvent) => void;
  className?: string;
  /** Extra classes for each part: root, label, trigger, value, popover, option, helper. */
  classNames?: ClassNames<'root' | 'label' | 'trigger' | 'value' | 'popover' | 'option' | 'helper'>;

  /** @deprecated Use `startIcon`. */
  prependIcon?: React.ReactNode;
  /** @deprecated Put an `icon` on each option instead. */
  appendIcon?: React.ReactNode;
  /** @deprecated Use `classNames` or CSS on `.sp-dropdown__trigger`. */
  showBorder?: boolean;
  /** @deprecated Put `icon: <User />` on each option. */
  forTeams?: boolean;
  /** @deprecated Use `classNames.root` or `className`. */
  containerStyle?: React.CSSProperties;
  /** @deprecated Use `classNames.trigger`. */
  inputStyle?: React.CSSProperties;
  /** @deprecated Use `classNames.option`. */
  itemStyle?: React.CSSProperties;
  /** @deprecated Use `classNames.popover`. */
  listContainerStyle?: React.CSSProperties;
}

/**
 * Dropdown: pick one value from a list. The chosen option's node lights up.
 * Built on the Popover and ListBox base components with React Aria:
 * typeahead on the closed and open list, arrow keys, Home/End, Escape,
 * groups with headings, screen-reader announcements, and a hidden native
 * select so plain forms and autofill work. `Select` is the same component.
 *
 * Style hooks: `.sp-dropdown[data-open][data-invalid][data-disabled]`,
 * `__label`, `__trigger`, `__value[data-placeholder]`, `__chevron`,
 * `__helper`; the list uses `.sp-popover`, `.sp-listbox` and `.sp-list-item`.
 */
export function Dropdown<V extends string | number = string | number>(inProps: DropdownProps<V>) {
  const props = useDefaults('Dropdown', useDefaults('Select', inProps));
  const m = useMessages();
  const {
    label,
    'aria-label': ariaLabel,
    options: rawOptions,
    value,
    defaultValue,
    onChange,
    onOpenChange,
    placeholder = m.selectPlaceholder,
    helperText,
    error,
    required,
    disabled,
    name,
    size = 'medium',
    startIcon,
    emptyState = m.noOptions,
    onFocus,
    onBlur,
    className,
    classNames,
    prependIcon,
    showBorder = true,
    forTeams,
    containerStyle,
    inputStyle,
    itemStyle,
    listContainerStyle,
    appendIcon,
  } = props;

  // Legacy `forTeams` puts a person icon on every option.
  const options: ListItems<ListOption<V>> = forTeams
    ? rawOptions.map((o) =>
        isGroup(o) ? { ...o, options: o.options.map((x) => ({ icon: <User />, ...x })) } : { icon: <User />, ...o },
      )
    : rawOptions;

  const invalid = Boolean(error);
  const message = typeof error === 'boolean' ? (error ? helperText : undefined) : error;
  const help = typeof error === 'boolean' || !error ? helperText : undefined;
  const disabledKeys = options.flatMap((o) => (isGroup(o) ? o.options : [o])).filter((o) => o.disabled).map((o) => String(o.value));

  const ariaProps = {
    label,
    'aria-label': ariaLabel,
    children: renderListItems(options),
    selectedKey: value === undefined ? undefined : value === null ? null : String(value),
    defaultSelectedKey: defaultValue === undefined ? undefined : String(defaultValue),
    onSelectionChange: (key: React.Key | null) => {
      const option = findOption(options, key);
      if (option) onChange?.(option.value);
    },
    onOpenChange,
    disabledKeys,
    isDisabled: disabled,
    isRequired: required,
    isInvalid: invalid,
    description: help ? 'description' : undefined,
    errorMessage: invalid && message ? 'error' : undefined,
    name,
    onFocus,
    onBlur,
  };
  const state = useSelectState(ariaProps);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const { labelProps, triggerProps, valueProps, menuProps, descriptionProps, errorMessageProps } = useSelect(ariaProps, state, triggerRef);
  const { buttonProps } = useButton(triggerProps, triggerRef);
  const selected = findOption(options, state.selectedKey);
  const icon = startIcon ?? prependIcon ?? selected?.icon;

  return (
    <div
      className={slot('sp-dropdown', classNames, 'root', className)}
      style={containerStyle}
      data-tone={invalid ? 'error' : 'brand'}
      data-size={size}
      data-open={state.isOpen || undefined}
      data-invalid={invalid || undefined}
      data-disabled={disabled || undefined}
      data-borderless={showBorder ? undefined : true}
    >
      {label && (
        <span {...labelProps} className={slot('sp-dropdown__label', classNames, 'label')}>
          {label}
          {required && (
            <span className="sp-field__required" aria-hidden="true">
              {' '}*
            </span>
          )}
        </span>
      )}
      <HiddenSelect state={state} triggerRef={triggerRef} label={label ?? ariaLabel} name={name} isDisabled={disabled} />
      <button {...buttonProps} ref={triggerRef} style={inputStyle} className={slot('sp-dropdown__trigger', classNames, 'trigger')}>
        {icon && (
          <span className="sp-dropdown__icon" aria-hidden="true">
            {icon}
          </span>
        )}
        <span {...valueProps} className={slot('sp-dropdown__value', classNames, 'value')} data-placeholder={selected ? undefined : true}>
          {selected ? selected.label : placeholder}
        </span>
        {appendIcon && (
          <span className="sp-dropdown__icon" aria-hidden="true">
            {appendIcon}
          </span>
        )}
        <svg className="sp-dropdown__chevron" width="16" height="16" viewBox="0 0 16 16" aria-hidden="true">
          <path d="M4 6l4 4 4-4" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>
      {invalid && message ? (
        <p {...errorMessageProps} className={slot('sp-dropdown__helper', classNames, 'helper')}>
          {message}
        </p>
      ) : (
        help && (
          <p {...descriptionProps} className={slot('sp-dropdown__helper', classNames, 'helper')}>
            {help}
          </p>
        )
      )}
      {state.isOpen && (
        <Popover
          state={state}
          triggerRef={triggerRef}
          matchTriggerWidth
          className={slot('sp-dropdown__popover', classNames, 'popover')}
          style={listContainerStyle}
        >
          <ListBox
            {...menuProps}
            state={state}
            optionClassName={classNames?.option}
            emptyState={emptyState}
            optionStyle={itemStyle}
          />
        </Popover>
      )}
    </div>
  );
}

export default Dropdown;

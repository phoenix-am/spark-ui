import React, { useRef } from 'react';
import { useButton, useComboBox, useFilter } from 'react-aria';
import { useComboBoxState } from 'react-stately';
import { InputBase } from '../base/InputBase';
import { Popover } from '../base/Popover';
import { ListBox, ListItems, ListOption, findOption, isGroup, renderListItems } from '../base/ListBox';
import { useDefaults, slot, ClassNames } from '../internal/defaults';

export type ComboboxOption<V extends string | number = string | number> = ListOption<V>;
export type ComboboxOptionGroup<V extends string | number = string | number> = { label: string; options: ComboboxOption<V>[] };

export interface ComboboxProps<V extends string | number = string | number> {
  /** Visible label. Use `aria-label` instead if there is no visible label. */
  label?: string;
  /** Accessible name when there is no visible label. */
  'aria-label'?: string;
  /** Options, or groups of options with a heading. */
  options: Array<ComboboxOption<V> | ComboboxOptionGroup<V>>;
  /** Controlled selected value (`null` for none). */
  value?: V | null;
  /** Initial selected value when uncontrolled. */
  defaultValue?: V;
  /** Called with the chosen option's value, or `null` when cleared. */
  onChange?: (value: V | null) => void;
  /** Controlled text in the input. */
  inputValue?: string;
  /** Initial text in the input when uncontrolled. */
  defaultInputValue?: string;
  /** Called as the user types; use it to fetch options from a server (with `filter={false}`). */
  onInputChange?: (text: string) => void;
  /**
   * How options are matched to the typed text: `contains` (default),
   * `startsWith`, or `false` when you filter yourself (e.g. server search).
   * Matching ignores case and accents.
   */
  filter?: 'contains' | 'startsWith' | false;
  /** Keep typed text that matches no option (free entry, e.g. tags or a new city). */
  allowsCustomValue?: boolean;
  /** When the list opens: on typing (`input`, default), on focus, or only with the button or arrow keys (`manual`). */
  menuTrigger?: 'input' | 'focus' | 'manual';
  /** Show a loading indicator, e.g. while fetching options. */
  loading?: boolean;
  /** Show a clear button when there is text. Default `true`. */
  clearable?: boolean;
  /** Placeholder text in the input. */
  placeholder?: string;
  /** Help text under the field (shown in the error colour when `error` is `true`). */
  helperText?: React.ReactNode;
  /** An error message, or `true` to mark the field invalid and show `helperText` as the error. */
  error?: React.ReactNode | boolean;
  required?: boolean;
  disabled?: boolean;
  /** Form field name. Submits the selected value (or the typed text with `allowsCustomValue`). */
  name?: string;
  /** Height 36, 46 or 54px. Default `medium`. */
  size?: 'small' | 'medium' | 'large';
  /** Icon at the start of the field, e.g. a search icon. */
  startIcon?: React.ReactNode;
  /** Shown when nothing matches. Default "No results". */
  emptyState?: React.ReactNode;
  /** Text shown in the list while `loading`. Default "Loading…". */
  loadingText?: React.ReactNode;
  className?: string;
  /** Extra classes for each part: root, label, field, input, popover, option, helper. */
  classNames?: ClassNames<'root' | 'label' | 'field' | 'input' | 'popover' | 'option' | 'helper'>;
}

/**
 * Combobox: type to search a list, then pick. The field charges as you type
 * and the matching option lights up. Built on the InputBase, Popover and
 * ListBox base components with React Aria: filtering that ignores case and
 * accents, arrow keys, Enter to pick, Escape to close or clear, groups,
 * free entry, server-side search, and screen-reader announcements of
 * result counts.
 *
 * Style hooks: `.sp-combobox[data-open][data-invalid][data-disabled][data-loading]`,
 * `__label`, `__helper`, `__spinner`; the field is `.sp-input-base`, the
 * list `.sp-popover`, `.sp-listbox` and `.sp-list-item`.
 */
export function Combobox<V extends string | number = string | number>(inProps: ComboboxProps<V>) {
  const {
    label,
    'aria-label': ariaLabel,
    options,
    value,
    defaultValue,
    onChange,
    inputValue,
    defaultInputValue,
    onInputChange,
    filter = 'contains',
    allowsCustomValue,
    menuTrigger = 'input',
    loading = false,
    clearable = true,
    placeholder,
    helperText,
    error,
    required,
    disabled,
    name,
    size = 'medium',
    startIcon,
    emptyState = 'No results',
    loadingText = 'Loading…',
    className,
    classNames,
  } = useDefaults('Combobox', inProps);

  const { contains, startsWith } = useFilter({ sensitivity: 'base' });
  const items = options as ListItems<ListOption<V>>;
  const invalid = Boolean(error);
  const message = typeof error === 'boolean' ? (error ? helperText : undefined) : error;
  const help = typeof error === 'boolean' || !error ? helperText : undefined;
  const disabledKeys = items.flatMap((o) => (isGroup(o) ? o.options : [o])).filter((o) => o.disabled).map((o) => String(o.value));

  const ariaProps = {
    label,
    'aria-label': ariaLabel,
    placeholder,
    children: renderListItems(items),
    selectedKey: value === undefined ? undefined : value === null ? null : String(value),
    defaultSelectedKey: defaultValue === undefined ? undefined : String(defaultValue),
    onSelectionChange: (key: React.Key | null) => onChange?.(findOption(items, key)?.value ?? null),
    inputValue,
    defaultInputValue,
    onInputChange,
    defaultFilter: filter === false ? undefined : filter === 'startsWith' ? startsWith : contains,
    allowsCustomValue,
    allowsEmptyCollection: true,
    menuTrigger,
    disabledKeys,
    isDisabled: disabled,
    isRequired: required,
    isInvalid: invalid,
    description: help ? 'description' : undefined,
    errorMessage: invalid && message ? 'error' : undefined,
  };
  const state = useComboBoxState(ariaProps);

  const inputRef = useRef<HTMLInputElement>(null);
  const fieldRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const listBoxRef = useRef<HTMLUListElement>(null);
  const popoverRef = useRef<HTMLDivElement>(null);
  const { buttonProps, inputProps, listBoxProps, labelProps, descriptionProps, errorMessageProps } = useComboBox(
    { ...ariaProps, inputRef, buttonRef, listBoxRef, popoverRef },
    state,
  );
  const { buttonProps: chevronProps } = useButton(buttonProps, buttonRef);

  const submitted = allowsCustomValue ? state.inputValue : state.selectedKey == null ? '' : String(state.selectedKey);
  const showClear = clearable && !disabled && state.inputValue !== '';

  return (
    <div
      className={slot('sp-combobox', classNames, 'root', className)}
      data-tone={invalid ? 'error' : 'brand'}
      data-size={size}
      data-open={state.isOpen || undefined}
      data-invalid={invalid || undefined}
      data-disabled={disabled || undefined}
      data-loading={loading || undefined}
    >
      {label && (
        <label {...labelProps} className={slot('sp-combobox__label', classNames, 'label')}>
          {label}
          {required && (
            <span className="sp-field__required" aria-hidden="true">
              {' '}*
            </span>
          )}
        </label>
      )}
      <InputBase
        {...(inputProps as React.InputHTMLAttributes<HTMLInputElement>)}
        ref={inputRef}
        rootRef={fieldRef}
        size={size}
        error={invalid}
        disabled={disabled}
        rootProps={{ 'data-active': state.isOpen || undefined }}
        classNames={{ root: slot('sp-combobox__field', classNames, 'field'), input: classNames?.input }}
        startAdornment={startIcon}
        endAdornment={
          <>
            {loading && <span className="sp-combobox__spinner" aria-hidden="true" />}
            {showClear && (
              <button
                type="button"
                tabIndex={-1}
                aria-label="Clear"
                className="sp-field-button"
                onClick={() => {
                  state.setSelectedKey(null);
                  state.setInputValue('');
                  inputRef.current?.focus();
                }}
              >
                <svg width="14" height="14" viewBox="0 0 16 16" aria-hidden="true">
                  <path d="M3 3l10 10M13 3L3 13" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                </svg>
              </button>
            )}
            <button {...chevronProps} ref={buttonRef} className="sp-field-button" data-chevron>
              <svg width="16" height="16" viewBox="0 0 16 16" aria-hidden="true">
                <path d="M4 6l4 4 4-4" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>
          </>
        }
      />
      {name && <input type="hidden" name={name} value={submitted} />}
      {invalid && message ? (
        <p {...errorMessageProps} className={slot('sp-combobox__helper', classNames, 'helper')}>
          {message}
        </p>
      ) : (
        help && (
          <p {...descriptionProps} className={slot('sp-combobox__helper', classNames, 'helper')}>
            {help}
          </p>
        )
      )}
      {state.isOpen && (
        <Popover
          ref={popoverRef}
          state={state}
          triggerRef={fieldRef}
          isNonModal
          matchTriggerWidth
          className={slot('sp-combobox__popover', classNames, 'popover')}
        >
          <ListBox
            {...listBoxProps}
            listBoxRef={listBoxRef}
            state={state}
            optionClassName={classNames?.option}
            emptyState={loading ? loadingText : emptyState}
          />
        </Popover>
      )}
    </div>
  );
}

export default Combobox;

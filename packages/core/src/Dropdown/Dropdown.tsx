import React from 'react';
import { DropdownProps } from './Dropdown.types';
import { cx } from '../internal/cx';
import { DropdownProvider, useDropdownContext } from './DropdownContext';
import DropdownOption from './DropdownOption';
import { ChevronDown, ChevronUp, User } from '@spark-ui/icons';
import { useDropdown } from './useDropdown';

const DropdownBase = React.forwardRef(({
  label,
  options,
  placeholder = 'Select an option',
  disabled = false,
  prependIcon,
  appendIcon,
  size = 'small',
  error = false,
  helperText,
  value,
  onChange,
  onBlur,
  onFocus,
  showBorder = true,
  forTeams,
  containerStyle,
  inputStyle,
  itemStyle,
  listContainerStyle,
  className,
}: DropdownProps, ref) => {
  const { isOpen, setIsOpen, selectedOption, setSelectedOption } = useDropdownContext();

  const {
    onFocus: handleFocus,
    onBlur: handleBlur,
    focused,
    disabled: isDisabled,
    error: hasError
  } = useDropdown({
    value,
    disabled,
    error,
    onBlur,
    onChange,
    onFocus,
  });


  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (isDisabled) return;
    if (event.key === 'Escape') {
      setIsOpen(false);
      return;
    }
    if (event.key === 'Enter' || event.key === ' ' || event.key === 'ArrowDown' || event.key === 'ArrowUp') {
      event.preventDefault();
      if (!isOpen) {
        setIsOpen(true);
        return;
      }
      if (event.key === 'Enter' || event.key === ' ') {
        setIsOpen(false);
        return;
      }
      const enabled = options.filter((o) => !o.disabled);
      if (!enabled.length) return;
      const idx = enabled.findIndex((o) => o.value === selectedOption);
      const step = event.key === 'ArrowDown' ? 1 : -1;
      const next = enabled[(idx + step + enabled.length) % enabled.length];
      setSelectedOption(next.value);
      onChange?.(next.value);
    }
  };

  const handleSelectOption = (value: string | number) => {
    setSelectedOption(value);
    setIsOpen(false);
    if (onChange) onChange(value);
  };

  return (
    <div
      className={cx('sp-dropdown', className)}
      data-size={size}
      data-tone={hasError ? 'error' : 'brand'}
      data-open={(isOpen && !isDisabled) || undefined}
      data-focused={focused || undefined}
      data-invalid={hasError || undefined}
      data-disabled={isDisabled || undefined}
      data-borderless={!showBorder || undefined}
      onClick={() => !isDisabled && setIsOpen(!isOpen)}
      onFocus={handleFocus}
      onBlur={handleBlur}
      style={{...containerStyle}}
    >
      {label && <label className="sp-dropdown__label">{label}</label>}
      <div className="sp-dropdown__control">
        {prependIcon && <div className="sp-dropdown__icon">{prependIcon || <User />}</div>}
        {forTeams && <div className="sp-dropdown__icon">{<User />}</div>}
        <input
          className="sp-dropdown__input"
          readOnly
          role="combobox"
          aria-expanded={isOpen}
          aria-haspopup="listbox"
          aria-invalid={hasError || undefined}
          aria-label={label ?? placeholder}
          disabled={isDisabled}
          onKeyDown={handleKeyDown}
          value={options.find((option) => option.value === selectedOption)?.label || ''}
          placeholder={placeholder}
          style={{...inputStyle}}
        />
        {appendIcon && <div className="sp-dropdown__icon">{appendIcon}</div>}
        <div className="sp-dropdown__chevron">
          {
            !isOpen ? <ChevronDown /> : <ChevronUp />
          }
        </div>
      </div>
      {isOpen && !disabled && (
        <ul role="listbox" className="sp-dropdown__list" style={{...listContainerStyle}}>
          {options.length ? options.map((option) => (
            <DropdownOption
              key={option.value}
              option={option}
              size={size}
              prependIcon={forTeams ? <User /> : <></>}
              selected={selectedOption === option.value}
              style={{...itemStyle}}
              onSelect={handleSelectOption}
            />
          )) : (
            <DropdownOption
              key={`no-option`}
              option={{
                label: 'No options available',
                value: '',
              }}
              size={size}
              selected={false}
              onSelect={() => {}}
              style={{...itemStyle}}
            />
          )}
        </ul>
      )}
      {helperText && <div className="sp-dropdown__helper">{helperText}</div>}
    </div>
  );
});

/**
 * @deprecated Use `Select`, which adds typeahead, full keyboard support,
 * screen-reader announcements and native form submission. Dropdown will be
 * removed in a future major version.
 */
const Dropdown = (props: DropdownProps) => (
  <DropdownProvider>
    <DropdownBase {...props} />
  </DropdownProvider>
);

export default Dropdown;

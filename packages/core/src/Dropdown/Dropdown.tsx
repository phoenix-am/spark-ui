import React from 'react';
import { useTheme } from '@spark-ui/system';
import { DropdownProps } from './Dropdown.types';
import { dropdownFieldStyles } from './Dropdown.styles';
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
}: DropdownProps, ref) => {
  const { isOpen, setIsOpen, selectedOption, setSelectedOption } = useDropdownContext();
  const { theme } = useTheme();

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

  const styles = dropdownFieldStyles({
    theme,
    size,
    disabled: isDisabled,
    focused,
    showBorder,
  });

  const handleSelectOption = (value: string | number) => {
    setSelectedOption(value);
    setIsOpen(false);
    if (onChange) onChange(value);
  };

  return (
    <div
      css={styles.container}
      onClick={() => !isDisabled && setIsOpen(!isOpen)}
      onFocus={handleFocus}
      onBlur={handleBlur}
      style={{...containerStyle}}
    >
      {label && <label css={styles.label}>{label}</label>}
      <div
        css={[styles.control, hasError && 'error', isDisabled && 'disabled']}
      >
        {prependIcon && <div css={styles.icon}>{prependIcon || <User />}</div>}
        {forTeams && <div css={styles.icon}>{<User />}</div>}
        <input
          css={styles.input}
          readOnly
          value={options.find((option) => option.value === selectedOption)?.label || ''}
          placeholder={placeholder}
          onClick={() => !isDisabled && setIsOpen(!isOpen)}
          style={{...inputStyle}}
        />
        {appendIcon && <div css={styles.icon}>{appendIcon}</div>}
        <div css={styles.dropdownIcon}>
          {
            !isOpen ? <ChevronDown /> : <ChevronUp />
          }
        </div>
      </div>
      {isOpen && !disabled && (
        <ul css={styles.dropdown} style={{...listContainerStyle}}>
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
      {helperText && <div css={styles.helperText}>{helperText}</div>}
    </div>
  );
});

const Dropdown = (props: DropdownProps) => (
  <DropdownProvider>
    <DropdownBase {...props} />
  </DropdownProvider>
);

export default Dropdown;

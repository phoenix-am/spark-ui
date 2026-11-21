import React, { ReactNode, CSSProperties } from 'react';
import { DropdownSizes, DropdownOption as OptionType } from './Dropdown.types';
import { Check } from '@spark-ui/icons';

type SelectFieldOptionProps = {
  option: OptionType;
  selected: boolean;
  onSelect: (value: string | number) => void;
  size: DropdownSizes;
  prependIcon?: ReactNode;
  style?: CSSProperties;
};

const SelectFieldOption = ({ option, selected, onSelect, size, prependIcon, style }: SelectFieldOptionProps) => {

  return (
    <li
      role="option"
      aria-selected={selected}
      aria-disabled={option.disabled || undefined}
      className={selected ? 'sp-dropdown__option selected' : 'sp-dropdown__option'}
      data-selected={selected || undefined}
      data-disabled={option.disabled || undefined}
      onClick={() => !option.disabled && onSelect(option.value)}
      style={{...style}}
    >
      <div className='dropdown__label'>
        {prependIcon && <div className='dropdown__prepend__icon'>{prependIcon}</div>}
        {option.label}
      </div>
      {selected && (
        <div className='dropdown__option__selected'>
          <Check />
        </div>
      )}
    </li>
  );
};

export default SelectFieldOption;

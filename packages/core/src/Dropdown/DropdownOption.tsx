import React, { ReactNode, CSSProperties } from 'react';
import { useTheme } from '@spark-ui/system';
import { DropdownSizes, DropdownOption as OptionType } from './Dropdown.types';
import { selectFieldOptionStyles } from './DropdownOption.styles';
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
  const { theme } = useTheme();
  const styles = selectFieldOptionStyles({ theme, size });

  return (
    <li
      css={styles.option}
      className={selected ? 'selected' : ''}
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

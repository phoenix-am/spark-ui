import { CSSProperties, ReactNode } from 'react';

export interface UseDropdownProps {
  value?: string | number;
  onChange?: (event: any) => void;
  onFocus?: (event: any) => void;
  onBlur?: (event: any) => void;
  disabled?: boolean;
  error?: boolean;
}

export interface UseDropdownResult {
  value: string | number;
  onChange: (event: any) => void;
  onFocus: (event: any) => void;
  onBlur: (event: any) => void;
  focused: boolean;
  disabled: boolean;
  error: boolean;
}

export type DropdownSizes = 'small' | 'medium' | 'large';

export interface DropdownOption {
  label: string;
  value: string | number;
  disabled?: boolean;
}

export interface DropdownProps {
  label?: string;
  options: DropdownOption[];
  showBorder?: boolean;
  placeholder?: string;
  disabled?: boolean;
  prependIcon?: ReactNode;
  appendIcon?: ReactNode;
  size?: DropdownSizes;
  error?: boolean;
  helperText?: string;
  value?: string | number;
  onChange?: (value: string | number) => void;
  onFocus?: (event: any) => void;
  onBlur?: (event: any) => void;
  forTeams?: boolean;
  containerStyle?: CSSProperties;
  itemStyle?: CSSProperties;
  inputStyle?: CSSProperties;
  listContainerStyle?: CSSProperties;
}

export interface DropdownContextProps {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  selectedOption: string | number | null;
  setSelectedOption: (option: string | number) => void;
}
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
  /** Visible label above the field. */
  label?: string;
  /** Class for the outer wrapper. */
  className?: string;
  /** The choices. Each has a `label` and a `value`. */
  options: DropdownOption[];
  /** Draw the field border. Default `true`. */
  showBorder?: boolean;
  /** Shown when nothing is selected. */
  placeholder?: string;
  disabled?: boolean;
  /** Icon at the start of the field. */
  prependIcon?: ReactNode;
  /** Icon before the chevron. */
  appendIcon?: ReactNode;
  /** Height 36, 46 or 54px. Default `small`. */
  size?: DropdownSizes;
  /** Marks the field invalid. */
  error?: boolean;
  /** Help or error text under the field. */
  helperText?: string;
  /** Initial selected value. */
  value?: string | number;
  /** Called with the selected option's value. */
  onChange?: (value: string | number) => void;
  onFocus?: (event: any) => void;
  onBlur?: (event: any) => void;
  /** Show a person icon before each option (for assigning people). */
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
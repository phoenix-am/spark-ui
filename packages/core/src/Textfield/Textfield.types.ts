import { ChangeEvent, FocusEvent, InputHTMLAttributes } from 'react';

export interface UseTextFieldProps {
  value?: string;
  onChange?: (event: ChangeEvent<HTMLInputElement>) => void;
  onFocus?: (event: FocusEvent<HTMLInputElement>) => void;
  onBlur?: (event: FocusEvent<HTMLInputElement>) => void;
  disabled?: boolean;
  error?: boolean;
}

export interface UseTextFieldResult {
  value: string;
  onChange: (event: ChangeEvent<HTMLInputElement>) => void;
  onFocus: (event: FocusEvent<HTMLInputElement>) => void;
  onBlur: (event: FocusEvent<HTMLInputElement>) => void;
  focused: boolean;
  disabled: boolean;
  error: boolean;
}

export interface TextfieldPropsBase extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  placeholder?: string;
  inputSize?: 'small' | 'medium' | 'large';
  disabled?: boolean;
  error?: boolean;
  value?: string;
  helperText?: string;
  onChange?: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onFocus: (event: FocusEvent<HTMLInputElement>) => void;
  onBlur: (event: FocusEvent<HTMLInputElement>) => void;
  variant?: 'outlined' | 'filled' | 'standard';
  prepend?: React.ReactNode;
  append?: React.ReactNode;
  cardDetection?: (value: string) => string | undefined;
  formatPhoneNumber?: (value: string) => string;
}
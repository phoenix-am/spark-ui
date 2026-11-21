import { ChangeEvent, FocusEvent, InputHTMLAttributes } from 'react';

export interface UseTextFieldProps {
  value?: string;
  onChange?: (event: ChangeEvent<HTMLInputElement>) => void;
  onFocus?: (event: FocusEvent<HTMLInputElement>) => void;
  onBlur?: (event: FocusEvent<HTMLInputElement>) => void;
  disabled?: boolean;
  error?: boolean;
  type?:
  | "button"
  | "checkbox"
  | "color"
  | "date"
  | "datetime-local"
  | "email"
  | "file"
  | "hidden"
  | "image"
  | "month"
  | "password"
  | "radio"
  | "range"
  | "reset"
  | "search"
  | "submit"
  | "text"
  | "time"
  | "url"
  | "week"
  | 'card'
  | 'currency'
  | 'phone'
  | (string & {});
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
  onFocus?: (event: FocusEvent<HTMLInputElement>) => void;
  onBlur?: (event: FocusEvent<HTMLInputElement>) => void;
  /**
   * Live Wire charge meter. A number from 0 to 1, or a function that maps the
   * current value to 0..1 (e.g. password strength). At 1 the field is fully
   * charged and current runs along the meter.
   */
  charge?: number | ((value: string) => number);
  /** Text announced next to the meter. Receives the charge as 0..100. */
  chargeLabel?: (percent: number) => React.ReactNode;
  variant?: 'outlined' | 'filled' | 'standard';
  prepend?: React.ReactNode;
  append?: React.ReactNode;
  cardDetection?: (value: string) => string | undefined;
  formatPhoneNumber?: (value: string) => string;
  containerStyle?: React.CSSProperties;
  isCurrency?: boolean;
  type?:
  | "button"
  | "checkbox"
  | "color"
  | "date"
  | "datetime-local"
  | "email"
  | "file"
  | "hidden"
  | "image"
  | "month"
  | "password"
  | "radio"
  | "range"
  | "reset"
  | "search"
  | "submit"
  | "text"
  | "time"
  | "url"
  | "week"
  | 'card'
  | 'currency'
  | 'phone'
  | (string & {});
}
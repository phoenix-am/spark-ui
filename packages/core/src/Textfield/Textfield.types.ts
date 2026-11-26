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
  /** The current text. */
  value: string;
  /** Pass to the input's onChange. */
  onChange: (event: ChangeEvent<HTMLInputElement>) => void;
  /** Pass to the input's onFocus. */
  onFocus: (event: FocusEvent<HTMLInputElement>) => void;
  /** Pass to the input's onBlur. */
  onBlur: (event: FocusEvent<HTMLInputElement>) => void;
  /** Whether the input has focus. */
  focused: boolean;
  /** Whether the field is disabled. */
  disabled: boolean;
  /** Whether the field is in its error state. */
  error: boolean;
}

export interface TextfieldPropsBase extends InputHTMLAttributes<HTMLInputElement> {
  /** Visible label, linked to the input. */
  label?: string;
  /** Initial value when uncontrolled (no `value`). Works with React Hook Form's `register`. */
  defaultValue?: string;
  /** Hint shown while the field is empty. Don't use it instead of a label; it disappears as soon as someone types. */
  placeholder?: string;
  /** Height and text size of the input. Default `medium`. */
  inputSize?: 'small' | 'medium' | 'large';
  /** Turns the control off: it can't be focused or changed, and it's announced as disabled. */
  disabled?: boolean;
  /** Shows the field in its error state. Pair it with `helperText` explaining what to fix. */
  error?: boolean;
  /** The current text, when you control the field yourself. Use `defaultValue` to let it manage its own state. */
  value?: string;
  /** Short guidance under the field. Shown in red with an error. */
  helperText?: string;
  /** Called on every keystroke with the change event; read `event.target.value`. */
  onChange?: (event: React.ChangeEvent<HTMLInputElement>) => void;
  /**
   * Called on every keystroke with the new text, then the event. Same shape as
   * `Textarea`, `Dropdown` and the other fields, so one handler style works everywhere.
   */
  onValueChange?: (value: string, event: React.ChangeEvent<HTMLInputElement>) => void;
  /** Called when the field gains focus. */
  onFocus?: (event: FocusEvent<HTMLInputElement>) => void;
  /** Called when the field loses focus. Handy for validating on blur. */
  onBlur?: (event: FocusEvent<HTMLInputElement>) => void;
  /**
   * Live Wire charge meter. A number from 0 to 1, or a function that maps the
   * current value to 0..1 (e.g. password strength). At 1 the field is fully
   * charged and current runs along the meter.
   */
  charge?: number | ((value: string) => number);
  /** Text announced next to the meter. Receives the charge as 0..100. */
  chargeLabel?: (percent: number) => React.ReactNode;
  /** Extra classes for each part: root, label, control, input, adornment, meter, helper. */
  classNames?: Partial<Record<'root' | 'label' | 'control' | 'input' | 'adornment' | 'meter' | 'helper', string>>;
  /** `outlined` (default) draws a full border, `filled` a tinted background, `standard` just an underline. */
  variant?: 'outlined' | 'filled' | 'standard';
  /** Content at the start of the input, like a currency symbol or a search icon. */
  prepend?: React.ReactNode;
  /** Content at the end of the input, like a unit (“kg”) or an icon button. */
  append?: React.ReactNode;
  /** Function that names the card network from the number typed, e.g. returns “Visa”; shown inside the field. */
  cardDetection?: (value: string) => string | undefined;
  /** Function that formats the value as it's typed, e.g. `98765 43210`. */
  formatPhoneNumber?: (value: string) => string;
  /** Inline styles for the wrapper around the label, input and helper text. */
  containerStyle?: React.CSSProperties;
  /** Formats the value as money while typing (thousand separators, two decimals). */
  isCurrency?: boolean;
  /** The kind of input, like `email`, `password` or `tel`. It sets the mobile keyboard and browser autofill. Default `text`. */
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
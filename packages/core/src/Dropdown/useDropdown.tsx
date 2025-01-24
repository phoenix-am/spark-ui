import { ChangeEvent, FocusEvent, useState } from "react";
import { UseDropdownProps, UseDropdownResult } from "./Dropdown.types";

export const useDropdown = ({
  value: initialValue = '',
  onChange: onChangeProp,
  onFocus: onFocusProp,
  onBlur: onBlurProp,
  disabled = false,
  error = false,
}: UseDropdownProps): UseDropdownResult => {
  const [value, setValue] = useState<string | number>(initialValue);
  const [focused, setFocused] = useState(false);

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    setValue(event.target.value);
    if (onChangeProp) {
      onChangeProp(event);
    }
  };

  const handleFocus = (event: FocusEvent<HTMLInputElement>) => {
    setFocused(true);
    if (onFocusProp) {
      onFocusProp(event);
    }
  };

  const handleBlur = (event: FocusEvent<HTMLInputElement>) => {
    setFocused(false);
    if (onBlurProp) {
      onBlurProp(event);
    }
  };

  return {
    value,
    onChange: handleChange,
    onFocus: handleFocus,
    onBlur: handleBlur,
    focused,
    disabled,
    error,
  };
};
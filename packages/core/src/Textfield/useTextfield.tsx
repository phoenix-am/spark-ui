import { ChangeEvent, FocusEvent, useState } from "react";
import { UseTextFieldProps, UseTextFieldResult } from "./Textfield.types";

export const useTextField = ({
  value: initialValue = '',
  onChange: onChangeProp,
  onFocus: onFocusProp,
  onBlur: onBlurProp,
  disabled = false,
  error = false,
}: UseTextFieldProps): UseTextFieldResult => {
  const [value, setValue] = useState(initialValue);
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
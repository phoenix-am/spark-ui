import { ChangeEvent, FocusEvent, useState } from "react";
import { UseTextFieldProps, UseTextFieldResult } from "./Textfield.types";

// Enum for Input Types
enum InputType {
  CURRENCY = 'currency',
  CARD = 'card',
  PHONE = 'phone',
}

// Utility functions for masking input values
const useMasking = (type?: string) => {
  const maskCurrency = (value: string): string => {
    const numericValue = value.replace(/[^\d]/g, '');
    if (!numericValue) return '';
    
    const decimalPart = numericValue.slice(-2);
    const wholePart = numericValue.slice(0, -2);
    const formattedWholePart = wholePart.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    
    return decimalPart.length > 0
      ? `${formattedWholePart}${decimalPart.length > 0 ? '.' + decimalPart : ''}`
      : formattedWholePart;
  };

  const maskCreditCard = (value: string): string => {
    return value.replace(/\d(?=\d{4})/g, '*');
  };

  const formatPhoneNumber = (value: string): string => {
    const cleaned = value.replace(/\D/g, '');
    const match = cleaned.match(/^(\d{3})(\d{3})(\d{4})$/);
    return match ? `(${match[1]}) ${match[2]}-${match[3]}` : value;
  };

  return (value: string): string => {
    switch (type) {
      case InputType.CURRENCY:
        return maskCurrency(value);
      case InputType.CARD:
        return maskCreditCard(value);
      case InputType.PHONE:
        return formatPhoneNumber(value);
      default:
        return value;
    }
  };
};

export const useTextField = ({
  value: initialValue = '',
  onChange: onChangeProp,
  onFocus: onFocusProp,
  onBlur: onBlurProp,
  disabled = false,
  error = false,
  type,
}: UseTextFieldProps): UseTextFieldResult => {
  const [value, setValue] = useState(initialValue);
  const [focused, setFocused] = useState(false);

  const applyMasking = useMasking(type);

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    const rawValue = event.target.value;
    const newValue = applyMasking(rawValue);
    setValue(newValue);

    if (onChangeProp) {
      onChangeProp({ ...event, target: { ...event.target, value: newValue } });
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

import { useState } from 'react';
import { InputBaseProps } from './InputBase.types';

export function useInputBase(props: InputBaseProps) {
  const { startAdornment, endAdornment, ...restProps } = props;

  const [value, setValue] = useState(restProps.value ?? '');

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setValue(event.target.value);
    if (restProps.onChange) {
      restProps.onChange(event);
    }
  };

  return {
    startAdornment,
    endAdornment,
    inputProps: { ...restProps, value, onChange: handleChange },
  };
}

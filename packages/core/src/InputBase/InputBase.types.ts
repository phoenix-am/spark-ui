import { InputHTMLAttributes } from 'react';

export interface InputBaseProps extends InputHTMLAttributes<HTMLInputElement> {
  variant?: 'filled' | 'outlined' | 'standard';
  error?: boolean;
  startAdornment?: React.ReactNode;
  endAdornment?: React.ReactNode;
}

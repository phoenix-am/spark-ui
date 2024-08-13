import { HTMLAttributes, ReactNode } from "react";

export interface ButtonProps extends HTMLAttributes<HTMLButtonElement> {
  variant?: 'text' | 'outlined' | 'contained';
  color?: 'primary' | 'secondary' | 'default' | 'error' | 'info' | 'success' | 'warning';
  size?: 'small' | 'medium' | 'large';
  startIcon?: ReactNode;
  endIcon?: ReactNode;
}
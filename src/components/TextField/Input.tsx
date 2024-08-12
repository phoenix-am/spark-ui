import React from 'react';
import './Input.css';

export interface InputProps {
  type: 'text' | 'password' | 'email' | 'number';
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  disabled?: boolean;
}

const Input: React.FC<InputProps> = ({ type, value, onChange, placeholder, disabled }) => {
  return (
    <div className="input-container">
      <input 
        className="input-field" 
        type={type} 
        value={value} 
        onChange={(e) => onChange(e.target.value)} 
        placeholder={placeholder}
        disabled={disabled}
      />
      <span className="focus-border"></span>
    </div>
  );
};

export default Input;

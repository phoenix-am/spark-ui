import React from 'react';

const TextFieldDropdown = ({ options }: { options: { label: string; value: string; }[] }) => (
  <select>
    {options.map((option) => (
      <option key={option.value} value={option.value}>{option.label}</option>
    ))}
  </select>
);

export default TextFieldDropdown;

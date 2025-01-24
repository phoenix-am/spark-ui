import { createContext, useContext, useState, ReactNode } from 'react';
import type { DropdownContextProps } from './Dropdown.types';

const DropdownContext = createContext<DropdownContextProps | undefined>(undefined);

export const DropdownProvider = ({ children }: { children: ReactNode }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedOption, setSelectedOption] = useState<string | number | null>(null);

  return (
    <DropdownContext.Provider value={{ isOpen, setIsOpen, selectedOption, setSelectedOption }}>
      {children}
    </DropdownContext.Provider>
  );
};

export const useDropdownContext = () => {
  const context = useContext<DropdownContextProps | undefined>(DropdownContext);
  if (!context) {
    throw new Error('useDropdownContext must be used within a DropdownProvider');
  }
  return context;
};

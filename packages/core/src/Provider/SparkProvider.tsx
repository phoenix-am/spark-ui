import React, { useContext, useMemo } from 'react';
import { I18nProvider } from 'react-aria';
import { DefaultsContext, DefaultsMap, ComponentConfig } from '../internal/defaults';
import type { ButtonTypeMap } from '../Button/Button.types';
import type { SwitchProps } from '../Switch';
import type { CheckboxProps } from '../Checkbox';
import type { TextfieldProps } from '../Textfield';
import type { SliderProps } from '../Slider';
import type { RadioGroupProps } from '../RadioGroup';
import type { TabsProps } from '../Tabs';
import type { AccordionProps } from '../Accordion';
import type { ModalProps } from '../Modal';
import type { TooltipProps } from '../Tooltip';
import type { CardProps } from '../Card';
import type { BadgeProps, ProgressProps, SpinnerProps } from '../Indicators';
import type { AvatarProps } from '../Avatar';
import type { DatePickerProps, CalendarProps } from '../DatePicker';
import type { SelectProps } from '../Select';
import type { DropdownProps } from '../Dropdown';
import type { ComboboxProps } from '../Combobox';
import type { MenuProps } from '../Menu';
import type { FieldProps } from '../Field';

/** App-wide defaults, keyed by component name. */
export interface SparkComponentsConfig {
  Button?: ComponentConfig<ButtonTypeMap['props']>;
  Switch?: ComponentConfig<SwitchProps>;
  Checkbox?: ComponentConfig<CheckboxProps>;
  Textfield?: ComponentConfig<TextfieldProps>;
  Slider?: ComponentConfig<SliderProps>;
  RadioGroup?: ComponentConfig<RadioGroupProps>;
  Dropdown?: ComponentConfig<DropdownProps>;
  /** Same component as Dropdown; both keys apply. */
  Select?: ComponentConfig<SelectProps>;
  Combobox?: ComponentConfig<ComboboxProps>;
  Menu?: ComponentConfig<MenuProps>;
  DataTable?: ComponentConfig<Record<string, unknown>>;
  DateRangePicker?: ComponentConfig<Record<string, unknown>>;
  CommandPalette?: ComponentConfig<Record<string, unknown>>;
  RangeCalendar?: ComponentConfig<Record<string, unknown>>;
  Field?: ComponentConfig<FieldProps>;
  Tabs?: ComponentConfig<TabsProps>;
  Accordion?: ComponentConfig<AccordionProps>;
  Modal?: ComponentConfig<ModalProps>;
  Tooltip?: ComponentConfig<TooltipProps>;
  Card?: ComponentConfig<CardProps>;
  Badge?: ComponentConfig<BadgeProps>;
  Progress?: ComponentConfig<ProgressProps>;
  Spinner?: ComponentConfig<SpinnerProps>;
  Avatar?: ComponentConfig<AvatarProps>;
  DatePicker?: ComponentConfig<DatePickerProps>;
  Calendar?: ComponentConfig<CalendarProps>;
}

export interface SparkProviderProps {
  /**
   * Defaults for every instance of a component, e.g.
   * `{ Button: { defaultProps: { variant: 'outlined' } }, Switch: { classNames: { bulb: 'my-bulb' } } }`.
   * Props set on an instance always win.
   */
  components?: SparkComponentsConfig;
  /**
   * BCP 47 locale for dates, number formats and keyboard direction, e.g.
   * `hi-IN`, `ar-EG`, `en-US`. Right-to-left locales mirror arrow keys.
   * Defaults to the parent provider's, then the browser's.
   */
  locale?: string;
  children: React.ReactNode;
}

/**
 * SparkProvider: set app-wide defaults and slot class names once, the way
 * MUI's `theme.components` works. Nested providers merge with their parent.
 * Styling still comes from `styles.css`; this provider only changes props.
 */
export function SparkProvider({ components, locale, children }: SparkProviderProps) {
  const parent = useContext(DefaultsContext);
  const value = useMemo<DefaultsMap>(() => {
    if (!components) return parent;
    const next: DefaultsMap = { ...parent };
    for (const [name, cfg] of Object.entries(components) as [string, ComponentConfig][]) {
      const up = parent[name];
      next[name] = {
        defaultProps: { ...up?.defaultProps, ...cfg.defaultProps },
        classNames: { ...up?.classNames, ...cfg.classNames },
      };
    }
    return next;
  }, [parent, components]);
  const tree = <DefaultsContext.Provider value={value}>{children}</DefaultsContext.Provider>;
  return locale ? <I18nProvider locale={locale}>{tree}</I18nProvider> : tree;
}

export default SparkProvider;

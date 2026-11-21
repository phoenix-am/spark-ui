import React, { useContext, useMemo } from 'react';
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
import type { FieldProps } from '../Field';

/** App-wide defaults, keyed by component name. */
export interface SparkComponentsConfig {
  Button?: ComponentConfig<ButtonTypeMap['props']>;
  Switch?: ComponentConfig<SwitchProps>;
  Checkbox?: ComponentConfig<CheckboxProps>;
  Textfield?: ComponentConfig<TextfieldProps>;
  Slider?: ComponentConfig<SliderProps>;
  RadioGroup?: ComponentConfig<RadioGroupProps>;
  Select?: ComponentConfig<SelectProps>;
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
  children: React.ReactNode;
}

/**
 * SparkProvider: set app-wide defaults and slot class names once, the way
 * MUI's `theme.components` works. Nested providers merge with their parent.
 * Styling still comes from `styles.css`; this provider only changes props.
 */
export function SparkProvider({ components, children }: SparkProviderProps) {
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
  return <DefaultsContext.Provider value={value}>{children}</DefaultsContext.Provider>;
}

export default SparkProvider;

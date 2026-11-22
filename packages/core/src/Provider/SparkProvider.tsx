import React, { useContext, useMemo } from 'react';
import { MessagesProvider, type SparkMessagesOverride } from '../internal/messages';
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
  Drawer?: ComponentConfig<Record<string, unknown>>;
  Sidebar?: ComponentConfig<Record<string, unknown>>;
  NumberField?: ComponentConfig<Record<string, unknown>>;
  Textarea?: ComponentConfig<Record<string, unknown>>;
  Alert?: ComponentConfig<Record<string, unknown>>;
  Breadcrumbs?: ComponentConfig<Record<string, unknown>>;
  Pagination?: ComponentConfig<Record<string, unknown>>;
  ToggleGroup?: ComponentConfig<Record<string, unknown>>;
  Stepper?: ComponentConfig<Record<string, unknown>>;
  FileUpload?: ComponentConfig<Record<string, unknown>>;
  TimePicker?: ComponentConfig<Record<string, unknown>>;
  LineChart?: ComponentConfig<Record<string, unknown>>;
  BarChart?: ComponentConfig<Record<string, unknown>>;
  DonutChart?: ComponentConfig<Record<string, unknown>>;
  Sparkline?: ComponentConfig<Record<string, unknown>>;
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
  /**
   * How lively the UI is: `calm` (slow current, soft glow, few sparks),
   * `default`, `electric` (fast current, bloom, big bursts) or `off`
   * (no decorative motion). Reduced-motion users always get `off`.
   * Sets `data-spark-energy` on a wrapper; you can also put that
   * attribute on `<html>` yourself.
   */
  energy?: 'off' | 'calm' | 'default' | 'electric';
  /**
   * Override any built-in text, or add a language: `{ close: 'Fermer', page: (n) => `Page ${n}` }`.
   * Hindi, Gujarati and Tamil are built in and follow `locale`.
   */
  messages?: SparkMessagesOverride;
  /** Short vibrations on Switch, Checkbox and spark bursts (phones that support it). Default `false`. */
  haptics?: boolean;
  children: React.ReactNode;
}

/**
 * Wrap your app once to set things for every component: the energy level, the
 * language, and default props or styles, so you're not repeating
 * `size="small"` on every button.
 *
 * Set app-wide defaults and slot class names once, the way
 * MUI's `theme.components` works. Nested providers merge with their parent.
 * Styling still comes from `styles.css`; this provider only changes props.
 */
export function SparkProvider({ components, locale, energy, haptics, messages, children }: SparkProviderProps) {
  const parent = useContext(DefaultsContext);
  const value = useMemo<DefaultsMap>(() => {
    if (!components) return parent;
    const next: DefaultsMap = { ...parent };
    for (const [name, cfg] of Object.entries(components) as [string, ComponentConfig][]) {
      const up = parent[name];
      next[name] = {
        defaultProps: { ...up?.defaultProps, ...cfg.defaultProps },
        classNames: { ...up?.classNames, ...cfg.classNames },
        // Parent variants first, so a nested provider's variants apply after (and win).
        variants: [...(up?.variants ?? []), ...(cfg.variants ?? [])],
      };
    }
    return next;
  }, [parent, components]);
  let tree = <DefaultsContext.Provider value={value}>{children}</DefaultsContext.Provider>;
  if (messages) tree = <MessagesProvider value={messages}>{tree}</MessagesProvider>;
  if (energy !== undefined || haptics !== undefined)
    tree = (
      <div className="sp-energy" data-spark-energy={energy} data-spark-haptics={haptics === undefined ? undefined : haptics ? 'on' : 'off'}>
        {tree}
      </div>
    );
  return locale ? <I18nProvider locale={locale}>{tree}</I18nProvider> : tree;
}

export default SparkProvider;

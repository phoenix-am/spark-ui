import React, { createContext, useContext, useRef } from 'react';
import { mergeProps, useFocusRing, useToggleButtonGroup, useToggleButtonGroupItem } from 'react-aria';
import { ToggleGroupState, useToggleGroupState } from 'react-stately';
import { useDefaults, slot, ClassNames } from '../internal/defaults';

type Mode = 'single' | 'multiple';

export interface ToggleGroupProps<M extends Mode = 'single'> {
  /** `single` (default): one at a time, like a segmented control. `multiple`: each toggles on its own (bold / italic / underline). */
  selectionMode?: M;
  /** Selected value(s): a string for `single`, a string[] for `multiple`. */
  value?: M extends 'multiple' ? string[] : string | null;
  /** Starting selection when the group manages its own state: one value, or an array with `selectionMode="multiple"`. */
  defaultValue?: M extends 'multiple' ? string[] : string | null;
  /** Called with the new selection: a value (or `null`), or an array of values in multiple mode. */
  onChange?: (value: M extends 'multiple' ? string[] : string | null) => void;
  /** In `single` mode, allow clicking the selected item to clear it. Default `false`. */
  allowEmpty?: boolean;
  /** Lay the options out in a row (`horizontal`, default) or a column. Arrow keys follow the direction. */
  orientation?: 'horizontal' | 'vertical';
  /** Height and text size. Default `medium`. */
  size?: 'small' | 'medium' | 'large';
  /** `segmented` (default): one track with a sliding fill. `outlined`: separate buttons. */
  variant?: 'segmented' | 'outlined';
  /** Stretch to fill the width. */
  fullWidth?: boolean;
  /** Turns the control off: it can't be focused or changed, and it's announced as disabled. */
  disabled?: boolean;
  /** Accessible name, read by screen readers. Use it when there's no visible label. */
  'aria-label'?: string;
  /** Id of an element whose text names this component, instead of `aria-label`. */
  'aria-labelledby'?: string;
  /** The options: one `ToggleGroupItem` each. */
  children: React.ReactNode;
  /** Extra class names for the outermost element. */
  className?: string;
  /** Extra class names for the component's inner parts, keyed by part name. Handy with Tailwind. */
  classNames?: ClassNames<'root' | 'item'>;
}

export interface ToggleGroupItemProps {
  /** Identifies this option in the group's `value` and `onChange`. */
  value: string;
  /** The option's label. */
  children?: React.ReactNode;
  /** Icon before the label. For icon-only items, pass `aria-label`. */
  icon?: React.ReactNode;
  /** Accessible name for an option that shows only an icon. */
  'aria-label'?: string;
  /** Makes just this option unavailable. */
  disabled?: boolean;
  /** Extra class names for this option's button. */
  className?: string;
}

const Ctx = createContext<{ state: ToggleGroupState; itemClass?: string } | null>(null);

/**
 * A row of buttons that act as one control. Use it as a segmented switch
 * between views, or let several be on at once, like bold and italic in a
 * toolbar. Arrow keys move between options.
 *
 * A row of related toggle buttons, as a segmented control
 * (`single`) or independent toggles (`multiple`). Arrow keys move between
 * items, one Tab stop for the group; selected items have `aria-checked` /
 * `aria-pressed`.
 *
 * ```tsx
 * <ToggleGroup aria-label="View" defaultValue="grid">
 *   <ToggleGroup.Item value="list">List</ToggleGroup.Item>
 *   <ToggleGroup.Item value="grid">Grid</ToggleGroup.Item>
 * </ToggleGroup>
 * ```
 *
 * Style hooks: `.sp-toggle-group[data-variant][data-size]`, `__item[data-selected]`.
 */
export function ToggleGroup<M extends Mode = 'single'>(inProps: ToggleGroupProps<M>) {
  const props = useDefaults('ToggleGroup', inProps) as ToggleGroupProps<M>;
  const { selectionMode = 'single' as M, allowEmpty = false, orientation = 'horizontal', size = 'medium', variant = 'segmented', fullWidth, disabled, children, className, classNames } = props;
  const toSet = (v: unknown) => (v == null ? undefined : new Set(Array.isArray(v) ? (v as string[]) : [v as string]));
  const state = useToggleGroupState({
    selectionMode,
    disallowEmptySelection: selectionMode === 'single' && !allowEmpty,
    selectedKeys: toSet(props.value),
    defaultSelectedKeys: toSet(props.defaultValue),
    onSelectionChange: (keys) => {
      const arr = Array.from(keys, String);
      (props.onChange as ((v: unknown) => void) | undefined)?.(selectionMode === 'multiple' ? arr : arr[0] ?? null);
    },
    isDisabled: disabled,
  });
  const ref = useRef<HTMLDivElement>(null);
  const { groupProps } = useToggleButtonGroup({ ...props, isDisabled: disabled, orientation }, state, ref);
  return (
    <div
      {...groupProps}
      ref={ref}
      className={slot('sp-toggle-group', classNames, 'root', className)}
      data-variant={variant}
      data-size={size}
      data-orientation={orientation}
      data-full-width={fullWidth || undefined}
      data-disabled={disabled || undefined}
    >
      <Ctx.Provider value={{ state, itemClass: classNames?.item }}>{children}</Ctx.Provider>
    </div>
  );
}

/**
 * One option inside a ToggleGroup. Give it a value and a label, or an icon
 * with an `aria-label`.
 */
function ToggleGroupItem({ value, children, icon, disabled, className, ...rest }: ToggleGroupItemProps) {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error('ToggleGroup.Item must be inside a ToggleGroup');
  const ref = useRef<HTMLButtonElement>(null);
  const { buttonProps, isPressed, isSelected, isDisabled } = useToggleButtonGroupItem({ id: value, isDisabled: disabled, 'aria-label': rest['aria-label'] }, ctx.state, ref);
  const { focusProps, isFocusVisible } = useFocusRing();
  return (
    <button
      {...mergeProps(buttonProps, focusProps)}
      ref={ref}
      className={['sp-toggle-group__item', ctx.itemClass, className].filter(Boolean).join(' ')}
      data-selected={isSelected || undefined}
      data-pressed={isPressed || undefined}
      data-disabled={isDisabled || undefined}
      data-focus-visible={isFocusVisible || undefined}
      data-icon-only={(!children && icon) || undefined}
    >
      {icon && <span className="sp-toggle-group__icon" aria-hidden="true">{icon}</span>}
      {children && <span className="sp-toggle-group__label">{children}</span>}
    </button>
  );
}

ToggleGroup.Item = ToggleGroupItem;
export { ToggleGroupItem };

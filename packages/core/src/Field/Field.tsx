import React, { cloneElement, createContext, isValidElement, useContext, useId } from 'react';
import { useDefaults, slot, ClassNames } from '../internal/defaults';

export interface FieldControlProps {
  id: string;
  'aria-describedby'?: string;
  'aria-invalid'?: true;
  'aria-required'?: true;
  required?: boolean;
  disabled?: boolean;
}

interface FieldContextValue {
  controlProps: FieldControlProps;
  labelId: string;
}

const FieldContext = createContext<FieldContextValue | null>(null);

/** Inside a <Field>, returns the props to spread on your own input. */
export const useFieldControl = () => useContext(FieldContext);

export interface FieldProps {
  /** Visible label, linked to the control. */
  label: React.ReactNode;
  /** Help text under the control. */
  description?: React.ReactNode;
  /** Error message. Replaces the description and marks the control invalid. */
  error?: React.ReactNode;
  /** Adds a required marker and `required` on the control. */
  required?: boolean;
  disabled?: boolean;
  /** Control id. Generated when omitted. */
  id?: string;
  /**
   * One element (ids and aria props are added to it), or a function that
   * receives the props to spread: `{(p) => <textarea {...p} />}`.
   */
  children: React.ReactElement | ((props: FieldControlProps) => React.ReactNode);
  className?: string;
  /** Extra classes for each part: root, label, description, error. */
  classNames?: ClassNames<'root' | 'label' | 'description' | 'error'>;
}

/**
 * Field: label, help text and error for any control, wired for screen readers.
 * Use it to give your own inputs (a textarea, a third-party editor) the same
 * labelling and error handling as Spark UI's built-in fields.
 *
 * Style hooks: `.sp-field[data-invalid][data-disabled]`, `__label`,
 * `__required`, `__description`, `__error`.
 */
export function Field(inProps: FieldProps) {
  const { label, description, error, required, disabled, id, children, className, classNames } = useDefaults('Field', inProps);
  const autoId = useId();
  const controlId = id ?? `${autoId}-control`;
  const labelId = `${controlId}-label`;
  const descId = `${controlId}-description`;
  const errorId = `${controlId}-error`;
  const invalid = Boolean(error);

  const controlProps: FieldControlProps = {
    id: controlId,
    'aria-describedby': invalid ? errorId : description ? descId : undefined,
    'aria-invalid': invalid || undefined,
    'aria-required': required || undefined,
    required: required || undefined,
    disabled: disabled || undefined,
  };

  const control =
    typeof children === 'function'
      ? children(controlProps)
      : isValidElement(children)
        ? cloneElement(children as React.ReactElement<Record<string, unknown>>, controlProps as unknown as Record<string, unknown>)
        : children;

  return (
    <FieldContext.Provider value={{ controlProps, labelId }}>
      <div className={slot('sp-field', classNames, 'root', className)} data-invalid={invalid || undefined} data-disabled={disabled || undefined}>
        <label id={labelId} htmlFor={controlId} className={slot('sp-field__label', classNames, 'label')}>
          {label}
          {required && (
            <span className="sp-field__required" aria-hidden="true">
              {' '}*
            </span>
          )}
        </label>
        {control}
        {invalid ? (
          <p id={errorId} className={slot('sp-field__error', classNames, 'error')}>
            {error}
          </p>
        ) : (
          description && (
            <p id={descId} className={slot('sp-field__description', classNames, 'description')}>
              {description}
            </p>
          )
        )}
      </div>
    </FieldContext.Provider>
  );
}

export default Field;

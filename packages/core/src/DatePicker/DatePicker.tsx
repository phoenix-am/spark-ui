import React, { useEffect, useId, useRef, useState } from 'react';
import { css, keyframes } from '@emotion/react';
import { useTheme } from '@spark-ui/system';
import { alpha } from '@spark-ui/utils';
import { Calendar, CalendarProps } from './Calendar';

const open = keyframes`
  from { opacity: 0; transform: translateY(-6px); }
  to { opacity: 1; transform: none; }
`;

export interface DatePickerProps extends Omit<CalendarProps, 'autoFocus' | 'onEscape' | 'onChange' | 'value'> {
  label?: React.ReactNode;
  value?: Date | null;
  defaultValue?: Date | null;
  onChange?: (date: Date | null) => void;
  placeholder?: string;
  helperText?: React.ReactNode;
  error?: boolean;
  disabled?: boolean;
  /** Show a clear button when a date is picked. Default `true`. */
  clearable?: boolean;
  /** How the picked date is shown in the field. */
  format?: Intl.DateTimeFormatOptions;
  /** Name for a hidden input carrying the ISO date (YYYY-MM-DD), for plain forms. */
  name?: string;
  size?: 'small' | 'medium' | 'large';
}

const heights = { small: '2.25rem', medium: '2.875rem', large: '3.375rem' };

const toISODate = (d: Date) =>
  `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;

/**
 * DatePicker: a field that opens a Calendar. The field lights up while the
 * calendar is open, and the picked day is a lit node with a spark.
 * Escape or a click outside closes it; focus returns to the field.
 */
export function DatePicker({
  label,
  value,
  defaultValue = null,
  onChange,
  placeholder = 'Pick a date',
  helperText,
  error,
  disabled,
  clearable = true,
  format = { day: 'numeric', month: 'short', year: 'numeric' },
  name,
  size = 'medium',
  locale,
  ...calendarProps
}: DatePickerProps) {
  const { theme } = useTheme();
  const [inner, setInner] = useState<Date | null>(defaultValue);
  const current = value !== undefined ? value : inner;
  const [isOpen, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const id = useId();
  const labelId = `${id}-label`;
  const helperId = `${id}-helper`;
  const dialogId = `${id}-dialog`;

  const display = current ? new Intl.DateTimeFormat(locale, format).format(current) : '';
  const err = theme.colors.primary.error['400'];
  const lit = !disabled && isOpen;
  const borderColor = error ? err : lit ? theme.energy.current : theme.surface.border;

  const commit = (d: Date | null) => {
    if (value === undefined) setInner(d);
    onChange?.(d);
  };

  const close = (refocus = true) => {
    setOpen(false);
    if (refocus) triggerRef.current?.focus();
  };

  // Close on outside click.
  useEffect(() => {
    if (!isOpen) return;
    const onDown = (e: MouseEvent) => {
      if (rootRef.current && !rootRef.current.contains(e.target as Node)) close(false);
    };
    document.addEventListener('mousedown', onDown);
    return () => document.removeEventListener('mousedown', onDown);
  }, [isOpen]);

  return (
    <div ref={rootRef} css={css`position: relative; font-family: ${theme.typography.fontFamily}; margin-bottom: 1rem;`}>
      {label && (
        <span id={labelId} css={css`display: block; margin-bottom: 0.375rem; font-size: ${theme.typography.fontSize.small}; font-weight: 600; color: ${disabled ? theme.text.disabled : theme.text.primary};`}>
          {label}
        </span>
      )}
      <div
        css={css`
          display: flex;
          align-items: center;
          min-height: ${heights[size]};
          box-sizing: border-box;
          border: 2px ${disabled ? 'dashed' : 'solid'} ${borderColor};
          border-radius: ${theme.borderRadius.medium};
          background: ${disabled ? theme.surface.raised : theme.surface.base};
          box-shadow: ${lit ? `0 0 0 3px ${alpha(error ? err : theme.energy.current, 0.18)}` : 'none'};
          transition: border-color ${theme.motion.normal}, box-shadow ${theme.motion.normal};
          &:hover {
            border-color: ${disabled || error || lit ? borderColor : theme.surface.borderStrong};
          }
        `}
      >
        <button
          ref={triggerRef}
          type="button"
          disabled={disabled}
          aria-haspopup="dialog"
          aria-expanded={isOpen}
          aria-controls={isOpen ? dialogId : undefined}
          aria-labelledby={label ? `${labelId} ${id}-value` : undefined}
          aria-describedby={helperText ? helperId : undefined}
          aria-invalid={error || undefined}
          onClick={() => setOpen((o) => !o)}
          onKeyDown={(e) => {
            if (e.key === 'ArrowDown' && !isOpen) {
              e.preventDefault();
              setOpen(true);
            }
          }}
          css={css`
            flex: 1;
            min-width: 0;
            align-self: stretch;
            display: flex;
            align-items: center;
            gap: 0.625rem;
            padding: 0 0.875rem;
            border: none;
            background: transparent;
            text-align: left;
            font: inherit;
            font-size: ${theme.typography.fontSize[size]};
            color: ${disabled ? theme.text.disabled : current ? theme.text.primary : theme.colors.primary.gray['300']};
            cursor: ${disabled ? 'not-allowed' : 'pointer'};
            border-radius: ${theme.borderRadius.medium};
            &:focus-visible {
              outline: 2px solid ${error ? err : theme.energy.current};
              outline-offset: 4px;
            }
          `}
        >
          <svg width="18" height="18" viewBox="0 0 24 24" aria-hidden="true" css={css`flex: none; color: ${lit ? theme.energy.current : theme.text.secondary};`}>
            <rect x="3" y="5" width="18" height="16" rx="2" fill="none" stroke="currentColor" strokeWidth="2" />
            <path d="M3 10h18M8 3v4M16 3v4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
          </svg>
          <span id={`${id}-value`}>{display || placeholder}</span>
        </button>
        {clearable && current && !disabled && (
          <button
            type="button"
            aria-label="Clear date"
            onClick={() => {
              commit(null);
              triggerRef.current?.focus();
            }}
            css={css`
              flex: none;
              width: 2rem;
              height: 2rem;
              margin-right: 0.375rem;
              display: inline-flex;
              align-items: center;
              justify-content: center;
              border: none;
              border-radius: ${theme.borderRadius.small};
              background: transparent;
              color: ${theme.text.secondary};
              cursor: pointer;
              &:hover {
                color: ${theme.text.primary};
                background: ${theme.surface.border};
              }
              &:focus-visible {
                outline: 2px solid ${theme.energy.current};
              }
            `}
          >
            <svg width="14" height="14" viewBox="0 0 16 16" aria-hidden="true"><path d="M3 3l10 10M13 3L3 13" stroke="currentColor" strokeWidth="2" strokeLinecap="round" /></svg>
          </button>
        )}
      </div>
      {helperText && (
        <p id={helperId} css={css`margin: 0.375rem 0 0; font-size: ${theme.typography.fontSize.small}; color: ${error ? err : theme.text.secondary};`}>
          {helperText}
        </p>
      )}
      {name && <input type="hidden" name={name} value={current ? toISODate(current) : ''} />}

      {isOpen && (
        <div
          id={dialogId}
          role="dialog"
          aria-modal="false"
          aria-label={typeof label === 'string' ? `Choose ${label.toLowerCase()}` : 'Choose date'}
          css={css`
            position: absolute;
            top: calc(${label ? '1.75rem + ' : ''}${heights[size]} + 0.5rem);
            left: 0;
            z-index: ${theme.zIndex.dropdown};
            padding: 1rem;
            background: ${theme.surface.raised};
            border: 1px solid ${theme.surface.borderStrong};
            border-radius: ${theme.borderRadius.large};
            box-shadow: ${theme.shadows.xlarge}, 0 0 0 1px ${alpha(theme.energy.current, 0.08)};
            animation: ${open} ${theme.motion.normal} ${theme.motion.easing} both;
            @media (prefers-reduced-motion: reduce) {
              animation: none;
            }
          `}
        >
          <Calendar
            {...calendarProps}
            locale={locale}
            value={current}
            autoFocus
            onEscape={() => close()}
            onChange={(d) => {
              commit(d);
              // Let the spark play before the popover closes.
              window.setTimeout(() => close(), 260);
            }}
          />
        </div>
      )}
    </div>
  );
}

export default DatePicker;

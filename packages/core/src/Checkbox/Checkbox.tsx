import React, { forwardRef, useEffect, useId, useRef } from 'react';
import { css, keyframes } from '@emotion/react';
import { useTheme } from '@spark-ui/system';
import { getTone, Tone } from '../internal/tone';
import { useForkRef } from '../Textfield/useForkRef';

const draw = keyframes`from { stroke-dashoffset: 18; } to { stroke-dashoffset: 0; }`;

export interface CheckboxProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'size' | 'type'> {
  label?: React.ReactNode;
  /** Shows a dash: some, but not all, of a group is selected. */
  indeterminate?: boolean;
  color?: Tone;
  size?: 'small' | 'medium' | 'large';
  helperText?: React.ReactNode;
  error?: boolean;
}

const box = { small: 16, medium: 20, large: 24 };

/**
 * Checkbox: a terminal. Checking it powers the terminal: it fills with current
 * and the tick is drawn in. Built on a native checkbox, so forms and keyboards work.
 */
export const Checkbox = forwardRef<HTMLInputElement, CheckboxProps>(function Checkbox(
  { label, indeterminate = false, color = 'brand', size = 'medium', helperText, error, disabled, id, className, ...rest },
  ref,
) {
  const { theme } = useTheme();
  const tone = getTone(error ? 'error' : color, theme);
  const innerRef = useRef<HTMLInputElement>(null);
  const handleRef = useForkRef(ref, innerRef);
  const autoId = useId();
  const inputId = id ?? autoId;
  const helperId = `${inputId}-helper`;
  const s = box[size];

  useEffect(() => {
    if (innerRef.current) innerRef.current.indeterminate = indeterminate;
  }, [indeterminate]);

  return (
    <div className={className} css={css`display: inline-flex; flex-direction: column; gap: 0.25rem; font-family: ${theme.typography.fontFamily};`}>
      <label
        htmlFor={inputId}
        css={css`
          display: inline-flex;
          align-items: center;
          gap: 0.625rem;
          cursor: ${disabled ? 'not-allowed' : 'pointer'};
          color: ${disabled ? theme.text.disabled : theme.text.primary};
          font-size: ${theme.typography.fontSize[size]};
          position: relative;
        `}
      >
        <input
          ref={handleRef}
          id={inputId}
          type="checkbox"
          disabled={disabled}
          aria-invalid={error || undefined}
          aria-describedby={helperText ? helperId : undefined}
          css={css`
            position: absolute;
            opacity: 0;
            width: ${s}px;
            height: ${s}px;
            margin: 0;
            cursor: inherit;

            & + span {
              position: relative;
              width: ${s}px;
              height: ${s}px;
              flex: none;
              box-sizing: border-box;
              display: inline-flex;
              align-items: center;
              justify-content: center;
              border: 2px solid ${error ? tone.fill : theme.surface.borderStrong};
              border-radius: ${theme.borderRadius.small};
              background: ${theme.surface.base};
              transition: all ${theme.motion.normal} ${theme.motion.easing};
            }
            &:hover:not(:disabled) + span {
              border-color: ${tone.fill};
            }
            &:checked + span,
            &:indeterminate + span {
              background: ${tone.fill};
              border-color: ${tone.fill};
              box-shadow: 0 0 12px ${tone.glow};
            }
            & + span svg {
              position: absolute;
              opacity: 0;
            }
            &:checked + span svg.tick,
            &:indeterminate + span svg.dash {
              opacity: 1;
            }
            &:checked + span svg.tick path {
              animation: ${draw} ${theme.motion.normal} ${theme.motion.easing} both;
            }
            &:focus-visible + span {
              outline: 2px solid ${tone.fill};
              outline-offset: 2px;
            }
            &:disabled + span {
              border-style: dashed;
              border-color: ${theme.surface.border};
              background: ${theme.surface.raised};
              box-shadow: none;
            }
            &:disabled:checked + span {
              background: ${theme.surface.borderStrong};
            }
            @media (prefers-reduced-motion: reduce) {
              & + span,
              &:checked + span svg.tick path {
                transition: none;
                animation: none;
              }
            }
          `}
          {...rest}
        />
        <span aria-hidden="true">
          <svg className="tick" width={s - 6} height={s - 6} viewBox="0 0 14 14" fill="none">
            <path d="M2.5 7.5l3 3 6-7" stroke={theme.text.onEnergy} strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" strokeDasharray="18" />
          </svg>
          <svg className="dash" width={s - 6} height={s - 6} viewBox="0 0 14 14" fill="none">
            <path d="M3 7h8" stroke={theme.text.onEnergy} strokeWidth="2.4" strokeLinecap="round" />
          </svg>
        </span>
        {label}
      </label>
      {helperText && (
        <span id={helperId} css={css`font-size: ${theme.typography.fontSize.small}; color: ${error ? tone.fill : theme.text.secondary}; padding-left: ${s + 10}px;`}>
          {helperText}
        </span>
      )}
    </div>
  );
});

Checkbox.displayName = 'Checkbox';
export default Checkbox;

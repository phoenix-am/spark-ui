import React, { useId, useState } from 'react';
import { css } from '@emotion/react';
import { useTheme } from '@spark-ui/system';
import { getTone, Tone } from '../internal/tone';

export interface RadioOption {
  value: string;
  label: React.ReactNode;
  description?: React.ReactNode;
  disabled?: boolean;
}

export interface RadioGroupProps {
  label: React.ReactNode;
  options: RadioOption[];
  value?: string;
  defaultValue?: string;
  onChange?: (value: string) => void;
  name?: string;
  color?: Tone;
  /** `list` stacks options; `cards` lays them out as selectable cards. */
  variant?: 'list' | 'cards';
  helperText?: React.ReactNode;
  error?: boolean;
}

/**
 * RadioGroup: a selector switch. Every option is a contact; only the chosen one
 * carries current, so its core lights up. Native radios underneath, so arrow
 * keys and forms work as expected.
 */
export function RadioGroup({
  label,
  options,
  value,
  defaultValue,
  onChange,
  name,
  color = 'brand',
  variant = 'list',
  helperText,
  error,
}: RadioGroupProps) {
  const { theme } = useTheme();
  const tone = getTone(error ? 'error' : color, theme);
  const [inner, setInner] = useState(defaultValue);
  const current = value ?? inner;
  const autoName = useId();
  const groupName = name ?? autoName;
  const helperId = `${groupName}-helper`;
  const cards = variant === 'cards';

  return (
    <fieldset
      aria-describedby={helperText ? helperId : undefined}
      css={css`
        border: none;
        margin: 0;
        padding: 0;
        min-width: 0;
        font-family: ${theme.typography.fontFamily};
        color: ${theme.text.primary};
      `}
    >
      <legend css={css`padding: 0; margin-bottom: 0.625rem; font-size: ${theme.typography.fontSize.small}; font-weight: 600;`}>{label}</legend>
      <div
        css={css`
          display: ${cards ? 'grid' : 'flex'};
          ${cards ? 'grid-template-columns: repeat(auto-fit, minmax(160px, 1fr));' : 'flex-direction: column;'}
          gap: ${cards ? '0.75rem' : '0.625rem'};
        `}
      >
        {options.map((o) => {
          const checked = current === o.value;
          return (
            <label
              key={o.value}
              css={css`
                position: relative;
                display: flex;
                gap: 0.75rem;
                align-items: flex-start;
                cursor: ${o.disabled ? 'not-allowed' : 'pointer'};
                color: ${o.disabled ? theme.text.disabled : theme.text.primary};
                ${cards &&
                css`
                  padding: 0.875rem 1rem;
                  border-radius: ${theme.borderRadius.medium};
                  border: 2px solid ${checked ? tone.fill : theme.surface.border};
                  background: ${checked ? theme.surface.raised : theme.surface.base};
                  box-shadow: ${checked ? `0 0 18px ${tone.glow}` : 'none'};
                  transition: border-color ${theme.motion.normal}, box-shadow ${theme.motion.normal};
                  &:hover {
                    border-color: ${checked ? tone.fill : theme.surface.borderStrong};
                  }
                `}
              `}
            >
              <input
                type="radio"
                name={groupName}
                value={o.value}
                checked={checked}
                disabled={o.disabled}
                onChange={() => {
                  if (value === undefined) setInner(o.value);
                  onChange?.(o.value);
                }}
                css={css`
                  position: absolute;
                  opacity: 0;
                  width: 20px;
                  height: 20px;
                  margin: 0;
                  & + span {
                    flex: none;
                    width: 20px;
                    height: 20px;
                    margin-top: 1px;
                    box-sizing: border-box;
                    border-radius: 50%;
                    border: 2px solid ${checked ? tone.fill : theme.surface.borderStrong};
                    display: inline-flex;
                    align-items: center;
                    justify-content: center;
                    transition: border-color ${theme.motion.normal};
                  }
                  & + span::after {
                    content: '';
                    width: 8px;
                    height: 8px;
                    border-radius: 50%;
                    background: ${checked ? tone.fill : 'transparent'};
                    box-shadow: ${checked ? `0 0 8px ${tone.glowStrong}` : 'none'};
                    transform: scale(${checked ? 1 : 0.2});
                    transition: transform ${theme.motion.normal} ${theme.motion.easing}, background ${theme.motion.normal};
                  }
                  &:focus-visible + span {
                    outline: 2px solid ${tone.fill};
                    outline-offset: 2px;
                  }
                  &:disabled + span {
                    border-style: dashed;
                    border-color: ${theme.surface.border};
                  }
                  @media (prefers-reduced-motion: reduce) {
                    & + span::after {
                      transition: none;
                    }
                  }
                `}
              />
              <span aria-hidden="true" />
              <span css={css`display: flex; flex-direction: column; gap: 0.2rem;`}>
                <span css={css`font-size: ${theme.typography.fontSize.small}; font-weight: ${cards ? 700 : 500};`}>{o.label}</span>
                {o.description && (
                  <span css={css`font-size: 0.8125rem; line-height: 1.5; color: ${o.disabled ? theme.text.disabled : theme.text.secondary};`}>
                    {o.description}
                  </span>
                )}
              </span>
            </label>
          );
        })}
      </div>
      {helperText && (
        <p id={helperId} css={css`margin: 0.5rem 0 0; font-size: 0.8125rem; color: ${error ? tone.fill : theme.text.secondary};`}>
          {helperText}
        </p>
      )}
    </fieldset>
  );
}

export default RadioGroup;

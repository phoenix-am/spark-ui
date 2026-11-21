import React, { createContext, useContext, useId, useState } from 'react';
import { css, keyframes } from '@emotion/react';
import { useTheme } from '@spark-ui/system';
import { alpha } from '@spark-ui/utils';

interface AccordionCtx {
  open: string[];
  toggle: (value: string) => void;
}
const Ctx = createContext<AccordionCtx | null>(null);

const flowDown = keyframes`to { background-position: 0 36px; }`;

export interface AccordionProps {
  /** Allow several sections open at once. Default `false`. */
  multiple?: boolean;
  defaultOpen?: string[];
  children: React.ReactNode;
}

/**
 * Accordion: a stack of circuits. Opening a section closes its circuit: the
 * wire beside it lights up and current runs down it.
 */
export function Accordion({ multiple = false, defaultOpen = [], children }: AccordionProps) {
  const { theme } = useTheme();
  const [open, setOpen] = useState<string[]>(defaultOpen);
  const toggle = (v: string) =>
    setOpen((cur) => (cur.includes(v) ? cur.filter((x) => x !== v) : multiple ? [...cur, v] : [v]));

  return (
    <Ctx.Provider value={{ open, toggle }}>
      <div
        css={css`
          border: 1px solid ${theme.surface.border};
          border-radius: ${theme.borderRadius.large};
          overflow: hidden;
          background: ${theme.surface.raised};
          font-family: ${theme.typography.fontFamily};
          & > * + * {
            border-top: 1px solid ${theme.surface.border};
          }
        `}
      >
        {children}
      </div>
    </Ctx.Provider>
  );
}

export interface AccordionItemProps {
  value: string;
  title: React.ReactNode;
  children: React.ReactNode;
  disabled?: boolean;
}

export function AccordionItem({ value, title, children, disabled }: AccordionItemProps) {
  const { theme } = useTheme();
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error('AccordionItem must be used inside <Accordion>');
  const isOpen = ctx.open.includes(value);
  const id = useId();

  return (
    <div css={css`position: relative;`}>
      <span
        aria-hidden="true"
        css={css`
          position: absolute;
          left: 0;
          top: 0;
          bottom: 0;
          width: 3px;
          opacity: ${isOpen ? 1 : 0};
          transition: opacity ${theme.motion.normal};
          background-color: ${alpha(theme.energy.current, 0.3)};
          background-image: repeating-linear-gradient(180deg, ${theme.energy.current} 0 9px, transparent 9px 18px);
          background-size: 100% 36px;
          animation: ${flowDown} 0.6s linear infinite;
          animation-play-state: ${isOpen ? 'running' : 'paused'};
          @media (prefers-reduced-motion: reduce) {
            animation: none;
            background-image: none;
            background-color: ${theme.energy.current};
          }
        `}
      />
      <h3 css={css`margin: 0;`}>
        <button
          type="button"
          id={`${id}-trigger`}
          aria-expanded={isOpen}
          aria-controls={`${id}-panel`}
          disabled={disabled}
          onClick={() => ctx.toggle(value)}
          css={css`
            width: 100%;
            display: flex;
            align-items: center;
            justify-content: space-between;
            gap: 1rem;
            padding: 1rem 1.25rem;
            border: none;
            background: transparent;
            text-align: left;
            font-family: inherit;
            font-size: 0.9375rem;
            font-weight: 600;
            color: ${disabled ? theme.text.disabled : isOpen ? theme.text.primary : theme.text.secondary};
            cursor: ${disabled ? 'not-allowed' : 'pointer'};
            transition: color ${theme.motion.fast}, background ${theme.motion.fast};
            &:hover:not(:disabled) {
              color: ${theme.text.primary};
              background: ${alpha(theme.text.primary, 0.03)};
            }
            &:focus-visible {
              outline: 2px solid ${theme.energy.current};
              outline-offset: -2px;
            }
          `}
        >
          {title}
          <svg
            width="16"
            height="16"
            viewBox="0 0 16 16"
            aria-hidden="true"
            css={css`
              flex: none;
              color: ${isOpen ? theme.energy.current : 'currentColor'};
              transform: rotate(${isOpen ? 180 : 0}deg);
              transition: transform ${theme.motion.normal} ${theme.motion.easing};
            `}
          >
            <path d="M4 6l4 4 4-4" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>
      </h3>
      <div
        id={`${id}-panel`}
        role="region"
        aria-labelledby={`${id}-trigger`}
        hidden={!isOpen}
        css={css`
          padding: 0 1.25rem 1.125rem;
          font-size: ${theme.typography.fontSize.small};
          line-height: 1.65;
          color: ${theme.text.secondary};
        `}
      >
        {children}
      </div>
    </div>
  );
}

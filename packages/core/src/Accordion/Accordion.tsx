import React, { createContext, useContext, useId, useState } from 'react';
import { cx } from '../internal/cx';
import { useDefaults } from '../internal/defaults';

interface AccordionCtx {
  open: string[];
  toggle: (value: string) => void;
}
const Ctx = createContext<AccordionCtx | null>(null);

export interface AccordionProps {
  /** Allow several sections open at once. Default `false`. */
  multiple?: boolean;
  /** Sections open at first, by `value`. */
  defaultOpen?: string[];
  children: React.ReactNode;
  className?: string;
}

/**
 * Stacked sections that open and close, so people see only what they need.
 * Perfect for FAQs and long settings pages. Allow one open at a time, or
 * several.
 *
 * A stack of circuits. Opening a section closes its circuit: the
 * wire beside it lights up and current runs down it.
 *
 * Style hooks: `.sp-accordion`, `__item[data-state="open"|"closed"]`, `__wire`,
 * `__trigger`, `__chevron`, `__panel`.
 */
export function Accordion(inProps: AccordionProps) {
  const { multiple = false, defaultOpen = [], children, className } = useDefaults('Accordion', inProps);
  const [open, setOpen] = useState<string[]>(defaultOpen);
  const toggle = (v: string) =>
    setOpen((cur) => (cur.includes(v) ? cur.filter((x) => x !== v) : multiple ? [...cur, v] : [v]));

  return (
    <Ctx.Provider value={{ open, toggle }}>
      <div className={cx('sp-accordion', className)}>{children}</div>
    </Ctx.Provider>
  );
}

export interface AccordionItemProps {
  /** Unique key for this section. */
  value: string;
  /** Text of the header button. */
  title: React.ReactNode;
  children: React.ReactNode;
  disabled?: boolean;
}

/**
 * One section of an accordion: a title people click and the content it
 * reveals.
 */
export function AccordionItem({ value, title, children, disabled }: AccordionItemProps) {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error('AccordionItem must be used inside <Accordion>');
  const isOpen = ctx.open.includes(value);
  const id = useId();

  return (
    <div className="sp-accordion__item" data-state={isOpen ? 'open' : 'closed'} data-disabled={disabled || undefined}>
      <span aria-hidden="true" className="sp-accordion__wire sp-current sp-current--down" />
      <h3 className="sp-accordion__heading">
        <button
          type="button"
          id={`${id}-trigger`}
          aria-expanded={isOpen}
          aria-controls={`${id}-panel`}
          disabled={disabled}
          onClick={() => ctx.toggle(value)}
          className="sp-accordion__trigger"
        >
          {title}
          <svg className="sp-accordion__chevron" width="16" height="16" viewBox="0 0 16 16" aria-hidden="true">
            <path d="M4 6l4 4 4-4" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>
      </h3>
      <div id={`${id}-panel`} role="region" aria-labelledby={`${id}-trigger`} hidden={!isOpen} className="sp-accordion__panel">
        {children}
      </div>
    </div>
  );
}

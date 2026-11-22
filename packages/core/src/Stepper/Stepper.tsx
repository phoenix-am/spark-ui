import React from 'react';
import { useDefaults, slot, ClassNames } from '../internal/defaults';

export type StepStatus = 'complete' | 'current' | 'upcoming' | 'error';

export interface StepItem {
  label: React.ReactNode;
  /** Short line under the label, e.g. "Optional" or a summary of what was entered. */
  description?: React.ReactNode;
  /** Mark a step as failed (shows an error icon). */
  error?: boolean;
  /** Custom icon in the circle instead of the number. */
  icon?: React.ReactNode;
  disabled?: boolean;
}

export interface StepperProps {
  steps: StepItem[];
  /** Index of the current step (0-based). Steps before it are complete. */
  active: number;
  /**
   * Let people jump back to a step by clicking it. `completed` (default when
   * `onStepClick` is set): finished steps only. `all`: any step (non-linear).
   */
  clickable?: 'completed' | 'all';
  onStepClick?: (index: number) => void;
  orientation?: 'horizontal' | 'vertical';
  /** Under ~480px a horizontal stepper shows "Step 2 of 4 · Label". Default `true`. */
  responsive?: boolean;
  'aria-label'?: string;
  className?: string;
  classNames?: ClassNames<'root' | 'step' | 'indicator' | 'label' | 'description' | 'connector'>;
}

const Check = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M5 12.5l4.5 4.5L19 7.5" />
  </svg>
);
const Bang = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" aria-hidden="true">
    <path d="M12 7v6M12 17h.01" />
  </svg>
);

/**
 * Stepper: progress through a multi-step flow (checkout, onboarding,
 * forms). Finished steps show a check, the current one is lit with flowing
 * current between steps, and failed ones show an error. Optionally
 * clickable to go back. An ordered list with `aria-current="step"`; status
 * is spelled out for screen readers, never colour alone.
 *
 * Style hooks: `.sp-stepper[data-orientation]`, `__step[data-status]`, `__indicator`, `__connector[data-done]`.
 */
export function Stepper(inProps: StepperProps) {
  const props = useDefaults('Stepper', inProps) as StepperProps;
  const { steps, active, onStepClick, orientation = 'horizontal', responsive = true, className, classNames } = props;
  const clickable = props.clickable ?? (onStepClick ? 'completed' : undefined);
  const statusOf = (i: number, s: StepItem): StepStatus => (s.error ? 'error' : i < active ? 'complete' : i === active ? 'current' : 'upcoming');
  const words: Record<StepStatus, string> = { complete: 'completed', current: 'current', upcoming: 'not started', error: 'has an error' };
  const current = steps[Math.min(Math.max(active, 0), steps.length - 1)];
  return (
    <nav aria-label={props['aria-label'] ?? 'Progress'} className={slot('sp-stepper', classNames, 'root', className)} data-orientation={orientation} data-responsive={responsive || undefined}>
      {orientation === 'horizontal' && responsive && current && (
        <p className="sp-stepper__compact" aria-hidden="true">
          <span>
            Step {Math.min(active + 1, steps.length)} of {steps.length}
          </span>{' '}
          · <strong>{current.label}</strong>
          <span className="sp-stepper__bar" style={{ '--sp-progress': `${(Math.min(active + 1, steps.length) / steps.length) * 100}%` } as React.CSSProperties} />
        </p>
      )}
      <ol className="sp-stepper__list">
        {steps.map((s, i) => {
          const status = statusOf(i, s);
          const canClick = !!onStepClick && !s.disabled && i !== active && (clickable === 'all' || (clickable === 'completed' && i < active));
          const inner = (
            <>
              <span className={slot('sp-stepper__indicator', classNames, 'indicator')} aria-hidden="true">
                {s.icon ?? (status === 'complete' ? <Check /> : status === 'error' ? <Bang /> : i + 1)}
              </span>
              <span className="sp-stepper__text">
                <span className={slot('sp-stepper__label', classNames, 'label')}>{s.label}</span>
                {s.description && <span className={slot('sp-stepper__description', classNames, 'description')}>{s.description}</span>}
                <span className="sp-visually-hidden">, {words[status]}</span>
              </span>
            </>
          );
          return (
            <li key={i} className={slot('sp-stepper__step', classNames, 'step')} data-status={status} data-disabled={s.disabled || undefined} aria-current={i === active ? 'step' : undefined}>
              {canClick ? (
                <button type="button" className="sp-stepper__button" onClick={() => onStepClick!(i)}>
                  {inner}
                </button>
              ) : (
                <div className="sp-stepper__button">{inner}</div>
              )}
              {i < steps.length - 1 && <span className={slot(`sp-stepper__connector${i === active ? (orientation === 'vertical' ? ' sp-current sp-current--down' : ' sp-current') : ''}`, classNames, 'connector')} data-done={i < active || undefined} aria-hidden="true" />}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}

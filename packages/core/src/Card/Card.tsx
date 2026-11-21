import React from 'react';
import { cx } from '../internal/cx';

/* ------------------------------------------------------------------- Card */

export interface CardProps extends React.HTMLAttributes<HTMLElement> {
  /** A live card has current running along its top edge. */
  live?: boolean;
  /** Hover lift and glow, for clickable cards. Put the link or button inside. */
  interactive?: boolean;
  /** Render as another element, e.g. `article` or `section`. */
  as?: 'div' | 'article' | 'section' | 'li';
  /** Inner spacing. Default `medium`. */
  padding?: 'none' | 'small' | 'medium' | 'large';
}

/**
 * Card: a raised panel. `live` cards carry current; `interactive` cards glow on hover.
 * Style hooks: `.sp-card[data-live][data-interactive][data-padding]`, `__current`.
 */
export function Card({ live = false, interactive = false, as: Tag = 'div', padding = 'medium', className, children, ...rest }: CardProps) {
  return (
    <Tag
      className={cx('sp-card', className)}
      data-live={live || undefined}
      data-interactive={interactive || undefined}
      data-padding={padding}
      {...rest}
    >
      {live && <span aria-hidden="true" className="sp-card__current sp-current" />}
      {children}
    </Tag>
  );
}

export interface CardHeaderProps {
  title: React.ReactNode;
  subtitle?: React.ReactNode;
  /** Shown on the left, e.g. an Avatar or icon. */
  media?: React.ReactNode;
  /** Shown on the right, e.g. a Badge or menu button. */
  action?: React.ReactNode;
}

export function CardHeader({ title, subtitle, media, action }: CardHeaderProps) {
  return (
    <div className="sp-card__header">
      {media}
      <div className="sp-card__heading">
        <h3 className="sp-card__title">{title}</h3>
        {subtitle && <p className="sp-card__subtitle">{subtitle}</p>}
      </div>
      {action}
    </div>
  );
}

export function CardFooter({ children }: { children: React.ReactNode }) {
  return <div className="sp-card__footer">{children}</div>;
}

/* --------------------------------------------------------------- Skeleton */

export interface SkeletonProps {
  /** Number (px) or any CSS length. Defaults to 100%. */
  width?: number | string;
  /** Number (px) or any CSS length. */
  height?: number | string;
  /** `circle` for avatars, `text` for lines of copy. */
  shape?: 'rect' | 'circle' | 'text';
  /** For `text`: number of lines. The last line is shorter. */
  lines?: number;
}

const len = (v: number | string | undefined, fallback: string) => (typeof v === 'number' ? `${v}px` : v ?? fallback);

/** Skeleton: a placeholder that shimmers like a line charging up. */
export function Skeleton({ width, height, shape = 'rect', lines = 1 }: SkeletonProps) {
  if (shape === 'text') {
    return (
      <span role="status" aria-label="Loading" className="sp-skeleton-text" style={{ width: len(width, '100%') }}>
        {Array.from({ length: lines }, (_, i) => (
          <span
            key={i}
            aria-hidden="true"
            className="sp-skeleton"
            style={{ width: i === lines - 1 && lines > 1 ? '60%' : '100%', height: len(height, '0.8rem') }}
          />
        ))}
      </span>
    );
  }
  const size = shape === 'circle' ? width ?? height ?? 40 : undefined;
  const w = len(size ?? width, '100%');
  return (
    <span role="status" aria-label="Loading" className="sp-skeleton-wrap" style={{ width: w }}>
      <span aria-hidden="true" className="sp-skeleton" data-shape={shape} style={{ width: w, height: len(size ?? height, '1rem') }} />
    </span>
  );
}

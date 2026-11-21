import React from 'react';
import { css, keyframes } from '@emotion/react';
import { useTheme } from '@spark-ui/system';
import { alpha } from '@spark-ui/utils';
import { currentLine } from '../internal/tone';

/* ------------------------------------------------------------------- Card */

export interface CardProps extends React.HTMLAttributes<HTMLElement> {
  /** A live card has current running along its top edge. */
  live?: boolean;
  /** Hover lift and glow, for clickable cards. Put the link or button inside. */
  interactive?: boolean;
  /** Render as another element, e.g. `article` or `section`. */
  as?: 'div' | 'article' | 'section' | 'li';
  padding?: 'none' | 'small' | 'medium' | 'large';
}

const pads = { none: '0', small: '0.875rem', medium: '1.25rem', large: '1.75rem' };

/** Card: a raised panel. `live` cards carry current; `interactive` cards glow on hover. */
export function Card({ live = false, interactive = false, as: Tag = 'div', padding = 'medium', children, ...rest }: CardProps) {
  const { theme } = useTheme();
  return (
    <Tag
      css={css`
        position: relative;
        overflow: hidden;
        box-sizing: border-box;
        background: ${theme.surface.raised};
        border: 1px solid ${theme.surface.border};
        border-radius: ${theme.borderRadius.large};
        padding: ${pads[padding]};
        font-family: ${theme.typography.fontFamily};
        color: ${theme.text.primary};
        transition: border-color ${theme.motion.normal}, box-shadow ${theme.motion.normal}, transform ${theme.motion.normal} ${theme.motion.easing};
        ${interactive &&
        css`
          &:hover,
          &:focus-within {
            border-color: ${theme.surface.borderStrong};
            box-shadow: ${theme.shadows.large}, 0 0 24px ${alpha(theme.energy.current, 0.12)};
            transform: translateY(-2px);
          }
          @media (prefers-reduced-motion: reduce) {
            &:hover,
            &:focus-within {
              transform: none;
            }
          }
        `}
      `}
      {...rest}
    >
      {live && (
        <span
          aria-hidden="true"
          css={css`
            position: absolute;
            left: 0;
            right: 0;
            top: 0;
            height: 2px;
            background-color: ${alpha(theme.energy.current, 0.3)};
            ${currentLine(theme.energy.current)};
          `}
        />
      )}
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
  const { theme } = useTheme();
  return (
    <div css={css`display: flex; align-items: center; gap: 0.75rem; margin-bottom: 0.875rem;`}>
      {media}
      <div css={css`flex: 1; min-width: 0;`}>
        <h3 css={css`margin: 0; font-size: 1rem; font-weight: 700; line-height: 1.3;`}>{title}</h3>
        {subtitle && <p css={css`margin: 0.15rem 0 0; font-size: 0.8125rem; color: ${theme.text.secondary};`}>{subtitle}</p>}
      </div>
      {action}
    </div>
  );
}

export function CardFooter({ children }: { children: React.ReactNode }) {
  const { theme } = useTheme();
  return (
    <div
      css={css`
        display: flex;
        flex-wrap: wrap;
        align-items: center;
        gap: 0.75rem;
        margin-top: 1.125rem;
        padding-top: 1rem;
        border-top: 1px solid ${theme.surface.border};
      `}
    >
      {children}
    </div>
  );
}

/* --------------------------------------------------------------- Skeleton */

const charge = keyframes`
  from { background-position: 200% 0; }
  to { background-position: -200% 0; }
`;

export interface SkeletonProps {
  width?: number | string;
  height?: number | string;
  /** `circle` for avatars, `text` for lines of copy. */
  shape?: 'rect' | 'circle' | 'text';
  /** For `text`: number of lines. The last line is shorter. */
  lines?: number;
}

/** Skeleton: a placeholder that shimmers like a line charging up. */
export function Skeleton({ width, height, shape = 'rect', lines = 1 }: SkeletonProps) {
  const { theme } = useTheme();
  const block = (w: number | string | undefined, h: number | string | undefined, key?: number) => (
    <span
      key={key}
      aria-hidden="true"
      css={css`
        display: block;
        width: ${typeof w === 'number' ? `${w}px` : w ?? '100%'};
        height: ${typeof h === 'number' ? `${h}px` : h ?? '1rem'};
        border-radius: ${shape === 'circle' ? '50%' : theme.borderRadius.small};
        background: linear-gradient(
          90deg,
          ${theme.surface.border} 0%,
          ${theme.surface.border} 40%,
          ${alpha(theme.energy.current, 0.18)} 50%,
          ${theme.surface.border} 60%,
          ${theme.surface.border} 100%
        );
        background-size: 200% 100%;
        animation: ${charge} 1.6s linear infinite;
        @media (prefers-reduced-motion: reduce) {
          animation: none;
        }
      `}
    />
  );

  if (shape === 'text') {
    return (
      <span role="status" aria-label="Loading" css={css`display: flex; flex-direction: column; gap: 0.5rem; width: ${typeof width === 'number' ? `${width}px` : width ?? '100%'};`}>
        {Array.from({ length: lines }, (_, i) => block(i === lines - 1 && lines > 1 ? '60%' : '100%', height ?? '0.8rem', i))}
      </span>
    );
  }
  const size = shape === 'circle' ? width ?? height ?? 40 : undefined;
  return (
    <span role="status" aria-label="Loading" css={css`display: inline-block; width: ${typeof (size ?? width) === 'number' ? `${size ?? width}px` : size ?? width ?? '100%'};`}>
      {block(size ?? width, size ?? height)}
    </span>
  );
}

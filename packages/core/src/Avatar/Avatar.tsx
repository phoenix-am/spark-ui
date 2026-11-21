import React, { useState } from 'react';
import { css, keyframes } from '@emotion/react';
import { useTheme } from '@spark-ui/system';
import { alpha } from '@spark-ui/utils';

const ping = keyframes`
  0% { box-shadow: 0 0 0 0 var(--ring); }
  70% { box-shadow: 0 0 0 6px transparent; }
  100% { box-shadow: 0 0 0 0 transparent; }
`;

export type AvatarStatus = 'online' | 'busy' | 'away' | 'offline';

export interface AvatarProps {
  name: string;
  src?: string;
  size?: 'small' | 'medium' | 'large' | 'xlarge';
  /** Status LED. `online` pulses. */
  status?: AvatarStatus;
}

const sizes = { small: 28, medium: 40, large: 56, xlarge: 80 };

const initials = (name: string) =>
  name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((p) => p[0]?.toUpperCase() ?? '')
    .join('');

/**
 * Avatar: a photo or initials, with an optional status LED. An online user's
 * LED pulses with current.
 */
export function Avatar({ name, src, size = 'medium', status }: AvatarProps) {
  const { theme } = useTheme();
  const [broken, setBroken] = useState(false);
  const s = sizes[size];
  const led = {
    online: theme.colors.primary.success['400'],
    busy: theme.colors.primary.error['400'],
    away: theme.energy.current,
    offline: theme.energy.off,
  };
  const dot = Math.max(8, Math.round(s / 4.5));
  const label = status ? `${name} (${status})` : name;

  return (
    <span
      role="img"
      aria-label={label}
      css={css`
        position: relative;
        display: inline-flex;
        flex: none;
        width: ${s}px;
        height: ${s}px;
      `}
    >
      <span
        aria-hidden="true"
        css={css`
          width: 100%;
          height: 100%;
          border-radius: 50%;
          overflow: hidden;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          background: ${theme.surface.border};
          border: 2px solid ${theme.surface.borderStrong};
          box-sizing: border-box;
          color: ${theme.energy.current};
          font-family: ${theme.typography.fontFamily};
          font-weight: 700;
          font-size: ${Math.round(s * 0.36)}px;
          letter-spacing: 0.02em;
        `}
      >
        {src && !broken ? (
          <img src={src} alt="" onError={() => setBroken(true)} css={css`width: 100%; height: 100%; object-fit: cover;`} />
        ) : (
          initials(name)
        )}
      </span>
      {status && (
        <span
          aria-hidden="true"
          style={{ '--ring': alpha(led[status], 0.7) } as React.CSSProperties}
          css={css`
            position: absolute;
            right: 0;
            bottom: 0;
            width: ${dot}px;
            height: ${dot}px;
            border-radius: 50%;
            background: ${led[status]};
            border: 2px solid ${theme.surface.base};
            ${status === 'online' &&
            css`
              animation: ${ping} 1.8s ease-out infinite;
              @media (prefers-reduced-motion: reduce) {
                animation: none;
              }
            `}
          `}
        />
      )}
    </span>
  );
}

export interface AvatarGroupProps {
  people: AvatarProps[];
  /** Show at most this many; the rest become a "+N" chip. */
  max?: number;
  size?: AvatarProps['size'];
}

/** AvatarGroup: overlapping avatars wired together, with a "+N" overflow. */
export function AvatarGroup({ people, max = 4, size = 'medium' }: AvatarGroupProps) {
  const { theme } = useTheme();
  const shown = people.slice(0, max);
  const extra = people.length - shown.length;
  const s = sizes[size];

  return (
    <span
      role="group"
      aria-label={`${people.length} people`}
      css={css`
        display: inline-flex;
        align-items: center;
        & > * + * {
          margin-left: -${Math.round(s * 0.2)}px;
        }
        & > * {
          border-radius: 50%;
          box-shadow: 0 0 0 2px ${theme.surface.raised};
        }
      `}
    >
      {shown.map((p) => (
        <Avatar key={p.name} {...p} size={size} />
      ))}
      {extra > 0 && (
        <span
          aria-label={`${extra} more`}
          css={css`
            width: ${s}px;
            height: ${s}px;
            display: inline-flex;
            align-items: center;
            justify-content: center;
            background: ${theme.energy.current};
            color: ${theme.text.onEnergy};
            font-family: ${theme.typography.fontFamily};
            font-weight: 700;
            font-size: ${Math.round(s * 0.32)}px;
          `}
        >
          +{extra}
        </span>
      )}
    </span>
  );
}

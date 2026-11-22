import React, { useState } from 'react';
import { useDefaults } from '../internal/defaults';

export type AvatarStatus = 'online' | 'busy' | 'away' | 'offline';

export interface AvatarProps {
  /** Full name: used for initials and the accessible label. */
  name: string;
  /** Photo URL. Falls back to initials if missing or broken. */
  src?: string;
  /** Default `medium` (40px). */
  size?: 'small' | 'medium' | 'large' | 'xlarge';
  /** Status LED. `online` pulses. */
  status?: AvatarStatus;
}

const initials = (name: string) =>
  name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((p) => p[0]?.toUpperCase() ?? '')
    .join('');

/**
 * A picture of a person, or their initials when there's no photo. The colour
 * comes from the name, so the same person always looks the same. Add a dot to
 * show if they're online.
 *
 * A photo or initials, with an optional status LED. An online user's
 * LED pulses with current.
 * Style hooks: `.sp-avatar[data-size][data-status]`, `__face`, `__led`.
 */
export function Avatar(inProps: AvatarProps) {
  const { name, src, size = 'medium', status } = useDefaults('Avatar', inProps);
  const [broken, setBroken] = useState(false);
  return (
    <span role="img" aria-label={status ? `${name} (${status})` : name} className="sp-avatar" data-size={size} data-status={status}>
      <span aria-hidden="true" className="sp-avatar__face">
        {src && !broken ? <img src={src} alt="" onError={() => setBroken(true)} /> : initials(name)}
      </span>
      {status && <span aria-hidden="true" className="sp-avatar__led" />}
    </span>
  );
}

export interface AvatarGroupProps {
  people: AvatarProps[];
  /** Show at most this many; the rest become a "+N" chip. Default 4. */
  max?: number;
  size?: AvatarProps['size'];
}

/**
 * A row of overlapping avatars for a team, with the rest folded into a “+3”.
 *
 * Overlapping avatars wired together, with a "+N" overflow.
 */
export function AvatarGroup({ people, max = 4, size = 'medium' }: AvatarGroupProps) {
  const shown = people.slice(0, max);
  const extra = people.length - shown.length;
  return (
    <span role="group" aria-label={`${people.length} people`} className="sp-avatar-group" data-size={size}>
      {shown.map((p) => (
        <Avatar key={p.name} {...p} size={size} />
      ))}
      {extra > 0 && (
        <span aria-label={`${extra} more`} className="sp-avatar-group__more">
          +{extra}
        </span>
      )}
    </span>
  );
}

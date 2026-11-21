import { css, keyframes } from '@emotion/react';
import { BaseTheme } from '@spark-ui/styles';
import { alpha } from '@spark-ui/utils';

export type Tone = 'brand' | 'error' | 'success' | 'warning';

/** The colours a component needs to "carry current" in a given tone. */
export const getTone = (tone: Tone, theme: BaseTheme) => {
  const scale = theme.colors.primary[tone];
  const fill = tone === 'brand' ? theme.energy.current : scale['400'];
  return {
    fill,
    hover: tone === 'brand' ? scale['300'] : scale['300'],
    deep: scale['600'],
    glow: alpha(fill, 0.35),
    glowStrong: alpha(fill, 0.55),
  };
};

/** Dashes moving along a line: the "current flowing" pattern. */
export const flow = keyframes`
  to { background-position: 36px 0; }
`;

export const currentLine = (color: string) => css`
  background-image: repeating-linear-gradient(90deg, ${color} 0 9px, transparent 9px 18px);
  background-size: 36px 100%;
  animation: ${flow} 0.6s linear infinite;

  @media (prefers-reduced-motion: reduce) {
    animation: none;
    background-image: none;
    background-color: ${color};
  }
`;

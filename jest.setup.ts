import '@testing-library/jest-dom';
import { toHaveNoViolations } from 'jest-axe';
import { setProjectAnnotations } from '@storybook/react';
import preview from './.storybook/preview';

expect.extend(toHaveNoViolations);
setProjectAnnotations(preview);

// jsdom gaps used by some components.
if (!window.matchMedia) {
  window.matchMedia = (query: string) =>
    ({ matches: false, media: query, addEventListener() {}, removeEventListener() {}, addListener() {}, removeListener() {}, onchange: null, dispatchEvent: () => false }) as unknown as MediaQueryList;
}

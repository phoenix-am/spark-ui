import React from 'react';
import { render } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Tooltip } from '..';

/** Place the trigger wrapper and the bubble at fixed spots, since jsdom has no layout. */
function layout(trigger: Partial<DOMRect>, bubble = { width: 90, height: 28 }) {
  const rect = (r: Partial<DOMRect>) => ({ x: 0, y: 0, top: 0, left: 0, right: 0, bottom: 0, width: 0, height: 0, toJSON: () => ({}), ...r }) as DOMRect;
  return jest.spyOn(HTMLElement.prototype, 'getBoundingClientRect').mockImplementation(function (this: HTMLElement) {
    if (this.classList.contains('sp-tooltip')) return rect(trigger);
    if (this.classList.contains('sp-tooltip__bubble')) return rect({ width: bubble.width, height: bubble.height });
    return rect({});
  });
}

/** Keyboard focus opens a tooltip at once. */
const open = () => userEvent.setup().tab();
const bubble = () => document.querySelector('.sp-tooltip__bubble') as HTMLElement;

beforeAll(() => {
  Object.defineProperty(window, 'innerWidth', { value: 1280, configurable: true });
  Object.defineProperty(window, 'innerHeight', { value: 800, configurable: true });
});

describe('Tooltip stays inside the window', () => {
  test('keeps the preferred side when there is room', async () => {
    const spy = layout({ top: 400, bottom: 432, left: 600, right: 632, width: 32, height: 32 });
    render(<Tooltip title="Light mode"><button type="button">Theme</button></Tooltip>);
    await open();
    expect(bubble()).toHaveAttribute('data-placement', 'top');
    spy.mockRestore();
  });
  test('flips below a trigger at the top of the window, like a header button', async () => {
    const spy = layout({ top: 14, bottom: 46, left: 600, right: 632, width: 32, height: 32 });
    render(<Tooltip title="Light mode"><button type="button">Theme</button></Tooltip>);
    await open();
    expect(bubble()).toHaveAttribute('data-placement', 'bottom');
    spy.mockRestore();
  });
  test('slides left instead of running off the right edge', async () => {
    const spy = layout({ top: 400, bottom: 432, left: 1240, right: 1272, width: 32, height: 32 }, { width: 140, height: 28 });
    render(<Tooltip title="Switch to light mode"><button type="button">Theme</button></Tooltip>);
    await open();
    // Centred, the bubble would end at 1256 + 70 = 1326; it must end by 1272 (8px from the edge).
    expect(bubble().style.getPropertyValue('--sp-shift')).toBe('-54px');
    spy.mockRestore();
  });
  test('a left tooltip near the left edge flips to the right', async () => {
    const spy = layout({ top: 400, bottom: 432, left: 10, right: 42, width: 32, height: 32 });
    render(<Tooltip title="Back" placement="left"><button type="button">Back</button></Tooltip>);
    await open();
    expect(bubble()).toHaveAttribute('data-placement', 'right');
    spy.mockRestore();
  });
});

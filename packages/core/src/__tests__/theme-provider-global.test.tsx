import React from 'react';
import { render } from '@testing-library/react';
import { ThemeProvider } from '@sparkwire/system';

describe('ThemeProvider global', () => {
  afterEach(() => {
    document.documentElement.removeAttribute('data-spark-theme');
    document.documentElement.removeAttribute('style');
  });
  test('without global, <html> is left alone', () => {
    render(<ThemeProvider mode="light">x</ThemeProvider>);
    expect(document.documentElement.hasAttribute('data-spark-theme')).toBe(false);
  });
  test('global puts the mode and color-scheme on <html> and follows changes', () => {
    const { rerender } = render(<ThemeProvider mode="light" global>x</ThemeProvider>);
    expect(document.documentElement.getAttribute('data-spark-theme')).toBe('light');
    expect(document.documentElement.style.colorScheme).toBe('light');
    rerender(<ThemeProvider mode="dark" global>x</ThemeProvider>);
    expect(document.documentElement.getAttribute('data-spark-theme')).toBe('dark');
  });
  test('global copies token overrides to <html>, and unmount restores it', () => {
    document.documentElement.setAttribute('data-spark-theme', 'dark');
    const { unmount } = render(<ThemeProvider mode="light" global theme={{ energy: { current: '#3AF2FF' } }}>x</ThemeProvider>);
    expect(document.documentElement.style.getPropertyValue('--spark-energy-current')).toBe('#3AF2FF');
    unmount();
    expect(document.documentElement.getAttribute('data-spark-theme')).toBe('dark');
    expect(document.documentElement.style.getPropertyValue('--spark-energy-current')).toBe('');
  });
});

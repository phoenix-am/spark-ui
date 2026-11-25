/** Regressions from the red-team review: bad input must degrade, never crash or misbehave. */
import React from 'react';
import { render, screen, fireEvent, renderHook, act } from '@testing-library/react';
import { SparkProvider, Pagination, NumberField, DatePicker, Calendar, CommandPalette } from '..';
import { normalizeLocale } from '../Provider/SparkProvider';
import { isSafeHref } from '../CommandPalette/CommandPalette';
import { useDataTable } from '../DataTable/useDataTable';

let warn: jest.SpyInstance;
beforeEach(() => (warn = jest.spyOn(console, 'warn').mockImplementation(() => {})));
afterEach(() => warn.mockRestore());

describe('locale', () => {
  test.each([
    ['en_US', 'en-US'],
    ['hi_IN', 'hi-IN'],
    ['EN-us', 'en-US'],
    ['en_US.UTF-8', 'en-US'],
    ['not a locale', 'en-US'],
    ['', 'en-US'],
  ])('normalizeLocale(%j) = %j', (input, out) => expect(normalizeLocale(input)).toBe(out));
  test('undefined stays undefined (inherit)', () => expect(normalizeLocale(undefined)).toBeUndefined());
  test('an underscore or junk locale renders instead of crashing', () => {
    render(<SparkProvider locale="en_US"><Pagination count={5} /></SparkProvider>);
    render(<SparkProvider locale="x y"><NumberField label="n" defaultValue={1} /></SparkProvider>);
    expect(screen.getAllByRole('navigation').length).toBeGreaterThan(0);
  });
});

describe('dates', () => {
  test('DatePicker treats an Invalid Date as empty', () => {
    render(<DatePicker label="When" value={new Date('nope')} onChange={() => {}} />);
    expect(screen.getByText('When')).toBeTruthy();
    expect(warn).toHaveBeenCalled();
  });
  test.each([0, -1, NaN, 1.7])('Calendar visibleMonths=%p renders one or more grids', (n) => {
    const { container } = render(<Calendar aria-label="c" visibleMonths={n} />);
    expect(container.querySelectorAll('[role=grid]').length).toBeGreaterThanOrEqual(1);
  });
});

describe('CommandPalette links', () => {
  test.each(['javascript:alert(1)', ' JAVASCRIPT:alert(1)', 'data:text/html,<script>1</script>', 'vbscript:x'])('blocks %s', (h) => expect(isSafeHref(h)).toBe(false));
  test.each(['https://example.com', '/docs/button', '#top', 'mailto:a@b.c', 'tel:+91'])('allows %s', (h) => expect(isSafeHref(h)).toBe(true));
  test('selecting a javascript: item does not navigate', () => {
    const assign = jest.fn();
    const original = window.location;
    Object.defineProperty(window, 'location', { value: { ...original, href: original.href, assign }, configurable: true });
    const onSelect = jest.fn();
    render(<CommandPalette open hotkey={false} onOpenChange={() => {}} onSelect={onSelect} items={[{ heading: 'G', items: [{ id: 'x', label: 'Docs', href: 'javascript:alert(1)' }] }]} />);
    fireEvent.click(screen.getByRole('option', { name: /Docs/ }));
    Object.defineProperty(window, 'location', { value: original, configurable: true });
    expect(onSelect).toHaveBeenCalled();
    expect(assign).not.toHaveBeenCalled();
  });
});

describe('DataTable row keys', () => {
  const cols = [{ key: 'name', header: 'Name' }];
  test('a row without id never shares a key with an id', () => {
    const data = [{ name: 'a' }, { id: 0, name: 'b' }] as Array<{ id?: number; name: string }>;
    const { result } = renderHook(() => useDataTable({ data, columns: cols, defaultPageSize: 0 }));
    const keys = result.current.rows.map((r) => r.key);
    expect(new Set(keys).size).toBe(2);
    expect(keys).toContain('0');
  });
  test('duplicate ids get unique keys and selecting one selects one', () => {
    const data = [{ id: 1, name: 'a' }, { id: 1, name: 'b' }];
    const { result } = renderHook(() => useDataTable({ data, columns: cols, defaultPageSize: 0 }));
    act(() => result.current.setSelectedKeys(new Set([result.current.rows[0].key])));
    expect(result.current.rows.filter((r) => result.current.isSelected(r.key))).toHaveLength(1);
    expect(warn).toHaveBeenCalled();
  });
  test('ordinary ids keep their plain keys', () => {
    const { result } = renderHook(() => useDataTable({ data: [{ id: 7, name: 'x' }], columns: cols, defaultPageSize: 0 }));
    expect(result.current.rows[0].key).toBe('7');
  });
});

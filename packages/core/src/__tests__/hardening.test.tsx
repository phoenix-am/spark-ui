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

/* ---------------------------------------------------------- second batch */
import { niceTicks } from '../Charts/core';
import { LineChart, Sparkline, Progress, Slider, TimePicker, Avatar, FileUpload, paginationRange, formatBytes } from '..';
import { createTheme, themeToCss } from '@sparkwire/styles';

const increasing = (t: number[]) => t.every((v, i) => i === 0 || v > t[i - 1]);

describe('niceTicks', () => {
  test.each([
    [1e16, 1e16 + 2],
    [9007199254740990, 9007199254740993],
    [-1e308, 1e308],
    [0, 1e-320],
    [5, 5],
    [1e16, 1e16],
    [1700000000000, 1700000000001],
    [-3, -1],
    [0, 1e-12],
  ])('niceTicks(%p, %p) returns fast, covers the range and strictly increases', (a, b) => {
    const t0 = Date.now();
    const t = niceTicks(a, b);
    expect(Date.now() - t0).toBeLessThan(50);
    expect(t.length).toBeGreaterThanOrEqual(2);
    expect(t.length).toBeLessThanOrEqual(51);
    expect(increasing(t)).toBe(true);
    expect(t[0]).toBeLessThanOrEqual(a);
    expect(t[t.length - 1]).toBeGreaterThanOrEqual(b);
  });
  test('ordinary ranges are unchanged', () => {
    expect(niceTicks(0, 100)).toEqual([0, 20, 40, 60, 80, 100]);
    expect(niceTicks(0, 1)).toEqual([0, 0.2, 0.4, 0.6, 0.8, 1]);
  });
  test('NaN input does not loop or throw', () => expect(niceTicks(NaN, 1)).toEqual([0, 1]));
});

describe('charts', () => {
  const axis = (c: HTMLElement) => Array.from(c.querySelectorAll('.sp-chart__axis')).map((e) => e.textContent);
  test('zeroBaseline={false} zooms to the data', () => {
    const { container } = render(<LineChart title="z" data={[{ d: 'a', v: 1000 }, { d: 'b', v: 1002 }]} x="d" series={[{ key: 'v', label: 'V' }]} zeroBaseline={false} />);
    expect(axis(container)).not.toContain('0');
  });
  test('zeroBaseline is still on by default for areas', () => {
    const { container } = render(<LineChart title="z" area data={[{ d: 'a', v: 1000 }, { d: 'b', v: 1002 }]} x="d" series={[{ key: 'v', label: 'V' }]} />);
    expect(axis(container)).toContain('0');
  });
  test('huge values with a small span render quickly', () => {
    const t0 = Date.now();
    render(<LineChart title="big" data={[{ d: 'a', v: 1e16 }, { d: 'b', v: 1e16 + 2 }]} x="d" series={[{ key: 'v', label: 'V' }]} zeroBaseline={false} />);
    expect(Date.now() - t0).toBeLessThan(2000);
  });
  test('Sparkline skips NaN and Infinity', () => {
    const { container } = render(<Sparkline aria-label="s" data={[1, NaN, Infinity, 3]} />);
    expect(container.innerHTML).not.toMatch(/NaN|Infinity/);
  });
});

describe('theme', () => {
  test('themeToCss drops a value that tries to escape the rule', () => {
    const css = themeToCss(createTheme({ energy: { current: 'red; } body { display: none } :root { --x: 1' } }));
    expect((css.match(/}/g) ?? []).length).toBe(1);
    expect(css).not.toMatch(/display: none/);
    expect(warn).toHaveBeenCalled();
  });
  test('__proto__ in a JSON theme is ignored', () => {
    const theme = createTheme(JSON.parse('{"__proto__": {"isAdmin": true}}')) as unknown as Record<string, unknown>;
    expect(theme.isAdmin).toBeUndefined();
    expect(Object.getPrototypeOf(theme)).toBe(Object.prototype);
  });
});

describe('small numeric edges', () => {
  test.each([
    [10, 50, -1],
    [10, 50, 0.5],
    [10.4, 50, 1],
    [999, 20, 1],
  ])('paginationRange(%p, %p, %p) keeps the current page and whole numbers', (p, n, s) => {
    const r = paginationRange(p, n, s);
    const nums = r.filter((x): x is number => typeof x === 'number');
    expect(nums.every(Number.isInteger)).toBe(true);
    expect(nums).toContain(Math.min(Math.round(p), n));
    expect(r.some((x, i) => x === 'ellipsis' && r[i + 1] === 'ellipsis')).toBe(false);
  });
  test('formatBytes edges', () => {
    expect(formatBytes(NaN)).toBe('–');
    expect(formatBytes(-2048)).toBe('–');
    expect(formatBytes(1024 * 1024 - 50)).toBe('1.0 MB');
    expect(formatBytes(1536)).toBe('1.5 KB');
    expect(formatBytes(500)).toBe('500 B');
  });
  test('Progress value={NaN} is indeterminate', () => {
    render(<Progress label="p" value={NaN} />);
    expect(screen.getByRole('progressbar').hasAttribute('aria-valuenow')).toBe(false);
  });
  test('Slider step={0} has no NaN', () => {
    const { container } = render(<Slider label="s" step={0} defaultValue={50} />);
    expect(container.innerHTML).not.toMatch(/NaN/);
  });
  test('TimePicker step={0} still offers times', () => {
    render(<TimePicker label="t" step={0} />);
    fireEvent.click(screen.getAllByRole('button').slice(-1)[0]);
    expect(screen.getAllByRole('option').length).toBeGreaterThan(0);
  });
  test('Avatar keeps an emoji initial whole', () => {
    const { container } = render(<Avatar name="😀 Smile" />);
    expect(container.textContent).toContain('😀');
  });
  test('FileUpload accept="*/*" accepts any file', () => {
    const onAdd = jest.fn();
    const { container } = render(<FileUpload label="f" accept="*/*" onAdd={onAdd} />);
    act(() => {
      fireEvent.change(container.querySelector('input[type=file]')!, { target: { files: [new File(['x'], 'a.txt', { type: 'text/plain' })] } });
    });
    expect(onAdd).toHaveBeenCalled();
  });
});

/* ------------------------------------------------------ controlled Textfield */
import { Textfield } from '..';
describe('Textfield controlled value', () => {
  test('a value changed by the parent shows in the input', () => {
    const { rerender } = render(<Textfield label="Hex" value="#FFD60A" onChange={() => {}} />);
    expect((screen.getByLabelText('Hex') as HTMLInputElement).value).toBe('#FFD60A');
    rerender(<Textfield label="Hex" value="#3AF2FF" onChange={() => {}} />);
    expect((screen.getByLabelText('Hex') as HTMLInputElement).value).toBe('#3AF2FF');
  });
  test('typing still works when the parent stores the value', () => {
    function Box() {
      const [v, setV] = React.useState('');
      return <Textfield label="Name" value={v} onChange={(e) => setV(e.target.value)} />;
    }
    render(<Box />);
    fireEvent.change(screen.getByLabelText('Name'), { target: { value: 'Asha' } });
    expect((screen.getByLabelText('Name') as HTMLInputElement).value).toBe('Asha');
  });
  test('a reset to an empty string clears the input', () => {
    const { rerender } = render(<Textfield label="Q" value="draft" onChange={() => {}} />);
    rerender(<Textfield label="Q" value="" onChange={() => {}} />);
    expect((screen.getByLabelText('Q') as HTMLInputElement).value).toBe('');
  });
});

describe('Progress label', () => {
  test.each([[99.5, '99%'], [99.99, '99%'], [100, '100%'], [0.4, '0%'], [42, '42%']])('%p shows %s', (value, text) => {
    const { container } = render(<Progress label="p" value={value} />);
    expect(container.querySelector('.sp-progress__value')).toHaveTextContent(text);
  });
});

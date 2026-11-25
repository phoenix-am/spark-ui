/**
 * Property tests: instead of a few hand-picked inputs, fast-check tries hundreds of
 * random ones (including the nasty edges) and shrinks any failure to the smallest case.
 * These cover the helpers the red-team review broke.
 */
import fc from 'fast-check';
import { renderHook, act } from '@testing-library/react';
import { niceTicks } from '../Charts/core';
import { paginationRange, formatBytes } from '..';
import { useDataTable } from '../DataTable/useDataTable';

const silence = () => jest.spyOn(console, 'warn').mockImplementation(() => {});

describe('niceTicks', () => {
  test('any finite range: few ticks, strictly increasing, covering both ends', () => {
    fc.assert(
      fc.property(fc.double({ noNaN: true, noDefaultInfinity: true, min: -1e300, max: 1e300 }), fc.double({ noNaN: true, noDefaultInfinity: true, min: -1e300, max: 1e300 }), (a, b) => {
        const lo = Math.min(a, b);
        const hi = Math.max(a, b);
        const t = niceTicks(lo, hi);
        expect(t.length).toBeGreaterThanOrEqual(2);
        expect(t.length).toBeLessThanOrEqual(51);
        for (let i = 1; i < t.length; i++) expect(t[i]).toBeGreaterThan(t[i - 1]);
        expect(t[0]).toBeLessThanOrEqual(lo);
        expect(t[t.length - 1]).toBeGreaterThanOrEqual(hi);
      }),
      { numRuns: 500 },
    );
  });
});

describe('paginationRange', () => {
  test('always shows the current page, whole numbers in range, no double gaps', () => {
    fc.assert(
      fc.property(
        fc.integer({ min: 1, max: 5000 }),
        fc.double({ min: -5, max: 5000, noNaN: true }),
        fc.double({ min: -3, max: 6, noNaN: true }),
        fc.double({ min: -3, max: 6, noNaN: true }),
        (count, page, siblings, boundaries) => {
          const r = paginationRange(page, count, siblings, boundaries);
          const nums = r.filter((x): x is number => typeof x === 'number');
          const current = Math.min(Math.max(1, Math.round(page) || 1), count);
          expect(nums).toContain(current);
          for (const n of nums) {
            expect(Number.isInteger(n)).toBe(true);
            expect(n).toBeGreaterThanOrEqual(1);
            expect(n).toBeLessThanOrEqual(count);
          }
          for (let i = 1; i < nums.length; i++) expect(nums[i]).toBeGreaterThan(nums[i - 1]);
          expect(r.some((x, i) => x === 'ellipsis' && r[i + 1] === 'ellipsis')).toBe(false);
          expect(r[0]).toBe(1);
          expect(r[r.length - 1]).toBe(count);
        },
      ),
      { numRuns: 500 },
    );
  });
});

describe('formatBytes', () => {
  test('never shows NaN or Infinity, and never "1024" of a unit that has a bigger one', () => {
    fc.assert(
      fc.property(fc.oneof(fc.double(), fc.integer({ min: 0, max: Number.MAX_SAFE_INTEGER })), (n) => {
        const s = formatBytes(n);
        expect(s).not.toMatch(/NaN|Infinity/);
        const m = s.match(/^([\d.]+) (B|KB|MB|GB|TB)$/);
        if (m && m[2] !== 'TB' && m[2] !== 'B') expect(Number(m[1])).toBeLessThan(1024);
      }),
      { numRuns: 500 },
    );
  });
});

describe('DataTable row keys', () => {
  test('any rows, with or without ids, get unique keys, and selecting k keys selects k rows', () => {
    const spy = silence();
    const row = fc.record({ id: fc.option(fc.oneof(fc.integer({ min: 0, max: 5 }), fc.constantFrom('a', 'b', '0')), { nil: undefined }), name: fc.string() }, { requiredKeys: ['name'] });
    fc.assert(
      fc.property(fc.array(row, { maxLength: 30 }), fc.nat(), (data, seed) => {
        const { result, unmount } = renderHook(() => useDataTable({ data, columns: [{ key: 'name', header: 'Name' }], defaultPageSize: 0 }));
        const keys = result.current.rows.map((r) => r.key);
        expect(new Set(keys).size).toBe(keys.length);
        const pick = keys.filter((_, i) => (seed >> i % 30) & 1);
        act(() => result.current.setSelectedKeys(new Set(pick)));
        expect(result.current.rows.filter((r) => result.current.isSelected(r.key))).toHaveLength(pick.length);
        unmount();
      }),
      { numRuns: 150 },
    );
    spy.mockRestore();
  });
});

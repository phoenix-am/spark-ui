import { useMemo, useState } from 'react';

export type SortDirection = 'ascending' | 'descending';
export interface SortRule {
  /** Column key. */
  column: string;
  direction: SortDirection;
}

export interface DataTableColumn<Row> {
  /** Unique key; also the row field read by default. */
  key: string;
  /** Header content. */
  header: React.ReactNode;
  /** Value used for sorting, filtering and default display. Default: `row[key]`. */
  accessor?: (row: Row) => unknown;
  /** Render the cell. Default: the accessor's value as text. */
  cell?: (row: Row, value: unknown) => React.ReactNode;
  /** Allow sorting by this column. Default `false`. */
  sortable?: boolean;
  /** Custom sort order (return <0, 0, >0). Default: numbers, dates, then text in the user's locale. */
  compare?: (a: unknown, b: unknown, rowA: Row, rowB: Row) => number;
  /** Include in the search box. Default `true` for text and numbers. */
  searchable?: boolean;
  /** Custom filter for this column's filter value. Default: case- and accent-insensitive "contains". */
  filter?: (value: unknown, filterValue: unknown, row: Row) => boolean;
  /** Text alignment. Numbers default to `end`. */
  align?: 'start' | 'center' | 'end';
  /** CSS width, e.g. `120` or `'20%'`. */
  width?: number | string;
  /** Hide the column (it still counts for search). */
  hidden?: boolean;
  /** Let people drag (or use arrow keys on) the column's edge to resize it. Also turned on for all columns by DataTable's `resizableColumns`. */
  resizable?: boolean;
  /** Smallest width when resizing, in px. Default 64. */
  minWidth?: number;
  /** Keep the column visible while the table scrolls sideways. Pinned columns use their numeric `width` (default 160px). */
  pin?: 'start' | 'end';
  /** Edit cells in place: double-click, Enter or F2 to edit, Enter to save, Escape to cancel. Saves through DataTable's `onCellEdit`. */
  editable?: boolean;
  /** Return a message to reject a value while editing, e.g. `(v) => v ? undefined : 'Required'`. */
  validate?: (value: unknown, row: Row) => string | undefined;
  /** Custom editor instead of the default text/number input. Call `commit(value)` to save or `cancel()`. */
  editor?: (props: { value: unknown; row: Row; commit: (value: unknown) => void; cancel: () => void }) => React.ReactNode;
  /** Screen-reader text for headers without visible text (e.g. an actions column). */
  'aria-label'?: string;
}

export interface UseDataTableOptions<Row> {
  data: Row[];
  columns: DataTableColumn<Row>[];
  /** Stable id for each row. Default: `row.id`, then the index. */
  getRowKey?: (row: Row, index: number) => string;

  /** Controlled sort rules (first wins). */
  sort?: SortRule[];
  defaultSort?: SortRule[];
  onSortChange?: (sort: SortRule[]) => void;

  /** Controlled search text (matches any searchable column). */
  search?: string;
  defaultSearch?: string;
  onSearchChange?: (search: string) => void;

  /** Controlled per-column filter values, keyed by column. */
  filters?: Record<string, unknown>;
  defaultFilters?: Record<string, unknown>;
  onFiltersChange?: (filters: Record<string, unknown>) => void;

  /** Controlled page (0-based). */
  page?: number;
  defaultPage?: number;
  onPageChange?: (page: number) => void;
  /** Rows per page; `0` turns paging off. Default 10. */
  pageSize?: number;
  defaultPageSize?: number;
  onPageSizeChange?: (size: number) => void;

  /** Controlled selected row keys. */
  selectedKeys?: Set<string>;
  defaultSelectedKeys?: Iterable<string>;
  onSelectionChange?: (keys: Set<string>) => void;

  /**
   * Server-side mode: you sort, filter and page the data yourself (e.g. in an
   * API call) and pass the current page as `data` with the total `rowCount`.
   */
  manual?: boolean;
  /** Total rows on the server, for paging in `manual` mode. */
  rowCount?: number;
}

/** Controlled-or-uncontrolled state, like React's own inputs. */
function useControllable<T>(value: T | undefined, defaultValue: T, onChange?: (v: T) => void) {
  const [inner, setInner] = useState(defaultValue);
  const current = value !== undefined ? value : inner;
  const set = (next: T) => {
    if (value === undefined) setInner(next);
    onChange?.(next);
  };
  return [current, set] as const;
}

const collator = typeof Intl !== 'undefined' ? new Intl.Collator(undefined, { numeric: true, sensitivity: 'base' }) : null;
const fold = (s: string) => s.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase();

/** Numbers and dates by value; everything else as text in the user's locale (10 after 9; "é" with "e"). Empty values last. */
export function defaultCompare(a: unknown, b: unknown): number {
  const empty = (v: unknown) => v === null || v === undefined || v === '';
  if (empty(a) || empty(b)) return empty(a) === empty(b) ? 0 : empty(a) ? 1 : -1;
  if (typeof a === 'number' && typeof b === 'number') return a - b;
  if (a instanceof Date && b instanceof Date) return a.getTime() - b.getTime();
  if (typeof a === 'boolean' && typeof b === 'boolean') return Number(a) - Number(b);
  return collator ? collator.compare(String(a), String(b)) : String(a).localeCompare(String(b));
}

/** Case- and accent-insensitive "contains"; arrays match any item. */
export function defaultFilter(value: unknown, filterValue: unknown): boolean {
  if (filterValue === undefined || filterValue === null || filterValue === '') return true;
  if (Array.isArray(filterValue)) return filterValue.length === 0 || filterValue.some((f) => defaultFilter(value, f));
  if (typeof filterValue !== 'string') return value === filterValue;
  return fold(String(value ?? '')).includes(fold(filterValue));
}

/**
 * The data logic of DataTable, with no markup: sorting (multi-column),
 * search, per-column filters, paging and row selection. Each piece of state
 * can be controlled or left to the hook. Use it alone for a fully custom
 * table, or let <DataTable> render it.
 */
export function useDataTable<Row>(options: UseDataTableOptions<Row>) {
  const { data, columns, manual = false } = options;
  const getRowKey =
    options.getRowKey ?? ((row: Row, i: number) => String((row as { id?: unknown })?.id ?? i));

  const [sort, setSort] = useControllable(options.sort, options.defaultSort ?? [], options.onSortChange);
  const [search, setSearchRaw] = useControllable(options.search, options.defaultSearch ?? '', options.onSearchChange);
  const [filters, setFiltersRaw] = useControllable(options.filters, options.defaultFilters ?? {}, options.onFiltersChange);
  const [page, setPage] = useControllable(options.page, options.defaultPage ?? 0, options.onPageChange);
  const [pageSize, setPageSizeRaw] = useControllable(options.pageSize, options.defaultPageSize ?? 10, options.onPageSizeChange);
  const [selectedKeys, setSelectedKeys] = useControllable(
    options.selectedKeys,
    new Set(options.defaultSelectedKeys ?? []),
    options.onSelectionChange,
  );

  const byKey = useMemo(() => new Map(columns.map((c) => [c.key, c])), [columns]);
  const valueOf = (row: Row, col: DataTableColumn<Row>) => (col.accessor ? col.accessor(row) : (row as Record<string, unknown>)[col.key]);

  const keyed = useMemo(() => data.map((row, i) => ({ row, key: getRowKey(row, i) })), [data, getRowKey]);

  const filtered = useMemo(() => {
    if (manual) return keyed;
    const searchCols = columns.filter((c) => c.searchable !== false);
    const activeFilters = Object.entries(filters).filter(([, v]) => !(v === undefined || v === '' || (Array.isArray(v) && !v.length)));
    return keyed.filter(({ row }) => {
      if (search) {
        const hit = searchCols.some((c) => {
          const v = valueOf(row, c);
          return (typeof v === 'string' || typeof v === 'number') && defaultFilter(v, search);
        });
        if (!hit) return false;
      }
      return activeFilters.every(([key, fv]) => {
        const col = byKey.get(key);
        if (!col) return true;
        const v = valueOf(row, col);
        return col.filter ? col.filter(v, fv, row) : defaultFilter(v, fv);
      });
    });
    // valueOf is stable for given columns
  }, [keyed, columns, byKey, search, filters, manual]);

  const sorted = useMemo(() => {
    if (manual || !sort.length) return filtered;
    const rules = sort.map((r) => ({ col: byKey.get(r.column), dir: r.direction === 'descending' ? -1 : 1 })).filter((r) => r.col);
    // Array.prototype.sort is stable, so equal rows keep their original order.
    return [...filtered].sort((a, b) => {
      for (const { col, dir } of rules) {
        const cmp = (col!.compare ?? defaultCompare)(valueOf(a.row, col!), valueOf(b.row, col!), a.row, b.row);
        if (cmp !== 0) return cmp * dir;
      }
      return 0;
    });
  }, [filtered, sort, byKey, manual]);

  const total = manual ? options.rowCount ?? data.length : sorted.length;
  const pageCount = pageSize > 0 ? Math.max(1, Math.ceil(total / pageSize)) : 1;
  const safePage = Math.min(page, pageCount - 1);
  const rows = manual || pageSize <= 0 ? sorted : sorted.slice(safePage * pageSize, safePage * pageSize + pageSize);

  /** Click a header: ascending → descending → off. With `multi` (Shift+click), add to the existing rules. */
  const toggleSort = (column: string, multi = false) => {
    const current = sort.find((r) => r.column === column);
    const next: SortRule | null = !current ? { column, direction: 'ascending' } : current.direction === 'ascending' ? { column, direction: 'descending' } : null;
    const others = multi ? sort.filter((r) => r.column !== column) : [];
    setSort(next ? (multi ? [...others, next] : [next]) : others);
    setPage(0);
  };

  const setSearch = (s: string) => {
    setSearchRaw(s);
    setPage(0);
  };
  const setFilter = (column: string, value: unknown) => {
    setFiltersRaw({ ...filters, [column]: value });
    setPage(0);
  };
  const setPageSize = (size: number) => {
    setPageSizeRaw(size);
    setPage(0);
  };

  const pageKeys = rows.map((r) => r.key);
  const allOnPageSelected = pageKeys.length > 0 && pageKeys.every((k) => selectedKeys.has(k));
  const someOnPageSelected = pageKeys.some((k) => selectedKeys.has(k));

  return {
    /** Rows to show now: filtered, sorted and paged, each with its key. */
    rows,
    /** Visible columns. */
    columns: columns.filter((c) => !c.hidden),
    valueOf,
    /** Rows after filtering (all pages). */
    filteredCount: manual ? total : filtered.length,
    totalCount: manual ? total : data.length,

    sort,
    setSort,
    toggleSort,
    sortOf: (column: string) => sort.find((r) => r.column === column)?.direction,
    sortIndex: (column: string) => (sort.length > 1 ? sort.findIndex((r) => r.column === column) : -1),

    search,
    setSearch,
    filters,
    setFilter,
    setFilters: setFiltersRaw,

    page: safePage,
    setPage,
    pageSize,
    setPageSize,
    pageCount,
    canPrev: safePage > 0,
    canNext: safePage < pageCount - 1,
    /** 1-based range shown, e.g. 11–20. */
    range: { from: total === 0 ? 0 : safePage * Math.max(pageSize, 0) + 1, to: pageSize > 0 ? Math.min(total, (safePage + 1) * pageSize) : total },

    selectedKeys,
    setSelectedKeys,
    isSelected: (key: string) => selectedKeys.has(key),
    toggleRow: (key: string) => {
      const next = new Set(selectedKeys);
      next.has(key) ? next.delete(key) : next.add(key);
      setSelectedKeys(next);
    },
    allOnPageSelected,
    someOnPageSelected,
    togglePage: () => {
      const next = new Set(selectedKeys);
      if (allOnPageSelected) pageKeys.forEach((k) => next.delete(k));
      else pageKeys.forEach((k) => next.add(k));
      setSelectedKeys(next);
    },
    clearSelection: () => setSelectedKeys(new Set()),
    /** The selected rows' data (across pages, from the current data). */
    selectedRows: keyed.filter((r) => selectedKeys.has(r.key)).map((r) => r.row),
  };
}

export type DataTableModel<Row> = ReturnType<typeof useDataTable<Row>>;

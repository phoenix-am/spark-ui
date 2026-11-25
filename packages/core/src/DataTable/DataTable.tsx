import React, { useEffect, useId, useMemo, useRef, useState } from 'react';
import { useMessages } from '../internal/messages';
import { useIsoLayoutEffect } from '../internal/useIsoLayoutEffect';
import {
  useLocale,
  useTable,
  useTableCell,
  useTableColumnHeader,
  useTableHeaderRow,
  useTableRow,
  useTableRowGroup,
  useTableSelectAllCheckbox,
  useTableSelectionCheckbox,
} from 'react-aria';
import { Cell, Column, Row, TableBody, TableHeader, useTableState, TableState } from 'react-stately';
import type { Node } from '@react-types/shared';
type GridNode<T> = Node<T>;
import type { Key, Selection, SortDescriptor } from '@react-types/shared';
import { Checkbox } from '../Checkbox';
import { Dropdown } from '../Dropdown';
import { InputBase } from '../base/InputBase';
import { useDefaults, slot, ClassNames } from '../internal/defaults';
import { cx } from '../internal/cx';
import { DataTableColumn, UseDataTableOptions, useDataTable, DataTableModel } from './useDataTable';

export interface DataTableProps<RowT> extends UseDataTableOptions<RowT> {
  /** Accessible name; describe what the table lists. */
  'aria-label'?: string;
  /** Id of an element whose text names this component, instead of `aria-label`. */
  'aria-labelledby'?: string;
  /** `multiple` adds checkboxes; `single` selects one row. Default `none`. */
  selectionMode?: 'none' | 'single' | 'multiple';
  /** Called when a row is activated (click, or Enter on the row). */
  onRowAction?: (row: RowT, key: string) => void;
  /** Show a search box over the table. */
  searchable?: boolean;
  /** Placeholder for the search box. */
  searchPlaceholder?: string;
  /** Extra content in the toolbar, e.g. filter dropdowns or an export button. */
  toolbar?: React.ReactNode;
  /** Actions shown when rows are selected, e.g. a delete button. Receives the selected rows. */
  bulkActions?: (rows: RowT[]) => React.ReactNode;
  /** Page sizes to offer. Default `[10, 25, 50]`. Pass `[]` to hide the picker. */
  pageSizeOptions?: number[];
  /** Row height. Default `normal`. */
  density?: 'compact' | 'normal' | 'comfortable';
  /** Shade every other row. */
  striped?: boolean;
  /** Fix the height and scroll the body under a sticky header, e.g. `400`. */
  maxHeight?: number | string;
  /**
   * In a narrow container: `stack` (default) turns rows into labelled cards;
   * `scroll` keeps the grid and scrolls sideways.
   */
  responsive?: 'stack' | 'scroll';
  /** Container width (px) below which rows stack. Default 640. */
  stackBelow?: number;
  /** Show placeholder rows while data loads. */
  loading?: boolean;
  /** Shown when there are no rows. Default "No results". */
  emptyState?: React.ReactNode;

  /** Let people resize every column (drag its edge, or Tab to the edge and use the arrow keys). Columns can also opt in with `resizable`. */
  resizableColumns?: boolean;
  /** Column widths in px by column key (controlled). */
  columnWidths?: Record<string, number>;
  /** Starting widths in pixels, by column key, when the table manages resizing itself. */
  defaultColumnWidths?: Record<string, number>;
  /** Called when a resize ends, with the column key and its new width. */
  onColumnResize?: (key: string, width: number) => void;

  /** Content shown under a row when it's expanded; adds an expand button to each row. */
  renderExpanded?: (row: RowT) => React.ReactNode;
  /** Expanded row keys (controlled). */
  expandedKeys?: Set<string>;
  /** Rows that start expanded, by key. */
  defaultExpandedKeys?: Iterable<string>;
  /** Called with the set of expanded row keys whenever a row opens or closes. */
  onExpandedChange?: (keys: Set<string>) => void;

  /** Save an edited cell (columns with `editable`). Update your data here; the table shows what `data` holds. */
  onCellEdit?: (row: RowT, columnKey: string, value: unknown) => void;

  /**
   * Render only the rows in view, for thousands of rows. Needs `maxHeight`;
   * paging is off unless you set a page size, rows have a fixed height
   * (`rowHeight`), and rows don't stack or expand.
   */
  virtualize?: boolean;
  /** Row height in px for `virtualize`. Default from `density`: 36, 44 or 52. */
  rowHeight?: number;

  /** Extra class names for the outermost element. */
  className?: string;
  /** Extra classes for each part. */
  classNames?: ClassNames<'root' | 'toolbar' | 'grid' | 'header' | 'columnHeader' | 'row' | 'cell' | 'footer'>;
}

const SELECT_W = 48;
const PIN_W = 160;
const ROW_H = { compact: 36, normal: 44, comfortable: 52 } as const;
const isNumberish = (v: unknown) => typeof v === 'number' || typeof v === 'bigint';
const textOf = (node: React.ReactNode): string => (typeof node === 'string' || typeof node === 'number' ? String(node) : '');

function useControlled<T>(value: T | undefined, initial: () => T, onChange?: (v: T) => void) {
  const [inner, setInner] = useState<T>(initial);
  const current = value !== undefined ? value : inner;
  const set = (next: T) => {
    if (value === undefined) setInner(next);
    onChange?.(next);
  };
  return [current, set] as const;
}

/**
 * A full data grid without a table library. Sort, search, filter, page and
 * select rows; resize and pin columns; expand rows for details; edit cells in
 * place; and scroll through thousands of rows smoothly. On narrow screens rows
 * turn into readable cards.
 *
 * Sort, search, filter, page and select rows; resize and pin
 * columns, expand rows, edit cells in place, and virtualise thousands of
 * rows. Built from divs on a CSS grid (like MUI's Data Grid), so it adapts
 * to its container: in narrow spaces rows become labelled cards. The table
 * logic is Sparkwire's own (`useDataTable`); React Aria supplies grid
 * keyboard navigation and screen-reader semantics.
 *
 * Keyboard: arrows move between cells, Home/End and Page Up/Down jump,
 * Space selects a row, Enter activates it (or edits an editable cell; F2
 * too), Shift+click sorts by more than one column. Tab from a resizable
 * column header reaches its resize handle, which takes the arrow keys.
 *
 * Style hooks: `.sp-data-table[data-density][data-striped][data-responsive][data-virtual]`,
 * `__toolbar`, `__grid[aria-busy]`, `__header`, `__column[data-sorted][data-sortable][data-pinned]`,
 * `__resizer`, `__row[data-selected][data-expanded]`, `__cell[data-align][data-pinned][data-editing]`,
 * `__expander`, `__detail`, `__editor`, `__footer`.
 */
export function DataTable<RowT>(inProps: DataTableProps<RowT>) {
  const props = useDefaults('DataTable', inProps) as DataTableProps<RowT>;
  const m = useMessages();
  const {
    'aria-label': ariaLabel,
    'aria-labelledby': ariaLabelledby,
    selectionMode = 'none',
    onRowAction,
    searchable,
    searchPlaceholder = m.search,
    toolbar,
    bulkActions,
    pageSizeOptions = [10, 25, 50],
    density = 'normal',
    striped,
    maxHeight,
    stackBelow = 640,
    loading,
    emptyState = m.noResults,
    resizableColumns,
    renderExpanded,
    onCellEdit,
    virtualize = false,
    className,
    classNames,
  } = props;
  const responsive = virtualize ? 'scroll' : props.responsive ?? 'stack';
  const table = useDataTable<RowT>({ ...props, defaultPageSize: props.defaultPageSize ?? (virtualize ? 0 : undefined) });
  const { locale, direction } = useLocale();
  const numberFormat = new Intl.NumberFormat(locale);
  const dateFormat = new Intl.DateTimeFormat(locale, { dateStyle: 'medium' });
  const fmt = (n: number) => numberFormat.format(n);

  const [widths, setWidths] = useControlled<Record<string, number>>(props.columnWidths, () => ({ ...props.defaultColumnWidths }), undefined);
  const [expanded, setExpanded] = useControlled<Set<string>>(props.expandedKeys, () => new Set(props.defaultExpandedKeys ?? []), props.onExpandedChange);
  const expandable = Boolean(renderExpanded) && !virtualize;

  // Pinned columns sit at the start or end; their widths are fixed so offsets are exact.
  const ordered = useMemo(
    () => [...table.columns.filter((c) => c.pin === 'start'), ...table.columns.filter((c) => !c.pin), ...table.columns.filter((c) => c.pin === 'end')],
    [table.columns],
  );
  const pxOf = (c: DataTableColumn<RowT>) => widths[c.key] ?? (typeof c.width === 'number' ? c.width : c.pin ? PIN_W : undefined);
  const trackOf = (c: DataTableColumn<RowT>) => {
    const px = pxOf(c);
    if (px !== undefined) return `${px}px`;
    return c.width === undefined ? 'minmax(8rem, 1fr)' : String(c.width);
  };
  const hasStartPins = ordered.some((c) => c.pin === 'start');
  const pins: Record<string, { side: 'start' | 'end'; offset: number; edge: boolean }> = {};
  let off = selectionMode === 'multiple' && hasStartPins ? SELECT_W : 0;
  const starts = ordered.filter((c) => c.pin === 'start');
  starts.forEach((c, i) => {
    pins[c.key] = { side: 'start', offset: off, edge: i === starts.length - 1 };
    off += pxOf(c)!;
  });
  off = 0;
  const ends = ordered.filter((c) => c.pin === 'end').reverse();
  ends.forEach((c, i) => {
    pins[c.key] = { side: 'end', offset: off, edge: i === ends.length - 1 };
    off += pxOf(c)!;
  });

  const template = [selectionMode === 'multiple' ? `${SELECT_W}px` : null, ...ordered.map(trackOf)].filter(Boolean).join(' ');
  const rowHeight = props.rowHeight ?? ROW_H[density];
  const selectedCount = table.selectedKeys.size;

  const display = (row: RowT, col: DataTableColumn<RowT>) => {
    const v = table.valueOf(row, col);
    if (col.cell) return col.cell(row, v);
    if (isNumberish(v)) return numberFormat.format(v as number);
    if (v instanceof Date) return dateFormat.format(v);
    return v === null || v === undefined ? '' : String(v);
  };
  const alignOf = (col: DataTableColumn<RowT>) =>
    col.align ?? (table.rows.length && isNumberish(table.valueOf(table.rows[0].row, col)) ? 'end' : 'start');

  // Cards or grid is decided from the table's own width against `stackBelow`. Until it has
  // been measured (server render), a CSS container query at the default 640px decides.
  const rootRef = useRef<HTMLDivElement>(null);
  const [stacked, setStacked] = useState<boolean | undefined>(undefined);
  useIsoLayoutEffect(() => {
    const el = rootRef.current;
    if (!el || responsive !== 'stack') return setStacked(undefined);
    const measure = () => setStacked(el.getBoundingClientRect().width < stackBelow);
    measure();
    if (typeof ResizeObserver === 'undefined') return;
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    return () => ro.disconnect();
  }, [responsive, stackBelow]);
  const sortableCols = ordered.filter((c) => c.sortable);
  const current = table.sort[0];
  const sortPicker =
    stacked && sortableCols.length > 0 ? (
      <Dropdown
        size="small"
        aria-label={m.sortBy}
        className="sp-data-table__sort-by"
        value={current ? `${current.column}:${current.direction}` : ''}
        onChange={(v) => {
          const [column, direction] = String(v).split(':');
          table.setSort(column ? [{ column, direction: direction as 'ascending' | 'descending' }] : []);
        }}
        options={[
          { value: '', label: `${m.sortBy}: ${m.notSorted}` },
          ...sortableCols.flatMap((c) => {
            const name = textOf(c.header) || c['aria-label'] || c.key;
            return (['ascending', 'descending'] as const).map((d) => ({ value: `${c.key}:${d}`, label: `${name}, ${m[d]}` }));
          }),
        ]}
      />
    ) : null;

  return (
    <div
      ref={rootRef}
      className={slot('sp-data-table', classNames, 'root', className)}
      data-stacked={stacked === undefined ? undefined : String(stacked)}
      data-density={density}
      data-striped={striped || undefined}
      data-responsive={responsive}
      data-virtual={virtualize || undefined}
      style={{ '--sp-cols': template, '--sp-row-h': `${rowHeight}px` } as React.CSSProperties}
    >
      {(searchable || toolbar || sortPicker || (bulkActions && selectedCount > 0)) && (
        <div className={slot('sp-data-table__toolbar', classNames, 'toolbar')}>
          {bulkActions && selectedCount > 0 ? (
            <div className="sp-data-table__bulk" role="status">
              <span className="sp-data-table__count">{m.selectedCount(fmt(selectedCount))}</span>
              {bulkActions(table.selectedRows)}
              <button type="button" className="sp-data-table__link" onClick={table.clearSelection}>
                {m.clearSelection}
              </button>
            </div>
          ) : (
            searchable && (
              <InputBase
                type="search"
                size="small"
                aria-label={ariaLabel ? m.searchNamed(ariaLabel) : m.search.replace('…', '')}
                placeholder={searchPlaceholder}
                value={table.search}
                onChange={(e) => table.setSearch(e.target.value)}
                classNames={{ root: 'sp-data-table__search' }}
                startAdornment={
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
                    <circle cx="11" cy="11" r="7" />
                    <path d="M20 20l-3.5-3.5" />
                  </svg>
                }
              />
            )
          )}
          {sortPicker}
          {toolbar && <div className="sp-data-table__tools">{toolbar}</div>}
        </div>
      )}

      <Grid
        table={table}
        columns={ordered}
        display={display}
        alignOf={alignOf}
        selectionMode={selectionMode}
        onRowAction={onRowAction}
        ariaLabel={ariaLabel}
        ariaLabelledby={ariaLabelledby}
        loading={loading}
        emptyState={emptyState}
        maxHeight={maxHeight}
        classNames={classNames}
        pins={pins}
        hasStartPins={hasStartPins}
        resizable={(c) => Boolean(c.resizable ?? resizableColumns)}
        widthOf={pxOf}
        onResize={(key, w, done) => {
          setWidths({ ...widths, [key]: w });
          if (done) props.onColumnResize?.(key, w);
        }}
        rtl={direction === 'rtl'}
        expandable={expandable}
        renderExpanded={renderExpanded}
        expanded={expanded}
        toggleExpanded={(key) => {
          const next = new Set(expanded);
          next.has(key) ? next.delete(key) : next.add(key);
          setExpanded(next);
        }}
        onCellEdit={onCellEdit}
        virtualize={virtualize}
        rowHeight={rowHeight}
      />

      {table.pageSize > 0 && (
        <div className={slot('sp-data-table__footer', classNames, 'footer')}>
          <span className="sp-data-table__range" aria-live="polite">
            {m.rangeOf(fmt(table.range.from), fmt(table.range.to), fmt(table.filteredCount))}
          </span>
          {pageSizeOptions.length > 0 && (
            <Dropdown
              aria-label={m.rowsPerPage}
              size="small"
              className="sp-data-table__page-size"
              value={table.pageSize}
              onChange={(v) => table.setPageSize(Number(v))}
              options={pageSizeOptions.map((n) => ({ value: n, label: m.perPage(fmt(n)) }))}
            />
          )}
          <div className="sp-data-table__pager">
            <button type="button" className="sp-field-button" aria-label={m.previousPage} disabled={!table.canPrev} onClick={() => table.setPage(table.page - 1)}>
              <svg width="16" height="16" viewBox="0 0 16 16" aria-hidden="true">
                <path d="M10 3L5 8l5 5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>
            <span className="sp-data-table__page">
              {fmt(table.page + 1)} / {fmt(table.pageCount)}
            </span>
            <button type="button" className="sp-field-button" aria-label={m.nextPage} disabled={!table.canNext} onClick={() => table.setPage(table.page + 1)}>
              <svg width="16" height="16" viewBox="0 0 16 16" aria-hidden="true">
                <path d="M6 3l5 5-5 5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

/* ---------------------------------------------------------------- grid */

type Pin = { side: 'start' | 'end'; offset: number; edge: boolean };

interface GridProps<RowT> {
  table: DataTableModel<RowT>;
  columns: DataTableColumn<RowT>[];
  display: (row: RowT, col: DataTableColumn<RowT>) => React.ReactNode;
  alignOf: (col: DataTableColumn<RowT>) => 'start' | 'center' | 'end';
  selectionMode: 'none' | 'single' | 'multiple';
  onRowAction?: (row: RowT, key: string) => void;
  ariaLabel?: string;
  ariaLabelledby?: string;
  loading?: boolean;
  emptyState: React.ReactNode;
  maxHeight?: number | string;
  classNames?: DataTableProps<RowT>['classNames'];
  pins: Record<string, Pin>;
  hasStartPins: boolean;
  resizable: (c: DataTableColumn<RowT>) => boolean;
  widthOf: (c: DataTableColumn<RowT>) => number | undefined;
  onResize: (key: string, width: number, done: boolean) => void;
  rtl: boolean;
  expandable: boolean;
  renderExpanded?: (row: RowT) => React.ReactNode;
  expanded: Set<string>;
  toggleExpanded: (key: string) => void;
  onCellEdit?: (row: RowT, columnKey: string, value: unknown) => void;
  virtualize: boolean;
  rowHeight: number;
}

const pinStyle = (pin?: Pin): React.CSSProperties | undefined =>
  pin ? { position: 'sticky', [pin.side === 'start' ? 'insetInlineStart' : 'insetInlineEnd']: pin.offset, zIndex: 1 } : undefined;
const startPin = (on: boolean): Pin | undefined => (on ? { side: 'start', offset: 0, edge: false } : undefined);

function Grid<RowT>(p: GridProps<RowT>) {
  const { table, columns, display, alignOf, selectionMode, onRowAction, ariaLabel, ariaLabelledby, loading, emptyState, maxHeight, classNames, pins } = p;
  const m = useMessages();
  const ref = useRef<HTMLDivElement>(null);
  const multiSort = useRef(false);
  const detailBase = useId();
  const rowsByKey = new Map(table.rows.map((r) => [r.key, r.row]));
  const pageKeys = table.rows.map((r) => r.key);
  const first = table.sort[0];
  const [editing, setEditing] = useState<{ row: string; col: string } | null>(null);
  const colByKey = useMemo(() => new Map(columns.map((c) => [c.key, c])), [columns]);
  const { locale } = useLocale();

  // Cells read `display` through a ref, so the collection is rebuilt only when rows or columns change, not on every scroll.
  const displayRef = useRef(display);
  displayRef.current = display;
  const children = useMemo(
    () => [
      <TableHeader key="header" columns={columns}>
        {(col: DataTableColumn<RowT>) => (
          <Column key={col.key} allowsSorting={col.sortable} textValue={textOf(col.header) || col['aria-label'] || col.key}>
            {col.header}
          </Column>
        )}
      </TableHeader>,
      <TableBody key="body" items={table.rows}>
        {(item: { row: RowT; key: string }) => (
          <Row key={item.key}>
            {(columnKey) => {
              const col = colByKey.get(String(columnKey))!;
              // Cell content renders only when the row is on screen; building the collection stays cheap for 10,000 rows.
              const raw = col.cell ? undefined : table.valueOf(item.row, col);
              return (
                <Cell textValue={typeof raw === 'string' ? raw : undefined}>
                  <CellContent display={displayRef} row={item.row} col={col} />
                </Cell>
              );
            }}
          </Row>
        )}
      </TableBody>,
    ],
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [columns, table.rows, locale],
  );
  const ariaProps = {
    'aria-label': ariaLabel,
    'aria-labelledby': ariaLabelledby,
    isVirtualized: p.virtualize,
    selectionMode,
    selectionBehavior: 'toggle' as const,
    showSelectionCheckboxes: selectionMode === 'multiple',
    selectedKeys: new Set(pageKeys.filter((k) => table.isSelected(k))),
    onSelectionChange: (sel: Selection) => {
      const onPage = sel === 'all' ? new Set(pageKeys) : new Set(Array.from(sel, String));
      const next = new Set(Array.from(table.selectedKeys).filter((k) => !pageKeys.includes(k)));
      if (selectionMode === 'single') next.clear();
      onPage.forEach((k) => next.add(k));
      table.setSelectedKeys(next);
    },
    sortDescriptor: first ? { column: first.column, direction: first.direction } : undefined,
    onSortChange: (d: SortDescriptor) => {
      table.toggleSort(String(d.column), multiSort.current);
      multiSort.current = false;
    },
    onRowAction: onRowAction ? (key: Key) => onRowAction(rowsByKey.get(String(key)) as RowT, String(key)) : undefined,
    children,
  };
  const state = useTableState<object>(ariaProps as never);
  const { gridProps } = useTable(ariaProps, state, ref);
  const headerRows = state.collection.headerRows;
  const bodyRows = Array.from(state.collection.body.childNodes) as GridNode<object>[];
  const colCount = state.collection.columnCount;
  const firstDataCol = columns[0]?.key;

  /* ---- virtual window */
  const [scroll, setScroll] = useState({ top: 0, height: typeof maxHeight === 'number' ? maxHeight : 400 });
  const overscan = 6;
  const startIdx = p.virtualize ? Math.max(0, Math.floor(scroll.top / p.rowHeight) - overscan) : 0;
  const endIdx = p.virtualize ? Math.min(bodyRows.length, Math.ceil((scroll.top + scroll.height) / p.rowHeight) + overscan) : bodyRows.length;
  const visible = bodyRows.slice(startIdx, endIdx);
  // Keyboard focus can move to a row that isn't rendered yet: scroll it into the window.
  const focusedKey = state.selectionManager.focusedKey;
  useEffect(() => {
    if (!p.virtualize || focusedKey == null || !ref.current) return;
    const idx = bodyRows.findIndex((r) => r.key === focusedKey || state.collection.getItem(focusedKey)?.parentKey === r.key);
    if (idx < 0) return;
    const el = ref.current;
    const header = el.querySelector<HTMLElement>('.sp-data-table__header')?.offsetHeight ?? 0;
    const top = idx * p.rowHeight;
    if (top < el.scrollTop) el.scrollTop = top;
    else if (top + p.rowHeight > el.scrollTop + el.clientHeight - header) el.scrollTop = top + p.rowHeight - el.clientHeight + header;
  }, [focusedKey]); // eslint-disable-line react-hooks/exhaustive-deps
  useEffect(() => {
    if (!p.virtualize || !ref.current) return;
    setScroll({ top: ref.current.scrollTop, height: ref.current.clientHeight || scroll.height });
  }, [p.virtualize]); // eslint-disable-line react-hooks/exhaustive-deps

  const colOf = (key: Key | undefined) => (key == null ? undefined : colByKey.get(String(key)));

  return (
    <div
      {...gridProps}
      ref={ref}
      className={slot('sp-data-table__grid', classNames, 'grid')}
      aria-busy={loading || undefined}
      style={maxHeight !== undefined ? { maxHeight, overflow: 'auto' } : undefined}
      data-scroll={maxHeight !== undefined || undefined}
      onScroll={
        p.virtualize
          ? (e) => {
              const top = e.currentTarget.scrollTop;
              const height = e.currentTarget.clientHeight;
              setScroll((prev) => (prev.top === top && prev.height === height ? prev : { top, height }));
            }
          : undefined
      }
    >
      <RowGroup className={slot('sp-data-table__header', classNames, 'header')} type="thead">
        {headerRows.map((headerRow) => (
          <HeaderRow key={headerRow.key} item={headerRow} state={state}>
            {Array.from(state.collection.getChildren!(headerRow.key) as Iterable<GridNode<object>>).map((column) => {
              if (column.props?.isSelectionCell) return <SelectAllCell key={column.key} column={column} state={state} pin={startPin(p.hasStartPins)} />;
              const col = colOf(column.key)!;
              return (
                <ColumnHeader
                  key={column.key}
                  column={column}
                  state={state}
                  table={table}
                  align={alignOf(col)}
                  className={classNames?.columnHeader}
                  onShift={(shift) => (multiSort.current = shift)}
                  pin={pins[col.key]}
                  resizer={
                    p.resizable(col) ? (
                      <Resizer
                        label={m.resizeColumn(textOf(col.header) || col['aria-label'] || col.key)}
                        width={p.widthOf(col)}
                        min={col.minWidth ?? 64}
                        rtl={p.rtl}
                        onResize={(w, done) => p.onResize(col.key, w, done)}
                      />
                    ) : null
                  }
                />
              );
            })}
          </HeaderRow>
        ))}
      </RowGroup>
      <RowGroup className="sp-data-table__body" type="tbody">
        {loading && bodyRows.length === 0 ? (
          Array.from({ length: Math.min(table.pageSize || 5, 5) }, (_, i) => (
            <div key={i} role="row" className="sp-data-table__row sp-data-table__row--loading">
              {Array.from({ length: colCount }, (_, j) => (
                <div key={j} role="gridcell" className="sp-data-table__cell">
                  <span className="sp-data-table__shimmer" />
                </div>
              ))}
            </div>
          ))
        ) : bodyRows.length === 0 ? (
          <div role="row" className="sp-data-table__row sp-data-table__row--empty">
            <div role="gridcell" aria-colspan={colCount} className="sp-data-table__empty">
              {emptyState}
            </div>
          </div>
        ) : (
          <>
            {p.virtualize && startIdx > 0 && <div aria-hidden="true" style={{ height: startIdx * p.rowHeight }} />}
            {visible.map((row) => {
              const key = String(row.key);
              const open = p.expandable && p.expanded.has(key);
              const detailId = `${detailBase}-${key}`;
              const dataRow = rowsByKey.get(key) as RowT;
              return (
                <React.Fragment key={row.key}>
                  <TableRow item={row} state={state} className={classNames?.row} interactive={Boolean(onRowAction) || selectionMode !== 'none'} expanded={p.expandable ? open : undefined}>
                    {Array.from(state.collection.getChildren!(row.key) as Iterable<GridNode<object>>).map((cell) => {
                      const column = state.collection.columns[cell.index!];
                      if (column?.props?.isSelectionCell) return <SelectionCell key={cell.key} cell={cell} state={state} pin={startPin(p.hasStartPins)} />;
                      const col = colOf(column?.key);
                      const isEditing = !!col && editing?.row === key && editing.col === col.key;
                      return (
                        <TableCell
                          key={cell.key}
                          cell={cell}
                          state={state}
                          label={col ? textOf(col.header) || col['aria-label'] || '' : ''}
                          align={col ? alignOf(col) : 'start'}
                          className={classNames?.cell}
                          pin={col ? pins[col.key] : undefined}
                          editable={Boolean(col?.editable && p.onCellEdit)}
                          editing={isEditing}
                          onStartEdit={() => col && setEditing({ row: key, col: col.key })}
                          editor={
                            isEditing && col ? (
                              <CellEditor
                                col={col}
                                row={dataRow}
                                value={table.valueOf(dataRow, col)}
                                onCommit={(v) => {
                                  p.onCellEdit?.(dataRow, col.key, v);
                                  setEditing(null);
                                }}
                                onCancel={() => setEditing(null)}
                              />
                            ) : null
                          }
                          prefix={
                            p.expandable && col?.key === firstDataCol ? (
                              <button
                                type="button"
                                className="sp-data-table__expander"
                                aria-expanded={open}
                                aria-controls={open ? detailId : undefined}
                                aria-label={open ? m.collapseRow : m.expandRow}
                                {...stop}
                                onKeyDown={(e) => e.stopPropagation()}
                                onClick={(e) => {
                                  e.stopPropagation();
                                  p.toggleExpanded(key);
                                }}
                              >
                                <svg width="14" height="14" viewBox="0 0 16 16" aria-hidden="true">
                                  <path d="M6 3l5 5-5 5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                </svg>
                              </button>
                            ) : null
                          }
                        />
                      );
                    })}
                  </TableRow>
                  {open && (
                    <div role="row" className="sp-data-table__detail" id={detailId}>
                      <div role="gridcell" aria-colspan={colCount} className="sp-data-table__detail-cell">
                        {p.renderExpanded!(dataRow)}
                      </div>
                    </div>
                  )}
                </React.Fragment>
              );
            })}
            {p.virtualize && endIdx < bodyRows.length && <div aria-hidden="true" style={{ height: (bodyRows.length - endIdx) * p.rowHeight }} />}
          </>
        )}
      </RowGroup>
    </div>
  );
}

function CellContent<RowT>({ display, row, col }: { display: React.MutableRefObject<(row: RowT, col: DataTableColumn<RowT>) => React.ReactNode>; row: RowT; col: DataTableColumn<RowT> }) {
  return <>{display.current(row, col)}</>;
}

function RowGroup({ type, className, children }: { type: 'thead' | 'tbody'; className: string; children: React.ReactNode }) {
  const { rowGroupProps } = useTableRowGroup();
  return (
    <div {...rowGroupProps} className={className} data-group={type}>
      {children}
    </div>
  );
}

function HeaderRow({ item, state, children }: { item: GridNode<object>; state: TableState<object>; children: React.ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);
  const { rowProps } = useTableHeaderRow({ node: item }, state, ref);
  return (
    <div {...rowProps} ref={ref} className="sp-data-table__header-row">
      {children}
    </div>
  );
}

function ColumnHeader<RowT>({
  column,
  state,
  table,
  align,
  className,
  onShift,
  pin,
  resizer,
}: {
  column: GridNode<object>;
  state: TableState<object>;
  table: DataTableModel<RowT>;
  align: string;
  className?: string;
  onShift: (shift: boolean) => void;
  pin?: Pin;
  resizer?: React.ReactNode;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const { columnHeaderProps } = useTableColumnHeader({ node: column }, state, ref);
  const sortable = Boolean(column.props?.allowsSorting);
  const direction = table.sortOf(String(column.key));
  const order = table.sortIndex(String(column.key));
  // React Aria marks only the first rule; announce every sorted column.
  const ariaSort = direction ?? (sortable ? 'none' : undefined);
  return (
    <div
      {...columnHeaderProps}
      ref={ref}
      aria-sort={ariaSort}
      className={cx('sp-data-table__column', className)}
      data-sortable={sortable || undefined}
      data-sorted={direction}
      data-align={align}
      data-pinned={pin?.side}
      data-pin-edge={pin?.edge || undefined}
      style={pinStyle(pin)}
      onPointerDownCapture={(e) => onShift(e.shiftKey)}
      onKeyDownCapture={(e) => {
        onShift(e.shiftKey);
        // Tab from the header goes to its resize handle; Shift+Tab from the handle comes back.
        const handle = ref.current?.querySelector<HTMLElement>('.sp-data-table__resizer');
        if (e.key !== 'Tab' || !handle) return;
        if (!e.shiftKey && e.target === ref.current) {
          e.preventDefault();
          e.stopPropagation();
          handle.focus();
        } else if (e.shiftKey && e.target === handle) {
          e.preventDefault();
          e.stopPropagation();
          ref.current?.focus();
        }
      }}
    >
      <span className="sp-data-table__column-label">{column.rendered}</span>
      {sortable && (
        <span className="sp-data-table__sort" aria-hidden="true">
          <svg width="12" height="12" viewBox="0 0 12 12">
            <path d={direction === 'descending' ? 'M3 4.5L6 8l3-3.5' : 'M3 7.5L6 4l3 3.5'} fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          {order >= 0 && <span className="sp-data-table__sort-order">{order + 1}</span>}
        </span>
      )}
      {resizer}
    </div>
  );
}

/** Drag handle on a column's edge. Arrow keys resize by 16px (Shift: 64px). */
function Resizer({ label, width, min, rtl, onResize }: { label: string; width?: number; min: number; rtl: boolean; onResize: (w: number, done: boolean) => void }) {
  const ref = useRef<HTMLDivElement>(null);
  const drag = useRef<{ x: number; w: number } | null>(null);
  const current = () => width ?? ref.current?.parentElement?.getBoundingClientRect().width ?? 160;
  const clamp = (w: number) => Math.max(min, Math.round(w));
  return (
    <div
      ref={ref}
      role="separator"
      aria-orientation="vertical"
      aria-label={label}
      aria-valuenow={Math.round(current())}
      aria-valuemin={min}
      tabIndex={0}
      className="sp-data-table__resizer"
      // Keep the grid from moving focus back to a cell when the handle takes it.
      onFocus={(e) => e.stopPropagation()}
      onClick={(e) => e.stopPropagation()}
      onPointerDown={(e) => {
        e.stopPropagation();
        e.preventDefault();
        drag.current = { x: e.clientX, w: current() };
        e.currentTarget.setPointerCapture?.(e.pointerId);
      }}
      onPointerMove={(e) => {
        if (!drag.current) return;
        const dx = (e.clientX - drag.current.x) * (rtl ? -1 : 1);
        onResize(clamp(drag.current.w + dx), false);
      }}
      onPointerUp={(e) => {
        if (!drag.current) return;
        const dx = (e.clientX - drag.current.x) * (rtl ? -1 : 1);
        onResize(clamp(drag.current.w + dx), true);
        drag.current = null;
      }}
      onKeyDown={(e) => {
        const step = e.shiftKey ? 64 : 16;
        const grow = rtl ? 'ArrowLeft' : 'ArrowRight';
        const shrink = rtl ? 'ArrowRight' : 'ArrowLeft';
        if (e.key !== grow && e.key !== shrink) return;
        e.preventDefault();
        e.stopPropagation();
        onResize(clamp(current() + (e.key === grow ? step : -step)), true);
      }}
    />
  );
}

/** Keep clicks on a checkbox or button from also reaching the row's press handler. */
const stop = { onPointerDown: (e: React.SyntheticEvent) => e.stopPropagation(), onClick: (e: React.SyntheticEvent) => e.stopPropagation() };

function SelectAllCell({ column, state, pin }: { column: GridNode<object>; state: TableState<object>; pin?: Pin }) {
  const ref = useRef<HTMLDivElement>(null);
  const { columnHeaderProps } = useTableColumnHeader({ node: column }, state, ref);
  const { checkboxProps } = useTableSelectAllCheckbox(state);
  return (
    <div {...columnHeaderProps} ref={ref} className="sp-data-table__column sp-data-table__select" data-pinned={pin?.side} style={pinStyle(pin)}>
      {state.selectionManager.selectionMode === 'multiple' && (
        <span {...stop}>
          <Checkbox
            size="small"
            aria-label={checkboxProps['aria-label']}
            checked={Boolean(checkboxProps.isSelected)}
            indeterminate={checkboxProps.isIndeterminate}
            disabled={checkboxProps.isDisabled}
            onChange={() => checkboxProps.onChange?.(!checkboxProps.isSelected)}
          />
        </span>
      )}
    </div>
  );
}

function TableRow({
  item,
  state,
  className,
  interactive,
  expanded,
  children,
}: {
  item: GridNode<object>;
  state: TableState<object>;
  className?: string;
  interactive: boolean;
  expanded?: boolean;
  children: React.ReactNode;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const { rowProps, isSelected, isPressed } = useTableRow({ node: item }, state, ref);
  const focused = state.selectionManager.isFocused && state.selectionManager.focusedKey === item.key;
  return (
    <div
      {...rowProps}
      ref={ref}
      className={cx('sp-data-table__row', className)}
      data-selected={isSelected || undefined}
      data-pressed={isPressed || undefined}
      data-focused={focused || undefined}
      data-interactive={interactive || undefined}
      data-expanded={expanded || undefined}
    >
      {children}
    </div>
  );
}

function TableCell({
  cell,
  state,
  label,
  align,
  className,
  pin,
  editable,
  editing,
  onStartEdit,
  editor,
  prefix,
}: {
  cell: GridNode<object>;
  state: TableState<object>;
  label: string;
  align: string;
  className?: string;
  pin?: Pin;
  editable?: boolean;
  editing?: boolean;
  onStartEdit?: () => void;
  editor?: React.ReactNode;
  prefix?: React.ReactNode;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const { gridCellProps } = useTableCell({ node: cell }, state, ref);
  const wasEditing = useRef(false);
  // Back to the cell after saving or cancelling, so keyboard navigation continues from here.
  useEffect(() => {
    if (wasEditing.current && !editing) ref.current?.focus();
    wasEditing.current = Boolean(editing);
  }, [editing]);
  return (
    <div
      {...gridCellProps}
      ref={ref}
      className={cx('sp-data-table__cell', className)}
      data-align={align}
      data-label={label || undefined}
      data-pinned={pin?.side}
      data-pin-edge={pin?.edge || undefined}
      data-editable={editable || undefined}
      data-editing={editing || undefined}
      style={pinStyle(pin)}
      onDoubleClick={editable && !editing ? onStartEdit : undefined}
      onKeyDownCapture={
        editable && !editing
          ? (e) => {
              if ((e.key === 'Enter' || e.key === 'F2') && e.target === e.currentTarget) {
                e.preventDefault();
                e.stopPropagation();
                onStartEdit?.();
              }
            }
          : undefined
      }
    >
      {prefix}
      {editing ? editor : <span className="sp-data-table__cell-content">{cell.rendered}</span>}
    </div>
  );
}

function CellEditor<RowT>({ col, row, value, onCommit, onCancel }: { col: DataTableColumn<RowT>; row: RowT; value: unknown; onCommit: (v: unknown) => void; onCancel: () => void }) {
  const [error, setError] = useState<string | undefined>();
  const numeric = isNumberish(value);
  const commit = (raw: unknown) => {
    const v = numeric && typeof raw === 'string' ? (raw.trim() === '' ? null : Number(raw)) : raw;
    const problem = col.validate?.(v, row) ?? (numeric && typeof v === 'number' && Number.isNaN(v) ? 'Not a number' : undefined);
    if (problem) {
      setError(problem);
      return;
    }
    onCommit(v);
  };
  const guard = { onPointerDown: (e: React.SyntheticEvent) => e.stopPropagation(), onClick: (e: React.SyntheticEvent) => e.stopPropagation(), onDoubleClick: (e: React.SyntheticEvent) => e.stopPropagation() };
  if (col.editor) return <span {...guard} className="sp-data-table__editor-custom">{col.editor({ value, row, commit, cancel: onCancel })}</span>;
  return (
    <span className="sp-data-table__editor-wrap" {...guard}>
      <input
        className="sp-data-table__editor"
        // eslint-disable-next-line jsx-a11y/no-autofocus
        autoFocus
        type={numeric ? 'number' : 'text'}
        defaultValue={value === null || value === undefined ? '' : String(value)}
        aria-label={typeof col.header === 'string' ? col.header : col['aria-label'] ?? col.key}
        aria-invalid={error ? true : undefined}
        title={error}
        onKeyDown={(e) => {
          e.stopPropagation();
          if (e.key === 'Enter') {
            e.preventDefault();
            commit(e.currentTarget.value);
          } else if (e.key === 'Escape') {
            e.preventDefault();
            onCancel();
          }
        }}
        onBlur={(e) => commit(e.currentTarget.value)}
        onChange={() => error && setError(undefined)}
      />
      {error && (
        <span className="sp-data-table__editor-error" role="alert">
          {error}
        </span>
      )}
    </span>
  );
}

function SelectionCell({ cell, state, pin }: { cell: GridNode<object>; state: TableState<object>; pin?: Pin }) {
  const ref = useRef<HTMLDivElement>(null);
  const { gridCellProps } = useTableCell({ node: cell }, state, ref);
  const { checkboxProps } = useTableSelectionCheckbox({ key: cell.parentKey! }, state);
  return (
    <div {...gridCellProps} ref={ref} className="sp-data-table__cell sp-data-table__select" data-pinned={pin?.side} style={pinStyle(pin)}>
      <span {...stop}>
        <Checkbox
          size="small"
          aria-label={checkboxProps['aria-label']}
          checked={Boolean(checkboxProps.isSelected)}
          disabled={checkboxProps.isDisabled}
          onChange={() => checkboxProps.onChange?.(!checkboxProps.isSelected)}
        />
      </span>
    </div>
  );
}

export default DataTable;

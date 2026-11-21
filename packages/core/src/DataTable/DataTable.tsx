import React, { useRef } from 'react';
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
  className?: string;
  /** Extra classes for each part. */
  classNames?: ClassNames<'root' | 'toolbar' | 'grid' | 'header' | 'columnHeader' | 'row' | 'cell' | 'footer'>;
}

const width = (w?: number | string) => (w === undefined ? 'minmax(8rem, 1fr)' : typeof w === 'number' ? `${w}px` : w);
const isNumberish = (v: unknown) => typeof v === 'number' || typeof v === 'bigint';
const textOf = (node: React.ReactNode): string => (typeof node === 'string' || typeof node === 'number' ? String(node) : '');

/**
 * DataTable: sort, search, filter, page and select rows. Built from divs on a
 * CSS grid (like MUI's Data Grid), so it adapts to its container: in narrow
 * spaces rows become labelled cards. The table logic is Spark UI's own
 * (`useDataTable`); React Aria supplies grid keyboard navigation and
 * screen-reader semantics. Sorted headers and selected rows light up.
 *
 * Keyboard: arrows move between cells, Home/End and Page Up/Down jump,
 * Space selects a row, Enter activates it, Shift+click sorts by more than
 * one column.
 *
 * Style hooks: `.sp-data-table[data-density][data-striped][data-responsive]`,
 * `__toolbar`, `__grid[aria-busy]`, `__header`, `__column[data-sorted][data-sortable]`,
 * `__row[data-selected][data-focus-visible]`, `__cell[data-align]`, `__footer`.
 */
export function DataTable<RowT>(inProps: DataTableProps<RowT>) {
  const props = useDefaults('DataTable', inProps) as DataTableProps<RowT>;
  const {
    'aria-label': ariaLabel,
    'aria-labelledby': ariaLabelledby,
    selectionMode = 'none',
    onRowAction,
    searchable,
    searchPlaceholder = 'Search…',
    toolbar,
    bulkActions,
    pageSizeOptions = [10, 25, 50],
    density = 'normal',
    striped,
    maxHeight,
    responsive = 'stack',
    stackBelow = 640,
    loading,
    emptyState = 'No results',
    className,
    classNames,
  } = props;
  const table = useDataTable<RowT>(props);
  const { locale } = useLocale();
  const numberFormat = new Intl.NumberFormat(locale);
  const dateFormat = new Intl.DateTimeFormat(locale, { dateStyle: 'medium' });

  const columns = table.columns;
  const selectedCount = table.selectedKeys.size;
  const template = [selectionMode === 'multiple' ? '3rem' : null, ...columns.map((c) => width(c.width))].filter(Boolean).join(' ');

  const display = (row: RowT, col: DataTableColumn<RowT>) => {
    const v = table.valueOf(row, col);
    if (col.cell) return col.cell(row, v);
    if (isNumberish(v)) return numberFormat.format(v as number);
    if (v instanceof Date) return dateFormat.format(v);
    return v === null || v === undefined ? '' : String(v);
  };
  const alignOf = (col: DataTableColumn<RowT>) =>
    col.align ?? (table.rows.length && isNumberish(table.valueOf(table.rows[0].row, col)) ? 'end' : 'start');

  return (
    <div
      className={slot('sp-data-table', classNames, 'root', className)}
      data-density={density}
      data-striped={striped || undefined}
      data-responsive={responsive}
      style={{ '--sp-cols': template, '--sp-stack-below': `${stackBelow}px` } as React.CSSProperties}
    >
      {(searchable || toolbar || (bulkActions && selectedCount > 0)) && (
        <div className={slot('sp-data-table__toolbar', classNames, 'toolbar')}>
          {bulkActions && selectedCount > 0 ? (
            <div className="sp-data-table__bulk" role="status">
              <span className="sp-data-table__count">{numberFormat.format(selectedCount)} selected</span>
              {bulkActions(table.selectedRows)}
              <button type="button" className="sp-data-table__link" onClick={table.clearSelection}>
                Clear
              </button>
            </div>
          ) : (
            searchable && (
              <InputBase
                type="search"
                size="small"
                aria-label={`Search ${ariaLabel ?? 'table'}`}
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
          {toolbar && <div className="sp-data-table__tools">{toolbar}</div>}
        </div>
      )}

      <Grid
        table={table}
        columns={columns}
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
      />

      {table.pageSize > 0 && (
        <div className={slot('sp-data-table__footer', classNames, 'footer')}>
          <span className="sp-data-table__range" aria-live="polite">
            {numberFormat.format(table.range.from)}–{numberFormat.format(table.range.to)} of {numberFormat.format(table.filteredCount)}
          </span>
          {pageSizeOptions.length > 0 && (
            <Dropdown
              aria-label="Rows per page"
              size="small"
              className="sp-data-table__page-size"
              value={table.pageSize}
              onChange={(v) => table.setPageSize(Number(v))}
              options={pageSizeOptions.map((n) => ({ value: n, label: `${n} / page` }))}
            />
          )}
          <div className="sp-data-table__pager">
            <button type="button" className="sp-field-button" aria-label="Previous page" disabled={!table.canPrev} onClick={() => table.setPage(table.page - 1)}>
              <svg width="16" height="16" viewBox="0 0 16 16" aria-hidden="true">
                <path d="M10 3L5 8l5 5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>
            <span className="sp-data-table__page">
              {numberFormat.format(table.page + 1)} / {numberFormat.format(table.pageCount)}
            </span>
            <button type="button" className="sp-field-button" aria-label="Next page" disabled={!table.canNext} onClick={() => table.setPage(table.page + 1)}>
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
}

function Grid<RowT>({ table, columns, display, alignOf, selectionMode, onRowAction, ariaLabel, ariaLabelledby, loading, emptyState, maxHeight, classNames }: GridProps<RowT>) {
  const ref = useRef<HTMLDivElement>(null);
  const multiSort = useRef(false);
  const rowsByKey = new Map(table.rows.map((r) => [r.key, r.row]));
  const pageKeys = table.rows.map((r) => r.key);
  const first = table.sort[0];

  const ariaProps = {
    'aria-label': ariaLabel,
    'aria-labelledby': ariaLabelledby,
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
    children: [
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
              const col = columns.find((c) => c.key === columnKey)!;
              const content = display(item.row, col);
              return <Cell textValue={typeof content === 'string' ? content : undefined}>{content}</Cell>;
            }}
          </Row>
        )}
      </TableBody>,
    ],
  };
  const state = useTableState<object>(ariaProps as never);
  const { gridProps } = useTable(ariaProps, state, ref);
  const headerRows = state.collection.headerRows;
  const bodyRows = Array.from(state.collection.body.childNodes) as GridNode<object>[];
  const colCount = state.collection.columnCount;

  return (
    <div
      {...gridProps}
      ref={ref}
      className={slot('sp-data-table__grid', classNames, 'grid')}
      aria-busy={loading || undefined}
      style={maxHeight !== undefined ? { maxHeight, overflow: 'auto' } : undefined}
      data-scroll={maxHeight !== undefined || undefined}
    >
      <RowGroup className={slot('sp-data-table__header', classNames, 'header')} type="thead">
        {headerRows.map((headerRow) => (
          <HeaderRow key={headerRow.key} item={headerRow} state={state}>
            {Array.from(state.collection.getChildren!(headerRow.key) as Iterable<GridNode<object>>).map((column) =>
              column.props?.isSelectionCell ? (
                <SelectAllCell key={column.key} column={column} state={state} />
              ) : (
                <ColumnHeader
                  key={column.key}
                  column={column}
                  state={state}
                  table={table}
                  align={alignOf(columns.find((c) => c.key === column.key)!)}
                  className={classNames?.columnHeader}
                  onShift={(shift) => (multiSort.current = shift)}
                />
              ),
            )}
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
          bodyRows.map((row) => (
            <TableRow key={row.key} item={row} state={state} className={classNames?.row} interactive={Boolean(onRowAction) || selectionMode !== 'none'}>
              {Array.from(state.collection.getChildren!(row.key) as Iterable<GridNode<object>>).map((cell) => {
                const column = state.collection.columns[cell.index!];
                if (column?.props?.isSelectionCell) return <SelectionCell key={cell.key} cell={cell} state={state} />;
                const col = columns.find((c) => c.key === column?.key);
                return (
                  <TableCell
                    key={cell.key}
                    cell={cell}
                    state={state}
                    label={col ? textOf(col.header) || col['aria-label'] || '' : ''}
                    align={col ? alignOf(col) : 'start'}
                    className={classNames?.cell}
                  />
                );
              })}
            </TableRow>
          ))
        )}
      </RowGroup>
    </div>
  );
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
}: {
  column: GridNode<object>;
  state: TableState<object>;
  table: DataTableModel<RowT>;
  align: string;
  className?: string;
  onShift: (shift: boolean) => void;
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
      onPointerDownCapture={(e) => onShift(e.shiftKey)}
      onKeyDownCapture={(e) => onShift(e.shiftKey)}
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
    </div>
  );
}

/** Keep clicks on a checkbox from also reaching the row's press handler. */
const stop = { onPointerDown: (e: React.SyntheticEvent) => e.stopPropagation(), onClick: (e: React.SyntheticEvent) => e.stopPropagation() };

function SelectAllCell({ column, state }: { column: GridNode<object>; state: TableState<object> }) {
  const ref = useRef<HTMLDivElement>(null);
  const { columnHeaderProps } = useTableColumnHeader({ node: column }, state, ref);
  const { checkboxProps } = useTableSelectAllCheckbox(state);
  return (
    <div {...columnHeaderProps} ref={ref} className="sp-data-table__column sp-data-table__select">
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

function TableRow({ item, state, className, interactive, children }: { item: GridNode<object>; state: TableState<object>; className?: string; interactive: boolean; children: React.ReactNode }) {
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
    >
      {children}
    </div>
  );
}

function TableCell({ cell, state, label, align, className }: { cell: GridNode<object>; state: TableState<object>; label: string; align: string; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const { gridCellProps } = useTableCell({ node: cell }, state, ref);
  return (
    <div {...gridCellProps} ref={ref} className={cx('sp-data-table__cell', className)} data-align={align} data-label={label || undefined}>
      <span className="sp-data-table__cell-content">{cell.rendered}</span>
    </div>
  );
}

function SelectionCell({ cell, state }: { cell: GridNode<object>; state: TableState<object> }) {
  const ref = useRef<HTMLDivElement>(null);
  const { gridCellProps } = useTableCell({ node: cell }, state, ref);
  const { checkboxProps } = useTableSelectionCheckbox({ key: cell.parentKey! }, state);
  return (
    <div {...gridCellProps} ref={ref} className="sp-data-table__cell sp-data-table__select">
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

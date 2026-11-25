## Features

- Sorting (Shift+click to sort by several columns), search, filters and paging, all built in. Turn on `manual` to do them on your server.
- Row selection with checkboxes, select-all and `bulkActions`.
- Resizable columns (`resizableColumns`, `onColumnResize`) and columns pinned to either edge (`pin`).
- Expandable rows (`renderExpanded`) and inline cell editing (`editable`, `validate`, `onCellEdit`).
- Virtual scrolling (`virtualize` + `maxHeight`) for thousands of rows.
- Density, striping, a sticky header with `maxHeight`, loading placeholders and an empty state.
- Built-in labels are translated.

## Accessibility

- An ARIA grid: arrow keys move between cells; Home/End and Page Up/Down jump; Space selects a row; Enter activates it.
- Editable cells open with Enter, F2 or double-click; Enter saves and Escape cancels.
- Sorted columns announce their direction; resize handles take the arrow keys.
- Give the table an `aria-label` that says what it lists.

## Responsive behavior

In containers narrower than 640px (`stackBelow`), rows turn into labelled cards. Set `responsive="scroll"` to keep the grid and scroll sideways instead. Virtualised tables always scroll.

## Best practices

- Give every row a stable `id` (or `getRowKey`) so selection and editing survive sorting and paging.
- Use `manual` with server paging once data no longer fits comfortably in the browser.
- Pin the column that identifies the row, so it stays visible while scrolling sideways.

## Limitations

- Virtualised rows need a fixed height (`rowHeight`), and don't stack or expand.
- Mounting tens of thousands of rows still indexes every row for keyboard navigation; beyond that, page on the server.

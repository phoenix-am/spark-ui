## Features

- A segmented control (one selection) or a row of independent toggles (`selectionMode="multiple"`).
- Two looks, `segmented` and `outlined`, in three sizes; `fullWidth` to fill the row.
- Horizontal or vertical (`orientation`).
- Controlled (`value` + `onChange`) or uncontrolled (`defaultValue`).

## Accessibility

- The whole group is one Tab stop; arrow keys move between items.
- Items announce their state (`aria-checked` for single selection, `aria-pressed` for multiple).
- Give the group an `aria-label`, and icon-only items their own `aria-label`.

## Responsive behavior

With `fullWidth`, items share the row equally. Keep labels short so they don't wrap on small screens.

## Best practices

- Use it to switch between two to five views or modes. For more options, use a `Dropdown`.
- For actions (not states), use separate `Button`s instead.

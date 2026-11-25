## Features

- A panel that slides in from any edge (`placement`), with `title`, `description`, body and `actions`.
- Controlled with `open` and `onClose`; `dismissable` controls closing by Escape and backdrop click, and `closeButton` shows a close button.
- Current runs along its inner edge as it opens.

## Accessibility

- Focus is trapped while open and returned afterwards; the page behind is hidden from screen readers and doesn't scroll.
- Escape closes it unless `dismissable` is off.

## Responsive behavior

Side drawers are capped at the screen width; a `bottom` drawer works well as a sheet on phones.

## Best practices

- Use drawers for filters, details and short forms related to the page behind.

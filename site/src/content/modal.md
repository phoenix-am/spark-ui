## Features

- A dialog with a `title`, `description`, body and `actions`, in three sizes.
- Controlled with `open` and `onClose`; Escape and clicking outside close it (`closeOnBackdrop`).
- The page behind dims with a flicker that follows the energy dial.

## Accessibility

- Focus moves into the dialog, stays there, and returns to the opener when it closes.
- The page behind is hidden from screen readers and can't scroll.
- The title and description name and describe the dialog.

## Responsive behavior

The dialog takes the width it needs up to its size limit, and never wider than the screen; long content scrolls inside it.

## Best practices

- Use modals sparingly, for decisions that need full attention, like confirming a delete.
- Label buttons with the action (“Delete project”), not “OK”.
- For details or forms that don't need to block the page, use a `Drawer`.

## Features

- Brief notifications from anywhere: wrap your app in `ToastProvider`, then call `toast()` from `useToast()`.
- A title, optional description, `tone`, an `action` (like Undo) and a `duration`.
- Toasts stack (up to five) and their timer pauses while hovered or focused.

## Accessibility

- Toasts live in a labelled region; error toasts use `role="alert"` and are read out immediately, others use `role="status"`.
- The timer pauses on focus, so keyboard users have time to reach the action.

## Hooks

| Hook | Returns | Description |
|---|---|---|
| `useToast()` | `{ toast(options): void }` | Shows a toast. Call it inside `ToastProvider`. |

## Best practices

- Use toasts to confirm something happened (“Saved”). For errors people must fix, show an `Alert` next to the problem.
- Offer Undo for reversible actions instead of asking for confirmation first.

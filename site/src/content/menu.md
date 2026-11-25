## Features

- A list of actions behind a `trigger`, with sections, icons, descriptions and submenus.
- Single or multiple selection (`selectionMode`) for things like sort order or visible columns.
- `onAction` for commands, `onSelectionChange` for selections; items can also be links.
- `placement` controls where it opens.

## Accessibility

- Arrow keys move, Enter or Space runs an item, and typing jumps to it.
- Submenus open with the right arrow (left in right-to-left) and close with the left arrow.
- Escape closes the menu and focus returns to the trigger.

## Best practices

- Use a menu for actions. To pick a value in a form, use a `Dropdown`.
- Put destructive actions last, in their own section.

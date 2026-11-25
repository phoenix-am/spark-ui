## Features

- A searchable list of commands in groups, opened with ⌘K or Ctrl+K (`hotkey`).
- Items can have icons, descriptions, `keywords` for search, `shortcut` hints and links.
- Async results: control the search with `onSearchChange` and show `loading`.
- Controlled (`open` + `onOpenChange`) or uncontrolled (`defaultOpen`); `closeOnSelect` and a custom `filter`.

## Accessibility

- A dialog with a combobox: focus stays in the search box while arrow keys move the active option.
- Enter runs the command; Escape closes, and focus returns to where it was.
- The number of results is announced as you type.

## Best practices

- Include navigation and frequent actions, and add `keywords` for the words people might type (“invoice” for Billing).
- Show the shortcut somewhere in your UI so people learn it.

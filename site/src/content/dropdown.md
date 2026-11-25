## Features

- Pick one value from `options` (`{ value, label, icon?, description?, disabled? }`), or grouped options with headings.
- Controlled (`value` + `onChange`) or uncontrolled (`defaultValue`), with a `placeholder` when empty.
- Label, helper text, error, three sizes and a `startIcon`.
- A hidden native select submits the value with plain forms and supports browser autofill.
- `Select` is the same component under another name.

## Accessibility

- Typeahead works on the closed and open list; arrow keys, Home/End, Enter and Escape behave like a native select.
- Group headings are announced; the selected option is marked for screen readers.
- Focus returns to the trigger when the list closes.

## Best practices

- Use it for six or more options; for fewer, a `RadioGroup` shows every choice at once.
- When the list is long enough that people want to type, use a `Combobox`.
- Migrate away from the deprecated props listed in the API reference; each one names its replacement.

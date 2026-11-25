## Features

- Type to filter `options`; matching ignores case and accents.
- Allow values that aren't in the list (`allowsCustomValue`), add a clear button (`clearable`).
- Load options from a server: control `inputValue`, react to `onInputChange`, and show `loading`.
- A custom `filter`, and `menuTrigger` to open on typing, on focus, or only by the button.

## Accessibility

- An ARIA combobox: arrow keys move through options, Enter picks, Escape closes or clears.
- The number of results is announced as you type.
- The label, helper text and error are linked to the input.

## Best practices

- Use it when there are too many options to scroll comfortably (countries, people, tags).
- With server search, debounce `onInputChange` and show `loadingText` so people know results are coming.

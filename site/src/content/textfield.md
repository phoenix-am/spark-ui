## Features

- Label, placeholder, helper text and error state in one component.
- Three looks: `outlined`, `filled` and `standard`; three sizes via `inputSize`.
- Content inside the field with `prepend` and `append`, such as a currency symbol or a button.
- A charge meter (`charge`) that fills as the value gets more complete, for example password strength.
- Input helpers: `isCurrency` formatting, `formatPhoneNumber`, and `cardDetection`.
- Forwards `ref` to the `<input>`, so React Hook Form's `register` works.

## Accessibility

- The label, helper text and error are linked to the input, so screen readers read them together.
- `type` sets the right mobile keyboard and browser autofill (`email`, `tel`, `password`).
- Errors are shown with text, not just a red border.

## Best practices

- Always give the field a visible `label`; a placeholder disappears as soon as someone types.
- Validate on blur or submit, not on every keystroke, and say how to fix the problem in `helperText`.
- Use `type="email"`, `type="tel"` and friends so phones show the right keyboard.
- `onChange` gives the input event, like a plain `<input>`. `onValueChange(value)` gives the text directly, like the other fields.
- Controlled (`value` and `onChange`): the field always shows the value you pass, including changes you make yourself, such as a reset or data loaded from the server. Uncontrolled (`defaultValue`): the field keeps its own value.

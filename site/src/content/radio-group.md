## Features

- Pick exactly one option from `options` (`{ value, label, description?, disabled? }`).
- Two looks: a simple list, or `variant="cards"` with room for descriptions.
- Controlled (`value` + `onChange`) or uncontrolled (`defaultValue`).
- Submits with forms under `name`.

## Accessibility

- Native radio inputs in a group with a legend, so the group name is announced with each option.
- The group is one Tab stop; arrow keys move and select within it.
- Disabled options are skipped by the arrow keys.

## Responsive behavior

The cards variant wraps onto new rows as the container narrows.

## Best practices

- Show all options at once when there are about five or fewer; use a `Dropdown` for longer lists.
- Preselect a sensible default unless choosing nothing is meaningful.
- Use cards when each option needs a sentence of explanation, like pricing plans.

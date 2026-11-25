## Features

- A photo (`src`) or initials from `name`, with a colour picked from the name so the same person always looks the same.
- Falls back to initials if the image fails to load.
- Four sizes and a status dot (`online`, `busy`, `away`, `offline`); online pulses with current.
- `AvatarGroup` overlaps several people and folds the rest into “+N” (`max`).

## Accessibility

- Announced as an image named after the person, including their status.

## Best practices

- Always pass `name`, even with a photo; it's the accessible name and the fallback.

## Limitations

- `AvatarGroup`'s screen-reader labels (“6 people”, “2 more”) are English-only for now; they don't follow the locale yet.

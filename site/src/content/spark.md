## Features

- The spark burst behind every Sparkwire button, available for your own elements.
- `burst()` fires from the pointer position of a click, or from the centre for keyboard clicks.
- Customise the number of particles (`count`), how far they fly (`spread`) and their `colors`.
- Follows the energy dial: fewer particles on `calm`, more on `electric`, none when `off`.

## Accessibility

- Purely decorative: the particles are hidden from screen readers.
- Renders nothing for people who have reduced motion turned on.
- Keep the real action in the element's click handler; the burst is only feedback.

## Best practices

- Use sparks for moments worth celebrating (sending, publishing, liking), not on every control.
- Place `<Spark>` inside an element with `position: relative`; bursts are positioned inside it.
- For several elements, `useSpark()` from `@sparkwire/core/headless` gives you `sparks` and `burst` without managing a ref.

## Limitations

- Bursts are positioned inside their nearest positioned ancestor; an element with `overflow: hidden` clips them.

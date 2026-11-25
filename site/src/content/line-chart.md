## Features

- Lines for trends over time or any ordered axis, from `data` (one object per x value), `x` and `series`.
- Fill the area under each line (`area`), stack series (`stacked`), smooth them (`curved`) and mark points (`showPoints`).
- A crosshair and tooltip that follow the pointer, legend toggles to hide series, and a data table view.
- Number formatting through Intl (`valueFormat`) and custom x labels (`formatX`).
- Lines draw in like current; the animation follows the energy dial and reduced motion.

## Accessibility

- The chart has an accessible name from `title` and an optional `description`.
- Focus the chart and use the arrow keys to move through the data; the tooltip follows.
- A “Data table” view (on by default with `tableView`) shows the numbers as a real table for screen readers and printing.
- Series are identified by the legend and labels, never by colour alone.

## Responsive behavior

Charts fill their container's width and keep the `height` you set. Put them in a container with a width, and use `formatX` to shorten long labels on small screens.

## Limitations

- One y axis per chart. To compare measures on different scales, use two charts.
- Rendered as SVG in the browser; there's no image export built in.

## Best practices

- Keep it to about five series; more lines become hard to tell apart.
- Use `zeroBaseline` when the size of the change matters, so the axis starts at zero.

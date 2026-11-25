## Features

- Compare amounts across categories, grouped or `stacked`, vertical or `horizontal`.
- Data from `data`, `x` and `series`, with Intl number formatting (`valueFormat`).
- A tooltip per group on hover or keyboard, legend toggles and a data table view.

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

- Use horizontal bars when category labels are long.
- Bars should start at zero; don't use bars for values where zero is meaningless.

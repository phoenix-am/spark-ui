## Features

- Drop files on the zone or browse; `accept`, `maxSize` and `maxFiles` are checked as files arrive.
- Rejected files come with a reason (`onReject`), shown in the list.
- A file list with image previews (`previews`), progress bars and remove buttons.
- You run the upload: start it in `onAdd`, then pass `progress` and `status` back through `files`.

## Accessibility

- The drop zone is a real button: Enter or Space opens the file picker.
- Drag-and-drop also works from the keyboard and screen readers through React Aria's drop support.
- Each file's remove button has a translated label naming the file; errors are announced.

## Responsive behavior

The zone and the file list fill their container's width; long file names are truncated with an ellipsis.

## Best practices

- Say what's allowed in `hint` (“PNG or JPG, up to 5 MB”), so people don't find out by failing.
- Upload as files are added and show progress, rather than waiting for a form submit.

## Limitations

- Uploading itself isn't built in; connect `onAdd` to your API.
- Folder uploads aren't supported.

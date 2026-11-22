/** With multiple selection it acts like a row of toggle buttons, like the formatting bar in an editor. */
import { ToggleGroup, ToggleGroupItem } from '@sparkwire/core';

export default function Multiple() {
  return (
    <ToggleGroup aria-label="Text style" selectionMode="multiple" variant="outlined" defaultValue={['bold']}>
      <ToggleGroupItem value="bold" aria-label="Bold"><b>B</b></ToggleGroupItem>
      <ToggleGroupItem value="italic" aria-label="Italic"><i>I</i></ToggleGroupItem>
      <ToggleGroupItem value="underline" aria-label="Underline"><u>U</u></ToggleGroupItem>
    </ToggleGroup>
  );
}

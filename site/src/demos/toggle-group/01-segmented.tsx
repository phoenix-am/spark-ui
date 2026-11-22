/** A segmented control for switching between a few views. Arrow keys move between the options. */
import { ToggleGroup, ToggleGroupItem } from '@sparkwire/core';

export default function Segmented() {
  return (
    <ToggleGroup aria-label="Time range" defaultValue="7d">
      <ToggleGroupItem value="24h">24h</ToggleGroupItem>
      <ToggleGroupItem value="7d">7 days</ToggleGroupItem>
      <ToggleGroupItem value="30d">30 days</ToggleGroupItem>
    </ToggleGroup>
  );
}

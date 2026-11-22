import type { Meta, StoryObj } from '@storybook/react';
import { ToggleGroup } from '.';

/** A segmented control (`single`) or a row of independent toggles (`multiple`). One Tab stop; arrow keys move between items. */
const meta: Meta = { title: 'Inputs/ToggleGroup' };
export default meta;

const Icon = ({ d }: { d: string }) => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><path d={d} /></svg>
);
export const Segmented: StoryObj = {
  render: () => (
    <ToggleGroup aria-label="Range" defaultValue="month">
      <ToggleGroup.Item value="day">Day</ToggleGroup.Item>
      <ToggleGroup.Item value="week">Week</ToggleGroup.Item>
      <ToggleGroup.Item value="month">Month</ToggleGroup.Item>
      <ToggleGroup.Item value="year">Year</ToggleGroup.Item>
    </ToggleGroup>
  ),
};
export const MultipleIcons: StoryObj = {
  render: () => (
    <ToggleGroup aria-label="Text style" selectionMode="multiple" defaultValue={['bold']} size="small">
      <ToggleGroup.Item value="bold" aria-label="Bold" icon={<Icon d="M7 5h6a3.5 3.5 0 0 1 0 7H7zM7 12h7a3.5 3.5 0 0 1 0 7H7z" />} />
      <ToggleGroup.Item value="italic" aria-label="Italic" icon={<Icon d="M14 5h-4M14 19h-4M14 5l-4 14" />} />
      <ToggleGroup.Item value="underline" aria-label="Underline" icon={<Icon d="M7 5v6a5 5 0 0 0 10 0V5M5 20h14" />} />
    </ToggleGroup>
  ),
};
export const Outlined: StoryObj = {
  render: () => (
    <ToggleGroup aria-label="Plan" variant="outlined" defaultValue="pro">
      <ToggleGroup.Item value="free">Free</ToggleGroup.Item>
      <ToggleGroup.Item value="pro">Pro</ToggleGroup.Item>
      <ToggleGroup.Item value="team" disabled>Team</ToggleGroup.Item>
    </ToggleGroup>
  ),
};
export const FullWidth: StoryObj = {
  render: () => (
    <div style={{ maxWidth: 420 }}>
      <ToggleGroup aria-label="View" fullWidth defaultValue="list">
        <ToggleGroup.Item value="list" icon={<Icon d="M8 6h13M8 12h13M8 18h13M3 6h.01M3 12h.01M3 18h.01" />}>List</ToggleGroup.Item>
        <ToggleGroup.Item value="grid" icon={<Icon d="M3 3h7v7H3zM14 3h7v7h-7zM3 14h7v7H3zM14 14h7v7h-7z" />}>Grid</ToggleGroup.Item>
      </ToggleGroup>
    </div>
  ),
};

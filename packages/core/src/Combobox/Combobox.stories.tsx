import React, { useEffect, useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { fn } from '@storybook/test';
import { MapPin, Search } from '@spark-ui/icons';
import { Combobox } from '.';

const cities = [
  'Ahmedabad', 'Amreli', 'Bengaluru', 'Bhopal', 'Chennai', 'Delhi', 'Hyderabad', 'Jaipur', 'Kochi',
  'Kolkata', 'Lucknow', 'Mumbai', 'Pune', 'Rajkot', 'Surat', 'Vadodara', 'São Paulo', 'Zürich',
].map((c) => ({ value: c.toLowerCase(), label: c }));

/**
 * Type to search, then pick. Matching ignores case and accents ("sao"
 * finds São Paulo). Arrow keys move, Enter picks, Escape closes then
 * clears. Built on the InputBase, Popover and ListBox base components.
 */
const meta: Meta<typeof Combobox> = {
  title: 'Inputs/Combobox',
  component: Combobox,
  args: { label: 'City', options: cities, placeholder: 'Start typing…', onChange: fn(), onInputChange: fn() },
  argTypes: {
    size: { control: 'inline-radio', options: ['small', 'medium', 'large'] },
    filter: { control: 'inline-radio', options: ['contains', 'startsWith', false] },
    menuTrigger: { control: 'inline-radio', options: ['input', 'focus', 'manual'] },
    options: { control: false },
    startIcon: { control: false },
  },
  decorators: [(Story) => <div style={{ maxWidth: 360, minHeight: 380 }}><Story /></div>],
};
export default meta;
type Story = StoryObj<typeof Combobox>;

export const Playground: Story = {};
export const WithValue: Story = { args: { defaultValue: 'amreli' } };
export const WithIcon: Story = { args: { startIcon: <MapPin />, helperText: 'We deliver to these cities.' } };
export const StartsWith: Story = { args: { filter: 'startsWith', helperText: 'Only matches the start of a name.' } };
export const OpenOnFocus: Story = { args: { menuTrigger: 'focus' } };
export const Error: Story = { args: { error: 'Pick a city from the list.', required: true } };
export const Disabled: Story = { args: { disabled: true, defaultValue: 'pune' } };

/** Groups with headings; filtering keeps the headings of groups that still match. */
export const Groups: Story = {
  args: {
    label: 'Timezone',
    options: [
      { label: 'Asia', options: [{ value: 'Asia/Kolkata', label: 'Kolkata (IST)' }, { value: 'Asia/Dubai', label: 'Dubai (GST)' }, { value: 'Asia/Tokyo', label: 'Tokyo (JST)' }] },
      { label: 'Europe', options: [{ value: 'Europe/London', label: 'London (GMT)' }, { value: 'Europe/Berlin', label: 'Berlin (CET)' }] },
      { label: 'Americas', options: [{ value: 'America/New_York', label: 'New York (EST)' }, { value: 'America/Sao_Paulo', label: 'São Paulo (BRT)' }] },
    ],
  },
};

/** Free entry: keep text that matches no option, e.g. a new tag. */
export const CustomValue: Story = {
  args: { label: 'Tag', allowsCustomValue: true, placeholder: 'Pick or type a new tag', options: ['bug', 'feature', 'docs', 'design'].map((t) => ({ value: t, label: t })) },
};

/** Server search: `filter={false}`, fetch in `onInputChange`, show `loading`. */
export const AsyncSearch: Story = {
  render: function Render(args) {
    const [text, setText] = useState('');
    const [loading, setLoading] = useState(false);
    const [results, setResults] = useState(cities);
    useEffect(() => {
      setLoading(true);
      const t = setTimeout(() => {
        setResults(cities.filter((c) => c.label.toLowerCase().includes(text.toLowerCase())));
        setLoading(false);
      }, 500);
      return () => clearTimeout(t);
    }, [text]);
    return (
      <Combobox
        {...args}
        label="Search cities"
        startIcon={<Search />}
        filter={false}
        options={results}
        loading={loading}
        onInputChange={setText}
        helperText="Results come from a (pretend) server after 500 ms."
      />
    );
  },
};

import React, { useRef } from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { useSelectState, useOverlayTriggerState } from 'react-stately';
import { useButton, useSelect, useOverlayTrigger, useDialog } from 'react-aria';
import { Globe, Search } from '@spark-ui/icons';
import { ButtonBase, InputBase, Popover, ListBox, renderListItems, findOption } from '../base';

/**
 * The base components are the building blocks under the advanced ones:
 * **ButtonBase**, **InputBase**, **Popover**, **ListBox** (with
 * `ListItemContent`) and **Overlay**. Import them from
 * `@spark-ui/core/base` to build components we don't ship, and they will
 * match the rest of the library. Unstable until 1.0.
 */
const meta: Meta = { title: 'Foundations/Base components', parameters: { layout: 'padded' } };
export default meta;
type Story = StoryObj;

/** ButtonBase: pressable, disabled for any element, sparks. Bring your own style. */
export const ButtonBaseExample: Story = {
  name: 'ButtonBase',
  render: () => (
    <div style={{ display: 'flex', gap: 12 }}>
      <ButtonBase style={{ padding: '10px 16px', borderRadius: 999, border: '2px dashed var(--spark-energy-ink)', background: 'none', color: 'var(--spark-text-primary)', cursor: 'pointer' }}>
        Custom pill
      </ButtonBase>
      <ButtonBase as="a" href="#" style={{ color: 'var(--spark-energy-ink)', padding: 10 }}>A link that sparks</ButtonBase>
    </div>
  ),
};

/** InputBase: the field shell with adornments, used by Textfield and Combobox. */
export const InputBaseExample: Story = {
  name: 'InputBase',
  render: () => (
    <div style={{ display: 'grid', gap: 12, maxWidth: 360 }}>
      <InputBase aria-label="Search" placeholder="Search docs" startAdornment={<Search />} endAdornment={<kbd style={{ fontSize: 12 }}>/</kbd>} />
      <InputBase aria-label="Website" variant="filled" placeholder="example.com" startAdornment={<span>https://</span>} />
      <InputBase aria-label="Standard" variant="standard" placeholder="Underline only" />
    </div>
  ),
};

const languages = [
  { label: 'India', options: [{ value: 'hi', label: 'हिन्दी', description: 'Hindi' }, { value: 'gu', label: 'ગુજરાતી', description: 'Gujarati' }] },
  { label: 'Other', options: [{ value: 'en', label: 'English' }, { value: 'ja', label: '日本語', description: 'Japanese' }] },
];

function LanguagePicker() {
  const props = { 'aria-label': 'Language', children: renderListItems(languages), defaultSelectedKey: 'en' };
  const state = useSelectState(props);
  const ref = useRef<HTMLButtonElement>(null);
  const { triggerProps, menuProps } = useSelect(props, state, ref);
  const { buttonProps } = useButton(triggerProps, ref);
  return (
    <>
      <button {...buttonProps} ref={ref} style={{ display: 'inline-flex', gap: 8, alignItems: 'center', padding: '6px 12px', borderRadius: 999, border: '1px solid var(--spark-surface-border-strong)', background: 'var(--spark-surface-raised)', color: 'var(--spark-text-primary)', cursor: 'pointer' }}>
        <Globe /> {findOption(languages, state.selectedKey)?.label}
      </button>
      {state.isOpen && (
        <Popover state={state} triggerRef={ref} placement="bottom end">
          <ListBox {...menuProps} state={state} />
        </Popover>
      )}
    </>
  );
}

/** Popover + ListBox: a compact language picker built in ~25 lines, with groups and full keyboard support. */
export const BuildYourOwn: Story = { name: 'Build your own: language picker', render: () => <LanguagePicker /> };

function InfoDialog() {
  const state = useOverlayTriggerState({});
  const ref = useRef<HTMLButtonElement>(null);
  const { triggerProps, overlayProps } = useOverlayTrigger({ type: 'dialog' }, state, ref);
  const { buttonProps } = useButton(triggerProps, ref);
  return (
    <>
      <button {...buttonProps} ref={ref} style={{ padding: '8px 12px', cursor: 'pointer' }}>What is this?</button>
      {state.isOpen && (
        <Popover state={state} triggerRef={ref} style={{ padding: 16, maxWidth: 260 }}>
          <Panel {...overlayProps} />
        </Popover>
      )}
    </>
  );
}
function Panel(props: object) {
  const ref = useRef<HTMLDivElement>(null);
  const { dialogProps, titleProps } = useDialog(props, ref);
  return (
    <div {...dialogProps} ref={ref} style={{ outline: 'none' }}>
      <h3 {...titleProps} style={{ margin: '0 0 6px', fontSize: 15 }}>Live Wire</h3>
      <p style={{ margin: 0, fontSize: 14, color: 'var(--spark-text-secondary)' }}>Popover keeps the theme, positions itself and closes on Escape.</p>
    </div>
  );
}

/** Popover on its own: an info popover with a dialog inside. */
export const PopoverExample: Story = { name: 'Popover', render: () => <InfoDialog /> };

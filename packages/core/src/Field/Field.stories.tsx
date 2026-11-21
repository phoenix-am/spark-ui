import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { Field, useFieldControl } from '.';

/**
 * Label, help text and error for any control. Use it to give your own inputs
 * (a textarea, a third-party editor) the same labelling and error handling
 * as Spark UI's built-in fields.
 */
const meta: Meta<typeof Field> = {
  title: 'Inputs/Field',
  component: Field,
  args: { label: 'Notes', description: 'Shown to your team only.' },
  argTypes: { children: { control: false } },
  render: (args) => (
    <div style={{ maxWidth: 420 }}>
      <Field {...args}>
        <textarea placeholder="What changed in this release?" />
      </Field>
    </div>
  ),
};
export default meta;
type Story = StoryObj<typeof Field>;

export const Playground: Story = {};
export const Required: Story = { args: { required: true } };
export const Error: Story = { args: { error: 'Notes are required for production releases.', required: true } };

/** A render function receives the id and aria props to spread. */
export const RenderFunction: Story = {
  render: () => (
    <div style={{ maxWidth: 420 }}>
      <Field label="Build number" description="Digits only.">
        {(props) => <input {...props} inputMode="numeric" placeholder="4821" />}
      </Field>
    </div>
  ),
};

function CustomEditor() {
  const field = useFieldControl();
  return (
    <div
      {...field?.controlProps}
      role="textbox"
      aria-multiline="true"
      aria-labelledby={field?.labelId}
      contentEditable
      suppressContentEditableWarning
      tabIndex={0}
      style={{ minHeight: 80, padding: 12, border: '2px solid var(--spark-surface-border)', borderRadius: 6, background: 'var(--spark-surface-base)' }}
    >
      Edit me
    </div>
  );
}

/** Deeper components can read the ids with `useFieldControl()`. */
export const WithHook: Story = {
  render: () => (
    <div style={{ maxWidth: 420 }}>
      <Field label="Release notes" description="Supports rich text.">
        <CustomEditor />
      </Field>
    </div>
  ),
};

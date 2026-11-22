import React, { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { Modal } from '.';
import { Button } from '../Button';
import { Textfield } from '../Textfield';

/**
 * A power cut: the page flickers and dims, leaving only the dialog lit.
 * Focus stays inside, Escape closes, and focus returns to the trigger.
 */
const meta: Meta<typeof Modal> = {
  title: 'Overlays/Modal',
  component: Modal,
  args: {
    title: 'Cut the power?',
    description: 'This stops every running deployment in the project. You can turn it back on later.',
    size: 'medium',
    closeOnBackdrop: true,
  },
  argTypes: {
    size: { control: 'inline-radio', options: ['small', 'medium', 'large'] },
    open: { control: false },
    onClose: { control: false },
    actions: { control: false },
  },
  render: function Render(args) {
    const [open, setOpen] = useState(false);
    const close = () => setOpen(false);
    return (
      <>
        <Button color="error" onClick={() => setOpen(true)}>Open modal</Button>
        <Modal
          {...args}
          open={open}
          onClose={close}
          actions={
            <>
              <Button variant="text" onClick={close}>Cancel</Button>
              <Button color="error" onClick={close}>Cut power</Button>
            </>
          }
        />
      </>
    );
  },
};
export default meta;
type Story = StoryObj<typeof Modal>;

export const Playground: Story = {};

export const WithForm: Story = {
  render: function Render() {
    const [open, setOpen] = useState(false);
    const close = () => setOpen(false);
    return (
      <>
        <Button onClick={() => setOpen(true)}>New project</Button>
        <Modal
          open={open}
          onClose={close}
          title="New project"
          description="Give it a name. You can change it later."
          actions={
            <>
              <Button variant="text" onClick={close}>Cancel</Button>
              <Button onClick={close}>Create</Button>
            </>
          }
        >
          <Textfield label="Project name" placeholder="my-app" />
        </Modal>
      </>
    );
  },
};

import React, { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { ThemeProvider } from '@spark-ui/system';
import { Modal } from './Modal';
import { Button } from '../Button';

const meta: Meta<typeof Modal> = { component: Modal, title: 'Spark UI/Modal' };
export default meta;

const Demo = () => {
  const [open, setOpen] = useState(false);
  return (
    <ThemeProvider>
      <Button onClick={() => setOpen(true)}>Open modal</Button>
      <Modal
        open={open}
        onClose={() => setOpen(false)}
        title="Cut the power?"
        description="This stops every running deployment in the project."
        actions={
          <>
            <Button variant="text" onClick={() => setOpen(false)}>Cancel</Button>
            <Button color="error" onClick={() => setOpen(false)}>Cut power</Button>
          </>
        }
      />
    </ThemeProvider>
  );
};

export const Base: StoryObj<typeof Modal> = { render: () => <Demo /> };

/** Colour says what the button does. Keep red for things that are hard to undo. */
import { Button } from '@sparkwire/core';

export default function Colors() {
  return (
    <>
      <Button color="brand">Publish</Button>
      <Button color="success">Approve</Button>
      <Button color="warning">Pause</Button>
      <Button color="error">Delete project</Button>
    </>
  );
}

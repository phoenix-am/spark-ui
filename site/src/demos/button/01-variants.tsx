/** Three weights for three jobs: contained for the main action, outlined for the alternative, text for the quiet ones. */
import { Button } from '@sparkwire/core';

export default function Variants() {
  return (
    <>
      <Button>Save changes</Button>
      <Button variant="outlined">Preview</Button>
      <Button variant="text">Cancel</Button>
    </>
  );
}

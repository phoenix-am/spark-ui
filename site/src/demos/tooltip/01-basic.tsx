/** A short hint on hover or keyboard focus. Keep it to a few words, and never hide anything essential in one. */
import { Tooltip, Button } from '@sparkwire/core';

export default function Basic() {
  return (
    <>
      <Tooltip title="Saves without publishing">
        <Button variant="outlined">Save draft</Button>
      </Tooltip>
      <Tooltip title="Shortcut: ⌘ Enter" placement="bottom">
        <Button>Publish</Button>
      </Tooltip>
    </>
  );
}

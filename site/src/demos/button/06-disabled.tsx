/** A disabled button is a dead circuit: no sparks, no clicks, and a dashed outline so it doesn't rely on colour alone. */
import { Button } from '@sparkwire/core';

export default function Disabled() {
  return (
    <>
      <Button disabled>Deploying…</Button>
      <Button variant="outlined" disabled>
        Unavailable
      </Button>
    </>
  );
}

/** Pair the error with a short hint so people know what to fix, not just that something's wrong. */
import { Checkbox } from '@sparkwire/core';

export default function WithError() {
  return <Checkbox label="I accept the terms of service" error helperText="You'll need to accept the terms to continue." />;
}

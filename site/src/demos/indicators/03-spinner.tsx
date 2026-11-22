/** When you don't know how long it'll take. Always give it a label for screen readers. */
import { Spinner } from '@sparkwire/core';

export default function SpinnerDemo() {
  return (
    <>
      <Spinner size="small" label="Loading" />
      <Spinner label="Loading" />
      <Spinner size="large" label="Loading" />
    </>
  );
}

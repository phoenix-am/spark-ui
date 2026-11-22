import { Field, InputBase } from '@sparkwire/core';

export default function Error() {
  return (
    <div style={{ width: 340 }}>
      <Field label="Team size" required error="Enter a number between 1 and 500.">
        <InputBase type="number" defaultValue={0} />
      </Field>
    </div>
  );
}

/** Field gives any input a label, a description and an error message, all wired up for screen readers. Bring your own control. */
import { Field, InputBase } from '@sparkwire/core';

export default function WrapAnyInput() {
  return (
    <div style={{ width: '100%', maxWidth: 340 }}>
      <Field label="Website" description="Shown on your public profile.">
        <InputBase type="url" placeholder="https://" />
      </Field>
    </div>
  );
}

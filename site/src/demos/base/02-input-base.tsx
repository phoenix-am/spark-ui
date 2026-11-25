/** `InputBase` is the field shell behind Textfield: one box with adornments that lights up on focus. Add your own label with `Field`. */
import { Field } from '@sparkwire/core';
import { InputBase } from '@sparkwire/core/base';

export default function InputBaseDemo() {
  return (
    <div style={{ width: '100%', maxWidth: 320 }}>
      <Field label="Amount">
        <InputBase variant="filled" startAdornment="₹" endAdornment="INR" placeholder="0.00" inputMode="decimal" />
      </Field>
    </div>
  );
}

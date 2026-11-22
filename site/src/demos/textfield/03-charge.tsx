/** Show how “full” a field is with a charge meter. Here it fills up as the password gets stronger. */
import { Textfield } from '@sparkwire/core';

const strength = (v: string) =>
  Math.min(100, v.length * 8 + (/[A-Z]/.test(v) ? 15 : 0) + (/\d/.test(v) ? 15 : 0) + (/[^\w]/.test(v) ? 20 : 0));

export default function Charge() {
  return (
    <div style={{ width: 340 }}>
      <Textfield label="New password" type="password" charge={strength} />
    </div>
  );
}

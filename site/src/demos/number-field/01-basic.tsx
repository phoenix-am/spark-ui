/** Type a number or nudge it with the buttons and arrow keys. Min and max are enforced for you. */
import { NumberField } from '@sparkwire/core';

export default function Basic() {
  return (
    <div style={{ width: '100%', maxWidth: 240 }}>
      <NumberField label="Replicas" defaultValue={3} min={1} max={20} />
    </div>
  );
}

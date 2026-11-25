/** Type the time straight in, or open the list and pick one. */
import { TimePicker } from '@sparkwire/core';

export default function Basic() {
  return (
    <div style={{ width: '100%', maxWidth: 240 }}>
      <TimePicker label="Reminder" defaultValue="09:00" />
    </div>
  );
}

/** Limit the range and the step to match what people can actually book. */
import { TimePicker } from '@sparkwire/core';

export default function BusinessHours() {
  return (
    <div style={{ width: '100%', maxWidth: 240 }}>
      <TimePicker label="Appointment" min="09:00" max="18:00" step={30} helperText="Open 9 am to 6 pm" />
    </div>
  );
}

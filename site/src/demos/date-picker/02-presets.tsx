/** Presets turn the most common picks into a single click. */
import { DatePicker } from '@sparkwire/core';

export default function Presets() {
  return (
    <div style={{ width: 300 }}>
      <DatePicker label="Remind me" presets={['today', 'tomorrow', '+1w', '+1m']} />
    </div>
  );
}

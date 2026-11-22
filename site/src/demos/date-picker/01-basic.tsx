/** Type a date, use the arrow keys on each part, or open the calendar. All three work, so nobody's stuck. */
import { DatePicker } from '@sparkwire/core';

export default function Basic() {
  return (
    <div style={{ width: 300 }}>
      <DatePicker label="Start date" />
    </div>
  );
}

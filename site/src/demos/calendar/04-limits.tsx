/** The same limits as the date pickers: `min`, `max` and `isDateDisabled`, plus one-click `presets`. */
import { Calendar } from '@sparkwire/core';

export default function Limits() {
  const today = new Date();
  const inTwoMonths = new Date(today.getFullYear(), today.getMonth() + 2, today.getDate());
  return <Calendar aria-label="Booking date" min={today} max={inTwoMonths} isDateDisabled={(d) => d.getDay() === 0} presets={['today', 'tomorrow', '+1w']} />;
}

/** The calendar on its own, for when the date picker's field isn't needed. */
import { Calendar } from '@sparkwire/core';

export default function CalendarOnly() {
  return <Calendar aria-label="Pick a day" />;
}

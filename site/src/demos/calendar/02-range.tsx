/** The range version, for picking a span of days right on the page. */
import { RangeCalendar } from '@sparkwire/core';

export default function Range() {
  return <RangeCalendar aria-label="Trip dates" visibleMonths={2} />;
}

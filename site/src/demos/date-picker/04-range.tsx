/** Pick a start and an end in one go, with presets for the usual ranges. */
import { DateRangePicker } from '@sparkwire/core';

export default function Range() {
  return (
    <div style={{ width: 360 }}>
      <DateRangePicker label="Report period" presets={['thisWeek', 'thisMonth', '-30d']} visibleMonths={2} />
    </div>
  );
}

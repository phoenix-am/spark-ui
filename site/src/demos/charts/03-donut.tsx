/** A donut for a few parts of a whole, with the headline number in the middle. */
import { DonutChart } from '@sparkwire/core';

export default function Donut() {
  return (
    <DonutChart
      title="Storage used"
      centerLabel="72%"
      centerCaption="of 500 GB"
      data={[
        { label: 'Images', value: 180 },
        { label: 'Video', value: 110 },
        { label: 'Backups', value: 70 },
      ]}
    />
  );
}

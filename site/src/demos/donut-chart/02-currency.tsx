import { DonutChart } from '@sparkwire/core';

export default function Currency() {
  return (
    <DonutChart
      title="Spend by team"
      centerLabel="₹8.4L"
      centerCaption="this month"
      valueFormat={{ style: 'currency', currency: 'INR', maximumFractionDigits: 0 }}
      data={[
        { label: 'Engineering', value: 420000 },
        { label: 'Design', value: 180000 },
        { label: 'Marketing', value: 240000 },
      ]}
    />
  );
}

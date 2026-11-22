/** A select that looks the part and keeps native behaviour: type to jump, arrow keys to move, Escape to close. */
import { Dropdown } from '@sparkwire/core';

export default function Basic() {
  return (
    <div style={{ width: 300 }}>
      <Dropdown
        label="Country"
        placeholder="Select a country"
        options={[
          { value: 'in', label: 'India' },
          { value: 'sg', label: 'Singapore' },
          { value: 'de', label: 'Germany' },
          { value: 'us', label: 'United States' },
        ]}
      />
    </div>
  );
}

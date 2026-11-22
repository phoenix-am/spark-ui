/** Cards give each option room to explain itself, which works well for plans and regions. */
import { RadioGroup } from '@sparkwire/core';

export default function Cards() {
  return (
    <RadioGroup
      label="Region"
      variant="cards"
      defaultValue="mumbai"
      options={[
        { value: 'mumbai', label: 'Mumbai', description: 'ap-south-1' },
        { value: 'singapore', label: 'Singapore', description: 'ap-southeast-1' },
        { value: 'frankfurt', label: 'Frankfurt', description: 'eu-central-1' },
      ]}
    />
  );
}

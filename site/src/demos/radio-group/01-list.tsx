/** Use radios when people must pick exactly one option and it helps to see every choice at once. */
import { RadioGroup } from '@sparkwire/core';

export default function List() {
  return (
    <RadioGroup
      label="Delivery"
      defaultValue="standard"
      options={[
        { value: 'standard', label: 'Standard', description: '3–5 working days' },
        { value: 'express', label: 'Express', description: 'Next working day' },
        { value: 'pickup', label: 'Pick up in store' },
      ]}
    />
  );
}

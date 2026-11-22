/** Vertical steps leave room for a description under each one. */
import { Stepper } from '@sparkwire/core';

export default function Vertical() {
  return (
    <Stepper
      orientation="vertical"
      active={2}
      steps={[
        { label: 'Build', description: '1 min 12 s' },
        { label: 'Test', description: '214 passed', error: false },
        { label: 'Deploy', description: 'In progress' },
        { label: 'Verify' },
      ]}
    />
  );
}

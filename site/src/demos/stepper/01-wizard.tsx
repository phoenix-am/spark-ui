/** Break a long task into steps. Current flows between the ones you've finished. */
import { useState } from 'react';
import { Stepper, Button } from '@sparkwire/core';

const steps = [{ label: 'Cart' }, { label: 'Address' }, { label: 'Payment' }, { label: 'Review' }];

export default function Wizard() {
  const [active, setActive] = useState(1);
  return (
    <div style={{ display: 'grid', gap: 24, width: '100%', maxWidth: 600 }}>
      <Stepper steps={steps} active={active} onStepClick={setActive} />
      <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 8 }}>
        <Button variant="text" disabled={active === 0} onClick={() => setActive(active - 1)}>Back</Button>
        <Button disabled={active === steps.length - 1} onClick={() => setActive(active + 1)}>Continue</Button>
      </div>
    </div>
  );
}

import type { Meta, StoryObj } from '@storybook/react';
import { useState } from 'react';
import { Stepper } from '.';
import { Button } from '../Button';

/** Progress through a multi-step flow. Finished steps can be clicked to go back. */
const meta: Meta = { title: 'Navigation/Stepper' };
export default meta;

const steps = [
  { label: 'Account', description: 'Email & password' },
  { label: 'Company', description: 'Name and size' },
  { label: 'Billing', description: 'Plan and card' },
  { label: 'Review' },
];
export const Horizontal: StoryObj = {
  render: () => {
    const [i, setI] = useState(2);
    return (
      <div style={{ display: 'grid', gap: 24, maxWidth: 760 }}>
        <Stepper steps={steps} active={i} onStepClick={setI} />
        <div style={{ display: 'flex', gap: 8 }}>
          <Button variant="outlined" disabled={i === 0} onClick={() => setI(i - 1)}>Back</Button>
          <Button disabled={i === steps.length} onClick={() => setI(i + 1)}>{i >= steps.length - 1 ? 'Finish' : 'Next'}</Button>
        </div>
      </div>
    );
  },
};
export const WithError: StoryObj = {
  render: () => <div style={{ maxWidth: 760 }}><Stepper steps={[steps[0], { ...steps[1], error: true, description: 'GST number is invalid' }, steps[2], steps[3]]} active={2} /></div>,
};
export const Vertical: StoryObj = { render: () => <Stepper orientation="vertical" steps={steps} active={1} /> };
export const Compact: StoryObj = { render: () => <div style={{ maxWidth: 360 }}><Stepper steps={steps} active={1} /></div> };

/** Hold the value in state when other parts of the page depend on it. `onChange` receives the chosen option's `value`. */
import { useState } from 'react';
import { RadioGroup } from '@sparkwire/core';

const prices = { monthly: '₹499 / month', yearly: '₹4,990 / year' };

export default function Controlled() {
  const [billing, setBilling] = useState<keyof typeof prices>('monthly');
  return (
    <div style={{ display: 'grid', gap: 12 }}>
      <RadioGroup
        label="Billing"
        value={billing}
        onChange={(v) => setBilling(v as keyof typeof prices)}
        options={[
          { value: 'monthly', label: 'Monthly' },
          { value: 'yearly', label: 'Yearly', description: 'Two months free' },
        ]}
      />
      <output style={{ fontSize: 13, color: 'var(--spark-text-secondary)' }}>You pay {prices[billing]}</output>
    </div>
  );
}

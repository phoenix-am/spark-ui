/** `onChange` gets the new value; `onOpenChange` tells you when the list opens or closes. */
import { useState } from 'react';
import { Dropdown } from '@sparkwire/core';

export default function Controlled() {
  const [region, setRegion] = useState('ap-south-1');
  const [open, setOpen] = useState(false);
  return (
    <div style={{ display: 'grid', gap: 12, width: '100%', maxWidth: 300 }}>
      <Dropdown
        label="Region"
        value={region}
        onChange={setRegion}
        onOpenChange={setOpen}
        options={[
          { value: 'ap-south-1', label: 'Mumbai' },
          { value: 'eu-central-1', label: 'Frankfurt' },
          { value: 'us-east-1', label: 'Virginia' },
        ]}
      />
      <output style={{ fontSize: 13, color: 'var(--spark-text-secondary)' }}>{region} · list {open ? 'open' : 'closed'}</output>
    </div>
  );
}

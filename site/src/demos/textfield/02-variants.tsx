import { Textfield } from '@sparkwire/core';

export default function Variants() {
  return (
    <div style={{ display: 'grid', gap: 16, width: 340 }}>
      <Textfield label="Outlined" variant="outlined" />
      <Textfield label="Filled" variant="filled" />
      <Textfield label="Standard" variant="standard" />
    </div>
  );
}

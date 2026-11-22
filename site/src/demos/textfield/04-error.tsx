import { Textfield } from '@sparkwire/core';

export default function Error() {
  return (
    <div style={{ width: 340 }}>
      <Textfield label="Subdomain" defaultValue="admin" error helperText="That one's taken. Try another." />
    </div>
  );
}

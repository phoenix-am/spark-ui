import { Textfield } from '@sparkwire/core';

export default function Error() {
  return (
    <div style={{ width: '100%', maxWidth: 340 }}>
      <Textfield label="Subdomain" defaultValue="admin" error helperText="That one's taken. Try another." />
    </div>
  );
}

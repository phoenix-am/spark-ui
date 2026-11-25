/** A plain `<form>`, no form library. Every Sparkwire input submits under its `name`, including the dropdown, date picker and switch. Submit it to see what the server would receive. */
import { useState } from 'react';
import { Textfield, Dropdown, DatePicker, Switch, Checkbox, Button } from '@sparkwire/core';

export default function NativeForm() {
  const [sent, setSent] = useState<Record<string, FormDataEntryValue>>();
  return (
    <form
      style={{ display: 'grid', gap: 16, width: '100%', maxWidth: 360 }}
      onSubmit={(e) => {
        e.preventDefault();
        setSent(Object.fromEntries(new FormData(e.currentTarget)));
      }}
    >
      <Textfield label="Full name" name="name" required />
      <Dropdown
        label="Plan"
        name="plan"
        defaultValue="pro"
        options={[
          { value: 'hobby', label: 'Hobby' },
          { value: 'pro', label: 'Pro' },
          { value: 'team', label: 'Team' },
        ]}
      />
      <DatePicker label="Start date" name="start" />
      <Switch label="Monthly newsletter" name="newsletter" value="yes" />
      <Checkbox label="I accept the terms" name="terms" value="accepted" required />
      <Button type="submit">Create account</Button>
      {sent && <pre style={{ margin: 0, fontSize: 12 }}>{JSON.stringify(sent, null, 2)}</pre>}
    </form>
  );
}

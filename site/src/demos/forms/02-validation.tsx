/** Check the values when the form is submitted and show what's wrong next to each field. Errors are linked to their fields, so screen readers read them with the label. `Field` does the same for any control, like a plain textarea. */
import { useState } from 'react';
import { Textfield, Field, Button, Alert } from '@sparkwire/core';

type Errors = Partial<Record<'email' | 'message', string>>;

export default function Validation() {
  const [errors, setErrors] = useState<Errors>({});
  const [done, setDone] = useState(false);
  return (
    <form
      noValidate
      style={{ display: 'grid', gap: 16, width: 360 }}
      onSubmit={(e) => {
        e.preventDefault();
        const data = new FormData(e.currentTarget);
        const email = String(data.get('email') ?? '');
        const message = String(data.get('message') ?? '');
        const next: Errors = {};
        if (!/^\S+@\S+\.\S+$/.test(email)) next.email = 'Enter an email address like name@example.com.';
        if (message.trim().length < 10) next.message = 'Tell us a bit more: at least 10 characters.';
        setErrors(next);
        setDone(Object.keys(next).length === 0);
      }}
    >
      <Textfield label="Email" name="email" type="email" error={Boolean(errors.email)} helperText={errors.email} />
      <Field label="Message" error={errors.message}>
        <textarea name="message" rows={4} className="sp-input" style={{ resize: 'vertical' }} />
      </Field>
      <Button type="submit">Send</Button>
      {done && <Alert tone="success" title="Sent">Thanks! We'll reply within a day.</Alert>}
    </form>
  );
}

/** A controlled field: you own the value and can transform it as people type, here into a URL-safe slug. */
import { useState } from 'react';
import { Textfield } from '@sparkwire/core';

export default function Controlled() {
  const [slug, setSlug] = useState('my-first-post');
  return (
    <div style={{ width: '100%', maxWidth: 340 }}>
      <Textfield
        label="URL"
        value={slug}
        onChange={(e) => setSlug(e.target.value.toLowerCase().replace(/[^a-z0-9]+/g, '-'))}
        onBlur={() => setSlug((s) => s.replace(/^-+|-+$/g, ''))}
        prepend="sparkwire.dev/blog/"
        helperText="Lowercase letters, numbers and dashes."
      />
    </div>
  );
}

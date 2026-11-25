/** `onChange` hands you the text directly. Show an error once the content is invalid. */
import { useState } from 'react';
import { Textarea } from '@sparkwire/core';

export default function Controlled() {
  const [text, setText] = useState('');
  const tooShort = text.length > 0 && text.trim().length < 20;
  return (
    <div style={{ width: '100%', maxWidth: 380 }}>
      <Textarea
        label="Describe the bug"
        value={text}
        onChange={(value) => setText(value)}
        error={tooShort}
        helperText={tooShort ? 'A little more detail, please (20 characters or more).' : 'Steps to reproduce help most.'}
        autoResize
      />
    </div>
  );
}

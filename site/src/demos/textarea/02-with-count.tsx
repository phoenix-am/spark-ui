/** A live character count that screen readers announce as the limit gets close. */
import { Textarea } from '@sparkwire/core';

export default function WithCount() {
  return (
    <div style={{ width: '100%', maxWidth: 380 }}>
      <Textarea label="Bio" showCount maxLength={160} defaultValue="Frontend engineer. Coffee, typography and tidy pull requests." />
    </div>
  );
}

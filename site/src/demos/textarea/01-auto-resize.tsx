/** It grows with the text instead of trapping it in a tiny scroll box. */
import { Textarea } from '@sparkwire/core';

export default function AutoResize() {
  return (
    <div style={{ width: 380 }}>
      <Textarea label="Release notes" autoResize minRows={3} maxRows={8} placeholder="What changed in this version?" />
    </div>
  );
}

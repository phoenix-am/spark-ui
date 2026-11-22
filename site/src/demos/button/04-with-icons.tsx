/** Icons pick up the text colour, so they stay in step with every variant and theme. */
import { Button } from '@sparkwire/core';

const Arrow = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
    <path d="M5 12h14M13 6l6 6-6 6" />
  </svg>
);
const Plus = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
    <path d="M12 5v14M5 12h14" />
  </svg>
);

export default function WithIcons() {
  return (
    <>
      <Button startIcon={<Plus />}>New project</Button>
      <Button variant="outlined" endIcon={<Arrow />}>
        Continue
      </Button>
    </>
  );
}

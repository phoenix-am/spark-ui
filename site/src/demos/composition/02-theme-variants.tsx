/** Name a look once and use it everywhere. A variant matches props and applies others, so `variant="danger"` here means a red, contained button app-wide. */
import { SparkProvider, Button } from '@sparkwire/core';

// Tell TypeScript about the new variant name.
declare module '@sparkwire/core' {
  interface ButtonVariantOverrides {
    danger: true;
  }
}

export default function ThemeVariants() {
  return (
    <SparkProvider
      components={{
        Button: { variants: [{ match: { variant: 'danger' }, props: { variant: 'contained', color: 'error' } }] },
      }}
    >
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12 }}>
        <Button variant="outlined">Keep project</Button>
        <Button variant="danger">Delete project</Button>
      </div>
    </SparkProvider>
  );
}

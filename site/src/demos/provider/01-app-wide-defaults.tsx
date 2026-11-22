/** Set defaults once for the whole app, like every button being small and outlined, instead of repeating props everywhere. */
import { SparkProvider, Button, Textfield } from '@sparkwire/core';

export default function AppWideDefaults() {
  return (
    <SparkProvider components={{ Button: { defaultProps: { variant: 'outlined', size: 'small' } } }}>
      <div style={{ display: 'flex', gap: 12, alignItems: 'flex-end' }}>
        <Textfield label="Search" inputSize="small" />
        <Button>Go</Button>
        <Button variant="contained">Override</Button>
      </div>
    </SparkProvider>
  );
}

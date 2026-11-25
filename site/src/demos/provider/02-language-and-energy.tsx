/** One provider sets the language for built-in labels (and numbers and dates), and the energy level for every effect inside it. */
import { SparkProvider, Pagination, Button } from '@sparkwire/core';

export default function LanguageAndEnergy() {
  return (
    <div style={{ display: 'grid', gap: 16 }}>
      <SparkProvider locale="gu" energy="calm">
        <Pagination count={12} defaultPage={4} />
      </SparkProvider>
      <SparkProvider energy="off" messages={{ nextPage: 'Onwards', previousPage: 'Back' }}>
        <Pagination count={12} defaultPage={4} />
        <Button>Energy off: no sparks</Button>
      </SparkProvider>
    </div>
  );
}

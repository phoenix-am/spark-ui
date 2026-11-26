/** Set `mode` on the provider, or `data-spark-theme` on any element, to switch between light and dark. `system` follows the visitor's device. */
import { ThemeProvider } from '@sparkwire/system';
import { Card, Button, Textfield } from '@sparkwire/core';

function Sample({ title }: { title: string }) {
  return (
    <Card padding="large" style={{ display: 'grid', gap: 12, width: '100%', maxWidth: 240 }}>
      <strong>{title}</strong>
      <Textfield label="Email" size="small" />
      <Button size="small">Subscribe</Button>
    </Card>
  );
}

export default function LightAndDark() {
  return (
    <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap' }}>
      <ThemeProvider mode="light">
        <Sample title="Light" />
      </ThemeProvider>
      <ThemeProvider mode="dark">
        <Sample title="Dark" />
      </ThemeProvider>
    </div>
  );
}

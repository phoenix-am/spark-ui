/** `render` swaps the element underneath while keeping the behaviour and the look. Here a Button becomes a real link and a Card becomes an article. */
import { Button, Card, Badge } from '@sparkwire/core';

export default function RenderProp() {
  return (
    <Card render={<article />} padding="large" style={{ display: 'grid', gap: 12, width: '100%', maxWidth: 340 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
        <strong>Release notes</strong>
        <Badge render={<a href="#changelog" />} variant="soft">v0.3.1</Badge>
      </div>
      <p style={{ margin: 0 }}>Typed `as` on Button and a description for every prop.</p>
      <Button render={<a href="https://github.com/phoenix-am/spark-ui/releases" target="_blank" rel="noreferrer" />} variant="outlined">
        Read the release
      </Button>
    </Card>
  );
}

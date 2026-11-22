import type { Meta, StoryObj } from '@storybook/react';
import { SparkProvider } from '../Provider';
import { Button } from '../Button';
import { Card } from '../Card';
import { Badge } from '../Indicators';
import { Alert } from '../Alert';

/**
 * **`render`** swaps the element a component renders while keeping its behaviour and look:
 * `<Button render={<Link href="/pricing" />}>`. Class names are joined, handlers chained, refs merged.
 * Available on Button (and ButtonBase), Card, Badge and Alert; Menu and Sidebar take their own render props.
 *
 * **Theme variants** define named looks once in `SparkProvider components`:
 * `Button: { variants: [{ match: { variant: 'danger' }, props: { variant: 'contained', color: 'error' } }] }`.
 * Add `declare module '@sparkwire/core' { interface ButtonVariantOverrides { danger: true } }` for types.
 */
const meta: Meta = { title: 'Foundations/Composition' };
export default meta;

export const RenderProp: StoryObj = {
  name: 'render prop',
  render: () => (
    <div style={{ display: 'grid', gap: 16, maxWidth: 520 }}>
      <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
        <Button render={<a href="#pricing" />}>A link that looks like a button</Button>
        <Badge render={<a href="#inbox" />}>3 new</Badge>
      </div>
      <Card live render={<article aria-label="Changelog entry" />}>
        <strong>An &lt;article&gt; card</strong>
        <p style={{ margin: '4px 0 0' }}>Same styles and live current, different element.</p>
      </Card>
      <Alert tone="info" render={<section aria-label="Announcement" />}>Rendered as a labelled section.</Alert>
    </div>
  ),
};

export const ThemeVariants: StoryObj = {
  name: 'Theme variants',
  render: () => (
    <SparkProvider
      components={{
        Button: {
          variants: [
            { match: { variant: 'danger' }, props: { variant: 'contained', color: 'error' } },
            { match: { variant: 'ghost' }, props: { variant: 'text', spark: false }, className: 'demo-ghost' },
          ],
        },
        Badge: { variants: [{ match: { tone: 'success' }, props: { pulse: true } }] },
      }}
    >
      <div style={{ display: 'flex', gap: 12, alignItems: 'center', flexWrap: 'wrap' }}>
        <Button variant={'danger' as never}>Delete project</Button>
        <Button variant={'ghost' as never}>Cancel</Button>
        <Badge tone="success">Live</Badge>
      </div>
    </SparkProvider>
  ),
};

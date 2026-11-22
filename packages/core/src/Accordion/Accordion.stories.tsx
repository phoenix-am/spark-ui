import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { Accordion, AccordionItem } from '.';

/** Opening a section closes its circuit: the wire beside it lights up. */
const meta: Meta<typeof Accordion> = {
  title: 'Navigation/Accordion',
  component: Accordion,
  subcomponents: { AccordionItem } as Record<string, React.ComponentType<unknown>>,
  args: { multiple: false, defaultOpen: ['what'] },
  render: (args) => (
    <div style={{ maxWidth: 560 }}>
      <Accordion {...args}>
        <AccordionItem value="what" title="What is Spark UI?">A React component library where components carry current.</AccordionItem>
        <AccordionItem value="motion" title="Can I turn the motion off?">Yes. Every animation respects the reduce-motion setting.</AccordionItem>
        <AccordionItem value="theme" title="Can I change the colours?">Pass your own theme to ThemeProvider.</AccordionItem>
        <AccordionItem value="soon" title="Server components?" disabled>Coming soon.</AccordionItem>
      </Accordion>
    </div>
  ),
};
export default meta;
type Story = StoryObj<typeof Accordion>;

export const Playground: Story = {};
export const Multiple: Story = { args: { multiple: true, defaultOpen: ['what', 'motion'] } };
export const AllClosed: Story = { args: { defaultOpen: [] } };

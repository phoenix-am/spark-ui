import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { ThemeProvider } from '@spark-ui/system';
import { Accordion, AccordionItem } from './Accordion';

const meta: Meta = { title: 'Spark UI/Accordion' };
export default meta;

export const Base: StoryObj = {
  render: () => (
    <ThemeProvider>
      <div style={{ maxWidth: 520 }}>
        <Accordion defaultOpen={['what']}>
          <AccordionItem value="what" title="What is Spark UI?">A React component library where components carry current.</AccordionItem>
          <AccordionItem value="motion" title="Can I turn the motion off?">Yes. Everything respects prefers-reduced-motion.</AccordionItem>
          <AccordionItem value="theme" title="Can I change the colours?">Pass your own theme to ThemeProvider.</AccordionItem>
        </Accordion>
      </div>
    </ThemeProvider>
  ),
};

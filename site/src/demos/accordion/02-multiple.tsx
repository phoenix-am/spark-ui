/** Allow several panels open at once when people compare sections. */
import { Accordion, AccordionItem } from '@sparkwire/core';

export default function Multiple() {
  return (
    <div style={{ width: '100%', maxWidth: 520 }}>
      <Accordion multiple defaultOpen={['a', 'b']}>
        <AccordionItem value="a" title="Shipping">Free over ₹999.</AccordionItem>
        <AccordionItem value="b" title="Returns">30 days, no questions.</AccordionItem>
        <AccordionItem value="c" title="Warranty">Two years on everything we make.</AccordionItem>
      </Accordion>
    </div>
  );
}

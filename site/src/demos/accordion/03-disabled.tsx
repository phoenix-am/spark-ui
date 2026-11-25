/** Disable a section that isn't available yet; it stays visible but can't open. */
import { Accordion, AccordionItem } from '@sparkwire/core';

export default function Disabled() {
  return (
    <div style={{ width: '100%', maxWidth: 520 }}>
      <Accordion>
        <AccordionItem value="profile" title="Profile">Name, photo and bio.</AccordionItem>
        <AccordionItem value="billing" title="Billing (admins only)" disabled>Invoices and payment methods.</AccordionItem>
      </Accordion>
    </div>
  );
}

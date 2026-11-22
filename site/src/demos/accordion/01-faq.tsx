/** Let people open only what they need. Great for FAQs and long settings pages. */
import { Accordion, AccordionItem } from '@sparkwire/core';

export default function Faq() {
  return (
    <div style={{ width: '100%', maxWidth: 520 }}>
      <Accordion defaultOpen={['free']}>
        <AccordionItem value="free" title="Is Sparkwire free?">Yes. It's open source under the MIT licence.</AccordionItem>
        <AccordionItem value="ts" title="Does it work with TypeScript?">Every component ships with types, and the props are documented right in your editor.</AccordionItem>
        <AccordionItem value="ssr" title="Can I use it with Next.js?">It renders on the server and hydrates on the client, so it works with the App Router.</AccordionItem>
      </Accordion>
    </div>
  );
}

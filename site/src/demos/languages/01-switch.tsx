/** Built-in labels follow the locale, and so do numbers and dates. */
import { useState } from 'react';
import { SparkProvider, ToggleGroup, ToggleGroupItem, DatePicker, NumberField, Pagination } from '@sparkwire/core';

export default function Switcher() {
  const [locale, setLocale] = useState('hi');
  return (
    <div style={{ display: 'grid', gap: 16, width: '100%', maxWidth: 320 }}>
      <ToggleGroup aria-label="Language" size="small" value={locale} onChange={(v) => v && setLocale(v as string)}>
        <ToggleGroupItem value="en">English</ToggleGroupItem>
        <ToggleGroupItem value="hi">हिन्दी</ToggleGroupItem>
        <ToggleGroupItem value="gu">ગુજરાતી</ToggleGroupItem>
        <ToggleGroupItem value="ta">தமிழ்</ToggleGroupItem>
      </ToggleGroup>
      <SparkProvider locale={locale}>
        <DatePicker label="Date" />
        <NumberField label="Amount" defaultValue={125000} formatOptions={{ style: 'currency', currency: 'INR' }} />
        <Pagination count={8} defaultPage={3} />
      </SparkProvider>
    </div>
  );
}

/** Formatting comes from Intl, so currency, percentages and units look right in every locale. */
import { NumberField } from '@sparkwire/core';

export default function Formats() {
  return (
    <div style={{ display: 'grid', gap: 16, width: '100%', maxWidth: 240 }}>
      <NumberField label="Monthly budget" defaultValue={25000} step={1000} formatOptions={{ style: 'currency', currency: 'INR', maximumFractionDigits: 0 }} />
      <NumberField label="Discount" defaultValue={0.15} step={0.05} min={0} max={1} formatOptions={{ style: 'percent' }} />
    </div>
  );
}

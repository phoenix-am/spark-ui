/** Pass two values to get two thumbs: handy for price filters and time windows. */
import { Slider } from '@sparkwire/core';

export default function Range() {
  return (
    <div style={{ width: '100%', maxWidth: 320 }}>
      <Slider
        label="Price"
        min={0}
        max={50000}
        step={500}
        defaultValue={[8000, 32000]}
        thumbLabels={['Minimum price', 'Maximum price']}
        formatOptions={{ style: 'currency', currency: 'INR', maximumFractionDigits: 0 }}
      />
    </div>
  );
}

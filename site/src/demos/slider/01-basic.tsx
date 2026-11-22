import { Slider } from '@sparkwire/core';

export default function Basic() {
  return (
    <div style={{ width: 320 }}>
      <Slider label="Brightness" defaultValue={70} formatOptions={{ style: 'unit', unit: 'percent' }} />
    </div>
  );
}

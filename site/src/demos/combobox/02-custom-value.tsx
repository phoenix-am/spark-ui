/** Allow free text when the list is only a set of suggestions. */
import { Combobox } from '@sparkwire/core';

export default function CustomValue() {
  return (
    <div style={{ width: 300 }}>
      <Combobox
        label="Tag"
        allowsCustomValue
        helperText="Pick a suggestion or type a new tag."
        options={['bug', 'feature', 'docs', 'performance'].map((t) => ({ value: t, label: t }))}
      />
    </div>
  );
}

/** Group long lists so people can scan them. Headings are announced to screen readers too. */
import { Dropdown } from '@sparkwire/core';

export default function Groups() {
  return (
    <div style={{ width: 300 }}>
      <Dropdown
        label="Instance type"
        defaultValue="m6"
        options={[
          { label: 'General purpose', options: [{ value: 't3', label: 't3.medium' }, { value: 'm6', label: 'm6i.large' }] },
          { label: 'Compute optimised', options: [{ value: 'c6', label: 'c6i.xlarge' }, { value: 'c7', label: 'c7g.2xlarge' }] },
        ]}
      />
    </div>
  );
}

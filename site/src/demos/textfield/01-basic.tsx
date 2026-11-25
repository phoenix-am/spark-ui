import { Textfield } from '@sparkwire/core';

export default function Basic() {
  return (
    <div style={{ width: '100%', maxWidth: 340 }}>
      <Textfield label="Project name" placeholder="my-awesome-app" helperText="Lowercase letters, numbers and dashes." />
    </div>
  );
}

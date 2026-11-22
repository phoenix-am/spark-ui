import { Switch } from '@sparkwire/core';

export default function Sizes() {
  return (
    <>
      <Switch size="small" label="Small" defaultChecked />
      <Switch size="medium" label="Medium" defaultChecked />
      <Switch size="large" label="Large" defaultChecked />
    </>
  );
}

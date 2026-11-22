/** Add a bulb that lights up when the circuit closes. A small touch that makes on and off obvious at a glance. */
import { Switch } from '@sparkwire/core';

export default function WithBulb() {
  return <Switch label="Studio lights" showBulb defaultChecked />;
}

/** A switch takes effect the moment it's flipped, so use it for settings, not for choices that wait for a Save button. */
import { Switch } from '@sparkwire/core';

export default function Basic() {
  return <Switch label="Email notifications" defaultChecked />;
}

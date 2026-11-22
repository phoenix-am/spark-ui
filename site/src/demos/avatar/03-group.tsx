/** Stack a team and fold the rest into a count. */
import { AvatarGroup } from '@sparkwire/core';

export default function Group() {
  return <AvatarGroup max={4} people={['Anmol Mehta', 'Asha Patel', 'Rohan Shah', 'Meera Joshi', 'Kabir Singh', 'Zoë Martin'].map((name) => ({ name }))} />;
}

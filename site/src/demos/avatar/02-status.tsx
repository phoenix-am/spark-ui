/** A status dot for presence. */
import { Avatar } from '@sparkwire/core';

export default function Status() {
  return (
    <>
      <Avatar name="Meera Joshi" status="online" size="large" />
      <Avatar name="Kabir Singh" status="away" size="large" />
      <Avatar name="Zoë Martin" status="offline" size="large" />
    </>
  );
}

/** Small labels for status and counts. The LED makes state readable without leaning on colour alone. */
import { Badge } from '@sparkwire/core';

export default function Badges() {
  return (
    <>
      <Badge tone="success" variant="soft" led>Live</Badge>
      <Badge tone="warning" variant="soft" led pulse>Building</Badge>
      <Badge tone="error" variant="soft" led>Failed</Badge>
      <Badge tone="neutral">Draft</Badge>
      <Badge variant="solid">New</Badge>
    </>
  );
}

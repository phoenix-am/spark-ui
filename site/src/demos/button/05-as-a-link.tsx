/** Need a link that looks like a button? Render it as an anchor, or pass your router's Link with `as`. */
import { Button } from '@sparkwire/core';

export default function AsLink() {
  return (
    <Button as="a" href="https://github.com/phoenix-am/spark-ui" target="_blank" rel="noreferrer" variant="outlined">
      View on GitHub
    </Button>
  );
}

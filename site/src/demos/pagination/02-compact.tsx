/** The compact version for tight spaces like a table footer. */
import { Pagination } from '@sparkwire/core';

export default function Compact() {
  return <Pagination count={9} defaultPage={2} variant="compact" size="small" />;
}

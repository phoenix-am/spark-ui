/** Page numbers with sensible gaps, so twelve pages or twelve hundred both fit. */
import { Pagination } from '@sparkwire/core';

export default function PaginationDemo() {
  return <Pagination count={24} defaultPage={6} />;
}

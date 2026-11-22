import { Pagination } from '@sparkwire/core';
import type { PlaygroundConfig } from '../../lib/demos';

export default { component: Pagination, props: { count: 12, siblings: 1, variant: 'pages', size: 'medium' }, fixed: { defaultPage: 4 } } satisfies PlaygroundConfig;

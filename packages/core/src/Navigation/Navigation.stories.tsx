import type { Meta, StoryObj } from '@storybook/react';
import { useState } from 'react';
import { Breadcrumbs, Pagination } from '.';

/** Breadcrumbs show where a page sits; Pagination moves between pages of results. */
const meta: Meta = { title: 'Navigation/Breadcrumbs & Pagination' };
export default meta;

const trail = [{ label: 'Home', href: '#' }, { label: 'Projects', href: '#' }, { label: 'Spark UI', href: '#' }, { label: 'Components', href: '#' }, { label: 'Button' }];
export const BreadcrumbTrail: StoryObj = { render: () => <Breadcrumbs items={trail} /> };
export const BreadcrumbCollapsed: StoryObj = { render: () => <Breadcrumbs items={trail} maxItems={3} /> };
export const Pages: StoryObj = {
  render: () => {
    const [p, setP] = useState(6);
    return <Pagination count={20} page={p} onChange={setP} />;
  },
};
export const Compact: StoryObj = { render: () => <Pagination count={12} defaultPage={3} variant="compact" /> };
export const Links: StoryObj = { render: () => <Pagination count={8} defaultPage={2} size="small" getHref={(n) => `?page=${n}`} /> };

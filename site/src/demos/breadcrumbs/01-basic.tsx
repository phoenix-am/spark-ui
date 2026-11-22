/** Show people where they are and give them a quick way back up. */
import { Breadcrumbs } from '@sparkwire/core';

export default function BreadcrumbsDemo() {
  return <Breadcrumbs items={[{ label: 'Projects', href: '#' }, { label: 'sparkwire', href: '#' }, { label: 'Settings', href: '#' }, { label: 'Domains' }]} />;
}

/** Long trails collapse: the first item, then “…”, then the last `maxItems − 1`. Pass `renderLink` to use your router's link. */
import { Breadcrumbs } from '@sparkwire/core';

export default function Collapsed() {
  return (
    <Breadcrumbs
      maxItems={3}
      separator="/"
      renderLink={({ href, className, children }) => (
        <a href={href} className={className} onClick={(e) => e.preventDefault()}>
          {children}
        </a>
      )}
      items={[
        { label: 'Home', href: '#home' },
        { label: 'Teams', href: '#teams' },
        { label: 'Design', href: '#design' },
        { label: 'Projects', href: '#projects' },
        { label: 'Rebrand' },
      ]}
    />
  );
}

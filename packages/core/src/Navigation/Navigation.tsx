import React from 'react';
import { useMessages } from '../internal/messages';
import { useDefaults, slot, ClassNames } from '../internal/defaults';

/* ----------------------------------------------------------- Breadcrumbs */

export interface BreadcrumbItem {
  label: React.ReactNode;
  /** Omit on the current page (the last item). */
  href?: string;
  icon?: React.ReactNode;
}

export interface BreadcrumbsProps {
  /** The trail from the top level down, each `{ label, href?, icon? }`. Leave `href` off the last item, the current page. */
  items: BreadcrumbItem[];
  /** Show at most this many; the middle collapses to "…". Default: all. */
  maxItems?: number;
  /** Default "/"-style chevron. */
  separator?: React.ReactNode;
  /** Render links with your router, e.g. `({ href, ...p }) => <Link href={href} {...p} />`. */
  renderLink?: (props: { href: string; className: string; children: React.ReactNode }) => React.ReactNode;
  /** Accessible name, read by screen readers. Use it when there's no visible label. */
  'aria-label'?: string;
  /** Extra class names for the outermost element. */
  className?: string;
  /** Extra class names for the component's inner parts, keyed by part name. Handy with Tailwind. */
  classNames?: ClassNames<'root' | 'item' | 'link' | 'current' | 'separator'>;
}

const Chevron = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
    <path d="m9 6 6 6-6 6" />
  </svg>
);

/**
 * A trail that shows where a page sits in your app and offers a quick way back
 * up. Long trails collapse in the middle so they never wrap awkwardly.
 *
 * Where this page sits. The last item is the current page
 * (`aria-current="page"`); long trails collapse in the middle with
 * `maxItems`. Works with any router through `renderLink`.
 *
 * Style hooks: `.sp-breadcrumbs`, `__item`, `__link`, `__current`, `__separator`, `__ellipsis`.
 */
export function Breadcrumbs(inProps: BreadcrumbsProps) {
  const m = useMessages();
  const { items, maxItems, separator = <Chevron />, renderLink, className, classNames, ...rest } = useDefaults('Breadcrumbs', inProps) as BreadcrumbsProps;
  const collapse = maxItems !== undefined && items.length > maxItems && maxItems >= 2;
  const shown: Array<BreadcrumbItem | 'ellipsis'> = collapse ? [items[0], 'ellipsis', ...items.slice(items.length - (maxItems! - 1))] : items;
  return (
    <nav aria-label={rest['aria-label'] ?? m.breadcrumb} className={slot('sp-breadcrumbs', classNames, 'root', className)}>
      <ol>
        {shown.map((item, i) => {
          const last = i === shown.length - 1;
          return (
            <li key={i} className={slot('sp-breadcrumbs__item', classNames, 'item')}>
              {item === 'ellipsis' ? (
                <span className="sp-breadcrumbs__ellipsis" aria-label={m.moreItems(m.num(items.length - maxItems! + 1))}>
                  …
                </span>
              ) : last || !item.href ? (
                <span className={slot('sp-breadcrumbs__current', classNames, 'current')} aria-current={last ? 'page' : undefined}>
                  {item.icon}
                  {item.label}
                </span>
              ) : renderLink ? (
                renderLink({ href: item.href, className: slot('sp-breadcrumbs__link', classNames, 'link'), children: <>{item.icon}{item.label}</> })
              ) : (
                <a href={item.href} className={slot('sp-breadcrumbs__link', classNames, 'link')}>
                  {item.icon}
                  {item.label}
                </a>
              )}
              {!last && (
                <span className={slot('sp-breadcrumbs__separator', classNames, 'separator')} aria-hidden="true">
                  {separator}
                </span>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}

/* ------------------------------------------------------------ Pagination */

export interface PaginationProps {
  /** Current page, 1-based. */
  page?: number;
  /** Starting page (1-based) when the component manages its own state. */
  defaultPage?: number;
  /** Total pages. */
  count: number;
  /** Called with the newly chosen page number. */
  onChange?: (page: number) => void;
  /** Pages shown on each side of the current one. Default 1. */
  siblings?: number;
  /** Pages always shown at each end. Default 1. */
  boundaries?: number;
  /** `pages` (default) or `compact` ("Page 3 of 12" with arrows, for small screens). */
  variant?: 'pages' | 'compact';
  /** Height and text size. Default `medium`. */
  size?: 'small' | 'medium';
  /** Turns the control off: it can't be focused or changed, and it's announced as disabled. */
  disabled?: boolean;
  /** Build an href per page to render real links (good for SEO and new tabs). */
  getHref?: (page: number) => string;
  /** Accessible name, read by screen readers. Use it when there's no visible label. */
  'aria-label'?: string;
  /** Labels for translation. */
  labels?: { previous?: string; next?: string; page?: (n: number) => string; of?: (page: number, count: number) => string };
  /** Extra class names for the outermost element. */
  className?: string;
  /** Extra class names for the component's inner parts, keyed by part name. Handy with Tailwind. */
  classNames?: ClassNames<'root' | 'item' | 'ellipsis' | 'summary'>;
}

/** Page list with ellipses: 1 … 4 5 6 … 20. Exported for custom pagers. */
export function paginationRange(page: number, count: number, siblings = 1, boundaries = 1): Array<number | 'ellipsis'> {
  const range = (a: number, b: number) => Array.from({ length: Math.max(0, b - a + 1) }, (_, i) => a + i);
  const total = siblings * 2 + 3 + boundaries * 2;
  if (count <= total) return range(1, count);
  const leftSib = Math.max(page - siblings, boundaries + 1);
  const rightSib = Math.min(page + siblings, count - boundaries);
  const leftDots = leftSib > boundaries + 2;
  const rightDots = rightSib < count - boundaries - 1;
  if (!leftDots && rightDots) return [...range(1, siblings * 2 + boundaries + 2), 'ellipsis', ...range(count - boundaries + 1, count)];
  if (leftDots && !rightDots) return [...range(1, boundaries), 'ellipsis', ...range(count - (siblings * 2 + boundaries + 2) + 1, count)];
  return [...range(1, boundaries), 'ellipsis', ...range(leftSib, rightSib), 'ellipsis', ...range(count - boundaries + 1, count)];
}

const Arrow = ({ dir }: { dir: 'left' | 'right' }) => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
    <path d={dir === 'left' ? 'm15 6-6 6 6 6' : 'm9 6 6 6-6 6'} />
  </svg>
);

/**
 * Page numbers with sensible gaps, so twelve pages or twelve hundred both fit.
 * There's a compact version for tight spots like table footers, and it can
 * render real links for server-rendered pages.
 *
 * Move between pages of results. Previous/next, page numbers
 * with ellipses (1 … 4 5 6 … 20), the current page marked
 * `aria-current="page"`, and real links when `getHref` is given.
 * `variant="compact"` shows "Page 3 of 12" for tight spaces.
 *
 * Style hooks: `.sp-pagination[data-size]`, `__item[aria-current]`, `__ellipsis`, `__summary`.
 */
export function Pagination(inProps: PaginationProps) {
  const props = useDefaults('Pagination', inProps) as PaginationProps;
  const m = useMessages();
  const { count, siblings = 1, boundaries = 1, variant = 'pages', size = 'medium', disabled, getHref, labels = {}, className, classNames } = props;
  const [inner, setInner] = React.useState(props.defaultPage ?? 1);
  const page = Math.min(Math.max(1, props.page ?? inner), Math.max(1, count));
  const go = (p: number) => {
    if (p < 1 || p > count || p === page) return;
    if (props.page === undefined) setInner(p);
    props.onChange?.(p);
  };
  const pageLabel = labels.page ?? ((n: number) => m.page(m.num(n)));
  const item = (p: number, content: React.ReactNode, label: string, opts: { current?: boolean; off?: boolean } = {}) => {
    const common = {
      className: slot('sp-pagination__item', classNames, 'item'),
      'aria-label': label,
      'aria-current': opts.current ? ('page' as const) : undefined,
    };
    if (getHref && !opts.off && !disabled)
      return (
        <a {...common} href={getHref(p)} onClick={(e) => { if (props.onChange) { e.preventDefault(); go(p); } }}>
          {content}
        </a>
      );
    return (
      <button {...common} type="button" disabled={opts.off || disabled} onClick={() => go(p)}>
        {content}
      </button>
    );
  };
  return (
    <nav aria-label={props['aria-label'] ?? m.pagination} className={slot('sp-pagination', classNames, 'root', className)} data-size={size} data-variant={variant}>
      <ul>
        <li>{item(page - 1, <Arrow dir="left" />, labels.previous ?? m.previousPage, { off: page <= 1 })}</li>
        {variant === 'compact' ? (
          <li className={slot('sp-pagination__summary', classNames, 'summary')} aria-live="polite">
            {labels.of ? labels.of(page, count) : m.pageOf(m.num(page), m.num(count))}
          </li>
        ) : (
          paginationRange(page, count, siblings, boundaries).map((p, i) => (
            <li key={p === 'ellipsis' ? `e${i}` : p}>
              {p === 'ellipsis' ? (
                <span className={slot('sp-pagination__ellipsis', classNames, 'ellipsis')} aria-hidden="true">
                  …
                </span>
              ) : (
                item(p, m.num(p), pageLabel(p), { current: p === page })
              )}
            </li>
          ))
        )}
        <li>{item(page + 1, <Arrow dir="right" />, labels.next ?? m.nextPage, { off: page >= count })}</li>
      </ul>
    </nav>
  );
}

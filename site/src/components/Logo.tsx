/** Sparkwire's mark: a knife switch closing, like the Switch component. The wire follows the text colour. */
export function LogoMark({ size = 34 }: { size?: number }) {
  return (
    <svg className="sw-logo__mark" width={Math.round(size * 1.55)} height={size} viewBox="4 20 90 58" aria-hidden="true" focusable="false">
      <path d="M8 64h18" stroke="currentColor" strokeWidth="7" strokeLinecap="round" />
      <circle cx="28" cy="64" r="7" fill="currentColor" />
      <path d="M28 64l30-38" stroke="var(--sw-logo-lever)" strokeWidth="8" strokeLinecap="round" />
      <circle cx="72" cy="64" r="10" fill="none" stroke="var(--sw-logo-lever)" strokeWidth="6" />
      <path d="M87 64h4" stroke="currentColor" strokeWidth="7" strokeLinecap="round" />
      <path d="M66 44l5-7M74 50l8-3" stroke="var(--sw-logo-lever)" strokeWidth="4" strokeLinecap="round" />
    </svg>
  );
}

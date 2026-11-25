/** Console warning in development only. Safe without a bundler (no global `process`). */
export function devWarn(...args: unknown[]) {
  const env = typeof process !== 'undefined' ? process.env?.NODE_ENV : undefined;
  if (env !== 'production') console.warn('[Sparkwire]', ...args);
}

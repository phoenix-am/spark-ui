// Typed here so the file also checks in browser-only projects without Node types.
declare const process: { env: { NODE_ENV?: string } };

/**
 * Console warning in development only.
 *
 * Written as the exact expression `process.env.NODE_ENV` so bundlers (Vite, webpack,
 * esbuild, Next) replace it at build time and drop the warning from production.
 * Without a bundler there is no `process`; the catch treats that as development.
 */
export function devWarn(...args: unknown[]) {
  let env: string | undefined;
  try {
    env = process.env.NODE_ENV;
  } catch {
    env = undefined;
  }
  if (env !== 'production') console.warn('[Sparkwire]', ...args);
}

import { defineConfig } from '@playwright/test';

/**
 * Visual regression tests: a screenshot of every Storybook story, compared
 * with the baseline in tests/visual/__screenshots__. Baselines are made in
 * CI (Linux, same fonts every time): a missing one is created and committed
 * to the pull request; a changed one fails the check. To accept an
 * intentional change, run the CI workflow by hand with "Update screenshots".
 */
export default defineConfig({
  testDir: 'tests/visual',
  snapshotPathTemplate: '{testDir}/__screenshots__/{arg}{ext}',
  fullyParallel: true,
  workers: process.env.CI ? 2 : undefined,
  retries: process.env.CI ? 1 : 0,
  reporter: process.env.CI ? [['list'], ['html', { open: 'never' }]] : 'list',
  updateSnapshots: 'missing',
  expect: { toHaveScreenshot: { maxDiffPixelRatio: 0.005, animations: 'disabled', caret: 'hide' } },
  use: {
    baseURL: 'http://127.0.0.1:6007',
    viewport: { width: 1024, height: 768 },
    deviceScaleFactor: 1,
    colorScheme: 'dark',
    reducedMotion: 'reduce',
    locale: 'en-US',
    timezoneId: 'Asia/Kolkata',
    launchOptions: process.env.PW_CHROME ? { executablePath: process.env.PW_CHROME } : {},
  },
  webServer: {
    command: 'node tests/visual/serve.mjs',
    url: 'http://127.0.0.1:6007/index.json',
    reuseExistingServer: !process.env.CI,
  },
});

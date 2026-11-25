import { defineConfig, devices } from '@playwright/test';

/**
 * Real-browser tests: the built docs site, whose pages are made of the real
 * components, driven in Chromium, Firefox and WebKit (Safari's engine).
 *
 *   npm run docs:build && npm run test:e2e
 *
 * Locally, PW_CHROME=/path/to/chrome runs Chromium only, with that browser.
 */
const localChrome = process.env.PW_CHROME;

export default defineConfig({
  testDir: 'e2e',
  timeout: 30_000,
  expect: { timeout: 5_000 },
  fullyParallel: true,
  retries: process.env.CI ? 1 : 0,
  reporter: process.env.CI ? [['list'], ['github']] : 'list',
  use: { baseURL: 'http://localhost:4173', locale: 'en-US', trace: 'retain-on-failure' },
  webServer: {
    command: 'npx vite preview --config site/vite.config.ts --port 4173 --strictPort',
    url: 'http://localhost:4173',
    reuseExistingServer: !process.env.CI,
    timeout: 60_000,
  },
  projects: localChrome
    ? [{ name: 'chromium', use: { ...devices['Desktop Chrome'], launchOptions: { executablePath: localChrome } } }]
    : [
        { name: 'chromium', use: { ...devices['Desktop Chrome'] } },
        { name: 'firefox', use: { ...devices['Desktop Firefox'] } },
        { name: 'webkit', use: { ...devices['Desktop Safari'] } },
        { name: 'mobile-safari', use: { ...devices['iPhone 13'] }, grep: /@mobile/ },
      ],
});

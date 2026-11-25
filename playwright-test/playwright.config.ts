import { defineConfig, devices } from '@playwright/test';
import { envConfig } from './config/env';

export default defineConfig({
  testDir: './tests',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 2 : undefined,
  globalSetup: require.resolve('./setup/global.setup'),
  globalTeardown: require.resolve('./setup/global.teardown'),
  reporter: process.env.CI
    ? [
        ['blob'],
        ['json', { outputFile: 'test-results/results.json' }],
        ['list'],
      ]
    : [
        ['html', { outputFolder: 'playwright-report', open: 'never' }],
        ['json', { outputFile: 'test-results/results.json' }],
        ['list'],
      ],
  timeout: envConfig.defaultTimeoutMs,
  expect: {
    timeout: process.env.CI ? 10_000 : 8_000,
  },
  use: {
    baseURL: envConfig.baseUrl,
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
  },
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
  ],
  webServer:
    !process.env.BASE_URL && envConfig.name === 'local'
      ? {
          command: 'npm run dev -- --port 5173',
          cwd: '../frontend',
          url: envConfig.baseUrl,
          reuseExistingServer: !process.env.CI,
          timeout: 60_000,
        }
      : undefined,
});

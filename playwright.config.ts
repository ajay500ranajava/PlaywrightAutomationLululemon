import { defineConfig } from '@playwright/test';

export default defineConfig({
  testDir: './tests',   // 👈 Your test folder
  timeout: 30 * 1000,   // 30 seconds per test
  retries: 0,           // No retries
  use: {
    headless: false,    // Show browser window
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
  },
});

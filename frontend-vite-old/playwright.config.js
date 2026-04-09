// Sample Playwright configuration file for Testing purposes only
/** @type {import('@playwright/test').PlaywrightTestConfig} */
export default {
  testDir: './tests',
  timeout: 30000,
  use: {
    baseURL: 'http://localhost:5173',
    headless: true,
  },
};

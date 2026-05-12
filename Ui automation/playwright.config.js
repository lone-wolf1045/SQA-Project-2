require('dotenv').config();

/** @type {import('@playwright/test').PlaywrightTestConfig} */
const config = {
  testDir: './tests',
  testMatch: '**/*.spec.js',

  timeout: 60000,

  use: {
    baseURL: process.env.BASE_URL,
    browserName: 'chromium',
    headless: false,
    screenshot: 'only-on-failure',
    video: 'retain-on-failure'
  },

  reporter: [['html'], ['list']]
};

module.exports = config;
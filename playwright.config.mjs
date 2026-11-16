import { defineConfig } from '@playwright/test';
import assert from 'node:assert/strict';
import path from 'node:path';
import { localStatePath } from './scripts/local-state.mjs';

const url = new URL(process.env.MADAR_BROWSER_URL || 'http://invalid');
assert(url.protocol === 'http:' && url.hostname === '127.0.0.1' && url.port, 'Use npm run check:browser; hosted URLs are not accepted.');
assert(process.env.MADAR_BROWSER_ARTIFACTS, 'Missing isolated run directory.');
const artifacts = localStatePath(undefined, process.env.MADAR_BROWSER_ARTIFACTS);
const record = process.env.MADAR_RECORD_BASELINES === '1';
export default defineConfig({
  testDir: './tests/browser', fullyParallel: false, workers: 1, retries: 0,
  forbidOnly: true, timeout: 60_000, globalTimeout: 480_000,
  expect: { timeout: 10_000, toHaveScreenshot: { animations: 'disabled', caret: 'hide', maxDiffPixels: 0 } },
  updateSnapshots: record ? 'all' : 'none',
  snapshotPathTemplate: '{testDir}/screenshots/{projectName}/{arg}{ext}',
  outputDir: path.join(artifacts, 'results'),
  reporter: [['list'], ['html', { outputFolder: path.join(artifacts, 'report'), open: 'never' }],
    ['json', { outputFile: path.join(artifacts, 'tests.json') }]],
  use: { baseURL: url.origin, browserName: 'chromium', locale: 'ar-SA', timezoneId: 'Asia/Riyadh',
    colorScheme: 'dark', reducedMotion: 'reduce', serviceWorkers: 'block', trace: 'retain-on-failure',
    screenshot: 'only-on-failure', video: 'off' },
  projects: [
    { name: 'desktop', use: { viewport: { width: 1440, height: 1000 } } },
    { name: 'mobile', use: { viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true } },
  ],
});

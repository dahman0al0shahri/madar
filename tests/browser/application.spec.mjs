import { test, expect } from '@playwright/test';

async function localRequestsOnly(context, baseURL) {
  // All requests stay on the disposable local server. No production analytics or learner services.
  await context.route('**/*', route => {
    const url = new URL(route.request().url());
    return url.origin === baseURL || ['data:', 'blob:'].includes(url.protocol)
      ? route.continue() : route.abort('blockedbyclient');
  });
}
test.beforeEach(async ({ context, baseURL }) => localRequestsOnly(context, baseURL));

test('course navigation and saved lesson note survive a fresh browser session', async ({ page, browser, baseURL }, testInfo) => {
  const errors = [];
  page.on('pageerror', error => errors.push(error.message));
  await page.goto('/');
  await expect(page.locator('#mh-main')).toBeVisible();
  await page.goto('/signin-with-chatgpt?return_to=%2Fapplications%23word');
  await page.locator('#main a[href="#learn/v01"]').first().click();
  const note = page.locator('#lesson-note-text');
  await expect(note).toBeEnabled();
  const text = 'Browser check (' + testInfo.project.name + '): synthetic note, not learner activity.';
  await note.fill(text);
  await page.locator('[data-note-save]').click();
  await expect(page.locator('.notes-status')).toContainText('محفوظة في حسابك');
  await page.reload();
  await expect(note).toHaveValue(text);
  await page.locator('a[data-nav="excel"]').click();
  await expect(page).toHaveURL(/#excel$/);
  await page.locator('a[data-nav="word"]').click();
  await page.locator('#main a[href="#learn/v01"]').first().click();
  await expect(note).toHaveValue(text);
  expect(errors).toEqual([]);
  // A brand-new context has no local/session storage. This checks the SQL record, not a cached draft.
  const fresh = await browser.newContext({ baseURL });
  try {
    await localRequestsOnly(fresh, baseURL);
    const next = await fresh.newPage();
    await next.goto('/signin-with-chatgpt?return_to=%2Fapplications%23learn%2Fv01');
    await expect(next.locator('#lesson-note-text')).toHaveValue(text);
  } finally { await fresh.close(); }
});

for (const section of ['word', 'excel', 'access']) {
  test('applications visual: ' + section, async ({ page }) => {
    test.skip(process.platform !== 'linux', 'Reference images use Ubuntu 24.04 and pinned Chromium; Windows runs interactions only.');
    await page.clock.setFixedTime(new Date('2026-11-16T12:00:00Z'));
    await page.goto('/applications#' + section);
    await expect(page.locator('#main')).toBeVisible();
    await expect(page.locator('#main')).not.toContainText('نجهّز مساحتك');
    await expect(page.locator('#main h1').first()).toBeVisible();
    await page.evaluate(() => document.fonts.ready);
    await expect(page).toHaveScreenshot(section + '.png', { fullPage: true });
  });
}

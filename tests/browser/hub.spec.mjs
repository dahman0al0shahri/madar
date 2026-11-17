import { test, expect } from '@playwright/test';

test('hub modules preserve profile data, navigation, failure recovery and history', async ({ page, context, baseURL }) => {
  await context.route('**/*', route => {
    const url = new URL(route.request().url());
    return url.origin === baseURL || ['data:', 'blob:'].includes(url.protocol)
      ? route.continue() : route.abort('blockedbyclient');
  });
  const errors = [];
  page.on('pageerror', error => errors.push(error.message));
  // Disposable local authentication and SQL storage are owned by check-browser.mjs.
  await page.goto('/signin-with-chatgpt?return_to=%2F');
  await page.waitForFunction(() => typeof document.getElementById('madar-hub')?.previewState === 'function');
  const url = '/api/madar/state?kind=profile&owner=local_seedy';
  const saved = await (await page.request.get(url)).json();
  const seed = { ...saved.snapshot, version: 1, visits: saved.snapshot?.visits || {},
    notes: { ...saved.snapshot?.notes, 'hub-test': 'Earlier synthetic note' },
    customHubTest: { retained: true } };
  const seeded = await page.request.put(url, { data: { snapshot: seed, revision: saved.revision,
    requestId: await page.evaluate(() => crypto.randomUUID()) } });
  expect(seeded.ok()).toBe(true);
  // A newer server note must enter the next profile save without losing unknown fields.
  await page.route('**/api/madar', async route => {
    const response = await route.fetch();
    const boot = await response.json();
    boot.notes = [...(boot.notes || []), { lesson: 'hub-test', note: 'Synthetic preserved note' }];
    await route.fulfill({ response, json: boot });
  });
  await page.reload();
  await page.waitForFunction(() => document.getElementById('madar-hub')?.previewState?.().profiles.student.customHubTest?.retained);
  const state = () => page.evaluate(() => document.getElementById('madar-hub').previewState());
  let rejectSave = true;
  await page.route('**/api/madar/state?*', route => route.request().method() === 'PUT' && rejectSave
    ? route.fulfill({ status: 503, contentType: 'application/json', body: JSON.stringify({ error: 'unavailable' }) })
    : route.continue());
  await page.locator('#mh-main [data-go="courses"]').click();
  await expect(page.locator('#mh-error')).toBeVisible();
  expect((await state()).route).toBe('home');
  expect((await state()).profiles.student.notes['hub-test']).toBe('Synthetic preserved note');
  rejectSave = false;
  await page.locator('#mh-retry').click();
  await expect(page).toHaveURL(/#courses$/);
  await expect(page.locator('#mh-error')).toBeHidden();
  await expect(page.locator('#mh-main')).toBeFocused();
  await page.locator('#mh-home-link').click();
  await expect(page).toHaveURL(/#madar$/);
  await page.goBack();
  await expect(page).toHaveURL(/#courses$/);
  await expect.poll(async () => (await state()).route).toBe('courses');
  await page.reload();
  await page.waitForFunction(() => document.getElementById('madar-hub')?.previewState?.().route === 'courses');
  expect((await state()).profiles.student.customHubTest).toEqual({ retained: true });
  const stored = await (await page.request.get(url)).json();
  expect(stored.snapshot.notes['hub-test']).toBe('Synthetic preserved note');
  expect(errors).toEqual([]);
  // Existing Office paths are kept, including the course home alias.
  await page.locator('#mh-picker-button').click();
  await page.locator('#mh-picker [data-go="course:office:home"]').click();
  await expect(page).toHaveURL(/\/applications#home$/);
  await expect(page.locator('#main')).toBeVisible();
});

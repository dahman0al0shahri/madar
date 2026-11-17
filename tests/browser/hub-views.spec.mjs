import { test, expect } from '@playwright/test';

test('hub search and update editor use isolated synthetic adapters', async ({ page, context, baseURL }) => {
  await context.route('**/*', route => {
    const url = new URL(route.request().url());
    return url.origin === baseURL || ['data:', 'blob:'].includes(url.protocol) ? route.continue() : route.abort('blockedbyclient');
  });
  const errors = [];
  page.on('pageerror', error => errors.push(error.message));
  const config = { access: { office: 'public', network: 'public', os1: 'public' }, contentAccess: {}, updates: [], grants: {} };
  const lessons = Array.from({ length: 24 }, (_, index) => ({ id: 'synthetic-' + index,
    title: 'جدول ' + index, course: 'office', section: 'excel', kind: 'درس', steps: ['synthetic'] }));
  lessons.push({ id: 'synthetic-network', title: 'Synthetic network', course: 'network', section: 'lessons', kind: 'درس', steps: ['synthetic'] });
  // This checks administrator UI wiring, not authentication/authorization. All
  // persistence and boot requests are synthetic; no administrator account is used.
  await page.route('**/api/madar', route => route.fulfill({ json: {
    account: { user: null, isAdmin: true }, config, lessons, notes: [], allowed: lessons.map(x => x.id), canPractice: true,
  } }));
  await page.route('**/madar-persistence.js', route => route.fulfill({ contentType: 'text/javascript', body: `
    window.testHubWrites = [];
    const values = { config: ${JSON.stringify(config)}, profile: { version: 1, visits: {}, notes: {}, latest: null } };
    window.MadarStore = { open: async kind => ({ value: structuredClone(values[kind]),
      save: async snapshot => {
        if (kind === 'config' && window.testHubReject) throw Error('synthetic rejection');
        values[kind] = structuredClone(snapshot);
        window.testHubWrites.push({ kind, snapshot: structuredClone(snapshot) });
      }, download() {}, discardAndReload() {} }) };
  ` }));
  try {
    await page.goto('/#admin');
    await page.waitForFunction(() => typeof document.getElementById('madar-hub')?.previewState === 'function');
    await expect(page.locator('[data-course-access="network"]')).toBeVisible();
    await page.locator('[data-course-access="network"]').selectOption('restricted');
    await page.locator('[data-content-access="synthetic-network"]').selectOption('draft');
    await page.locator('[data-grant="network"]').fill(' first, ,second ');
    await page.locator('[data-grant="network"]').press('Tab');
    await expect.poll(() => page.evaluate(() => window.testHubWrites.filter(x => x.kind === 'config').at(-1)?.snapshot.grants.network)).toEqual(['first', 'second']);
    const access = await page.evaluate(() => window.testHubWrites.filter(x => x.kind === 'config').at(-1).snapshot);
    expect(access.access.network).toBe('restricted');
    expect(access.contentAccess['synthetic-network']).toBe('draft');
    await page.locator('#mh-new-update').click();
    await page.locator('#mh-editor-form [name=title]').fill('Synthetic update');
    await page.locator('#mh-editor-form [name=body]').fill('Synthetic body');
    await page.locator('#mh-editor-form [name=placement]').selectOption('course');
    await page.locator('#mh-save-update').click();
    await expect(page.locator('#mh-editor-error')).toHaveText('اختر مقررًا لظهور المستجد في رئيسيته.');
    await page.locator('#mh-editor-form [name=course]').selectOption('office');
    await page.locator('#mh-editor-form [name=destination]').selectOption('lesson:synthetic-0');
    await page.locator('#mh-preview-update').click();
    await expect(page.locator('#mh-update-preview h2')).toHaveText('Synthetic update');
    await expect(page.locator('#mh-update-preview p')).toHaveText('Synthetic body');
    expect(await page.evaluate(() => document.getElementById('madar-hub').previewState().updates)).toEqual([]);
    await expect(page.locator('#mh-editor-form [name=destination]')).toHaveValue('lesson:synthetic-0');
    await page.evaluate(() => { window.testHubReject = true; });
    await page.locator('#mh-save-update').click();
    await expect(page.locator('#mh-error')).toBeVisible();
    await expect(page.locator('#mh-editor-form [name=title]')).toHaveValue('Synthetic update');
    await page.evaluate(() => { window.testHubReject = false; });
    await page.locator('#mh-retry').click();
    await expect(page.locator('#mh-error')).toBeHidden();
    await expect.poll(() => page.evaluate(() => window.testHubWrites.filter(x => x.kind === 'config').at(-1)?.snapshot.updates[0]?.target)).toBe('lesson:synthetic-0');
    await page.locator('#mh-cancel-edit').click();
    await expect(page.locator('#mh-editor-form')).toHaveCount(0);
    await page.locator('[data-edit-update]').click();
    await expect(page.locator('#mh-editor-form [name=title]')).toHaveValue('Synthetic update');
    await page.locator('[data-delete-update]').click();
    await page.keyboard.press('Escape');
    await expect(page.locator('[data-edit-update]')).toHaveCount(1);
    await page.locator('[data-delete-update]').click();
    await page.locator('#mh-delete-confirm').click();
    await expect(page.locator('[data-edit-update]')).toHaveCount(0);
    await page.locator('#mh-search-button').click();
    await page.locator('#mh-query').fill('اكسيل');
    await expect(page.locator('.mh-search-count')).toHaveText('عرض 20 من 24 نتيجة');
    await page.locator('#mh-search-more').click();
    await expect(page.locator('.mh-search-count')).toHaveText('عرض 24 من 24 نتيجة');
    await page.locator('#mh-search-scope').selectOption('network');
    await expect(page.locator('.mh-search-hit')).toHaveCount(0);
    await page.keyboard.press('Escape');
    await expect(page.locator('#mh-search-dialog')).not.toBeVisible();
    expect(errors).toEqual([]);
  } finally {
    await page.unrouteAll({ behavior: 'wait' });
  }
});

import { randomUUID } from 'node:crypto';
import { expect, test } from '@playwright/test';
import { LAB_VERSION, seed } from '../../public/access-lab-engine.mjs';
import { localRequestsOnly } from './local-requests.mjs';

test.beforeEach(async ({ context, baseURL }) => localRequestsOnly(context, baseURL));

test('OS1 practice records a checked explanation and returns to the source lesson', async ({ page }) => {
  await page.goto('/#lesson:os1-lesson-1');
  await page.locator('[data-os-step="3"]').first().click();
  await page.locator('[data-os-lab="install"]').click();
  await expect(page.locator('.op-lab')).toHaveAttribute('data-op-lab', 'install');
  await page.locator('[data-vm="open"][data-window="settings"]').click();
  const drive = page.locator('[data-vm-form="dvd"]');
  await drive.locator('select[name="iso"]').selectOption('Windows2012R2RTM.iso');
  await drive.getByRole('button', { name: 'OK', exact: true }).click();
  await page.locator('[data-vm="power"]').first().click();
  await expect(page.locator('[data-window-id="boot"]')).toContainText('Press any key to boot');
  await page.locator('[data-vm="boot-key"]').click();
  await expect(page.locator('[data-window-id="setup"]')).toBeVisible();
  await page.locator('input[name="op-reason"]').first().check();
  await page.locator('[data-op-action="check"]').click();
  await expect(page.locator('.op-result li').first()).toBeVisible();
  await page.locator('.op-result [data-op-action="source"]').click();
  await expect(page).toHaveURL(/#lesson:os1-lesson-\d+$/);
});

test('worksheet saves for Excel and Access survive reload and appear in the account backup', async ({ page, baseURL }) => {
  await page.goto('/signin-with-chatgpt?return_to=%2F');
  const excel = { cells: { A1: 'Synthetic worksheet' }, formats: {}, spills: {}, validation: {}, locked: {}, extra: {},
    rules: [], trace: [], events: [], protect: false, sheetName: 'Sheet1', clockSource: 0 };
  const access = seed();
  access.name = 'Synthetic.accdb';
  const cases = [
    ['excel-RCfL7Q524BQ', 'excel-RCfL7Q524BQ', excel],
    ['access-u01-01', LAB_VERSION + ':access-u01-01', access]
  ];
  for (const [lesson, activity, state] of cases) {
    const url = '/api/worksheet?owner=local_seedy&lesson=' + lesson;
    const initial = await page.request.get(url);
    expect(initial.ok()).toBe(true);
    const { revision } = await initial.json();
    const snapshot = { schema: 1, activity, current: JSON.stringify(state), history: [], future: [] };
    const options = { headers: { origin: baseURL }, data: { snapshot, revision, requestId: randomUUID() } };
    const saved = await page.request.put(url, options);
    expect(saved.ok(), await saved.text()).toBe(true);
    expect((await (await page.request.put(url, options)).json()).revision).toBe(revision + 1);
    await page.reload();
    expect(await (await page.request.get(url)).json()).toMatchObject({ revision: revision + 1, snapshot });
    const backup = await (await page.request.get('/api/study-backup')).json();
    expect(backup.worksheets.find(row => row.lesson === lesson)).toMatchObject({ revision: revision + 1, snapshot });
  }
});

test('feedback retries create one account report in the local database', async ({ page, baseURL }) => {
  await page.goto('/signin-with-chatgpt?return_to=%2F');
  const options = { headers: { origin: baseURL }, data: { actor: 'account:local_seedy', requestId: randomUUID(),
    kind: 'report', category: 'technical', targetType: 'general', targetId: null,
    bankVersion: 'srwe-456-84-v1', message: 'Synthetic report', rating: null, website: '' } };
  const endpoint = '/api/feedback-center';
  const saved = await page.request.post(endpoint, options);
  expect(saved.status(), await saved.text()).toBe(201);
  const { id } = await saved.json();
  const retried = await page.request.post(endpoint, options);
  expect(await retried.json()).toMatchObject({ id, duplicate: true });
  const list = await page.request.get(endpoint);
  expect((await list.json()).items.filter(item => item.id === id)).toHaveLength(1);
});

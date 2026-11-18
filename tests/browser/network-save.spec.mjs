import { expect, test } from '@playwright/test';
import { fileURLToPath } from 'node:url';

test('network lab retains an edit after a failed save and retry', async ({ page, baseURL }) => {
  test.setTimeout(150_000);
  // Allow the software WebGL renderer to initialize on headless runners.
  const ready = () => expect(page.locator('html')).toHaveAttribute('data-network-boot', 'ready', { timeout: 45_000 });
  // Serve the actual generated document locally, independently of course publication permissions.
  const url = baseURL + '/__test_network_lab';
  const html = fileURLToPath(new URL('../../lib/network-simulator.html', import.meta.url));
  await page.route('**/*', route => {
    const target = route.request().url();
    if (target === url) return route.fulfill({ path: html, contentType: 'text/html; charset=utf-8' });
    if (target.startsWith(baseURL + '/') || /^(blob|data):/.test(target)) return route.continue();
    return route.abort();
  });
  await page.goto(url);
  await ready();
  const lab = page.locator('#madar-labs');
  await expect.poll(() => lab.evaluate(el => typeof el.getLabsState)).toBe('function');
  const initial = await lab.evaluate(el => el.getLabsState().labs.length);
  // Reject only the first write; the retry uses the original guest storage adapter.
  await page.evaluate(() => {
    const store = window.MadarLabPersistence;
    const write = store.setWidgetState;
    store.setWidgetState = async () => {
      store.setWidgetState = write;
      throw Error('Synthetic save failure');
    };
  });
  await page.locator('#ml-plus').click();
  await page.locator('#ml-new-copy').click();
  await page.locator('#ml-create-copy').click();
  await expect(page.locator('#ml-save')).toHaveAttribute('data-state', 'error');
  const edited = await lab.evaluate(el => el.getLabsState().active);
  await page.locator('#ml-retry').click();
  await expect(page.locator('#ml-save')).toHaveAttribute('data-state', 'saved');
  await page.reload();
  await ready();
  await expect.poll(() => lab.evaluate(el => typeof el.getLabsState)).toBe('function');
  const restored = await lab.evaluate(el => el.getLabsState());
  expect(restored.active).toBe(edited);
  expect(restored.labs).toHaveLength(initial + 1);
});

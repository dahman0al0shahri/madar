import { expect, test } from '@playwright/test';
import { localRequestsOnly } from './local-requests.mjs';

const review = '/network-review?chapter=4';
const signIn = '/signin-with-chatgpt?return_to=' + encodeURIComponent(review);
const guestKey = 'madar-state-v1:guest:srwe';
const accountEndpoint = '/api/madar/state?kind=srwe&owner=local_seedy';

async function openReview(page, url) {
  const response = await page.goto(url);
  expect(response?.ok()).toBe(true);
  await page.waitForFunction(() => window.SRWE_READY === true);
}

// Keyboard activation avoids scrolling between distant controls. Scrolling schedules an
// independent location save, which would obscure which write the retry button made.
async function activate(control, key) {
  await control.evaluate(element => element.focus({ preventScroll: true }));
  await control.press(key);
}

test.beforeEach(async ({ context, baseURL }) => localRequestsOnly(context, baseURL));

test('theory review restores a guest answer after failed storage and retry', async ({ page }) => {
  await openReview(page, review);
  const answer = page.locator('[data-qid="4-01"] .choice-input').nth(1);
  await expect(answer).not.toBeChecked();
  const previous = await page.evaluate(key => localStorage.getItem(key), guestKey);
  await page.evaluate(key => {
    const original = Storage.prototype.setItem;
    Storage.prototype.setItem = function (name, value) {
      if (this === localStorage && name === key) {
        Storage.prototype.setItem = original;
        throw new Error('Synthetic guest write failure');
      }
      return original.call(this, name, value);
    };
  }, guestKey);
  await activate(answer, 'Space');
  const status = page.locator('#save-status');
  await expect(status).toHaveAttribute('data-status', 'error');
  await expect(answer).toBeChecked();
  expect(await page.evaluate(key => localStorage.getItem(key), guestKey)).toBe(previous);
  await activate(page.locator('#srwe-retry-save'), 'Enter');
  await expect(status).toHaveAttribute('data-status', 'saved');
  const stored = await page.evaluate(key => JSON.parse(localStorage.getItem(key)), guestKey);
  expect(stored.pending).toBeNull();
  expect(stored.value.study['4-01'].choices).toEqual([1]);
  await page.reload();
  await page.waitForFunction(() => window.SRWE_READY === true);
  await expect(answer).toBeChecked();
});

test('theory review restores a retried account answer in a fresh session', async ({ page, browser, baseURL }) => {
  await openReview(page, signIn);
  const saved = async () => {
    const response = await page.request.get(accountEndpoint);
    expect(response.ok()).toBe(true);
    return response.json();
  };
  const previous = await saved();
  const oldChoice = previous.snapshot?.study?.['4-01']?.choices?.[0];
  const index = oldChoice === 0 ? 1 : 0;
  const answer = page.locator('[data-qid="4-01"] .choice-input').nth(index);
  let rejected = false;
  await page.route(url => url.pathname + url.search === accountEndpoint, route => {
    if (route.request().method() === 'PUT' && !rejected) {
      rejected = true;
      return route.fulfill({ status: 503, json: { error: 'unavailable' } });
    }
    return route.continue();
  });
  await activate(answer, 'Space');
  const status = page.locator('#save-status');
  await expect(status).toHaveAttribute('data-status', 'error');
  expect(rejected).toBe(true);
  await expect(answer).toBeChecked();
  expect(await saved()).toEqual(previous);
  await activate(page.locator('#srwe-retry-save'), 'Enter');
  await expect(status).toHaveAttribute('data-status', 'saved');
  const durable = await saved();
  expect(durable.revision).toBe(previous.revision + 1);
  expect(durable.snapshot.study['4-01'].choices).toEqual([index]);

  const fresh = await browser.newContext({ baseURL });
  try {
    await localRequestsOnly(fresh, baseURL);
    const next = await fresh.newPage();
    await openReview(next, signIn);
    await expect(next.locator('[data-qid="4-01"] .choice-input').nth(index)).toBeChecked();
  } finally {
    await fresh.close();
  }
});

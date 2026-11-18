import assert from 'node:assert/strict';
import { fileURLToPath } from 'node:url';
import { readFileSync } from 'node:fs';
import { createHash } from 'node:crypto';
import { gunzipSync } from 'node:zlib';
import { chromium, expect } from '@playwright/test';
const url = new URL('../out/code-atlas.html', import.meta.url);
const html = readFileSync(url, 'utf8');
const inventory = JSON.parse(html.match(/<script id="inventory" type="application\/json">([\s\S]*?)<\/script>/)[1]);
let lines = 0,
  texts = 0;
for (const [file, entry] of Object.entries(inventory.files)) {
  if (!entry.text) continue;
  const model = JSON.parse(gunzipSync(Buffer.from(inventory.payloads[entry.payload], 'base64')));
  const bytes = Buffer.from(model.content);
  assert.equal(createHash('sha1').update('blob ' + bytes.length + '\0').update(bytes).digest('hex'), entry.oid, file);
  assert.equal(entry.lines, bytes.length ? model.content.split('\n').length - Number(model.content.endsWith('\n')) : 0, file);
  for (const [start, end] of [...model.symbols, ...model.ops, ...model.branches]) assert(start >= 0 && start <= end && end <= model.content.length, file);
  for (const [offset, name, mentions] of model.bindings) {
    for (const at of [offset, ...mentions]) assert(at >= 0 && at < model.content.length, name + ' in ' + file);
  }
  for (const [i, [a, b, parent]] of model.fields.entries()) {
    assert(a >= 0 && b <= model.content.length && b >= a && parent < i, file);
  }
  for (const target of entry.deps) assert(Object.hasOwn(inventory.files, target), target);
  if (inventory.subjects && entry.lines) {
    let next = 1;
    for (const [first, count, sha] of entry.history) {
      assert.equal(first, next, file);
      assert(Object.hasOwn(inventory.subjects, sha), sha);
      next += count;
    }
    assert.equal(next - 1, entry.lines, file);
  }
  lines += entry.lines;
  texts++;
}
assert.equal(lines, inventory.stats.lines);
assert.equal(texts, inventory.stats.text);
assert.equal(Object.keys(inventory.files).length, inventory.stats.files);
const browser = await chromium.launch({
  executablePath: process.env.MADAR_ATLAS_CHROME || undefined
});
try {
  for (const width of [1440, 375]) {
    const context = await browser.newContext({
      viewport: {
        width,
        height: 900
      },
      offline: true
    });
    const page = await context.newPage();
    const errors = [];
    page.on('pageerror', error => errors.push(error.message));
    await page.goto(url.href);
    for (const [id, tour] of Object.entries(inventory.guide)) {
      await page.locator('#features button[data-id="' + id + '"]').click();
      await expect(page.locator('#feature-name')).toHaveText(tour.title);
      await expect(page.locator('#trail a')).toHaveCount(tour.steps.length);
    }
    await page.locator('#features button').first().click();
    await page.locator('#trail a').first().click();
    await expect(page.locator('#code .src[aria-pressed=true]')).toBeVisible();
    await page.locator('#query').fill('courseCard');
    await expect(page.locator('#matches')).toContainText('course-views.mjs');
    await page.locator('#matches button').filter({
      hasText: 'public/hub/course-views.mjs'
    }).click();
    await expect(page.locator('#symbol')).toBeEnabled();
    await page.locator('#line').fill('5');
    await page.locator('#line').press('Enter');
    await expect(page.locator('#code .src[aria-pressed=true] b')).toHaveText('5');
    const asset = Object.keys(inventory.files).find(name => inventory.files[name].role === 'asset');
    await page.locator('#role').selectOption('asset');
    await page.locator('#query').fill(asset);
    await page.locator('#matches button').first().click();
    await expect(page.locator('#source-area')).toBeHidden();
    await page.locator('[data-tab=build]').click();
    for (const assembly of inventory.map.sourceAssemblies) {
      await page.locator('#product').selectOption(assembly.output);
      await expect(page.locator('#assembly ol li')).toHaveCount(assembly.parts.length);
    }
    await page.locator('[data-tab=audit]').click();
    await expect(page.locator('#findings details').first()).toBeVisible();
    await page.locator('[data-tab=map]').click();
    assert(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth), 'viewport overflow at ' + width);
    await page.screenshot({
      path: fileURLToPath(new URL('../out/atlas-' + width + '.png', import.meta.url))
    });
    assert.deepEqual(errors, []);
    await context.close();
  }
} finally {
  await browser.close();
}
console.log('Verified ' + texts + ' source blobs, ' + lines + ' lines and desktop/mobile offline navigation.');

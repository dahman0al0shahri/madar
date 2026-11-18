import assert from 'node:assert/strict';
import { fileURLToPath } from 'node:url';
import { readFileSync } from 'node:fs';
import { createHash } from 'node:crypto';
import { gunzipSync } from 'node:zlib';
import { chromium, expect } from '@playwright/test';
const url = new URL('../out/code-atlas.html', import.meta.url);
const html = readFileSync(url, 'utf8');
const inventory = JSON.parse(html.match(/<script id="inventory" type="application\/json">([\s\S]*?)<\/script>/)[1]);
const counted = {};
let lines = 0,
  texts = 0;
for (const [file, entry] of Object.entries(inventory.files)) {
  for(const [symbol,caller,sites] of entry.consumers||[]){
    assert(symbol && inventory.files[caller]?.text && sites.every(n=>n>=1 && n<=inventory.files[caller].lines),file);
  }
  if (!entry.text) {
    assert(entry.purpose?.length>10,file);
    for(const [caller,n] of entry.mentions||[])assert(n>=1 && n<=inventory.files[caller].lines,file);
    continue;
  }
  const model = JSON.parse(gunzipSync(Buffer.from(inventory.payloads[entry.payload], 'base64')));
  assert.equal(model.notes.length,entry.lines,file);
  assert.equal(model.fieldGuides.length,model.fields.length,file);
  assert(model.fieldGuides.every(value=>typeof value==='string' && value.length>10),file);
  for(const [category,explanation,evidence] of model.notes){
    assert(typeof evidence==='string' && evidence.length>15 && evidence!==explanation,'Missing independent detail in '+file);
    assert(typeof explanation==='string' && explanation.length>10,file);
    if(category==='data' && inventory.revision==='9ce3df0f1314262e5e2c95285c7544312fba577a')assert(!explanation.includes('، ومحتواها '),'Data purpose needs review in '+file);
    counted[category]=(counted[category]||0)+1;
  }
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
assert.deepEqual(counted,inventory.coverage);
if(inventory.revision==='9ce3df0f1314262e5e2c95285c7544312fba577a')assert.deepEqual([texts,lines],[831,170310]);
const curriculum=inventory.files['lib/os-simulator-curriculum.json'];
const [reader,site]=curriculum.fieldReaders.host;
const sourceAt=(name,line)=>JSON.parse(gunzipSync(Buffer.from(inventory.payloads[inventory.files[name].payload],'base64'))).content.split('\n')[line-1];
assert.match(sourceAt(reader,site),/\.host\b/);
function noteContaining(file, marker) {
  const model=JSON.parse(gunzipSync(Buffer.from(inventory.payloads[inventory.files[file].payload], 'base64')));
  const index=model.content.split('\n').findIndex(line=>line.includes(marker));
  assert(index>=0,file+' '+marker);
  return model.notes[index][1];
}
assert.match(noteContaining('modules/source-parts/access-workspace/01-session.mjs.inc','async function mountAccessLab'), /mountAccessLab.*host, lesson/);
assert.match(noteContaining('modules/source-parts/access-workspace/01-session.mjs.inc','async function mountAccessLab'), /host.innerHTML/);
assert.match(noteContaining('lib/connector-preview.d.ts','declare module'), /virtual:sites-connector-preview.*TypeScript/);
assert(inventory.files['public/assets/network-sources/chapter-9.pptx'].mentions.some(([file])=>file==='lib/network-theory.mjs'));
assert(inventory.files['public/assets/os1/server-interior.webp'].mentions.some(([file])=>file==='modules/madar-hub/os1.js'));
assert(inventory.files['lib/access-content.json'].dataReads.some(([file,,mode])=>file==='lib/course-base.mjs' && mode==='import'));
assert(inventory.files['lib/os-simulator-curriculum.json'].dataReads.some(([file])=>file==='build/madar/network-simulator.cjs'));
assert.match(noteContaining('lib/word-bank-v81.json','"answer": 0'),/ترقيم مصفوفة البدائل من صفر/);
const indexFile='drizzle/0010_great_wendell_vaughn.sql';
const schema=JSON.parse(gunzipSync(Buffer.from(inventory.payloads[inventory.files[indexFile].payload],'base64')));
const indexLine=schema.content.split('\n').findIndex(row=>row.startsWith('CREATE UNIQUE INDEX'));
assert.match(schema.notes[indexLine][2],/CREATE UNIQUE INDEX.*account_code_unique/);
assert.match(noteContaining('lib/feedback-lessons.json','"general"'),/خيار البلاغ العام/);
assert.match(noteContaining('drizzle/meta/_journal.json','"when"'),/المللي ثانية/);
assert.match(noteContaining('.githooks/pre-commit','#!/bin/sh'), /مفسّر/);
assert.match(noteContaining('.githooks/pre-commit','--staged'), /--staged/);
assert(!counted.literal,'Unclassified source lines require inspection');
assert(inventory.experiments.length>=16,'Missing behavioral experiments');
for(const item of inventory.experiments){
  assert.notDeepEqual(item.actual,item.observed,item.expression);
  assert(item.reason && item.line>=1 && item.line<=inventory.files[item.file].lines,item.file);
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
    await page.goto(url.href+'#'+new URLSearchParams({view:'files',file:'lib/os-simulator-curriculum.json',line:'10'}));
    await expect(page.locator('#explanation')).toContainText('جهاز');
    await expect(page.locator('#explanation a').filter({hasText:'استعمال الحقل'})).toHaveCount(1);
    await page.locator('[data-tab=map]').click();
    for (const [id, tour] of Object.entries(inventory.guide)) {
      await page.locator('#features button[data-id="' + id + '"]').click();
      await expect(page.locator('#feature-name')).toHaveText(tour.title);
      const stops = page.locator('#trail a');
      await expect(stops).toHaveCount(tour.steps.length);
      for (const [index, [, file, line, , command]] of tour.steps.entries()) {
        if (command) await expect(page.locator('#trail .stop').nth(index).locator('code')).toHaveText(command);
        await expect(stops.nth(index)).toHaveAttribute('href', '#' + new URLSearchParams({ view: 'files', file, line }));
      }
    }
    if (inventory.guide['lesson-notes']) {
      // Exercise the public README fragment against this snapshot, including offline copies.
      await page.goto(url.href + '#view=map&feature=lesson-notes');
      const tour = inventory.guide['lesson-notes'];
      await expect(page.locator('#feature-name')).toHaveText(tour.title);
      const links = page.locator('#trail a');
      await links.first().click();
      await expect(page.locator('#line')).toHaveValue(String(tour.steps[0][2]));
    }
    await page.locator('[data-tab=tree]').click();
    await expect(page.locator('#folder-tree a')).toHaveCount(inventory.stats.files);
    const experiment=inventory.experiments.find(e=>e.expression==='update.end >= day');
    await page.goto(url.href+'#'+new URLSearchParams({view:'files',file:experiment.file,line:experiment.line}));
    await expect(page.locator('#explanation .experiment')).toContainText(['أول يوم','آخر يوم']);
    await expect(page.locator('#explanation')).toContainText('app/api/madar/route.ts');
    await page.locator('[data-tab=map]').click();
    await page.locator('#features button').first().click();
    await page.locator('#trail a').first().click();
    await expect(page.locator('#code .src[aria-pressed=true]')).toBeVisible();
    await page.locator('#query').fill('courseCard');
    await expect(page.locator('#matches')).toContainText('course-views.mjs');
    await page.locator('#matches button').filter({
      hasText: 'public/hub/course-views.mjs'
    }).click();
    await expect(page.locator('#filename')).toHaveText('public/hub/course-views.mjs');
    await expect(page.locator('#file-panel')).toHaveAttribute('aria-busy','false');
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

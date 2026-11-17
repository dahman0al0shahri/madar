import { test, expect } from '@playwright/test';

test('lesson actions preserve notes and wait for pending-note retry', async ({ page, context, baseURL }) => {
  await context.route('**/*', route => {
    const url = new URL(route.request().url());
    return url.origin === baseURL || ['data:', 'blob:'].includes(url.protocol) ? route.continue() : route.abort('blockedbyclient');
  });
  const errors = [];
  page.on('pageerror', error => errors.push(error.message));
  const lesson = { id: 'synthetic-theory', course: 'network', section: 'theory', title: 'Synthetic lesson',
    kind: 'درس', source: 'Synthetic fixture', steps: ['First topic', 'Second topic'],
    theory: { chapter: 1, chapterTitle: 'Synthetic chapter', part: 'Synthetic part', english: 'Fixture',
      glossary: {}, checks: [], topics: ['First topic', 'Second topic'].map(title => ({ title, slides: '1', paragraphs: ['Synthetic text'] })) } };
  await page.route('**/api/madar', route => route.fulfill({ json: {
    account: { user: null, isAdmin: false },
    config: { access: { office: 'public', network: 'public', os1: 'public' }, contentAccess: {}, updates: [], grants: {} },
    lessons: [lesson], notes: [], allowed: [lesson.id], canPractice: true,
  } }));
  // Only synthetic browser adapters are used. SQL-backed recovery is tested separately.
  await page.route('**/madar-persistence.js', route => route.fulfill({ contentType: 'text/javascript', body: `
    window.testHubWrites = [];
    window.MadarStore = { open: async () => ({ value: { version: 1, visits: {}, notes: {}, latest: null, extra: 'keep' },
      save: async snapshot => { window.testHubWrites.push(structuredClone(snapshot)); },
      download() {}, discardAndReload() {} }) };
  ` }));
  await page.route('**/notes.js', route => route.fulfill({ contentType: 'text/javascript', body: `
    window.testNotePending = false;
    window.testNoteRetries = 0;
    window.MADAR_NOTES = {
      hasPending: () => window.testNotePending,
      retry: async () => { window.testNoteRetries++; if (window.testNoteCanSave) window.testNotePending = false; },
      mount: async () => { document.getElementById('lesson-notes').innerHTML = '<textarea id="lesson-note-text" aria-label="Synthetic note"></textarea>'; }
    };
  ` }));
  try {
    await page.goto('/#lesson:synthetic-theory');
    await page.waitForFunction(() => typeof document.getElementById('madar-hub')?.previewState === 'function');
    await expect(page.locator('#nt-topic-title')).toHaveText('First topic');
    await page.getByText('ملاحظتي على هذا الجزء', { exact: true }).click();
    await page.locator('#lesson-note-text').fill('Synthetic retained note');
    await expect.poll(() => page.evaluate(() => window.testHubWrites.at(-1)?.notes['synthetic-theory'])).toBe('Synthetic retained note');
    await page.evaluate(() => { window.testNotePending = true; });
    await page.locator('.nt-next [data-step="1"]').click();
    await expect.poll(() => page.evaluate(() => window.testNoteRetries)).toBe(1);
    await expect(page.locator('#nt-topic-title')).toHaveText('First topic');
    expect(await page.evaluate(() => document.getElementById('madar-hub').previewState().profiles.student.theoryPositions)).toBeUndefined();
    await page.evaluate(() => { window.testNoteCanSave = true; });
    await page.locator('.nt-next [data-step="1"]').click();
    await expect(page.locator('#nt-topic-title')).toHaveText('Second topic');
    await expect(page.locator('#nt-topic-title')).toBeFocused();
    await expect.poll(() => page.evaluate(() => window.testHubWrites.at(-1)?.theoryPositions?.['synthetic-theory'])).toBe(1);
    const saved = await page.evaluate(() => window.testHubWrites.at(-1));
    expect(saved.notes['synthetic-theory']).toBe('Synthetic retained note');
    expect(saved.visits.network).toEqual({ lesson: 'synthetic-theory', step: 1 });
    expect(saved.extra).toBe('keep');
    await page.locator('.nt-next [data-step="0"]').click();
    await expect(page.locator('#nt-topic-title')).toHaveText('First topic');
    await expect.poll(() => page.evaluate(() => window.testHubWrites.at(-1)?.visits.network.step)).toBe(0);
    expect(errors).toEqual([]);
  } finally {
    await page.unrouteAll({ behavior: 'wait' });
  }
});

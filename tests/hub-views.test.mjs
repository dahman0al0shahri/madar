import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';
import { findSearchResults, searchText, createSearchController } from '../public/hub/search.mjs';
import { createEditorController, editorError, editorFromFields } from '../public/hub/editor.mjs';
import { createEditorViews } from '../public/hub/editor-views.mjs';
import { createHubViews } from '../public/hub/views.mjs';
import { bindHubEvents } from '../public/hub/events.mjs';

const courses = { office: { name: 'تطبيقات الحاسب' }, network: { name: 'الشبكات' } };
const lessons = [
  { id: 'excel', title: 'الجداول', kind: 'درس', course: 'office', section: 'excel' },
  { id: 'vlan', title: 'فيلان', kind: 'شرح', course: 'network', section: 'vlan', theory: { english: 'VLAN 10', terms: ['Switch'] } },
  { id: 'hidden', title: 'سري', kind: 'درس', course: 'office' },
];
const catalog = { courses, lessons, available: () => Object.keys(courses), canLesson: lesson => lesson.id !== 'hidden', hosted: true };
const esc = value => String(value).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
const icon = name => `<i>${name}</i>`;
const find = (query, scope = 'all') => findSearchResults({ ...catalog, query, scope });

test('search preserves Arabic normalization, aliases, multiword matching and visibility', () => {
  assert.equal(searchText(' إِكـسِل ١٠ '), 'اكسل 10');
  assert.deepEqual(find('اكسيل').map(x => x.route), ['lesson:excel']);
  assert.deepEqual(find('switch ١٠').map(x => x.route), ['lesson:vlan']);
  assert.deepEqual(find('سري'), []);
  assert.deepEqual(find('اكسيل', 'network'), []);
  assert.equal(find('')[0].route, 'course:office:home');
});

test('search pagination resets on a new query and escapes results', () => {
  let query = '', output = '';
  const controller = createSearchController({ ...catalog,
    lessons: Array.from({ length: 23 }, (_, i) => ({ ...lessons[0], id: 'x' + i, title: '<img> ' + i })),
    readQuery: () => query, readScope: () => 'all', showResults: html => { output = html; }, paintIcons() {}, esc, icon });
  controller.search();
  assert.match(output, /عرض 20 من 25 نتيجة/);
  assert.match(output, /&lt;img&gt;/);
  controller.more();
  assert.match(output, /عرض 25 من 25 نتيجة/);
  query = 'لا يوجد'; controller.search();
  assert.match(output, /لا توجد نتائج مطابقة/);
  assert.doesNotMatch(output, /mh-search-more/);
  query = ''; controller.search();
  assert.match(output, /عرض 20 من 25 نتيجة/);
});

const fields = () => ({ title: 'Update', body: 'Body', course: 'office', placement: 'both', status: 'draft',
  date: '2026-11-17', start: '', end: '', duration: '12', pin: false, destination: 'auto' });
test('editor field conversion preserves extra fields and validates cross-course and date constraints', () => {
  const update = editorFromFields({ id: 'u', extra: true }, fields());
  assert.deepEqual(update.places, ['global', 'course']);
  assert.equal(update.target, 'course:office:home');
  assert.equal(update.duration, 12); assert.equal(update.extra, true);
  const lookup = id => lessons.find(x => x.id === id);
  assert.equal(editorError(update, lookup), '');
  for (const invalid of [{ title: ' ' }, { body: '' }, { course: '' },
    { start: '2026-11-18', end: '2026-11-17' }, { target: 'lesson:vlan' }]) {
    assert.notEqual(editorError({ ...update, ...invalid }, lookup), '');
  }
});

test('editor keeps failed drafts, upserts once and uses the latest restored state', async () => {
  let state = { editor: null, updates: [] }, dirty = false, fail = true;
  const controller = createEditorController({ getState: () => state,
    lessonBy: id => lessons.find(x => x.id === id), saves: { markDirty() { dirty = true; } },
    persist: async () => { if (fail) throw Error('offline'); }, now: () => 1, today: () => '2026-11-17' });
  controller.begin(); controller.capture(fields());
  await assert.rejects(controller.save(), /offline/);
  assert.equal(dirty, true); assert.equal(state.editor.title, 'Update');
  fail = false; assert.equal((await controller.save()).saved, true);
  assert.equal(state.updates.length, 1);
  state.editor.title = 'Changed draft'; assert.equal(state.updates[0].title, 'Update');
  controller.cancel(); controller.edit('u-1'); assert.equal(state.editor.title, 'Update');
  controller.remove('u-1'); assert.equal(state.editor, null); assert.deepEqual(state.updates, []);
  state = { editor: null, updates: [] }; controller.begin();
  assert.equal(state.editor.id, 'u-1');
});

test('admin and editor rendering resolves its own option helpers without global scope', () => {
  const state = { access: { network: 'public' }, contentAccess: {}, updates: [], editor: editorFromFields({ id: 'u' }, fields()) };
  const views = createEditorViews({ getState: () => state, getAccountFilter: () => 'all', courses, lessons,
    profile: () => ({ visits: {}, notes: {} }), ...catalog, lessonBy: id => lessons.find(x => x.id === id),
    lessonPosition: () => '1', heading: title => `<h1>${title}</h1>`, esc, icon, getGrants: () => ({ network: ['synthetic'] }) });
  const before = JSON.stringify(state), html = views.admin();
  assert.match(html, /data-course-access="network"/);
  assert.match(html, /value="public" selected/);
  assert.match(html, /data-grant="network" value="synthetic"/);
  assert.match(html, /id="mh-editor-form"/);
  assert.doesNotMatch(html, /data-course-access="office"/);
  assert.equal(JSON.stringify(state), before);
});

test('route view returns redirects without navigation and refuses unavailable admin/lessons', () => {
  let calls = 0;
  const views = createHubViews({ ...catalog, isAdmin: false, canCourse: () => true, lessonBy: id => lessons.find(x => x.id === id),
    heading: title => title, admin: () => { calls++; return 'admin'; }, lessonPage: () => 'lesson' });
  assert.deepEqual(views.page({ route: 'account' }), { redirect: '/account' });
  assert.deepEqual(views.page({ route: 'course:office:word' }, 'office'), { redirect: '/applications#word' });
  assert.match(views.page({ route: 'admin' }).html, /المحتوى غير متاح/);
  assert.match(views.page({ route: 'lesson:hidden' }).html, /المحتوى غير متاح/);
  assert.equal(calls, 0);
});

test('delegated actions handle zero-valued data and dispose only their own listeners', async () => {
  const root = new EventTarget(), doc = new EventTarget();
  let count = 0, external = 0;
  root.addEventListener('input', () => { external++; });
  const dispose = bindHubEvents({ root, documentTarget: doc, clickActions: {},
    dataActions: { step: value => { assert.equal(value, '0'); count++; } },
    actions: { input: () => { count++; }, outsideClick: () => { count++; } } });
  const click = new Event('click');
  Object.defineProperty(click, 'target', { value: { closest: () => ({ id: '', dataset: { step: '0' } }) } });
  root.dispatchEvent(click); await Promise.resolve();
  assert.equal(count, 1); root.dispatchEvent(new Event('input')); assert.equal(count, 2);
  dispose(); dispose(); root.dispatchEvent(new Event('input')); doc.dispatchEvent(new Event('click'));
  assert.equal(count, 2); assert.equal(external, 2);
});

test('hub module import edges stay explicit and browser globals remain in composition', () => {
  // Bounded source guard, not a complete JavaScript security/static analysis.
  const edges = { 'index.mjs': ['state','persistence','navigation','environment','editor','editor-views','views','search','events','lesson-actions','access-actions','editor-actions','announcements','course-views','hosted-course-views','view-lifecycle','scene-resources'],
    'state.mjs': [], 'persistence.mjs': ['state'], 'navigation.mjs': [], 'environment.mjs': ['state','navigation'],
    'editor.mjs': ['state'], 'editor-views.mjs': [], 'views.mjs': [], 'search.mjs': [], 'events.mjs': [], 'lesson-actions.mjs': [], 'access-actions.mjs': [], 'editor-actions.mjs': [], 'announcements.mjs': [], 'course-views.mjs': [], 'hosted-course-views.mjs': [], 'view-lifecycle.mjs': [], 'scene-resources.mjs': [] };
  const folder = new URL('../public/hub/', import.meta.url);
  assert.deepEqual(fs.readdirSync(folder).sort(), Object.keys(edges).sort(), 'Classify new modules and their allowed dependencies');
  for (const [file, allowed] of Object.entries(edges)) {
    const source = fs.readFileSync(new URL(file, folder), 'utf8');
    const imports = [...source.matchAll(/\bfrom\s+['"]([^'"]+)['"]/g)].map(match => match[1]);
    for (const dependency of imports) assert(allowed.map(name => './' + name + '.mjs').includes(dependency), `${file} -> ${dependency}`);
    assert.doesNotMatch(source, /\b(?:window|document|localStorage|sessionStorage|fetch)\s*[.(]/, file);
  }
});

test('network command filtering operates on the supplied cards and empty message', () => {
  const source = fs.readFileSync(new URL('../modules/madar-hub/search.js', import.meta.url), 'utf8');
  const filter = vm.runInNewContext(source + '\nfilterCommandCards');
  const cards = ['switch vlan 10', 'router ip', 'switch trunk'].map(text => ({ dataset: { commandSearch: text }, hidden: false }));
  const emptyMessage = { hidden: true };
  assert.equal(filter({ query: 'switch ١٠', cards, emptyMessage, normalize: searchText }), 1);
  assert.deepEqual(cards.map(card => card.hidden), [false, true, true]);
  assert.equal(filter({ query: 'missing', cards, emptyMessage, normalize: searchText }), 0);
  assert.equal(emptyMessage.hidden, false);
  assert.equal(filter({ query: '', cards, emptyMessage, normalize: searchText }), 3);
  assert.equal(emptyMessage.hidden, true);
});

test('generated hosted hub retains composition and delegates extracted responsibilities', () => {
  const source = fs.readFileSync(new URL('../public/madar-hub.js', import.meta.url), 'utf8');
  for (const name of ['createEditorController', 'createEditorViews', 'createHubViews', 'createSearchController', 'bindHubEvents', 'createLessonActions', 'createAccessActions', 'createEditorActions']) {
    assert.match(source, new RegExp('= ' + name + '\\('));
  }
  assert.match(source, /const editorViews = createEditorViews/);
  assert.doesNotMatch(source, /function (?:accessOptions|editorMarkup|searchText)\(/);
});

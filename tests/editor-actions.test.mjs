import test from 'node:test';
import assert from 'node:assert/strict';
import { createEditorActions } from '../public/hub/editor-actions.mjs';
import { createEditorViews } from '../public/hub/editor-views.mjs';

function fixture() {
  const calls = [];
  let fields = { title: 'edited' }, draft = { title: 'original', extra: 'keep' };
  const editor = {
    begin: () => calls.push('begin'), edit: id => calls.push('edit:' + id), cancel: () => calls.push('cancel'),
    capture: value => { calls.push('capture'); draft = { ...draft, ...value }; },
    resetDestination: () => { calls.push('reset'); draft.target = 'courses'; },
    remove: id => calls.push('remove:' + id), save: async () => { calls.push('save'); return { saved: true }; }
  };
  const adapters = { editor, getDraft: () => draft, readFields: () => fields,
    reportValidity: () => true, saves: { scheduleSave: () => calls.push('schedule') },
    render: () => calls.push('render'), showError: error => calls.push('error:' + error),
    notifySaved: () => calls.push('notify'), showPreview: value => calls.push(['preview', structuredClone(value)]),
    showDestinations: value => calls.push(['destinations', structuredClone(value)]),
    openDelete: () => calls.push('open'), closeDelete: () => calls.push('close') };
  return { calls, editor, adapters, get draft() { return draft; }, setFields: value => { fields = value; }, setDraft: value => { draft = value; } };
}

test('editor opening, editing and cancellation keep render-before-schedule order', () => {
  const f = fixture(), actions = createEditorActions(f.adapters);
  actions.begin(); actions.edit('u1'); actions.cancel();
  assert.deepEqual(f.calls, ['begin', 'render', 'schedule', 'edit:u1', 'render', 'schedule', 'cancel', 'render', 'schedule']);
});

test('field capture ignores absent forms and uses current fields without dropping unknown data', () => {
  const f = fixture(), actions = createEditorActions(f.adapters);
  f.setFields(undefined); actions.capture(); assert.deepEqual(f.calls, []);
  f.setFields({ title: '  جديد  ', pin: true }); f.setDraft({ extra: 'restored' }); actions.changed();
  assert.deepEqual(f.draft, { title: '  جديد  ', pin: true, extra: 'restored' });
  assert.deepEqual(f.calls, ['capture', 'schedule']);
});

test('course reset and preview receive the freshly captured draft without an implicit write', () => {
  const f = fixture(), actions = createEditorActions(f.adapters);
  actions.courseChanged();
  assert.deepEqual(f.calls, ['capture', 'reset', ['destinations', { title: 'edited', extra: 'keep', target: 'courses' }]]);
  f.calls.length = 0; f.setFields({ title: 'preview only' }); actions.preview();
  assert.deepEqual(f.calls, ['capture', ['preview', { title: 'preview only', extra: 'keep', target: 'courses' }]]);
});

test('native invalid forms and model validation never show a successful save', async () => {
  const f = fixture();
  await createEditorActions({ ...f.adapters, reportValidity: () => false }).save();
  assert.deepEqual(f.calls, []);
  f.editor.save = async () => ({ saved: false, error: 'invalid destination' });
  await createEditorActions(f.adapters).save();
  assert.deepEqual(f.calls, ['capture', 'error:invalid destination']);
});

test('save failures retain the draft; a later successful save notifies then renders', async () => {
  const f = fixture(), actions = createEditorActions(f.adapters);
  f.editor.save = async () => { throw Error('offline'); }; await actions.save();
  assert.equal(f.draft.title, 'edited'); assert.equal(f.draft.extra, 'keep');
  assert.deepEqual(f.calls, ['capture']);
  f.calls.length = 0; f.editor.save = async () => ({ saved: true }); await actions.save();
  assert.deepEqual(f.calls, ['capture', 'notify', 'render']);
});

test('requesting deletion does not mutate data; confirmation uses the last requested id', () => {
  const f = fixture(), actions = createEditorActions(f.adapters);
  actions.requestDelete('cancelled'); actions.requestDelete('confirmed');
  assert.deepEqual(f.calls, ['open', 'open']);
  actions.confirmDelete();
  assert.deepEqual(f.calls, ['open', 'open', 'remove:confirmed', 'close', 'render', 'schedule']);
});

test('preview markup preserves escaping, fallback title, scene and input data', () => {
  const esc = value => String(value).replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('>', '&gt;');
  const seen = [], views = createEditorViews({ courses: { network: { color: '#abc' } }, esc,
    scene: update => { seen.push(update); return '<span>scene</span>'; } });
  const update = { title: '<title>', body: '<body>', course: 'network', scene: 'old', extra: true };
  const before = JSON.stringify(update), html = views.previewMarkup(update);
  assert.match(html, /--slide-accent:#abc/); assert.match(html, /&lt;title&gt;/); assert.match(html, /&lt;body&gt;/);
  assert.equal(seen[0].scene, 'network'); assert.equal(JSON.stringify(update), before);
  assert.match(views.previewMarkup({ title: '', body: '', course: '' }), /عنوان المستجد/);
  assert.equal(seen[1].scene, 'hub');
});

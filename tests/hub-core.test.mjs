import test from 'node:test';
import assert from 'node:assert/strict';
import { createHubState, normalizeState } from '../public/hub/state.mjs';
import { createSaveController } from '../public/hub/persistence.mjs';
import { createNavigation, externalDestination, routeFromHash, hashForRoute } from '../public/hub/navigation.mjs';
import { createHostedEnvironment, createPreviewEnvironment } from '../public/hub/environment.mjs';

const initial = () => ({ version: 1, route: 'home', viewer: 'student',
  access: { office: 'public', network: 'restricted' }, contentAccess: {},
  profiles: { student: { visits: {}, notes: {}, latest: null }, guest: { visits: {}, notes: {}, latest: null } },
  editor: null, updates: [] });
const lessons = [{ id: 'v01', course: 'office', section: 'word' },
  { id: 'e01', course: 'office', section: 'excel' }, { id: 'n01', course: 'network' }];
const courses = { office: {}, network: {} };
const model = restored => createHubState({ initial: initial(), restored, courses, lessons });
function deferred() {
  let resolve, reject;
  const promise = new Promise((yes, no) => { resolve = yes; reject = no; });
  return { promise, resolve, reject };
}

test('normalization preserves unknown profile data and does not mutate restoration input', () => {
  const saved = { version: 1, viewer: 'invalid', profiles: { student: { notes: { n01: 'keep' }, custom: 42 } } };
  const before = structuredClone(saved);
  const state = normalizeState(saved, initial());
  assert.deepEqual(saved, before);
  assert.equal(state.viewer, 'student');
  assert.equal(state.profiles.student.custom, 42);
  assert.equal(state.profiles.student.notes.n01, 'keep');
  assert.deepEqual(state.profiles.guest.visits, {});
  state.profiles.student.notes.n01 = 'changed';
  assert.equal(saved.profiles.student.notes.n01, 'keep');
});

test('unknown state versions use fresh defaults without shared mutable state', () => {
  const a = model({ version: 2 }), b = model(null);
  a.profile().notes.n01 = 'a';
  assert.deepEqual(b.profile().notes, {});
});

test('course and lesson visibility preserve guest restrictions and explicit admin bypass', () => {
  const state = initial(); state.viewer = 'guest'; state.contentAccess.v01 = 'draft';
  const guest = model(state);
  assert.equal(guest.canCourse('network'), false);
  assert.equal(guest.canCourse('unknown'), false);
  assert.equal(guest.canLesson(lessons[0]), false);
  const admin = createHubState({ initial: initial(), restored: state, courses, lessons, isAdmin: true });
  assert.equal(admin.canLesson(lessons[0]), true);
  assert.equal(admin.canCourse('unknown'), false);
});

test('navigation preserves an existing lesson position and restores a different lesson position', () => {
  const state = initial(); state.profiles.student.theoryPositions = { n01: 3 };
  const hub = model(state);
  hub.visit('lesson:n01');
  assert.deepEqual(hub.profile().visits.network, { lesson: 'n01', step: 3 });
  hub.profile().visits.network.step = 5;
  hub.visit('lesson:n01');
  assert.equal(hub.profile().visits.network.step, 5);
  assert.equal(hub.selectedCourse(), 'network');
  hub.replace({ ...initial(), route: 'course:office:word' });
  assert.equal(hub.selectedCourse(), 'office');
  assert.deepEqual(hub.profile().notes, {});
});

test('save requests serialize immutable snapshots and cannot clear newer edits', async () => {
  const gate = deferred(), writes = [], flags = [];
  const state = { revision: 1 };
  const saves = createSaveController({ getState: () => state, onDirty: dirty => flags.push(dirty),
    write: async snapshot => { writes.push(snapshot); if (snapshot.revision === 1) await gate.promise; } });
  const first = saves.persist();
  await Promise.resolve(); await Promise.resolve();
  state.revision = 2; saves.markDirty();
  const second = saves.persist();
  assert.deepEqual(writes, [{ revision: 1 }]);
  gate.resolve(); await first;
  assert.equal(flags.includes(false), false);
  await second;
  assert.deepEqual(writes, [{ revision: 1 }, { revision: 2 }]);
  assert.equal(flags.at(-1), false);
});

test('a failed write keeps dirty state and later retry can succeed', async () => {
  let fail = true, dirty = false;
  const saves = createSaveController({ getState: () => ({ note: 'retained' }), onDirty: value => { dirty = value; },
    write: async () => { if (fail) throw Error('offline'); } });
  await assert.rejects(saves.persist(), /offline/);
  assert.equal(dirty, true);
  fail = false; await saves.retry();
  assert.equal(dirty, false);
});

test('scheduled saves debounce and explicit persistence cancels the timer', async () => {
  const timers = new Map(); let next = 0, writes = 0;
  const saves = createSaveController({ getState: () => ({}), write: async () => { writes++; },
    schedule: (run, delay) => { assert.equal(delay, 350); timers.set(++next, run); return next; },
    cancel: id => timers.delete(id) });
  saves.scheduleSave(); saves.scheduleSave();
  assert.equal(timers.size, 1);
  await saves.persist();
  assert.equal(timers.size, 0); assert.equal(writes, 1);
});

test('failed prerequisite prevents navigation and retry runs it after saving', async () => {
  let fail = true; const order = [];
  const saves = createSaveController({ getState: () => ({}),
    beforeLeave: async () => { if (fail) throw Error('pending note'); order.push('notes'); },
    write: async () => { order.push('save'); } });
  assert.equal(await saves.guard(async () => { order.push('leave'); }), false);
  assert.equal(saves.hasPendingAction(), true); assert.deepEqual(order, []);
  fail = false; await saves.retry();
  assert.deepEqual(order, ['notes', 'save', 'leave']);
});

test('cancelled and superseded navigation cannot execute after a slow save', async () => {
  const gate = deferred(), actions = [];
  const saves = createSaveController({ getState: () => ({}), write: () => gate.promise });
  const first = saves.guard(async () => actions.push('first'));
  const second = saves.guard(async () => actions.push('second'));
  gate.resolve(); await Promise.all([first, second]);
  assert.deepEqual(actions, ['second']);
  const next = saves.guard(async () => actions.push('cancelled'));
  saves.cancelPendingAction(); await next;
  assert.deepEqual(actions, ['second']);
});

function navigationFixture({ write = async () => {}, beforeLeave = async () => {} } = {}) {
  const hub = model(null), events = [];
  let dirty = false, hash = '#madar';
  const saves = createSaveController({ getState: () => hub.value, write, beforeLeave,
    onDirty: value => { dirty = value; } });
  const navigation = createNavigation({ model: hub, saves, hosted: true,
    closePicker: () => events.push('close'), pushHash: value => { hash = value; },
    leave: url => events.push(url), render: () => events.push('render'), focus: () => events.push('focus'),
    hasPending: () => dirty, warn: () => events.push('warn'), getHash: () => hash });
  return { hub, saves, navigation, events, setHash: value => { hash = value; }, getHash: () => hash };
}

test('hosted route changes save before rendering a potentially mobile redirect', async () => {
  const writes = [];
  const f = navigationFixture({ write: async snapshot => writes.push(snapshot.route) });
  await f.navigation.go('lesson:n01');
  assert.deepEqual(writes, ['home', 'lesson:n01', 'lesson:n01']);
  assert.equal(f.getHash(), '#lesson:n01');
  assert.deepEqual(f.events, ['close', 'render', 'focus']);
});

test('failed save blocks course exit without replacing state or notes', async () => {
  const f = navigationFixture({ write: async () => { throw Error('offline'); } });
  f.hub.profile().notes.n01 = 'keep';
  await f.navigation.go('course:office:word');
  assert.equal(f.hub.value.route, 'home');
  assert.equal(f.hub.profile().notes.n01, 'keep');
  assert.deepEqual(f.events, ['close']);
});

test('network revision exit also waits for pending notes and profile persistence', async () => {
  const gate = deferred();
  const f = navigationFixture({ beforeLeave: () => gate.promise });
  const leaving = f.navigation.go('lesson:network-srwe-4');
  assert.deepEqual(f.events, ['close']);
  gate.resolve(); await leaving;
  assert.equal(f.events.at(-1), '/network-review?chapter=4');
});

test('history restores aliases and blocks pending changes', () => {
  const f = navigationFixture();
  f.setHash('#courses'); assert.equal(f.navigation.restoreHistory(), true);
  assert.equal(f.hub.value.route, 'courses');
  f.saves.markDirty(); f.setHash('#madar');
  assert.equal(f.navigation.restoreHistory(), false);
  assert.equal(f.getHash(), '#courses'); assert.equal(f.events.at(-1), 'warn');
  assert.equal(routeFromHash('#my-space'), 'account'); assert.equal(hashForRoute('home'), '#madar');
  assert.equal(externalDestination('lesson:v01', f.hub.lessonBy, true), '/applications#learn/v01');
  assert.equal(externalDestination('lesson:e01', f.hub.lessonBy, true), '/applications#excel/e01');
});

test('host environment preserves notes, config grants, editor and storage payload formats', async () => {
  const writes = [];
  const profile = { value: { notes: { local: 'keep' }, editor: { title: 'draft' }, custom: 7 }, save: async v => writes.push(['profile', v]) };
  const config = { value: { access: initial().access, contentAccess: {}, updates: [], grants: { network: ['synthetic'] } }, save: async v => writes.push(['config', v]) };
  const boot = { account: { isAdmin: true, user: 'synthetic' }, lessons, notes: [{ lesson: 'n01', note: 'server' }] };
  const env = await createHostedEnvironment({ initial: initial(), fetchBoot: async () => ({ ok: true, json: async () => boot }),
    openStore: async name => name === 'profile' ? profile : config, hash: '#courses', readLocalNote: () => null });
  assert.equal(env.restored.profiles.student.notes.n01, 'server');
  assert.equal(profile.value.notes.n01, undefined);
  await env.write(env.restored);
  assert.equal(writes[0][0], 'config'); assert.deepEqual(writes[0][1].grants, { network: ['synthetic'] });
  assert.equal(writes[1][1].custom, 7); assert.deepEqual(writes[1][1].editor, { title: 'draft' });
  assert.equal('route' in writes[1][1], false);
});

test('guest environment overlays local notes and never opens admin storage', async () => {
  const opened = [];
  const boot = { account: { isAdmin: false, user: null }, lessons, config: initial() };
  const env = await createHostedEnvironment({ initial: initial(), fetchBoot: async () => ({ ok: true, json: async () => boot }),
    openStore: async name => { opened.push(name); return { value: {}, save: async () => {} }; }, hash: '',
    readLocalNote: id => id === 'n01' ? { text: 'guest note' } : null });
  assert.deepEqual(opened, ['profile']); assert.equal(env.restored.profiles.student.notes.n01, 'guest note');
  assert.equal(env.restored.editor, null);
});

test('boot failures never open or replace storage', async () => {
  await assert.rejects(createHostedEnvironment({ initial: initial(), fetchBoot: async () => ({ ok: false }),
    openStore: () => assert.fail('must not open storage') }), /تعذر تحميل مدار/);
});

test('preview adapter retains its key and widget payload contract', async () => {
  const calls = [];
  const storage = { getItem: key => { assert.equal(key, 'preview'); return '{broken'; }, setItem: (...args) => calls.push(args) };
  const env = createPreviewEnvironment({ initial: initial(), storage, key: 'preview', getWidget: () => null, shouldFail: () => false });
  assert.equal(env.restored, undefined); await env.write(initial()); assert.equal(calls[0][0], 'preview');
  const widget = createPreviewEnvironment({ initial: initial(), storage, key: 'preview',
    getWidget: () => ({ setWidgetState: value => calls.push(value) }), shouldFail: () => false });
  await widget.write(initial()); assert.equal(calls[1].privateContent.hub.route, 'home');
});

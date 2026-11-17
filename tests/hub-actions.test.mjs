import test from 'node:test';
import assert from 'node:assert/strict';
import { createLessonActions } from '../public/hub/lesson-actions.mjs';
import { createAccessActions } from '../public/hub/access-actions.mjs';

function fixture() {
  let state = { route: 'lesson:theory', viewer: 'student', access: { network: 'public' }, contentAccess: {},
    profiles: { student: { visits: {}, notes: {}, extra: { retained: true } }, guest: { visits: {}, notes: {} } } };
  let grants = { network: ['existing'] }, pending = false, rejectWrite = false;
  const calls = [];
  const lessons = [{ id: 'theory', course: 'network', steps: ['one', 'two'], theory: {} },
    { id: 'practice', course: 'network', steps: ['one', 'two'] }];
  const saves = { scheduleSave: () => calls.push('schedule'), markDirty: () => calls.push('dirty'),
    persist: async () => { calls.push('persist'); if (rejectWrite) throw Error('offline'); },
    guard: async action => { calls.push('guard'); await action(); } };
  const dependencies = { getState: () => state, getGrants: () => grants,
    profile: () => state.profiles[state.viewer], lessonBy: id => lessons.find(x => x.id === id),
    notes: { hasPending: () => pending, retry: async () => { calls.push('retry-note'); } },
    saves, hosted: true, render: () => calls.push('render'), focusTopic: () => calls.push('focus'),
    warn: message => calls.push(message), resetAccountFilter: () => calls.push('filter'),
    syncViewer: value => calls.push('viewer:' + value) };
  return { dependencies, calls, saves, get state() { return state; }, get grants() { return grants; },
    setState: value => { state = value; }, setGrants: value => { grants = value; },
    setPending: value => { pending = value; }, rejectWrite: () => { rejectWrite = true; } };
}

test('step actions reject missing/out-of-range/NaN targets without saving or rendering', async () => {
  const f = fixture(), actions = createLessonActions(f.dependencies), before = structuredClone(f.state);
  for (const step of [-1, 2, 'invalid', Infinity]) await actions.moveStep(step);
  assert.deepEqual(f.state, before); assert.deepEqual(f.calls, []);
  f.state.route = 'home'; await actions.moveStep(0); actions.captureNote('ignored');
  assert.deepEqual(f.calls, []);
});

test('pending notes block lesson movement until retry actually clears them', async () => {
  const f = fixture(); f.setPending(true);
  const actions = createLessonActions(f.dependencies), before = structuredClone(f.state);
  await actions.moveStep(1);
  assert.deepEqual(f.state, before);
  assert.equal(f.calls[0], 'retry-note'); assert.match(f.calls[1], /لم تُحفظ/);
  f.calls.length = 0;
  f.dependencies.notes.retry = async () => { f.calls.push('retry-note'); f.setPending(false); };
  await actions.moveStep('1');
  assert.deepEqual(f.calls, ['retry-note', 'dirty', 'render', 'focus', 'persist']);
  assert.deepEqual(f.state.profiles.student.visits.network, { lesson: 'theory', step: 1 });
  assert.equal(f.state.profiles.student.theoryPositions.theory, 1);
  assert.deepEqual(f.state.profiles.student.extra, { retained: true });
});

test('rejected note retry does not mutate the lesson profile', async () => {
  const f = fixture(); f.setPending(true);
  f.dependencies.notes.retry = async () => { throw Error('note offline'); };
  const before = structuredClone(f.state);
  await assert.rejects(createLessonActions(f.dependencies).moveStep(1), /note offline/);
  assert.deepEqual(f.state, before); assert.deepEqual(f.calls, []);
});

test('failed profile write retains the chosen step for persistence retry', async () => {
  const f = fixture(); f.state.route = 'lesson:practice'; f.rejectWrite();
  await createLessonActions(f.dependencies).moveStep('0');
  assert.deepEqual(f.calls, ['dirty', 'render', 'persist']);
  assert.deepEqual(f.state.profiles.student.visits.network, { lesson: 'practice', step: 0 });
  assert.equal(f.state.profiles.student.latest, 'network');
  assert.equal(f.state.profiles.student.theoryPositions, undefined);
});

test('note capture uses the restored profile and preserves text and unrelated fields', () => {
  const f = fixture(), actions = createLessonActions(f.dependencies), old = f.state;
  const restored = structuredClone(old); restored.viewer = 'guest'; f.setState(restored);
  actions.captureNote('  ملاحظة\nsecond line  ');
  assert.equal(restored.profiles.guest.notes.theory, '  ملاحظة\nsecond line  ');
  assert.deepEqual(old.profiles.guest.notes, {});
  assert.deepEqual(restored.profiles.student.extra, { retained: true });
  assert.deepEqual(f.calls, ['schedule']);
});

test('access edits preserve other entries and use current state and grants readers', () => {
  const f = fixture(), actions = createAccessActions(f.dependencies), old = f.state, oldGrants = f.grants;
  f.setState(structuredClone(old)); f.setGrants({ network: ['existing'], untouched: ['keep'] });
  actions.setGrants('network', ' first, ,second, first ');
  actions.setCourseAccess('network', 'restricted'); actions.setContentAccess('theory', 'draft');
  assert.deepEqual(f.grants, { network: ['first', 'second', 'first'], untouched: ['keep'] });
  assert.equal(f.state.access.network, 'restricted'); assert.equal(f.state.contentAccess.theory, 'draft');
  assert.equal(old.access.network, 'public'); assert.deepEqual(oldGrants.network, ['existing']);
  assert.deepEqual(f.calls, ['schedule', 'schedule', 'schedule']);
  actions.setGrants('', 'ignored'); actions.setCourseAccess('', 'draft'); actions.setContentAccess('', 'draft');
  assert.equal(f.calls.length, 3);
});

test('preview grant changes remain inactive', () => {
  const f = fixture();
  createAccessActions({ ...f.dependencies, hosted: false, getGrants: () => { throw Error('not hosted'); } }).setGrants('network', 'new');
  assert.deepEqual(f.calls, []); assert.deepEqual(f.grants.network, ['existing']);
});

test('viewer changes stay behind the save guard and restore the selected value after cancellation', async () => {
  const f = fixture(), actions = createAccessActions(f.dependencies);
  f.saves.guard = async () => { f.calls.push('blocked'); };
  await actions.switchViewer('guest');
  assert.equal(f.state.viewer, 'student'); assert.deepEqual(f.calls, ['blocked', 'viewer:student']);
  f.calls.length = 0; f.saves.guard = async action => { f.calls.push('guard'); await action(); };
  await actions.switchViewer('guest');
  assert.equal(f.state.viewer, 'guest');
  assert.deepEqual(f.calls, ['guard', 'filter', 'render', 'persist', 'viewer:guest']);
});

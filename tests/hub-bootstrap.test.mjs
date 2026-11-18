import test from 'node:test';
import assert from 'node:assert/strict';
import { hubLesson, updateVisible, summarizeReview } from '../lib/hub-bootstrap.mjs';

test('lesson summaries preserve course sections, practice labels and legacy defaults', () => {
  const defaultSteps = ['الشرح والتطبيق والمراجعة'];
  assert.deepEqual(hubLesson({ id: 'w', subject: 'Word', title: 'Intro' }), {
    id: 'w', course: 'office', section: 'word', title: 'Intro', practice: false,
    kind: 'درس', intro: '', steps: defaultSteps, source: null, theory: null, scenes: null, seconds: null
  });
  const practice = hubLesson({ id: 'n', subject: 'Network', section: 'practice-guide', practice: 1, steps: [], seconds: 0 });
  assert.deepEqual([practice.course, practice.section, practice.kind, practice.practice, practice.steps, practice.seconds],
    ['network', 'practice-guide', 'مختبر عملي', true, [], null]);
  assert.equal(hubLesson({ subject: 'Network', section: 'other' }).kind, 'مختبر');
  const theory = hubLesson({ subject: 'OS1', section: 'theory', summary: 's', theory: { unit: 1 } });
  assert.deepEqual([theory.course, theory.section, theory.kind, theory.intro, theory.theory], ['os1', 'theory', 'درس نظري', 's', { unit: 1 }]);
});

test('visibility includes boundary dates and requires both the course and target to be available', () => {
  const day = '2026-11-18', allowed = ['office'], visible = new Set(['word1']);
  const check = patch => updateVisible({ status: 'published', target: 'global', ...patch }, allowed, visible, day);
  assert.equal(check({ start: day, end: day }), true);
  assert.equal(check({ start: '2026-11-19' }), false);
  assert.equal(check({ end: '2026-11-17' }), false);
  assert.equal(check({ status: 'draft' }), false);
  assert.equal(check({ course: 'network', target: 'lesson:word1' }), false);
  assert.equal(check({ target: 'course:office:home' }), true);
  assert.equal(check({ target: 'course:network:home' }), false);
  assert.equal(check({ target: 'lesson:word1' }), true);
  assert.equal(check({ target: 'lesson:hidden' }), false);
});

test('review distinguishes a missing snapshot from an empty one and counts each entry once', () => {
  assert.equal(summarizeReview(null), null);
  assert.deepEqual(summarizeReview({}), { wrong: 0, marked: 0, answered: 0 });
  assert.deepEqual(summarizeReview({
    meta: { a: { mistakes: 3, marked: true }, b: { mistakes: 0, marked: false } },
    study: { a: { graded: true }, b: { graded: false } }
  }), { wrong: 1, marked: 1, answered: 1 });
});

// Public lesson shape consumed by the hosted course hub.
export function hubLesson(lesson) {
  const { id, subject, section, title } = lesson;
  const course = subject === 'OS1' ? 'os1' : subject === 'Network' ? 'network' : 'office';
  let kind = subject === 'Network' ? 'مختبر' : 'درس';
  if (section === 'practice-guide') kind = 'مختبر عملي';
  if (section === 'theory') kind = 'درس نظري';

  return {
    id,
    course,
    section: course === 'office' ? subject.toLowerCase() : section,
    title,
    practice: Boolean(lesson.practice),
    kind,
    intro: lesson.summary || '',
    steps: lesson.steps || ['الشرح والتطبيق والمراجعة'],
    source: lesson.source || null,
    theory: lesson.theory || null,
    scenes: lesson.scenes || null,
    seconds: lesson.seconds || null
  };
}

/**
 * @param {{ status: string, target: string, course?: string, start?: string, end?: string }} update
 * @param {string[]} allowed
 * @param {Set<string>} visibleLessons
 * @param {string} day Calendar date in Asia/Riyadh.
 */
export function updateVisible(update, allowed, visibleLessons, day) {
  if (update.status !== 'published') return false;
  if (update.course && !allowed.includes(update.course)) return false;
  if (update.target.startsWith('course:') && !allowed.includes(update.target.split(':')[1])) return false;
  if (update.target.startsWith('lesson:') && !visibleLessons.has(update.target.slice('lesson:'.length))) return false;
  return (!update.start || update.start <= day) && (!update.end || update.end >= day);
}

export function summarizeReview(snapshot) {
  if (!snapshot) return null;
  const metadata = Object.values(snapshot.meta || {});
  return {
    wrong: metadata.filter(item => item.mistakes > 0).length,
    marked: metadata.filter(item => item.marked).length,
    answered: Object.values(snapshot.study || {}).filter(item => item.graded).length
  };
}

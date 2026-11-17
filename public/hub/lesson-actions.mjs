// Lesson mutations use live readers; the composition supplies note and UI adapters.
export function createLessonActions({ getState, profile, lessonBy, notes, saves,
  render, focusTopic, warn }) {
  function currentLesson() { return lessonBy(getState().route.split(':')[1]); }

  function captureNote(text) {
    const lesson = currentLesson();
    if (!lesson) return;
    profile().notes[lesson.id] = text;
    saves.scheduleSave();
  }

  async function moveStep(value) {
    const lesson = currentLesson(), step = Number(value);
    if (!(lesson && step >= 0 && step < lesson.steps.length)) return;
    if (notes.hasPending()) {
      await notes.retry();
      if (notes.hasPending()) {
        warn('ملاحظتك لم تُحفظ بعد؛ أعد الحفظ قبل تغيير الموضوع.');
        return;
      }
    }
    const current = profile();
    if (lesson.theory) {
      current.theoryPositions ||= {};
      current.theoryPositions[lesson.id] = step;
    }
    current.visits[lesson.course] = { lesson: lesson.id, step };
    current.latest = lesson.course;
    saves.markDirty();
    render();
    if (lesson.theory) focusTopic();
    // Preserve the existing retry UI: persistence owns failure/dirty reporting.
    await saves.persist().catch(() => {});
  }

  return { captureNote, moveStep };
}

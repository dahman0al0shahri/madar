import { cloneState } from './state.mjs';

export function editorFromFields(current, fields) {
  const course = fields.course;
  return { ...current, title: fields.title, body: fields.body, course,
    places: fields.placement === 'both' ? ['global', 'course'] : [fields.placement],
    status: fields.status, date: fields.date, start: fields.start, end: fields.end,
    duration: Number(fields.duration), pin: fields.pin,
    target: fields.destination === 'auto' ? (course ? `course:${course}:home` : 'courses') : fields.destination };
}

export function editorError(update, lessonBy) {
  if (!update.title.trim() || !update.body.trim()) return 'أدخل عنوان المستجد ونصه.';
  if (!update.course && update.places.includes('course')) return 'اختر مقررًا لظهور المستجد في رئيسيته.';
  if (update.start && update.end && update.end < update.start) return 'نهاية الظهور يجب ألا تسبق بدايته.';
  if (update.target.startsWith('lesson:') && lessonBy(update.target.split(':')[1])?.course !== update.course) return 'اختر وجهة من المقرر نفسه.';
  return '';
}

// State is read for each action: restoring a model cannot leave a stale reference.
export function createEditorController({ getState, lessonBy, saves, persist, now, today }) {
  return {
    begin() {
      getState().editor = { id: 'u-' + now(), title: '', body: '', course: '', target: 'courses',
        places: ['global'], status: 'draft', pin: false, date: today(), start: '', end: '', duration: 12, scene: 'hub' };
    },
    edit(id) { getState().editor = cloneState(getState().updates.find(update => update.id === id)); },
    cancel() { getState().editor = null; },
    capture(fields) { getState().editor = editorFromFields(getState().editor, fields); },
    resetDestination() {
      const update = getState().editor;
      update.target = update.course ? `course:${update.course}:home` : 'courses';
    },
    remove(id) {
      const state = getState();
      state.updates = state.updates.filter(update => update.id !== id);
      if (state.editor?.id === id) state.editor = null;
    },
    async save() {
      const state = getState(), update = state.editor;
      const error = editorError(update, lessonBy);
      if (error) return { saved: false, error };
      update.scene = update.course || 'hub';
      const index = state.updates.findIndex(item => item.id === update.id);
      if (index < 0) state.updates.push(cloneState(update));
      else state.updates[index] = cloneState(update);
      saves.markDirty();
      // A failed write keeps the draft and dirty state for the existing retry flow.
      await persist();
      return { saved: true, error: '' };
    },
  };
}

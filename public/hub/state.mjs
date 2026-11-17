// State rules have no DOM, storage or browser dependency.
export const cloneState = value => JSON.parse(JSON.stringify(value));

export function normalizeState(value, initial) {
  if (!value || value.version !== 1) return cloneState(initial);
  const restored = cloneState(value);
  const state = Object.assign(cloneState(initial), restored);
  for (const viewer of ['student', 'guest']) {
    state.profiles[viewer] = { visits: {}, notes: {}, latest: null, ...restored.profiles?.[viewer] };
  }
  state.viewer = ['student', 'guest'].includes(state.viewer) ? state.viewer : 'student';
  state.access = { ...initial.access, ...restored.access };
  state.contentAccess = restored.contentAccess || {};
  state.updates = Array.isArray(restored.updates) ? restored.updates : cloneState(initial.updates);
  return state;
}

export function createHubState({ initial, restored, courses, lessons, isAdmin = false }) {
  let value = normalizeState(restored, initial);
  const profile = () => value.profiles[value.viewer];
  const lessonBy = id => lessons.find(lesson => lesson.id === id);
  const canCourse = id => Boolean(courses[id]) && (isAdmin || value.access[id] === 'public' ||
    (value.access[id] === 'restricted' && value.viewer === 'student'));
  const canLesson = lesson => Boolean(lesson) && canCourse(lesson.course) && (isAdmin ||
    (value.contentAccess[lesson.id] !== 'draft' &&
      (value.contentAccess[lesson.id] !== 'restricted' || value.viewer === 'student')));

  function visit(route) {
    value.route = route;
    if (!route.startsWith('lesson:')) return;
    const lesson = lessonBy(route.split(':')[1]);
    if (!canLesson(lesson)) return;
    const current = profile();
    const previous = current.visits[lesson.course];
    current.visits[lesson.course] = previous?.lesson === lesson.id ? previous : {
      lesson: lesson.id, step: current.theoryPositions?.[lesson.id] || 0,
    };
    current.latest = lesson.course;
  }

  return {
    get value() { return value; },
    replace(next) { value = normalizeState(next, initial); return value; },
    profile, lessonBy, canCourse, canLesson, visit,
    available: () => Object.keys(courses).filter(canCourse),
    selectedCourse() {
      if (value.route.startsWith('course:')) return value.route.split(':')[1];
      if (value.route.startsWith('lesson:')) return lessonBy(value.route.split(':')[1])?.course;
      return null;
    },
  };
}

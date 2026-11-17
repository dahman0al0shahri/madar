export function routeFromHash(hash) {
  const route = decodeURIComponent(hash.replace(/^#/, ''));
  return ({ madar: 'home', 'my-space': 'account' })[route] || route || 'home';
}

export const hashForRoute = route => '#' + ({ home: 'madar', account: 'my-space' }[route] || route);

export function externalDestination(route, lessonBy, hosted) {
  if (/^lesson:network-srwe-[456]$/.test(route)) return '/network-review?chapter=' + route.slice(-1);
  if (!hosted) return null;
  const lesson = route.startsWith('lesson:') ? lessonBy(route.split(':')[1]) : null;
  if (route.startsWith('course:office:') || lesson?.course === 'office') {
    const section = route.split(':')[2];
    return '/applications#' + (lesson
      ? (lesson.section === 'word' ? 'learn/' : lesson.section + '/') + lesson.id
      : section || 'home');
  }
  return null;
}

export function createNavigation({ model, saves, hosted = false, closePicker,
  pushHash, leave, render, focus, hasPending, warn, getHash }) {
  async function go(route) {
    closePicker();
    return saves.guard(async () => {
      const destination = externalDestination(route, model.lessonBy, hosted);
      if (destination) { leave(destination); return; }
      model.visit(route);
      if (hosted) pushHash(hashForRoute(route));
      saves.markDirty();
      // Mobile lesson rendering can replace the document; save position first.
      if (hosted) await saves.persist();
      render();
      focus();
      await saves.persist();
    });
  }

  function restoreHistory() {
    if (hasPending()) {
      pushHash(hashForRoute(model.value.route));
      warn();
      return false;
    }
    model.value.route = routeFromHash(getHash());
    render();
    return true;
  }

  return { go, restoreHistory, selectedCourse: model.selectedCourse };
}

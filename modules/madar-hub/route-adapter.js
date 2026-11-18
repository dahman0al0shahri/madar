const routeAdapter = {
  redirect: html => mobilePracticalTarget(html),
  beforeReplace() { disposeNetworkFrame(); disposeOsScene(); },
  afterReplace({ course }) {
    mountNetworkFrame(); mountOsScene();
    if ($('#mh-hint-history-root')) window.MadarHintHistoryPage($('#mh-hint-history-root'));
    document.body.dataset.view = course === 'os1' ? 'os1' : course === 'network' ? 'network' : state.route === 'courses' ? 'courses' : 'home';
    window.MADAR_ACTIVITY?.emit('page_open', state.route.startsWith('lesson:') ? { lesson: state.route.split(':')[1] } : {});
    if (state.route.startsWith('lesson:')) void window.MADAR_NOTES?.mount(state.route.split(':')[1], { video: false });
    if ($('#mh-network-feedback')) {
      $('#mh-network-feedback').innerHTML = window.MADAR_FEEDBACK.markup();
      void window.MADAR_FEEDBACK.bind({ subject: 'Network', bankVersion: 'network-lab452-v1',
        currentLesson: state.route.startsWith('lesson:') ? state.route.split(':')[1] : null,
        lessons: lessons.filter(l => l.course === 'network'), questions: [] });
    }
    updateNetworkBackground(course);
  },
  dispose() { disposeNetworkFrame(); disposeOsScene(); window.MadarPageReflection?.stop(); },
};

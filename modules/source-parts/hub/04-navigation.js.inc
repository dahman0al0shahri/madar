  const navigation = createNavigation({
    model: stateModel, saves, hosted: environment.hosted,
    closePicker: () => { $('#mh-picker').hidden = true; $('#mh-picker-button').setAttribute('aria-expanded', 'false'); },
    pushHash: hash => history.pushState(null, '', hash),
    getHash: () => location.hash,
    leave: url => location.assign(url),
    render: () => render(),
    focus: () => { $('.mh-header').scrollIntoView({ block: 'start', behavior: 'instant' }); $('#mh-main').focus({ preventScroll: true }); },
    hasPending: () => dirty || window.MADAR_NOTES?.hasPending() ||
      $('#mh-network-lab')?.contentWindow?.MadarStore?.hasPending() ||
      $('#mh-network-lab')?.contentWindow?.document.getElementById('madar-labs')?.getLabsState?.().dirty,
    warn: () => say('احفظ تغييراتك قبل الرجوع.'),
  });
  function selectedCourse() { return navigation.selectedCourse(); }
  const go = navigation.go;
  if (environment.hosted) {
    addEventListener('popstate', navigation.restoreHistory);
    addEventListener('hashchange', () => {
      const key = location.hash.slice(1).split('/')[0];
      if (['home','word','excel','access','learn','quiz','reference','saved','mistakes','about','session','results'].includes(key)) {
        location.replace('/applications' + location.search + location.hash);
        return;
      }
      if (routeFromHash(location.hash) !== state.route) navigation.restoreHistory();
    });
  }


/* hub:course-tools:start */
  /* hub:course-tools:end */
  const searchController = createSearchController({ courses, lessons, available, canLesson,
    hosted: environment.hosted, esc, icon, paintIcons,
    readQuery: () => $('#mh-query').value, readScope: () => $('#mh-search-scope').value,
    showResults: html => { $('#mh-search-results').innerHTML = html; } });
  const search = searchController.search;
  function openSearch() {
    const current = selectedCourse();
    $('#mh-search-scope').innerHTML = `<option value="all">كل المقررات</option>` + available().map(id => `<option value="${id}" ${id===current?'selected':''}>${courses[id].name}</option>`).join('');
    $('#mh-query').value = '';
    search();
    $('#mh-search-dialog').showModal();
    $('#mh-query').focus();
  }
  function closePicker() {
    $('#mh-picker').hidden = true;
    $('#mh-picker-button').setAttribute('aria-expanded', 'false');
  }
  const lessonActions = createLessonActions({ getState: () => stateModel.value, profile, lessonBy, saves,
    notes: { hasPending: () => Boolean(window.MADAR_NOTES?.hasPending()),
      retry: () => window.MADAR_NOTES.retry() }, render, warn: say,
    focusTopic: () => { $('#nt-topic-title')?.focus({ preventScroll: true }); $('#nt-topic-title')?.scrollIntoView({ block: 'start' }); } });
  const accessActions = createAccessActions({ getState: () => stateModel.value,
    getGrants: () => config.grants, hosted: environment.hosted, saves, render,
    resetAccountFilter: () => { accountFilter = 'all'; },
    syncViewer: value => { $('#mh-viewer').value = value; } });
  function paintEditorPreview(update) {
    $('#mh-update-preview').innerHTML = editorViews.previewMarkup(update);
    paintIcons();
    announcements.paintPreview();
  }
  function handleInput(event) {
    const target = event.target;
    if (target.id === (environment.hosted ? 'lesson-note-text' : 'mh-note')) {
      lessonActions.captureNote(target.value);
    }
    if (target.id === 'mh-query') search();
    if (environment.hosted && target.id === 'mh-command-query') {
      filterCommandCards({ query: target.value, cards: $$('[data-command-search]'),
        emptyMessage: $('#mh-command-empty'), normalize: searchText });
    }
    if (target.closest('#mh-editor-form')) { editorActions.changed(); }
  }
  async function handleChange(event) {
    const target = event.target;
    if (target.name === 'course' && target.closest('#mh-editor-form')) {
      editorActions.courseChanged();
    }
    if (target.id === 'mh-viewer') {
      await accessActions.switchViewer(target.value);
    }
    if (target.id === 'mh-search-scope') search();
    if (environment.hosted && target.dataset.grant) {
      accessActions.setGrants(target.dataset.grant, target.value);
    }
    if (target.dataset.courseAccess) accessActions.setCourseAccess(target.dataset.courseAccess, target.value);
    if (target.dataset.contentAccess) accessActions.setContentAccess(target.dataset.contentAccess, target.value);
    if (target.closest('#mh-editor-form')) { editorActions.changed(); }
  }
  function handleKeydown(event) {
    if (event.key === 'Enter' && event.target.tagName === 'INPUT' && event.target.closest('#mh-editor-form')) { event.preventDefault(); void editorActions.save(); }
    if (event.key === 'Enter' && event.target.id === 'mh-query') event.preventDefault();
    keyboard = true;
    if (event.key === 'Escape') {
      const dialog = $('dialog[open]');
      if (dialog) { event.preventDefault(); dialog.close(); return; }
      if (!$('#mh-picker').hidden) { closePicker(); $('#mh-picker-button').focus(); }
    }
  }
  const disposeHubEvents = bindHubEvents({ root, documentTarget: document,
    clickActions: {
      'mh-skip': () => { $('#mh-main').focus({ preventScroll: true }); $('#mh-main').scrollIntoView({ block: 'start' }); },
      'mh-picker-button': button => { const open = $('#mh-picker').hidden; $('#mh-picker').hidden = !open; button.setAttribute('aria-expanded', String(open)); },
      'mh-save-update': editorActions.save,
      'mh-search-button': openSearch,
      'mh-search-more': () => searchController.more(),
      'mh-retry': () => saves.retry().catch(() => {}),
      'mh-stay': () => { saves.cancelPendingAction(); $('#mh-error').hidden = true; },
      'mh-pause': () => setPaused(!announcements.isPaused()), 'mh-scene': () => setPaused(!announcements.isPaused()),
      'mh-replay': paintSlide, 'mh-next': () => moveSlide('next'), 'mh-prev': () => moveSlide('prev'),
      'mh-new-update': editorActions.begin,
      'mh-cancel-edit': editorActions.cancel,
      'mh-preview-update': editorActions.preview,
      'mh-delete-confirm': editorActions.confirmDelete,
      ...(environment.hosted ? {
        'mh-profile-export': () => store.download(),
        'mh-recover-export': () => { store.download(); adminStore?.download(); },
        'mh-recover-load': () => store.discardAndReload(),
      } : {}),
    },
    dataActions: {
      go: go, close: id => $('#' + id).close(),
      searchGo: async route => { $('#mh-search-dialog').close(); await go(route); },
      slide: value => moveSlide(Number(value)), step: lessonActions.moveStep,
      filter: value => { accountFilter = value; render(); },
      editUpdate: editorActions.edit,
      deleteUpdate: editorActions.requestDelete,
    },
    actions: {
      input: handleInput, change: handleChange, keydown: handleKeydown,
      submit: event => { event.preventDefault(); if (event.target.id === 'mh-editor-form') void editorActions.save(); },
      pointerdown: () => { keyboard = false; },
      focusin: event => { if (keyboard && event.target.closest('.mh-carousel') && event.target.id !== 'mh-pause') setPaused(true); },
      outsideClick: event => { if (!event.target.closest('.mh-picker-wrap')) closePicker(); },
    },
  });


/* hub:course-tools */
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
  function moveSlide(value) {
    if (!carousel) return;
    slideIndex = typeof value === 'number' ? value : (slideIndex + (value === 'next' ? 1 : -1) + carousel.items.length) % carousel.items.length;
    paintSlide();
  }
  async function moveLessonStep(value) {
    const lesson = lessonBy(state.route.split(':')[1]), step = Number(value);
    if (!(lesson && step >= 0 && step < lesson.steps.length)) return;
    if (window.MADAR_NOTES?.hasPending()) {
      await window.MADAR_NOTES.retry();
      if (window.MADAR_NOTES.hasPending()) { say('ملاحظتك لم تُحفظ بعد؛ أعد الحفظ قبل تغيير الموضوع.'); return; }
    }
    if (lesson.theory) { profile().theoryPositions ||= {}; profile().theoryPositions[lesson.id] = step; }
    profile().visits[lesson.course] = { lesson: lesson.id, step };
    profile().latest = lesson.course;
    saves.markDirty();
    render();
    if (lesson.theory) { $('#nt-topic-title')?.focus({ preventScroll: true }); $('#nt-topic-title')?.scrollIntoView({ block: 'start' }); }
    await persist().catch(() => {});
  }
  function editAndRender(action) { action(); render(); scheduleSave(); }
  function previewUpdate() {
    captureEditor();
    const update = state.editor;
    $('#mh-update-preview').innerHTML = `<div class="mh-news-shell mh-space-top"><article class="mh-news-slide" style="--slide-accent:${courses[update.course]?.color||'#e9c691'}"><div class="mh-news-copy"><span class="mh-eyebrow">معاينة قبل الإتاحة</span><h2>${esc(update.title||'عنوان المستجد')}</h2><p>${esc(update.body)}</p></div><div class="mh-visual">${scene({...update,scene:update.course||'hub'})}</div></article></div>`;
    paintIcons();
    liquidOrbit?.dispose(); liquidOrbit = null;
    const previewMark = $('#mh-update-preview .mh-main-mark');
    if (previewMark) liquidOrbit = createLiquidOrbit(previewMark);
    networkNewsPlayer?.dispose();
    networkNewsPlayer = createNetworkNewsPlayer($('#mh-update-preview .mh-network-showcase'));
  }
  function handleInput(event) {
    const target = event.target;
    if (target.id === (environment.hosted ? 'lesson-note-text' : 'mh-note')) {
      const lesson = lessonBy(state.route.split(':')[1]);
      if (lesson) { profile().notes[lesson.id] = target.value; scheduleSave(); }
    }
    if (target.id === 'mh-query') search();
    if (environment.hosted && target.id === 'mh-command-query') {
      filterCommandCards({ query: target.value, cards: $$('[data-command-search]'),
        emptyMessage: $('#mh-command-empty'), normalize: searchText });
    }
    if (target.closest('#mh-editor-form')) { captureEditor(); scheduleSave(); }
  }
  async function handleChange(event) {
    const target = event.target;
    if (target.name === 'course' && target.closest('#mh-editor-form')) {
      captureEditor(); editor.resetDestination();
      $('#mh-editor-form [name=destination]').innerHTML = targetOptions(state.editor);
    }
    if (target.id === 'mh-viewer') {
      const next = target.value;
      await guarded(async () => { state.viewer = next; accountFilter = 'all'; render(); await persist(); });
      $('#mh-viewer').value = state.viewer;
    }
    if (target.id === 'mh-search-scope') search();
    if (environment.hosted && target.dataset.grant) {
      config.grants[target.dataset.grant] = target.value.split(',').map(value => value.trim()).filter(Boolean);
      scheduleSave();
    }
    if (target.dataset.courseAccess) { state.access[target.dataset.courseAccess] = target.value; scheduleSave(); }
    if (target.dataset.contentAccess) { state.contentAccess[target.dataset.contentAccess] = target.value; scheduleSave(); }
    if (target.closest('#mh-editor-form')) { captureEditor(); scheduleSave(); }
  }
  function handleKeydown(event) {
    if (event.key === 'Enter' && event.target.tagName === 'INPUT' && event.target.closest('#mh-editor-form')) { event.preventDefault(); void saveEditor(); }
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
      'mh-save-update': saveEditor,
      'mh-search-button': openSearch,
      'mh-search-more': () => searchController.more(),
      'mh-retry': () => saves.retry().catch(() => {}),
      'mh-stay': () => { saves.cancelPendingAction(); $('#mh-error').hidden = true; },
      'mh-pause': () => setPaused(!paused), 'mh-scene': () => setPaused(!paused),
      'mh-replay': paintSlide, 'mh-next': () => moveSlide('next'), 'mh-prev': () => moveSlide('prev'),
      'mh-new-update': () => editAndRender(editor.begin),
      'mh-cancel-edit': () => editAndRender(editor.cancel),
      'mh-preview-update': previewUpdate,
      'mh-delete-confirm': () => { editor.remove(deleteId); deleteId = null; $('#mh-confirm').close(); render(); scheduleSave(); },
      ...(environment.hosted ? {
        'mh-profile-export': () => store.download(),
        'mh-recover-export': () => { store.download(); adminStore?.download(); },
        'mh-recover-load': () => store.discardAndReload(),
      } : {}),
    },
    dataActions: {
      go: go, close: id => $('#' + id).close(),
      searchGo: async route => { $('#mh-search-dialog').close(); await go(route); },
      slide: value => moveSlide(Number(value)), step: moveLessonStep,
      filter: value => { accountFilter = value; render(); },
      editUpdate: id => editAndRender(() => editor.edit(id)),
      deleteUpdate: id => { deleteId = id; $('#mh-confirm').showModal(); },
    },
    actions: {
      input: handleInput, change: handleChange, keydown: handleKeydown,
      submit: event => { event.preventDefault(); if (event.target.id === 'mh-editor-form') void saveEditor(); },
      pointerdown: () => { keyboard = false; },
      focusin: event => { if (keyboard && event.target.closest('.mh-carousel') && event.target.id !== 'mh-pause') setPaused(true); },
      outsideClick: event => { if (!event.target.closest('.mh-picker-wrap')) closePicker(); },
    },
  });


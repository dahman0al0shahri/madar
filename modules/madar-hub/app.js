(async () => {
  const { createHubState, createSaveController, createNavigation, routeFromHash,
    createPreviewEnvironment, createHostedEnvironment, createEditorController, createEditorViews,
    createHubViews, createSearchController, searchText, bindHubEvents, createLessonActions, createAccessActions, createEditorActions, createAnnouncements, nowDay, createCourseViews, createHostedCourseViews, createViewLifecycle, createNewsFramePlayer } = await import('/hub/index.mjs');
  'use strict';
  const root=document.getElementById('madar-hub'), $=s=>root.querySelector(s), $$=s=>[...root.querySelectorAll(s)];
  const KEY='madar-hub-preview-v1', motionPreference=matchMedia('(prefers-reduced-motion: reduce)'), reduced=motionPreference.matches;
  const clone=x=>JSON.parse(JSON.stringify(x));
  const esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const icon=n=>`<i data-lucide="${n}" aria-hidden="true"></i>`;
  function courseIcon(id){
    if(id==='office')return `<span class="mh-course-icon mh-course-icon-office" aria-hidden="true"><svg viewBox="0 0 48 48" fill="none"><rect x="2" y="15" width="16" height="26" rx="2.5" fill="#492736" stroke="#dc7f9d"/><rect x="16" y="6" width="17" height="29" rx="2.5" fill="#193e32" stroke="#70c8a5"/><rect x="31" y="14" width="15" height="27" rx="2.5" fill="#203c59" stroke="#85b9f3"/><path d="m6 28 3.7-9 3.7 9M7.2 25h5M21 12l7 9m0-9-7 9M34 20l1.8 9 2.7-6 2.6 6 1.7-9" stroke="#f2f6fa" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round"/><path d="M20 26h9v5h-9Zm4.5 0v5M20 28.5h9" stroke="#70c8a5" stroke-width=".7"/><path d="M35 33h7m-7 3h7" stroke="#85b9f3" stroke-width=".8"/><ellipse cx="10" cy="33" rx="3.2" ry="1.2" stroke="#dc7f9d" stroke-width=".8"/><path d="M6.8 33v3c0 1.7 6.4 1.7 6.4 0v-3" stroke="#dc7f9d" stroke-width=".8"/></svg></span>`;
    const network=id==='network',tone=network?'#efb472':'#91c8ff';
    const body=network?`<path d="M8 18 15 11h19l6 7v15l-7 5H8Z" fill="url(#course-device-network)" stroke="#9e876a"/><path d="M8 18h32M34 12v5" stroke="#e5c49b" stroke-opacity=".6"/><rect x="11" y="23" width="26" height="9" rx="1" fill="#080d12" stroke="#7e7160"/>${[13,19,25,31].map(x=>`<path d="M${x} 25h4v4h-4Z" fill="#303c42" stroke="#b19772" stroke-width=".55"/><path d="M${x+1} 25v1m2-1v1" stroke="#e6cd99" stroke-width=".6"/>`).join('')}<path d="M14 6h14l-3-3m3 3-3 3M34 42H20l3-3m-3 3 3 3" fill="none" stroke="${tone}" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/><circle cx="12" cy="35" r="1" fill="#8ed9ae"/>`:`<path d="M10 5h28v38H10Z" fill="#101b25" stroke="#718fa6"/><path d="M12 7h24M12 41h24" stroke="#a9becb" stroke-opacity=".5"/>${[9,20,31].map(y=>`<rect x="13" y="${y}" width="22" height="8" rx="1.2" fill="url(#course-device-os1)" stroke="#607b90" stroke-width=".7"/><path d="M17 ${y+2}v4m3-4v4m3-4v4m3-4v4" stroke="#09121b" stroke-width="1.4"/><circle cx="31" cy="${y+3}" r="1.2" fill="${tone}"/><circle cx="31" cy="${y+6}" r=".7" fill="#8de9bc"/>`).join('')}`;
    return `<span class="mh-course-icon mh-course-icon-${id}" aria-hidden="true"><svg viewBox="0 0 48 48" fill="none"><defs><linearGradient id="course-device-${id}" x1="0" y1="0" x2=".5" y2="1"><stop stop-color="${network?'#5d6264':'#526a7c'}"/><stop offset=".5" stop-color="#26333d"/><stop offset="1" stop-color="#121c25"/></linearGradient></defs>${body}</svg></span>`;
  }

const courses={
    os1:{name:'نظم التشغيل 1',color:'#91c8ff',description:'Windows Server · التثبيت، Server Core، وإدارة المجال.',tags:['Windows Server','Server Core','AD DS'],sections:[['home','رئيسية المقرر'],['lessons','الجزء العملي'],['practice','طبّق وتحقّق'],['reference','الملاحظات والمصادر']]},
    office:{name:'تطبيقات الحاسب المتقدمة',color:'#8fbfff',description:'من المستندات والجداول إلى قواعد البيانات؛ شرح وتطبيق ومراجعة في Word وExcel وAccess.',tags:['Word','Excel','Access'],sections:[['home','رئيسية المقرر'],['word','Word'],['excel','Excel'],['access','Access'],['quiz','اختبر نفسك'],['reference','المرجع']]},
    network:{name:'التوجيه والتحويل ١',color:'#efb472',description:'افهم الشبكة من اتصال أجهزتها إلى إعدادها؛ دروس وتطبيق عملي في VLAN وInter-VLAN.',tags:['VLAN','Inter-VLAN','تطبيق عملي'],sections:[['home','رئيسية المقرر'],['theory','الجزء النظري'],['lessons','الجزء العملي'],['hints','سجل التلميحات'],['quiz','تمارين وتقييم'],['reference','المرجع']]}
  };
/* hub:preview-catalog:start */
  const lessons=[
    {id:'word-compare',course:'office',section:'word',title:'مقارنة المستندات ودمجها',kind:'درس',intro:'تعرّف الفروق بين نسختين من المستند، ثم راجع التغييرات قبل دمجها.',steps:['التعرّف على نسخ المستند','مقارنة التغييرات','مراجعة النتيجة']},
    {id:'excel-functions',course:'office',section:'excel',title:'استخدام الدالتين Average وCountIF',kind:'درس',intro:'تعرّف حساب المتوسط وعدّ الخلايا التي تحقق شرطًا في جدول البيانات.',steps:['قراءة بيانات الجدول','اختيار الدالة المناسبة','مراجعة النتيجة']},
    {id:'access-fields',course:'office',section:'access',title:'خصائص الحقول',kind:'تدريب',intro:'تعرّف أثر خصائص الحقل في البيانات التي يمكن إدخالها.',steps:['تحديد الحقل','إعداد قاعدة التحقق','فحص البيانات']},
    {id:'net-vlan',course:'network',section:'practical',title:'إعداد VLAN على Switch',kind:'مختبر',intro:'VLAN شبكة محلية افتراضية تفصل الأجهزة منطقيًا. جهّز مجموعات الشبكة واربط المنافذ بالمجموعة المطلوبة.',steps:['قراءة متطلبات الشبكة','إنشاء VLAN','التحقق باستخدام Show']},
    {id:'net-trunk',course:'network',section:'practical',title:'إعداد Trunk',kind:'مختبر',intro:'Trunk وصلة تسمح بمرور أكثر من VLAN بين أجهزة الشبكة.',steps:['تحديد الوصلة','إعداد المنافذ','التحقق من الإعداد']},
    {id:'net-inter',course:'network',section:'practical',title:'التطبيق العملي لـ Inter-VLAN',kind:'مختبر',intro:'Inter-VLAN هو الاتصال بين الشبكات المحلية الافتراضية باستخدام Router أو جهاز يدعم التوجيه.',steps:['قراءة متطلبات الاتصال','إعداد واجهات Router','التحقق من الوصول']}
  ];
    /* hub:preview-catalog:end */
const initial={version:1,route:'home',viewer:'student',access:{office:'public',network:'public'},contentAccess:{},profiles:{student:{visits:{},notes:{},latest:null},guest:{visits:{},notes:{},latest:null}},editor:null,updates:[
    {id:'hub',title:'مدار يجمع رحلتك',body:'مقرراتك في مكان واحد. ادخل إلى مساحة كل مقرر، وارجع إلى تعلّمك من المكان اللي وقفت عنده.',course:'',target:'courses',places:['global'],status:'published',pin:true,date:'2026-10-15',start:'',end:'',duration:12,scene:'hub'},
    {id:'network',title:'مساحة للشبكات. وفهم أقرب للتطبيق.',body:'دروس وتدريب عملي يجمعان الفكرة وتنفيذها، مع إرشاد يساعدك عند الحاجة.',course:'network',target:'course:network:lessons',places:['global','course'],status:'published',pin:false,date:'2026-10-15',start:'',end:'',duration:14,scene:'network'},
    {id:'office',title:'مذاكرتك صارت مترابطة',body:'تنتقل بين Word وExcel وAccess، وتجمع الشرح والتطبيق والمراجعة داخل مقرر واحد.',course:'office',target:'course:office:home',places:['global','course'],status:'published',pin:false,date:'2026-10-15',start:'',end:'',duration:12,scene:'office'}
  ]};

  /* hub:environment:start */
  const environment = createPreviewEnvironment({ initial, key: KEY,
    getWidget: () => window.openai, storage: localStorage, shouldFail: () => $('#mh-fail').checked });
  /* hub:environment:end */
  const { boot, store, adminStore, config, restored } = environment;
  const stateModel = createHubState({ initial: environment.initial, restored, courses, lessons,
    isAdmin: environment.isAdmin });
  let state = stateModel.value;
  const { profile, canCourse, canLesson, available, lessonBy } = stateModel;
  // Temporary view compatibility: save status is driven only by the controller.
  let dirty = false;
  let keyboard = false, toastTimer, accountFilter = 'all';
  
  const saves = createSaveController({
    getState: () => stateModel.value,
    write: environment.write,
    onDirty: value => { dirty = value; },
    onStatus: (phase, error) => {
      const messages = { pending: 'تغييرات بانتظار الحفظ', saving: 'جارٍ الحفظ…',
        saved: environment.savedMessage, failed: environment.hosted ? error?.message || 'لم يكتمل الحفظ' : 'لم يكتمل الحفظ' };
      status(messages[phase]);
      if (phase === 'saved') $('#mh-error').hidden = true;
    },
    onError: error => { status(environment.hosted ? error.message || 'لم يكتمل الحفظ' : 'لم يكتمل الحفظ'); $('#mh-error').hidden = false; },
    beforeLeave: async () => {
      if (!environment.hosted) return;
      const frame = $('#mh-network-lab');
      const lab = frame?.contentWindow?.document.getElementById('madar-labs');
      if (lab?.flushSave) await lab.flushSave();
      syncLessonProgress(frame);
      if (window.MADAR_NOTES?.hasPending()) {
        await window.MADAR_NOTES.retry();
        if (window.MADAR_NOTES.hasPending()) throw Error('ملاحظتك لم تُحفظ بعد');
      }
    },
  });
  const persist = saves.persist;
  const scheduleSave = saves.scheduleSave;
  const guarded = saves.guard;

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
  /* hub:frame-support:start */
  /* hub:frame-support:end */
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

  function paintIcons(){globalThis.lucide?.createIcons({attrs:{width:19,height:19}});$$('button').forEach(b=>b.classList.add('cursor-interaction'));}
  function say(t){clearTimeout(toastTimer);$('#mh-toast').textContent=t;$('#mh-toast').hidden=false;toastTimer=setTimeout(()=>$('#mh-toast').hidden=true,4500);}
  function status(t){$('#mh-save').textContent=t;}


  /* hub:scene-support:start */
  /* hub:scene-support:end */
  const announcements = createAnnouncements({ courses, getUpdates: () => state.updates,
    canCourse, canLesson, lessonBy, $, $$, esc, icon, paintIcons,
    createLiquidOrbit, createNetworkNewsPlayer, vmOrbitTick: (t, stopped) => vmOrbitTick(t, stopped),
    motionReduced: () => motionPreference.matches, isHidden: () => document.hidden,
    requestFrame: callback => requestAnimationFrame(callback), cancelFrame: id => cancelAnimationFrame(id),
    render: () => render(), refreshSchedule: (done, scheduleRefreshFailed) => {
      if (!environment.hosted || adminStore) { done(); return; }
      fetch('/api/madar', { cache: 'no-store' }).then(r => { if (!r.ok) throw Error(); return r.json(); })
        .then(b => { boot.allowed=b.allowed; boot.canPractice=b.canPractice;
          state.access=b.config.access; state.updates=b.config.updates; done(); })
        .catch(() => scheduleRefreshFailed());
    } });
  const { scene, officeArt, networkArt, carouselMarkup, paintSlide, setPaused, moveSlide } = announcements;
  /* hub:course-support:start */
  /* hub:course-support:end */
  const courseViews = createCourseViews({ courses, lessons, profile, lessonBy, canLesson, esc, icon,
    carouselMarkup, officeArt, networkArt, osCourseArt: () => osCourseArt(), osHome: () => osHome(),
    networkReviewCard: () => networkReviewCard(), integrations: {
      ...(environment.hosted ? { courseSection: (id, section) => hostedCourseViews.courseSection(id, section),
        lessonPage: lesson => hostedCourseViews.lessonPage(lesson) } : {}) } });
  const { lessonPosition, resume, about, heading, courseCard, courseHome, lessonRows, courseSection, lessonPage } = courseViews;
  const hostedCourseViews = environment.hosted ? createHostedCourseAdapter() : null;
/* hub:editor-composition */
  const editor = createEditorController({ getState: () => state, lessonBy, saves, persist,
    now: () => Date.now(), today: nowDay });
  const editorViews = createEditorViews({ getState: () => state, getAccountFilter: () => accountFilter,
    courses, lessons, profile, available, canLesson, lessonBy, lessonPosition, heading, esc, icon, scene,
    hosted: environment.hosted, getGrants: () => config?.grants || {} });
  function account(){return editorViews.account();}
  function admin(){return editorViews.admin();}
  function readEditorFields() {
    const form = $('#mh-editor-form');
    if (!form) return;
    const fields = Object.fromEntries(['title','body','course','placement','status','date','start','end','duration','destination']
      .map(name => [name, form.elements.namedItem(name).value]));
    fields.pin = form.elements.namedItem('pin').checked;
    return fields;
  }

  const editorActions = createEditorActions({ editor, getDraft: () => stateModel.value.editor,
    readFields: readEditorFields, reportValidity: () => $('#mh-editor-form').reportValidity(), saves, render,
    showError: message => { $('#mh-editor-error').textContent = message; },
    notifySaved: () => say(environment.hosted ? 'تم حفظ المستجد.' : 'تم حفظ المستجد في المعاينة فقط.'),
    showPreview: paintEditorPreview,
    showDestinations: update => { $('#mh-editor-form [name=destination]').innerHTML = editorViews.targetOptions(update); },
    openDelete: () => $('#mh-confirm').showModal(), closeDelete: () => $('#mh-confirm').close() });
const hubViews = createHubViews({ courses, available, canCourse, canLesson, lessonBy,
    courseIcon, icon, srweAnnouncement, carouselMarkup, about, resume, heading, courseCard,
    account, admin, courseHome, courseSection, lessonPage,
    hosted: environment.hosted, isAdmin: environment.isAdmin });
  let celebrationObserver = null;
  function observeOfficeCelebration() {
    celebrationObserver?.disconnect();
    celebrationObserver = new IntersectionObserver(entries => entries.forEach(entry => entry.target.classList.toggle(entry.target.classList.contains('office') ? 'mh-celebration-active' : 'mh-network-active', entry.isIntersecting)));
    $$('.mh-course-card.office,.mh-course-card.network').forEach(card => celebrationObserver.observe(card));
  }
  /* hub:mount-adapter:start */
  const routeAdapter = { beforeReplace() {}, afterReplace() {}, dispose() {}, redirect: () => null };
  /* hub:mount-adapter:end */
  const viewLifecycle = createViewLifecycle({
    begin: () => {
      if (state.route === 'course:network:practical') {
        state.route = 'course:network:lessons';
        if (location.hash === '#course:network:practical') history.replaceState(null, '', '#' + state.route);
      }
      announcements.reset();
    },
    resolve: () => {
      const course = selectedCourse(), permitted = course && canCourse(course);
      root.style.setProperty('--mh-accent', courses[course]?.color || '#e9c691');
      root.dataset.course = course || 'global';
      $('#mh-home-link').setAttribute('aria-current', state.route === 'home' ? 'page' : 'false');
      $('#mh-picker-button').setAttribute('aria-current', state.route === 'courses' || permitted ? 'page' : 'false');
      const chrome = hubViews.chrome(state, course);
      $('#mh-picker').innerHTML = chrome.picker; $('#mh-subnav').innerHTML = chrome.subnav;
      const page = hubViews.page(state, course);
      return { ...page, course, redirect: page.redirect || routeAdapter.redirect(page.html) };
    },
    redirect: url => location.replace(url),
    beforeReplace: () => { disposeSrweAnnouncement(); routeAdapter.beforeReplace(); },
    replace: page => { $('#mh-main').innerHTML = page.html; },
    mount: page => {
      routeAdapter.afterReplace(page);
      observeOfficeCelebration(); $('#mh-viewer').value = state.viewer;
      paintSlide(); paintIcons(); mountSrweAnnouncement();
    },
    finish: () => announcements.start(),
    dispose: () => { announcements.dispose(); celebrationObserver?.disconnect();
      celebrationObserver = null; disposeSrweAnnouncement(); routeAdapter.dispose(); },
  });
  function render() { viewLifecycle.render(); }
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

  window.addEventListener('beforeunload',e=>{if(dirty){e.preventDefault();e.returnValue='';}});
  window.addEventListener('pagehide', event => {
    // A back/forward-cache page stays live; dispose only a document being discarded.
    if (!event.persisted) { viewLifecycle.dispose(); disposeHubEvents(); clearTimeout(toastTimer); }
  });
  if (!environment.hosted) window.addEventListener('openai:set_globals',e=>{const next=e.detail?.globals?.widgetState?.privateContent?.hub;if(next&&!dirty){state=stateModel.replace(next);render();}});
  motionPreference.addEventListener('change',e=>{if(e.matches)setPaused(true);});
  /* hub:startup:start */
  render();status(restored?'استُعيدت بيانات المعاينة':'');
  /* hub:startup:end */
  requestAnimationFrame(()=>{if(motionPreference.matches)setPaused(true);});
  // Read-only diagnostics for the local acceptance tests; never academic evidence.
  root.previewState=()=>clone(state);
})().catch(()=>{const main=document.getElementById('mh-main');main.innerHTML='<p role="alert">تعذر تحميل بيانات مدار. لم نستبدل الحفظ السابق.</p><button onclick="location.reload()">إعادة المحاولة</button>';});

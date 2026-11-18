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

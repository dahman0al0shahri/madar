const hubViews = createHubViews({ courses, available, canCourse, canLesson, lessonBy,
    courseIcon, icon, srweAnnouncement, carouselMarkup, about, resume, heading, courseCard,
    account, admin, courseHome, courseSection, lessonPage,
    hosted: environment.hosted, isAdmin: environment.isAdmin });
  function render(){if(state.route==='course:network:practical'){state.route='course:network:lessons';if(location.hash==='#course:network:practical')history.replaceState(null,'','#'+state.route);}cancelAnimationFrame(raf);if(!brandOrbit)brandOrbit=createLiquidOrbit($('.mh-brand .mh-orbit'));carousel=null;elapsed=0;lastFrame=0;const course=selectedCourse();root.style.setProperty('--mh-accent',courses[course]?.color||'#e9c691');root.dataset.course=course||'global';const permitted=course&&canCourse(course);$('#mh-home-link').setAttribute('aria-current',state.route==='home'?'page':'false');$('#mh-picker-button').setAttribute('aria-current',state.route==='courses'||permitted?'page':'false');const chrome=hubViews.chrome(state,course);$('#mh-picker').innerHTML=chrome.picker;$('#mh-subnav').innerHTML=chrome.subnav;
    const page = hubViews.page(state, course);
    if (page.redirect) { location.replace(page.redirect); return; }
    const html = page.html;
    disposeSrweAnnouncement();$('#mh-main').innerHTML=html;observeOfficeCelebration();$('#mh-viewer').value=state.viewer;paintSlide();paintIcons();mountSrweAnnouncement();raf=requestAnimationFrame(tick);
  }
  
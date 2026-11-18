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

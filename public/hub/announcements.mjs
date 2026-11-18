// Announcement presentation and its owned animation resources. Browser adapters are explicit.
export function nowDay(){return new Intl.DateTimeFormat('en-CA',{timeZone:'Asia/Riyadh',year:'numeric',month:'2-digit',day:'2-digit'}).format(new Date());}

export function createAnnouncements({ courses, getUpdates, canCourse, canLesson, lessonBy,
  $, $$, esc, icon, paintIcons, createLiquidOrbit, createNetworkNewsPlayer,
  vmOrbitTick, motionReduced, isHidden, requestFrame, cancelFrame, render,
  refreshSchedule = done => done(), day = nowDay }) {
  const nowDay = day;
  let scheduleDay = nowDay(), carousel = null, raf = null, lastFrame = 0, elapsed = 0;
  let paused = motionReduced(), slideIndex = 0, disposed = false;
  function eligible(u,scope){const day=nowDay();return u.status==='published'&&(!u.course||canCourse(u.course))&&(!u.target.startsWith('lesson:')||canLesson(lessonBy(u.target.split(':')[1])))&&(!u.start||u.start<=day)&&(!u.end||u.end>=day)&&(scope?u.course===scope&&u.places.includes('course'):u.places.includes('global'));}
  function news(scope){return getUpdates().filter(u=>eligible(u,scope)).sort((a,b)=>Number(b.pin)-Number(a.pin)||b.date.localeCompare(a.date));}
function officeArt(){return `<div class="mh-office-scene" aria-hidden="true"><div class="mh-file" style="--i:0"><b>W</b><span class="mh-file-lines"></span></div><div class="mh-file" style="--i:1"><b>X</b><span class="mh-file-grid"></span></div><div class="mh-file" style="--i:2"><b>A</b><span class="mh-file-db"></span></div></div>`;}
  function networkArt(){const paths=['M0 100L72 42L200 90','M200 90L320 30L400 80','M0 170L80 138L200 90','M200 90L320 145L400 170','M200 0V90','M200 90L210 180'];return `<div class="mh-network-map" aria-hidden="true"><svg viewBox="0 0 400 180"><path class="mh-network-wire" d="M0 100L72 42L200 90L320 30L400 80M0 170L80 138L200 90L320 145L400 170M72 42L80 138M320 30L320 145M200 0V90L210 180"/>${paths.map((d,i)=>`<path class="mh-network-flow mh-network-trail" pathLength="100" d="${d}" style="--flow-delay:${-i*.8}s;--flow-duration:${4+i%3}s"/><path class="mh-network-flow mh-network-signal" pathLength="100" d="${d}" style="--flow-delay:${-i*.8}s;--flow-duration:${4+i%3}s"/>`).join('')}${[[72,42],[80,138],[320,30],[320,145],[210,180]].map(([x,y],i)=>`<circle class="mh-network-node-halo" cx="${x}" cy="${y}" r="10" style="--node-delay:${-i*.8}s"/><circle class="mh-network-node" cx="${x}" cy="${y}" r="3.3" style="--node-delay:${-i*.8}s"/>`).join('')}</svg></div><div class="mh-network-center" aria-hidden="true"><span>${icon('cloud')}<i class="mh-network-leds"><b></b><b></b><b></b></i></span></div>`;}
  let liquidOrbit=null,brandOrbit=null,networkNewsPlayer=null;
  function scene(u){if(u.scene==='office')return officeArt();if(u.scene==='network')return '<iframe class="mh-network-showcase" src="/network-news.html" title="مشهد تفاعلي لتوصيل Router وSwitch — تكبير وسحب"></iframe>';return `<div class="mh-main-mark" aria-hidden="true"><div class="mh-orbit-core"></div><span>مدار</span><div class="mh-liquid-bubble"><canvas></canvas></div></div>`;}
  function carouselMarkup(scope){const items=news(scope);if(!items.length)return `<div class="mh-empty">لا توجد مستجدات متاحة الآن.</div>`;carousel={items,scope};slideIndex=Math.min(slideIndex,items.length-1);return `<section class="mh-carousel" aria-label="${scope?'آخر مستجدات '+courses[scope].name:'آخر مستجدات مدار'}" aria-roledescription="عارض مستجدات"><div class="mh-section-head"><h2>${scope?'آخر مستجدات '+courses[scope].name:'آخر مستجدات مدار'}</h2><span class="mh-eyebrow">${scope?'داخل المقرر':'في مدار'}</span></div><div class="mh-news-control" style="margin-bottom:12px"><button id="mh-pause" class="mh-pause">${icon(paused?'play':'pause')}<span>${paused?'تشغيل العرض':'إيقاف العرض'}</span></button><span class="mh-kicker">${items.length} مستجدات</span></div><div class="mh-news-shell"><div id="mh-slide" aria-live="${paused?'polite':'off'}"></div><div class="mh-timing" aria-hidden="true"><span id="mh-progress"></span></div></div><div class="mh-news-control"><button id="mh-prev" class="mh-icon" aria-label="المستجد السابق">${icon('arrow-right')}</button><button id="mh-next" class="mh-icon" aria-label="المستجد التالي">${icon('arrow-left')}</button><div class="mh-dots">${items.map((u,i)=>`<button data-slide="${i}" aria-label="عرض: ${esc(u.title)}" aria-pressed="${i===slideIndex}"></button>`).join('')}</div><span id="mh-slide-num" class="mh-slide-num"></span><button id="mh-replay" class="mh-pause">${icon('rotate-ccw')}إعادة المشهد</button></div></section>`;}
  function paintSlide(){networkNewsPlayer?.dispose();networkNewsPlayer=null;liquidOrbit?.dispose();liquidOrbit=null;if(!carousel||!$('#mh-slide'))return;const u=carousel.items[slideIndex];const accent=u.course?courses[u.course].color:'#e9c691';$('#mh-slide').innerHTML=`<article class="mh-news-slide" role="group" aria-roledescription="بطاقة" aria-label="${slideIndex+1} من ${carousel.items.length}" style="--slide-accent:${accent}"><div class="mh-news-copy"><div class="mh-news-meta"><span>${u.course?courses[u.course].name:'مدار'}</span><time datetime="${esc(u.date)}">${new Intl.DateTimeFormat('ar-SA',{calendar:'gregory',day:'numeric',month:'long'}).format(new Date(u.date+'T12:00:00+03:00'))}</time>${u.pin?'<span>مثبّت</span>':''}</div><h2>${esc(u.title)}</h2><p>${esc(u.body)}</p><div class="mh-actions"><button class="mh-primary" data-go="${esc(u.target)}">${u.course?'اكتشف التحديث':'استعرض المقررات'} ${icon('arrow-left')}</button></div></div><${u.scene==='network'?'div':'button'} class="mh-visual ${paused?'mh-scene-paused':''}" id="mh-scene" aria-label="${u.scene==='network'?'مشهد الأجهزة التفاعلي':'إيقاف المشهد أو تشغيله'}">${scene(u)}</${u.scene==='network'?'div':'button'}></article>`;$('#mh-slide-num').textContent=`${slideIndex+1} / ${carousel.items.length}`;$('#mh-prev').disabled=carousel.items.length<2;$('#mh-next').disabled=carousel.items.length<2;$$('[data-slide]').forEach(b=>b.setAttribute('aria-pressed',Number(b.dataset.slide)===slideIndex));elapsed=0;lastFrame=0;paintIcons();const mark=$('.mh-main-mark');if(mark)liquidOrbit=createLiquidOrbit(mark);networkNewsPlayer=createNetworkNewsPlayer($('#mh-scene .mh-network-showcase'));}
  function setPaused(p){paused=p;networkNewsPlayer?.sync();if(!carousel)return;$('#mh-pause').innerHTML=`${icon(p?'play':'pause')}<span>${p?'تشغيل العرض':'إيقاف العرض'}</span>`;$('#mh-slide').setAttribute('aria-live',p?'polite':'off');$('#mh-scene')?.classList.toggle('mh-scene-paused',p);paintIcons();lastFrame=0;}
  let lastScheduleCheck=0;
  function tick(time) {
    if (disposed) return;
    raf = null;
    const stopped = paused || motionReduced();
    vmOrbitTick(time, stopped);
    brandOrbit?.tick(time, stopped);
    liquidOrbit?.tick(time, stopped);
    if (carousel && time - lastScheduleCheck > 1000) {
      lastScheduleCheck = time;
      const currentDay = nowDay();
      if (currentDay !== scheduleDay) {
        scheduleDay = currentDay;
        refreshSchedule(() => render(), () => { scheduleDay = ''; });
        return;
      }
    }
    if (carousel && $('#mh-progress')) {
      if (!paused && !isHidden()) {
        if (lastFrame) elapsed += Math.min(time - lastFrame, 100);
        const item = carousel.items[slideIndex];
        const duration = Math.max(item.scene === 'network' ? 18 : 8, Number(item.duration) || 12)
          * 1000 * (item.scene === 'hub' ? 2 : 1);
        $('#mh-progress').style.width = Math.min(100, elapsed / duration * 100) + '%';
        if (elapsed >= duration && carousel.items.length > 1) {
          slideIndex = (slideIndex + 1) % carousel.items.length;
          paintSlide();
        }
      }
      lastFrame = time;
    }
    raf = requestFrame(tick);
  }

  function moveSlide(value) {
    if (!carousel) return;
    slideIndex = typeof value === 'number' ? value : (slideIndex + (value === 'next' ? 1 : -1) + carousel.items.length) % carousel.items.length;
    paintSlide();
  }
  function stopFrame() {
    if (raf !== null) cancelFrame(raf);
    raf = null;
  }
  function reset() {
    stopFrame();
    if (!brandOrbit) brandOrbit = createLiquidOrbit($('.mh-brand .mh-orbit'));
    carousel = null; elapsed = 0; lastFrame = 0;
  }
  function start() {
    stopFrame();
    if (!disposed) raf = requestFrame(tick);
  }
  function paintPreview() {
    liquidOrbit?.dispose(); liquidOrbit = null;
    const mark = $('#mh-update-preview .mh-main-mark');
    if (mark) liquidOrbit = createLiquidOrbit(mark);
    networkNewsPlayer?.dispose();
    networkNewsPlayer = createNetworkNewsPlayer($('#mh-update-preview .mh-network-showcase'));
  }
  function dispose() {
    if (disposed) return;
    disposed = true; stopFrame();
    networkNewsPlayer?.dispose(); liquidOrbit?.dispose(); brandOrbit?.dispose();
    networkNewsPlayer = liquidOrbit = brandOrbit = null;
    carousel = null;
  }
  return { scene, officeArt, networkArt, carouselMarkup, paintSlide, setPaused, moveSlide,
    reset, start, paintPreview, dispose, isPaused: () => paused };
}

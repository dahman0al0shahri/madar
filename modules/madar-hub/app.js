(async () => {
  const { createHubState, createSaveController, createNavigation, routeFromHash,
    createPreviewEnvironment, createHostedEnvironment, createEditorController, createEditorViews,
    createHubViews, createSearchController, searchText, bindHubEvents, createLessonActions, createAccessActions } = await import('/hub/index.mjs');
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
  const lessons=[
    {id:'word-compare',course:'office',section:'word',title:'مقارنة المستندات ودمجها',kind:'درس',intro:'تعرّف الفروق بين نسختين من المستند، ثم راجع التغييرات قبل دمجها.',steps:['التعرّف على نسخ المستند','مقارنة التغييرات','مراجعة النتيجة']},
    {id:'excel-functions',course:'office',section:'excel',title:'استخدام الدالتين Average وCountIF',kind:'درس',intro:'تعرّف حساب المتوسط وعدّ الخلايا التي تحقق شرطًا في جدول البيانات.',steps:['قراءة بيانات الجدول','اختيار الدالة المناسبة','مراجعة النتيجة']},
    {id:'access-fields',course:'office',section:'access',title:'خصائص الحقول',kind:'تدريب',intro:'تعرّف أثر خصائص الحقل في البيانات التي يمكن إدخالها.',steps:['تحديد الحقل','إعداد قاعدة التحقق','فحص البيانات']},
    {id:'net-vlan',course:'network',section:'practical',title:'إعداد VLAN على Switch',kind:'مختبر',intro:'VLAN شبكة محلية افتراضية تفصل الأجهزة منطقيًا. جهّز مجموعات الشبكة واربط المنافذ بالمجموعة المطلوبة.',steps:['قراءة متطلبات الشبكة','إنشاء VLAN','التحقق باستخدام Show']},
    {id:'net-trunk',course:'network',section:'practical',title:'إعداد Trunk',kind:'مختبر',intro:'Trunk وصلة تسمح بمرور أكثر من VLAN بين أجهزة الشبكة.',steps:['تحديد الوصلة','إعداد المنافذ','التحقق من الإعداد']},
    {id:'net-inter',course:'network',section:'practical',title:'التطبيق العملي لـ Inter-VLAN',kind:'مختبر',intro:'Inter-VLAN هو الاتصال بين الشبكات المحلية الافتراضية باستخدام Router أو جهاز يدعم التوجيه.',steps:['قراءة متطلبات الاتصال','إعداد واجهات Router','التحقق من الوصول']}
  ];
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
  let scheduleDay = nowDay();
  let carousel = null, raf = 0, lastFrame = 0, elapsed = 0, paused = reduced;
  let slideIndex = 0, keyboard = false, toastTimer, deleteId = null, accountFilter = 'all';
  
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

function nowDay(){return new Intl.DateTimeFormat('en-CA',{timeZone:'Asia/Riyadh',year:'numeric',month:'2-digit',day:'2-digit'}).format(new Date());}
  function eligible(u,scope){const day=nowDay();return u.status==='published'&&(!u.course||canCourse(u.course))&&(!u.target.startsWith('lesson:')||canLesson(lessonBy(u.target.split(':')[1])))&&(!u.start||u.start<=day)&&(!u.end||u.end>=day)&&(scope?u.course===scope&&u.places.includes('course'):u.places.includes('global'));}
  function news(scope){return state.updates.filter(u=>eligible(u,scope)).sort((a,b)=>Number(b.pin)-Number(a.pin)||b.date.localeCompare(a.date));}
  function paintIcons(){globalThis.lucide?.createIcons({attrs:{width:19,height:19}});$$('button').forEach(b=>b.classList.add('cursor-interaction'));}
  function say(t){clearTimeout(toastTimer);$('#mh-toast').textContent=t;$('#mh-toast').hidden=false;toastTimer=setTimeout(()=>$('#mh-toast').hidden=true,4500);}
  function status(t){$('#mh-save').textContent=t;}

function officeArt(){return `<div class="mh-office-scene" aria-hidden="true"><div class="mh-file" style="--i:0"><b>W</b><span class="mh-file-lines"></span></div><div class="mh-file" style="--i:1"><b>X</b><span class="mh-file-grid"></span></div><div class="mh-file" style="--i:2"><b>A</b><span class="mh-file-db"></span></div></div>`;}
  function networkArt(){const paths=['M0 100L72 42L200 90','M200 90L320 30L400 80','M0 170L80 138L200 90','M200 90L320 145L400 170','M200 0V90','M200 90L210 180'];return `<div class="mh-network-map" aria-hidden="true"><svg viewBox="0 0 400 180"><path class="mh-network-wire" d="M0 100L72 42L200 90L320 30L400 80M0 170L80 138L200 90L320 145L400 170M72 42L80 138M320 30L320 145M200 0V90L210 180"/>${paths.map((d,i)=>`<path class="mh-network-flow mh-network-trail" pathLength="100" d="${d}" style="--flow-delay:${-i*.8}s;--flow-duration:${4+i%3}s"/><path class="mh-network-flow mh-network-signal" pathLength="100" d="${d}" style="--flow-delay:${-i*.8}s;--flow-duration:${4+i%3}s"/>`).join('')}${[[72,42],[80,138],[320,30],[320,145],[210,180]].map(([x,y],i)=>`<circle class="mh-network-node-halo" cx="${x}" cy="${y}" r="10" style="--node-delay:${-i*.8}s"/><circle class="mh-network-node" cx="${x}" cy="${y}" r="3.3" style="--node-delay:${-i*.8}s"/>`).join('')}</svg></div><div class="mh-network-center" aria-hidden="true"><span>${icon('cloud')}<i class="mh-network-leds"><b></b><b></b><b></b></i></span></div>`;}
  let liquidOrbit=null,brandOrbit=null,networkNewsPlayer=null;
  function scene(u){if(u.scene==='office')return officeArt();if(u.scene==='network')return '<iframe class="mh-network-showcase" src="/network-news.html" title="مشهد تفاعلي لتوصيل Router وSwitch — تكبير وسحب"></iframe>';return `<div class="mh-main-mark" aria-hidden="true"><div class="mh-orbit-core"></div><span>مدار</span><div class="mh-liquid-bubble"><canvas></canvas></div></div>`;}
  function carouselMarkup(scope){const items=news(scope);if(!items.length)return `<div class="mh-empty">لا توجد مستجدات متاحة الآن.</div>`;carousel={items,scope};slideIndex=Math.min(slideIndex,items.length-1);return `<section class="mh-carousel" aria-label="${scope?'آخر مستجدات '+courses[scope].name:'آخر مستجدات مدار'}" aria-roledescription="عارض مستجدات"><div class="mh-section-head"><h2>${scope?'آخر مستجدات '+courses[scope].name:'آخر مستجدات مدار'}</h2><span class="mh-eyebrow">${scope?'داخل المقرر':'في مدار'}</span></div><div class="mh-news-control" style="margin-bottom:12px"><button id="mh-pause" class="mh-pause">${icon(paused?'play':'pause')}<span>${paused?'تشغيل العرض':'إيقاف العرض'}</span></button><span class="mh-kicker">${items.length} مستجدات</span></div><div class="mh-news-shell"><div id="mh-slide" aria-live="${paused?'polite':'off'}"></div><div class="mh-timing" aria-hidden="true"><span id="mh-progress"></span></div></div><div class="mh-news-control"><button id="mh-prev" class="mh-icon" aria-label="المستجد السابق">${icon('arrow-right')}</button><button id="mh-next" class="mh-icon" aria-label="المستجد التالي">${icon('arrow-left')}</button><div class="mh-dots">${items.map((u,i)=>`<button data-slide="${i}" aria-label="عرض: ${esc(u.title)}" aria-pressed="${i===slideIndex}"></button>`).join('')}</div><span id="mh-slide-num" class="mh-slide-num"></span><button id="mh-replay" class="mh-pause">${icon('rotate-ccw')}إعادة المشهد</button></div></section>`;}
  function paintSlide(){networkNewsPlayer?.dispose();networkNewsPlayer=null;liquidOrbit?.dispose();liquidOrbit=null;if(!carousel||!$('#mh-slide'))return;const u=carousel.items[slideIndex];const accent=u.course?courses[u.course].color:'#e9c691';$('#mh-slide').innerHTML=`<article class="mh-news-slide" role="group" aria-roledescription="بطاقة" aria-label="${slideIndex+1} من ${carousel.items.length}" style="--slide-accent:${accent}"><div class="mh-news-copy"><div class="mh-news-meta"><span>${u.course?courses[u.course].name:'مدار'}</span><time datetime="${esc(u.date)}">${new Intl.DateTimeFormat('ar-SA',{calendar:'gregory',day:'numeric',month:'long'}).format(new Date(u.date+'T12:00:00+03:00'))}</time>${u.pin?'<span>مثبّت</span>':''}</div><h2>${esc(u.title)}</h2><p>${esc(u.body)}</p><div class="mh-actions"><button class="mh-primary" data-go="${esc(u.target)}">${u.course?'اكتشف التحديث':'استعرض المقررات'} ${icon('arrow-left')}</button></div></div><${u.scene==='network'?'div':'button'} class="mh-visual ${paused?'mh-scene-paused':''}" id="mh-scene" aria-label="${u.scene==='network'?'مشهد الأجهزة التفاعلي':'إيقاف المشهد أو تشغيله'}">${scene(u)}</${u.scene==='network'?'div':'button'}></article>`;$('#mh-slide-num').textContent=`${slideIndex+1} / ${carousel.items.length}`;$('#mh-prev').disabled=carousel.items.length<2;$('#mh-next').disabled=carousel.items.length<2;$$('[data-slide]').forEach(b=>b.setAttribute('aria-pressed',Number(b.dataset.slide)===slideIndex));elapsed=0;lastFrame=0;paintIcons();const mark=$('.mh-main-mark');if(mark)liquidOrbit=createLiquidOrbit(mark);networkNewsPlayer=createNetworkNewsPlayer($('#mh-scene .mh-network-showcase'));}
  function setPaused(p){paused=p;networkNewsPlayer?.sync();if(!carousel)return;$('#mh-pause').innerHTML=`${icon(p?'play':'pause')}<span>${p?'تشغيل العرض':'إيقاف العرض'}</span>`;$('#mh-slide').setAttribute('aria-live',p?'polite':'off');$('#mh-scene')?.classList.toggle('mh-scene-paused',p);paintIcons();lastFrame=0;}
  let lastScheduleCheck=0;
  function tick(t){vmOrbitTick(t,paused||motionPreference.matches);brandOrbit?.tick(t,paused||motionPreference.matches);liquidOrbit?.tick(t,paused||motionPreference.matches);if(carousel&&t-lastScheduleCheck>1000){lastScheduleCheck=t;const day=nowDay();if(day!==scheduleDay){scheduleDay=day;render();return;}}if(carousel&&$('#mh-progress')){if(!paused&&!document.hidden){if(lastFrame)elapsed+=Math.min(t-lastFrame,100);const duration=Math.max(carousel.items[slideIndex].scene==='network'?18:8,Number(carousel.items[slideIndex].duration)||12)*1000*(carousel.items[slideIndex].scene==='hub'?2:1);$('#mh-progress').style.width=Math.min(100,elapsed/duration*100)+'%';if(elapsed>=duration&&carousel.items.length>1){slideIndex=(slideIndex+1)%carousel.items.length;paintSlide();}}lastFrame=t;}raf=requestAnimationFrame(tick);}
  function lessonPosition(l,v){return v?.labStep?(v.completed?'اكتمل تطبيق الدرس؛ يمكنك مراجعته':'الخطوة '+(v.step+1)+' من '+v.stepTotal+' · '+v.stepTitle):(l.steps[v?.step||0]||'افتح الدرس للمتابعة');}
  function resume(course){const id=course||profile().latest,v=profile().visits[id],l=lessonBy(v?.lesson);if(!canLesson(l))return '';return `<section class="mh-resume"><div class="mh-resume-copy"><span class="mh-eyebrow">كمّل من وين وقفت</span><h3>${esc(l.title)}</h3><p>${courses[id].name} · ${esc(lessonPosition(l,v))}</p></div><button class="mh-primary" data-go="lesson:${l.id}">متابعة ${icon('arrow-left')}</button></section>`;}
  function about(){return `<section class="mh-about"><span class="mh-eyebrow">عن مدار</span><div class="mh-about-intro"><h2>تعلّم بفهم.<br>وتقدّم باستقلال.</h2><p>مدار منصة تعليمية تجمع مقرراتك في مكان واحد، وتربط الشرح بالتطبيق والمراجعة، وتقدّم التدريب والإرشاد والمساعدة اللازمة؛ لتتعلّم بفهم وتتقدّم نحو التطبيق باستقلال.</p></div><div class="mh-beliefs"><article class="mh-belief"><div class="mh-belief-title">${icon('telescope')}<h3>رؤيتنا</h3></div><p>أن يكون مدار بيئة تعليمية متكاملة، تساعد الطالب على فهم مقرراته، وتنمية مهاراته، والاستعداد لاختباراته، وتربط تعلّمه بمتطلبات سوق العمل؛ ليبني كفاءة عملية تدعم دخوله إلى المجال المهني وتطوّره فيه بثقة.</p></article><article class="mh-belief"><div class="mh-belief-title">${icon('compass')}<h3>رسالتنا</h3></div><p>نقدّم تجربة تعليمية تجمع المحتوى الواضح، والتدريب العملي، والإرشاد والمساعدة اللازمة، والمراجعة التي تكشف ما يحتاج إلى تقوية؛ لنساعد الطالب على فهم ما يتعلّمه، وتطبيقه باستقلال، وبناء مهارات ترتبط باحتياجاته الدراسية ومتطلبات سوق العمل.</p></article></div></section>`;}
  function heading(title,kicker=''){return `<div class="mh-page-heading"><div>${kicker?`<div class="mh-kicker">${esc(kicker)}</div>`:''}<h1>${esc(title)}</h1></div></div>`;}
  let celebrationObserver=null;
  function officeCelebration(){return '<div class="mh-office-celebration" aria-hidden="true">'+Array.from({length:27},(_,i)=>`<i style="--x:${4+(i*29)%92}%;--y:${8+(i*37)%78}%;--size:${3+i%3}px;--party-color:${['#83bdff','#70d9b1','#f195bb'][i%3]};--duration:${6+i%5}s;--delay:-${i*.71}s;--turn:${i*43}deg;--drift:${i%2?12:-12}px"></i>`).join('')+'<span class="mh-celebration-ribbon"></span><span class="mh-celebration-ribbon"></span></div>';}
  function observeOfficeCelebration(){celebrationObserver?.disconnect();celebrationObserver=new IntersectionObserver(entries=>entries.forEach(entry=>entry.target.classList.toggle(entry.target.classList.contains('office')?'mh-celebration-active':'mh-network-active',entry.isIntersecting)));$$('.mh-course-card.office,.mh-course-card.network').forEach(card=>celebrationObserver.observe(card));}
  function courseCard(id){const c=courses[id],v=profile().visits[id],l=lessonBy(v?.lesson);return `<article class="mh-course-card ${id}" style="--mh-accent:${c.color}"><div class="mh-course-art">${id==='os1'?osCourseArt():id==='office'?officeCelebration()+officeArt():networkArt()}</div><div class="mh-course-body"><div class="mh-course-tags">${c.tags.map(t=>`<span>${t}</span>`).join('')}${id==='office'?`<span class="mh-course-badge mh-featured-badge">${icon('star')}<b>مميز</b></span><span class="mh-course-badge mh-origin-badge">${icon('party-popper')}<b>بداية مدار</b></span>`:''}</div><h2>${c.name}</h2><p>${c.description}</p>${canLesson(l)?`<div class="mh-last">آخر وصول: ${esc(l.title)}</div>`:''}<div class="mh-actions"><button class="mh-primary" data-go="course:${id}:home">دخول المقرر ${icon('arrow-left')}</button></div></div></article>`;}
  function courseHome(id){if(id==='os1')return osHome();const c=courses[id];return `${carouselMarkup(id)}<div class="mh-course-cover"><span class="mh-eyebrow">مساحتك للتعلّم</span><h1>${c.name}</h1><p>${c.description}</p></div>${resume(id)}${id==='network'?networkReviewCard():''}<div class="mh-section-links">${(id==='office'?[['word','Word','شرح المستندات وتحريرها ومراجعتها.','file-text'],['excel','Excel','الجداول والدوال وتحليل البيانات.','table-2'],['access','Access','قواعد البيانات والحقول والاستعلامات.','database']]:[['theory','الجزء النظري','افهم الفكرة، تابع الأمثلة، وارجع للمصطلحات من داخل الدرس.','book-open'],['lessons','الجزء العملي','افتح درسًا داخل المحاكي، أو تدرّب في مختبر جاهز أو تبويب حر.','network'],['reference','المرجع','ارجع للمفهوم والدرس من مكان واحد.','library']]).map(([s,t,p,i])=>`<article class="mh-section-link">${icon(i)}<h3>${t}</h3><p>${p}</p><button data-go="course:${id}:${s}">دخول ${icon('arrow-left')}</button></article>`).join('')}</div>`;}
  function lessonRows(list){return `<div class="mh-list">${list.map(l=>`<article class="mh-list-row">${icon(l.kind==='مختبر'?'network':'book-open')}<div><span class="mh-kicker">${l.kind} · ${courses[l.course].name}</span><h3>${esc(l.title)}</h3></div><button data-go="lesson:${l.id}">فتح ${icon('arrow-left')}</button></article>`).join('')}</div>`;}
  function courseSection(id,section){const c=courses[id],title=c.sections.find(x=>x[0]===section)?.[1]||'الدروس';if(section==='quiz')return `${heading('اختبر نفسك',c.name)}<div class="mh-empty"><h3>مكان الاختبارات داخل المقرر</h3><p>هذه المعاينة تختبر تنظيم الصفحات والتنقّل. بنك الأسئلة ونتائج الاختبارات يبقيان ضمن مقرر ${c.name} عند الربط.</p><button data-go="course:${id}:home">العودة لرئيسية المقرر</button></div>`;const list=lessons.filter(l=>l.course===id&&canLesson(l)&&(id==='network'||section==='reference'||l.section===section));return `${heading(title,c.name)}${lessonRows(list)}<p class="mh-footnote">عينة لتنقّل المعاينة؛ ليست قائمة المنهج كاملة.</p>`;}
  function lessonPage(l){const v=profile().visits[l.course]||{step:0},step=Math.min(2,v.step||0);return `${heading(l.title,courses[l.course].name+' / '+l.kind)}<div class="mh-learning-layout"><section class="mh-lesson"><span class="mh-eyebrow">مساحة الدرس</span><h2>${esc(l.steps[step])}</h2><p>${esc(l.intro)}</p><div class="mh-step" aria-label="الموضع داخل الدرس">${l.steps.map((_,i)=>`<span class="${i===step?'mh-step-current':''}">${i+1}</span>`).join('')}</div><div class="mh-actions"><button data-step="${step-1}" ${step===0?'disabled':''}>السابق</button><button data-step="${step+1}" ${step===2?'disabled':''} class="mh-primary">التالي ${icon('arrow-left')}</button></div><p class="mh-footnote">لتجربة حفظ موضعك: انتقل بين الخطوات واكتب ملاحظة، ثم غيّر المقرر وارجع إليه. هذا ليس تشغيلًا للمختبر أو تقييمًا لتعلّمك.</p></section><aside class="mh-note-box"><label for="mh-note">ملاحظتي في هذا الدرس<textarea id="mh-note" placeholder="اكتب ملاحظتك…">${esc(profile().notes[l.id]||'')}</textarea></label><p class="mh-footnote">تُحفظ تلقائيًا مع هذا الدرس.</p></aside></div>`;}
  /* hub:editor-composition */
  const editor = createEditorController({ getState: () => state, lessonBy, saves, persist,
    now: () => Date.now(), today: nowDay });
  const editorViews = createEditorViews({ getState: () => state, getAccountFilter: () => accountFilter,
    courses, lessons, profile, available, canLesson, lessonBy, lessonPosition, heading, esc, icon,
    hosted: environment.hosted, getGrants: () => config?.grants || {} });
  function account(){return editorViews.account();}
  function admin(){return editorViews.admin();}
  const targetOptions = editorViews.targetOptions;
  function captureEditor() {
    const form = $('#mh-editor-form');
    if (!form) return;
    const fields = Object.fromEntries(['title','body','course','placement','status','date','start','end','duration','destination']
      .map(name => [name, form.elements.namedItem(name).value]));
    fields.pin = form.elements.namedItem('pin').checked;
    editor.capture(fields);
  }

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
  const lessonActions = createLessonActions({ getState: () => stateModel.value, profile, lessonBy, saves,
    notes: { hasPending: () => Boolean(window.MADAR_NOTES?.hasPending()),
      retry: () => window.MADAR_NOTES.retry() }, render, warn: say,
    focusTopic: () => { $('#nt-topic-title')?.focus({ preventScroll: true }); $('#nt-topic-title')?.scrollIntoView({ block: 'start' }); } });
  const accessActions = createAccessActions({ getState: () => stateModel.value,
    getGrants: () => config.grants, hosted: environment.hosted, saves, render,
    resetAccountFilter: () => { accountFilter = 'all'; },
    syncViewer: value => { $('#mh-viewer').value = value; } });
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
      lessonActions.captureNote(target.value);
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
      await accessActions.switchViewer(target.value);
    }
    if (target.id === 'mh-search-scope') search();
    if (environment.hosted && target.dataset.grant) {
      accessActions.setGrants(target.dataset.grant, target.value);
    }
    if (target.dataset.courseAccess) accessActions.setCourseAccess(target.dataset.courseAccess, target.value);
    if (target.dataset.contentAccess) accessActions.setContentAccess(target.dataset.contentAccess, target.value);
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
      slide: value => moveSlide(Number(value)), step: lessonActions.moveStep,
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

async function saveEditor() {
    if (!$('#mh-editor-form').reportValidity()) return;
    captureEditor();
    try {
      const result = await editor.save();
      if (!result.saved) { $('#mh-editor-error').textContent = result.error; return; }
      say(environment.hosted ? 'تم حفظ المستجد.' : 'تم حفظ المستجد في المعاينة فقط.');
      render();
    } catch { /* The save controller exposes retry without discarding the draft. */ }
  }
  window.addEventListener('beforeunload',e=>{if(dirty){e.preventDefault();e.returnValue='';}});
  window.addEventListener('openai:set_globals',e=>{const next=e.detail?.globals?.widgetState?.privateContent?.hub;if(next&&!dirty){state=stateModel.replace(next);render();}});
  motionPreference.addEventListener('change',e=>{if(e.matches)setPaused(true);});
  render();status(restored?'استُعيدت بيانات المعاينة':'');
  requestAnimationFrame(()=>{if(motionPreference.matches)setPaused(true);});
  // Read-only diagnostics for the local acceptance tests; never academic evidence.
  root.previewState=()=>clone(state);
})();

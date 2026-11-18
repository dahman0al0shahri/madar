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

const initial={version:1,route:'home',viewer:'student',access:{office:'public',network:'public'},contentAccess:{},profiles:{student:{visits:{},notes:{},latest:null},guest:{visits:{},notes:{},latest:null}},editor:null,updates:[
    {id:'hub',title:'مدار يجمع رحلتك',body:'مقرراتك في مكان واحد. ادخل إلى مساحة كل مقرر، وارجع إلى تعلّمك من المكان اللي وقفت عنده.',course:'',target:'courses',places:['global'],status:'published',pin:true,date:'2026-10-15',start:'',end:'',duration:12,scene:'hub'},
    {id:'network',title:'مساحة للشبكات. وفهم أقرب للتطبيق.',body:'دروس وتدريب عملي يجمعان الفكرة وتنفيذها، مع إرشاد يساعدك عند الحاجة.',course:'network',target:'course:network:lessons',places:['global','course'],status:'published',pin:false,date:'2026-10-15',start:'',end:'',duration:14,scene:'network'},
    {id:'office',title:'مذاكرتك صارت مترابطة',body:'تنتقل بين Word وExcel وAccess، وتجمع الشرح والتطبيق والمراجعة داخل مقرر واحد.',course:'office',target:'course:office:home',places:['global','course'],status:'published',pin:false,date:'2026-10-15',start:'',end:'',duration:12,scene:'office'}
  ]};

  const environment = await createHostedEnvironment({
  initial,
  fetchBoot: () => fetch('/api/madar', { cache: 'no-store' }),
  openStore: (...args) => MadarStore.open(...args),
  hash: location.hash,
  readLocalNote: id => JSON.parse(localStorage.getItem('madar-notes-v1:guest:' + id) || 'null'),
});
const lessons = environment.boot.lessons;
window.MADAR_ACCOUNT = { ...environment.boot.account, available: true };

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
  // A frame load event is not proof that the lab restored and opened its lesson.
// Keep startup visible, fetch the document explicitly, and never reload a
// running lab (which may contain unsaved work).
let disposeNetworkFrame=()=>{};
function mountNetworkFrame(){
 disposeNetworkFrame();
 const frame=$('#mh-network-lab');if(!frame)return;
 const url=new URL(frame.getAttribute('data-network-src')||frame.getAttribute('src'),location.origin);
 if(url.origin!==location.origin||url.pathname!=='/network-lab')return;
 const panel=document.createElement('div');panel.className='mh-lab-loading';panel.setAttribute('role','status');panel.setAttribute('aria-live','polite');
 const text=document.createElement('span');text.textContent='جارٍ فتح الدرس واستعادة مختبراتك…';
 const retry=document.createElement('button');retry.type='button';retry.textContent='إعادة المحاولة';retry.hidden=true;
 const direct=document.createElement('a');direct.href=url.pathname+url.search;direct.textContent='فتح المحاكي في صفحة كاملة';
 panel.append(text,retry,direct);frame.before(panel);frame.setAttribute('aria-busy','true');
 let timer=0,started=Date.now(),disposed=false,request=null,documentUrl=null;
 const inspect=()=>{try{const doc=frame.contentDocument;return {blank:!doc||doc.URL==='about:blank',phase:doc?.documentElement.dataset.networkBoot,hasLab:!!doc?.getElementById('madar-labs')};}catch{return {blank:false,phase:'error',hasLab:false};}};
 function finish(){clearTimeout(timer);panel.remove();frame.removeAttribute('aria-busy');frame.dataset.loadState='ready';}
 function check(){
  clearTimeout(timer);
  if(disposed||!frame.isConnected)return;
  const state=inspect();
  if(state.phase==='ready'){finish();return;}
  if(state.phase==='error'||state.phase==='conflict'){
   // The embedded page already contains the relevant recovery controls.
   finish();frame.dataset.loadState=state.phase;return;
  }
  const elapsed=Date.now()-started;
  if(elapsed>=20000){text.textContent='تأخر فتح الدرس. أعد المحاولة أو افتحه في صفحة كاملة؛ حفظك السابق باقٍ.';retry.hidden=state.hasLab;frame.dataset.loadState='delayed';}
  timer=setTimeout(check,250);
 }
 async function load(){
  request?.abort();const controller=new AbortController();request=controller;
  started=Date.now();retry.hidden=true;frame.dataset.loadState='loading';text.textContent='جارٍ فتح الدرس واستعادة مختبراتك…';
  const timeout=setTimeout(()=>controller.abort(),15000);
  try{
   const response=await fetch(url.href,{credentials:'same-origin',cache:'no-store',signal:controller.signal});
   if(!response.ok)throw Error(response.status===403?'هذا المختبر غير متاح لهذا الحساب.':'تعذر تحميل الدرس. أعد المحاولة.');
   const html=await response.text();
   if(!response.headers.get('content-type')?.includes('text/html')||!html.includes('id="network-template"'))throw Error('تعذر تحميل محتوى الدرس الصحيح. أعد المحاولة.');
   if(disposed||!frame.isConnected||request!==controller)return;
   // Validate access/content before navigation. Keep the ordinary same-origin
   // URL: object-URL frames can stay blank in embedded browsers. The route
   // checks authorization again; no authenticated HTML is exposed elsewhere.
   frame.dataset.networkUrl=url.href;frame.src=url.href;check();
  }catch(error){if(disposed||request!==controller)return;clearTimeout(timer);text.textContent=controller.signal.aborted?'تأخر اتصال الدرس. أعد المحاولة؛ حفظك السابق باقٍ.':error.message;retry.hidden=false;frame.dataset.loadState='error';}
  finally{clearTimeout(timeout);}
 }
 retry.onclick=()=>{const state=inspect();if(state.phase==='ready'||state.hasLab){check();return;}void load();};
 function message(e){if(e.origin!==location.origin||e.source!==frame.contentWindow||disposed)return;if(e.data?.type==='madar-network-boot'){clearTimeout(timer);check();}if(e.data?.type==='madar-network-navigate'){const lesson=lessonBy(e.data.lesson);if(lesson?.course==='network'&&canLesson(lesson))void go('lesson:'+lesson.id);}}
 addEventListener('message',message);frame.addEventListener('load',check);
 disposeNetworkFrame=()=>{disposed=true;request?.abort();clearTimeout(timer);if(documentUrl)URL.revokeObjectURL(documentUrl);removeEventListener('message',message);frame.removeEventListener('load',check);panel.remove();};
 void load();
}

// A full document avoids a tall nested WebGL viewport on phones. Replace only
// the current lesson entry, so Back still leads to the course the learner opened.
function mobilePracticalTarget(html){
 if(!matchMedia('(max-width: 700px), (pointer: coarse)').matches)return null;
 const template=document.createElement('template');template.innerHTML=html;
 const frame=template.content.querySelector('#mh-network-lab');
 if(!frame)return null;
 const url=new URL(frame.getAttribute('data-network-src')||frame.getAttribute('src'),location.origin);
 if(url.origin!==location.origin||url.pathname!=='/network-lab')return null;
 return url.pathname+url.search;
}

// Resume metadata is derived from the saved original lab, never from a helper or copy.
function syncLessonProgress(frame){
 if(!state.route.startsWith('lesson:')||!frame)return;
 const progress=frame.contentWindow?.document.getElementById('madar-labs')?.lessonProgress?.();
 if(!progress||progress.lesson!==state.route.slice(7)||!canLesson(lessonBy(progress.lesson)))return;
 const old=profile().visits.network;
 if(JSON.stringify(old)!==JSON.stringify(progress)||profile().latest!=='network'){
  profile().visits.network=progress;profile().latest='network';scheduleSave();
 }
}

// A script-free, local visual copy of the live viewport. Never captures the desktop.
// New same-origin UI is mirrored automatically; no duplicate application or storage runs.
window.MadarPageReflection=(()=>{
 let host=null,view=null,active=false,timer=0,last=0,revision=0;
 const documents=new Map(),canvasTargets=new Map(),glPatches=[],stats={updates:0,documents:0,canvases:0,lastMs:0};
 const blocked=new Set(['SCRIPT','TEMPLATE','NOSCRIPT','OBJECT','EMBED','BASE']);
 function attrs(source,target){
  const names=new Set(target.tagName==='CANVAS'?['width','height']:[]);
  for(const a of source.attributes){const k=a.name.toLowerCase();if((target.tagName==='CANVAS'&&['width','height'].includes(k))||k.startsWith('on')||k==='autofocus'||k==='srcdoc'||k==='nonce'||k==='integrity'||k==='autoplay'||k==='sandbox'||(source.tagName==='IFRAME'&&k==='src')||(k==='href'&&/^javascript:/i.test(a.value)))continue;names.add(a.name);if(target.getAttribute(a.name)!==a.value)target.setAttribute(a.name,a.value);}
  for(const a of [...target.attributes])if(!names.has(a.name)&&a.name!=='data-reflection-node')target.removeAttribute(a.name);
  if(source.tagName==='IFRAME'){target.setAttribute('sandbox','allow-same-origin');target.setAttribute('tabindex','-1');}
 }
 function paint(source,target){if(!active||!source.isConnected||!target.isConnected||!source.width||!source.height)return;try{const ratio=Math.min(1,960/source.width,720/source.height),w=Math.max(1,Math.round(source.width*ratio)),h=Math.max(1,Math.round(source.height*ratio));if(target.width!==w)target.width=w;if(target.height!==h)target.height=h;const c=target.getContext('2d');c.clearRect(0,0,w,h);c.drawImage(source,0,0,w,h);}catch{/* Cross-origin pixels cannot be copied. */}}
 function watchGL(win){
  if(glPatches.some(p=>p.win===win))return;
  const changes=[];
  for(const type of ['WebGLRenderingContext','WebGL2RenderingContext']){const proto=win[type]?.prototype;if(!proto)continue;
   for(const name of ['clear','drawArrays','drawElements','drawArraysInstanced','drawElementsInstanced','drawRangeElements']){
    if(!Object.hasOwn(proto,name)||typeof proto[name]!=='function')continue;const original=proto[name];
    const wrapped=function(...args){const result=Reflect.apply(original,this,args),entry=canvasTargets.get(this.canvas);if(active&&entry&&!entry.queued&&performance.now()-(entry.last||0)>50){entry.queued=true;win.queueMicrotask(()=>{entry.queued=false;if(canvasTargets.get(this.canvas)===entry){entry.last=performance.now();paint(this.canvas,entry.target);}});}return result;};
    try{proto[name]=wrapped;changes.push({proto,name,original,wrapped});}catch{}
   }
  }
  glPatches.push({win,changes});
 }
 function mirrorDocument(source,target){
  let record=documents.get(source);
  if(!record||record.target!==target){
   record={source,target,map:new WeakMap(),scroll:[]};documents.set(source,record);target.head.replaceChildren();target.body.replaceChildren();
   const base=target.createElement('base');base.href=source.baseURI;target.head.append(base);record.base=base;
   const style=target.createElement('style');style.textContent='html{scroll-behavior:auto!important}body{pointer-events:none!important}*{caret-color:transparent!important}';record.style=style;watchGL(source.defaultView);
  }
  attrs(source.documentElement,target.documentElement);attrs(source.body,target.body);target.body.inert=true;record.scroll=[];
  syncChildren(source.head,target.head,record,[record.base]);target.head.append(record.style);
  syncChildren(source.body,target.body,record);
  for(const [a,b]of record.scroll){b.scrollTop=a.scrollTop;b.scrollLeft=a.scrollLeft;}
  target.defaultView.scrollTo(source.defaultView.scrollX,source.defaultView.scrollY);
  if(record.needsPaint){record.needsPaint=false;source.defaultView.dispatchEvent(new source.defaultView.Event('madar-reflection-refresh'));}
  // Show dialogs/popovers in the same top layer without activating any app logic.
  for(const a of source.querySelectorAll('dialog[open],[popover]')){const b=record.map.get(a);if(!b)continue;try{if(a.matches(':modal')&&!b.matches(':modal')){b.removeAttribute('open');b.showModal();}else if(a.matches(':popover-open')&&!b.matches(':popover-open'))b.showPopover();else if(!a.matches(':popover-open')&&b.matches(':popover-open'))b.hidePopover();}catch{}}
  return record;
 }
 function skip(n){return n.nodeType===1&&(blocked.has(n.tagName)||n.hasAttribute('data-page-reflection')||(n.tagName==='LINK'&&n.rel!=='stylesheet')||(n.tagName==='META'&&n.httpEquiv));}
 function syncChildren(source,target,record,prefix=[]){
  let at=target.firstChild;for(const fixed of prefix){if(at!==fixed)target.insertBefore(fixed,at);at=fixed.nextSibling;}
  for(const n of source.childNodes){if(skip(n)||![1,3].includes(n.nodeType))continue;
   let copy=record.map.get(n);if(!copy){copy=n.nodeType===3?record.target.createTextNode(n.data):record.target.createElementNS(n.namespaceURI,n.tagName==='VIDEO'||n.id==='mh-network-background'?'canvas':n.localName);record.map.set(n,copy);}
   if(at!==copy)target.insertBefore(copy,at);at=copy.nextSibling;
   if(n.nodeType===3){if(copy.data!==n.data)copy.data=n.data;continue;}
   attrs(n,copy);
   if(n.id==='mh-network-background'){
    const background=n.contentDocument?.querySelector('.net-stage>canvas');if(background)paint(background,copy);
   }else if(n.tagName==='IFRAME'){
    try{const doc=n.contentDocument;if(doc?.body&&copy.contentDocument?.body)mirrorDocument(doc,copy.contentDocument);}catch{}
   }else if(n.tagName==='CANVAS'){
    const size=n.ownerDocument.defaultView.getComputedStyle(n);copy.style.width=size.width;copy.style.height=size.height;
    let entry=canvasTargets.get(n);if(!entry||entry.target!==copy){entry={target:copy,queued:false};canvasTargets.set(n,entry);paint(n,copy);record.needsPaint=true;}
    // WebGL pixels are copied at the end of the drawing task, before its buffer is cleared.
    if(n.getContext('2d'))paint(n,copy);
   }else if(n.tagName==='VIDEO'){
    try{copy.width=n.videoWidth||n.clientWidth;copy.height=n.videoHeight||n.clientHeight;copy.getContext('2d').drawImage(n,0,0,copy.width,copy.height);}catch{}
   }else{
    syncChildren(n,copy,record);
    if('value'in n&&n.tagName!=='LI'&&copy.value!==n.value)copy.value=n.value;
    if('checked'in n)copy.checked=n.checked;if('selected'in n)copy.selected=n.selected;
    if(n.shadowRoot){const shadow=copy.shadowRoot||copy.attachShadow({mode:'open'});syncChildren(n.shadowRoot,shadow,record);}
   }
   if(n.scrollHeight>n.clientHeight||n.scrollWidth>n.clientWidth)record.scroll.push([n,copy]);
   // Match animation phase instead of restarting animations on each visual update.
   const animations=n.getAnimations?.()||[],copies=copy.getAnimations?.()||[];animations.forEach((a,i)=>{if(!copies[i])return;try{copies[i].pause();copies[i].currentTime=a.currentTime;}catch{}});
  }
  while(at){const next=at.nextSibling;at.remove();at=next;}
 }
 function layout(){if(!host||!view)return;const w=innerWidth,h=innerHeight,s=Math.min(host.clientWidth/w,host.clientHeight/h);view.style.cssText=`position:absolute;border:0;margin:0;max-width:none;width:${w}px;height:${h}px;left:${(host.clientWidth-w*s)/2}px;top:${(host.clientHeight-h*s)/2}px;transform-origin:0 0;transform:scale(${s});pointer-events:none;z-index:2;background:#090b0e;`;}
 function tick(){timer=0;if(!active||document.hidden||!host?.isConnected)return;const started=performance.now();
  try{layout();if(view.contentDocument?.body){mirrorDocument(document,view.contentDocument);revision++;view.dataset.revision=String(revision);}
   for(const [source,record]of documents)if(source!==document&&(!source.defaultView?.frameElement?.isConnected||source.defaultView.document!==source))documents.delete(source);
   for(const [source,entry]of canvasTargets)if(!source.isConnected||!entry.target.isConnected)canvasTargets.delete(source);
   stats.updates++;stats.documents=documents.size;stats.canvases=canvasTargets.size;stats.lastMs=performance.now()-started;
  }catch(error){console.warn('Page reflection:',error);}
  last=performance.now();timer=setTimeout(tick,Math.max(100,stats.lastMs*4));
 }
 function stop(){active=false;clearTimeout(timer);timer=0;for(const p of glPatches)for(const c of p.changes)if(c.proto[c.name]===c.wrapped)c.proto[c.name]=c.original;glPatches.length=0;canvasTargets.clear();documents.clear();view?.remove();view=null;host=null;}
 function start(frame){const screen=frame.contentDocument?.querySelector('.self-screen');if(!screen)return;if(host!==screen){stop();host=screen;host.querySelector('.mirror-surface').hidden=true;view=host.ownerDocument.createElement('iframe');view.setAttribute('sandbox','allow-same-origin');view.setAttribute('aria-hidden','true');view.setAttribute('tabindex','-1');view.setAttribute('data-page-reflection','');view.title='انعكاس الصفحة';host.append(view);view.onload=()=>{if(active){clearTimeout(timer);tick();}};}
  active=true;clearTimeout(timer);tick();
 }
 document.addEventListener('visibilitychange',()=>{clearTimeout(timer);timer=0;if(active&&!document.hidden)tick();});addEventListener('pagehide',stop);
 return {start,stop,refresh:()=>{if(active&&performance.now()-last>50){clearTimeout(timer);tick();}},stats:()=>({...stats,active,revision})};
}).call(null);

function updateNetworkBackground(course){
 const frame=$('#mh-network-background'),active=course==='network';frame.hidden=!active;
 const send=()=>{
  const showing=root.dataset.course==='network';
  frame.contentWindow?.postMessage({type:'madar-background-active',active:showing},location.origin);
  if(!showing){window.MadarPageReflection?.stop();return;}
  window.MadarPageReflection?.start(frame);
 };
 frame.onload=send;
 if(!active)window.MadarPageReflection?.stop();
 if(active&&!frame.getAttribute('src'))frame.src='/network-background.html';else if(frame.getAttribute('src'))send();
}

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


  // Curated triads, not random RGB: broad variety without muddy or near-identical mixes.
const orbitTriads=[
  ['#31D7EA','#8467F5','#F6A7D8'],['#18D3B1','#379DFA','#E3B9FF'],
  ['#FFB45E','#F46491','#8A75F4'],['#51E0C1','#D5EE8F','#F4B364'],
  ['#5AB9FC','#E093F8','#FFCE94'],['#F58BA7','#D6ABFC','#89DCD5'],
  ['#30C3CD','#3172D7','#DBB0FA'],['#F8D078','#F68B65','#CD6CA9'],
  ['#89C6FF','#63E1C1','#EEE0A1'],['#A58AFF','#F3ABD7','#FFC79C'],
  ['#4DCDB4','#9BB4FD','#F6CF88'],['#ED7E9E','#FFBA77','#96A2F5'],
  ['#61D6E9','#3B8BBF','#F2CF9D'],['#B393F6','#71BCEB','#A7E4C8'],
  ['#F6A38C','#E9C185','#C393EA'],['#2FBFA8','#79DBD5','#F2AECE'],
  ['#7AA9EE','#E1A1C6','#F5DCAE'],['#EF91CA','#956BEC','#65DCE0'],
  ['#F7BE6E','#BA8CE2','#6FBBCF'],['#91E3C3','#4AA9D8','#CFACF2'],
  ['#EE8A78','#F0BD98','#7B9FE4'],['#65CDE1','#F0C5EC','#A59CED'],
  ['#B8DE8D','#49BFB8','#AD9BE9'],['#F1A6D0','#ECA65C','#7BBBDD']
];
let orbitPaletteOffset=Math.floor(Math.random()*orbitTriads.length);
// Decorative scene only. Shared pause state; palette timing is independent of travel speed.
function createLiquidOrbit(mark,options={}){
  const bubble=mark.querySelector(options.bubbleSelector||'.mh-liquid-bubble'),canvas=bubble.querySelector('canvas');
  const ctx=canvas.getContext('2d',{alpha:true});
  const size=options.size??(mark.classList.contains('mh-orbit')||mark.classList.contains('vm-orbit-badge')?40:112);canvas.width=canvas.height=size;
  const paletteOffset=options.paletteIndex??orbitPaletteOffset++;
  const image=ctx?.createImageData(size,size),pixels=[];
  let seconds=options.seconds||0,colorSeconds=options.colorSeconds||0,last=0,lastDraw=-1,width=mark.clientWidth,visible=false;
  const resize=new ResizeObserver(()=>{width=mark.clientWidth;lastDraw=-1;});resize.observe(mark);
  const observer=new IntersectionObserver(entries=>{visible=entries[0].isIntersecting;last=0;});observer.observe(mark);
  const smooth=x=>x*x*(3-2*x);
  function palette(n){return orbitTriads[(paletteOffset+n)%orbitTriads.length].map(hex=>[1,3,5].map(i=>parseInt(hex.slice(i,i+2),16)/255));}
  if(image)for(let y=0;y<size;y++)for(let x=0;x<size;x++){
    const px=(x+.5)/size*2-1,py=(y+.5)/size*2-1,r=px*px+py*py;
    if(r<1)pixels.push({i:(y*size+x)*4,x:px,y:py,z:Math.sqrt(1-r),a:Math.min(1,(1-r)*size/2)});
  }
  function draw(){
    // Hold exactly three source colours, then dissolve to a new triad every five active seconds.
    // Start immediately in gold for 60 active seconds, then show the 24 triads.
    // Repeat every 180 active seconds; a fresh mount starts in gold again.
    // The original24triads and default renderer remain unchanged elsewhere.
    const phase=options.signatureGold?(colorSeconds+120)%180:colorSeconds;
    const signature=!!options.signatureGold&&phase>=120;
    const cycle=Math.floor(phase/5),mix=smooth(Math.min(1,((signature?phase-120:phase)%5)/1.35));
    const gold=[[6,7,10],[242,202,112],[68,49,22]].map(c=>c.map(v=>v/255));
    const goldMix=signature?(colorSeconds<60?1:smooth(Math.min(1,(phase-120)/1.35))):0;
    const from=signature?palette(23):(options.signatureGold&&cycle===0&&colorSeconds>=60?gold:palette(Math.max(0,cycle-1))),to=signature?gold:palette(cycle);
    const blend=signature?goldMix:mix;
    const goldStrength=signature?goldMix:(options.signatureGold&&phase<1.35?1-mix:0);
    const colors=to.map((c,i)=>c.map((v,j)=>from[i][j]+(v-from[i][j])*blend));
    if(options.signatureGold)mark.dataset.paletteStyle=signature?'black-gold':'original';
    bubble.style.background=`linear-gradient(135deg,${colors.map(c=>`rgb(${c.map(v=>Math.round(v*255)).join(' ')})`).join(',')})`;
    if(options.position!==false){
    const angle=seconds*Math.PI/3-.5,rx=width*.72,ry=width*.31,tilt=-Math.PI/12;
    const x=rx*Math.cos(angle),y=ry*Math.sin(angle);
    bubble.style.transform=`translate(-50%,-50%) translate(${x*Math.cos(tilt)-y*Math.sin(tilt)}px,${x*Math.sin(tilt)+y*Math.cos(tilt)}px) scale(${.88+.12*Math.sin(angle)})`;
    bubble.style.zIndex=Math.sin(angle)>=0?'4':'1';
    }
    mark.dataset.orbitSeconds=seconds.toFixed(3);mark.dataset.palette=String(cycle);
    if(!image)return;
    // Fluid has its own pace: broad moving folds stay readable in a 24–36px bubble.
    // Palette dwell and fluid motion are independent: gold stays gold while its
    // folds visibly flow. Integrate both speeds so palette boundaries never
    // reset or jump the fluid clock (60*.55 + 120 = 153 per complete cycle).
    const elapsed=colorSeconds%180;
    const fluidSeconds=options.signatureGold
      ?120+Math.floor(colorSeconds/180)*153+(elapsed<60?elapsed*.55:33+elapsed-60)
      :colorSeconds;
    const t=fluidSeconds*.95,data=image.data;
    for(const p of pixels){
      // A differential swirl bends the centre faster than the edge; the folds also deform.
      const twist=t*.52+(p.x*p.x+p.y*p.y)*1.3*Math.sin(t*.6);
      const ct=Math.cos(twist),st=Math.sin(twist);
      const u=p.x*ct-p.y*st,v=p.x*st+p.y*ct;
      const a=u+.42*Math.sin(v*2.5+t)+.12*Math.sin(v*4.5-t*.6);
      const b=v+.40*Math.sin(u*2.3-t*.8)+.12*Math.cos(a*3.5+t*.5);
      const field=Math.sin(a*2.5+b*1.8+Math.sin(b*2.2-a*1.6+t*.7));
      const field2=Math.sin(b*2.6-a*1.7+Math.cos(a*2.8+t*.6));
      const weights=[Math.exp(field*2.7),Math.exp(field2*2.7),Math.exp(-(field+field2)*2.1)];
      if(goldStrength){weights[0]*=1+goldStrength*1.2;weights[2]*=1-goldStrength*.35;}
      const sum=weights[0]+weights[1]+weights[2];
      const light=.62+.38*p.z,rim=Math.pow(1-p.z,4)*(.24-.16*goldStrength);
      const spec=Math.exp(-((p.x+.36)**2/.027+(p.y+.43)**2/.013))*(.85-.5*goldStrength);
      for(let c=0;c<3;c++)data[p.i+c]=Math.min(255,255*((colors[0][c]*weights[0]+colors[1][c]*weights[1]+colors[2][c]*weights[2])/sum*light+rim+spec));
      data[p.i+3]=p.a*255;
    }
    ctx.putImageData(image,0,0);
  }
  draw();
  return {
    tick(t,stopped){
      if(stopped||!visible||document.hidden||!mark.isConnected){last=0;return;}
      if(last){const delta=Math.min((t-last)/1000,.1);seconds+=delta*(options.speed??.5);colorSeconds+=delta*(options.colorSpeed??1);}last=t;
      if(t-lastDraw>=1000/30){draw();lastDraw=t;}
    },
    snapshot(){return {seconds,colorSeconds,paletteIndex:paletteOffset};},
    dispose(){resize.disconnect();observer.disconnect();}
  };
}

function createNetworkNewsPlayer(frame) {
  return createNewsFramePlayer({ frame, eventTarget: window, origin: location.origin,
    observe: callback => new IntersectionObserver(callback),
    isPaused: () => announcements.isPaused() || motionPreference.matches });
}

// Homepage-only announcement. Demonstration data never enters the learner store.
let disposeSrweAnnouncement=()=>{};
const SRWE_EXAM_START='2026-11-10T09:50:00+03:00';
function srweExamRemaining(now=Date.now()){
 const total=Math.max(0,Math.ceil((Date.parse(SRWE_EXAM_START)-now)/1000));
 return {hours:Math.floor(total/3600),minutes:Math.floor(total%3600/60),seconds:total%60,reached:total===0};
}
function srweAnnouncement(){
 if(![4,5,6].every(c=>lessons.some(l=>l.id==='network-srwe-'+c&&canLesson(l))))return '';
 return `<section class="sa" id="srwe-announcement" aria-labelledby="sa-title" data-stage="0" data-running="false">
 <div class="sa-atmosphere" aria-hidden="true"><i></i><i></i><div class="sa-grid"></div><div class="sa-edge"></div></div>
 <div class="sa-top"><span class="sa-release"><i></i>بوابة مرجع الاختبار</span><span class="sa-series" dir="ltr">SRWE <b>04 / 05 / 06</b></span><button type="button" class="sa-motion" aria-pressed="false" aria-label="إيقاف حركة الإعلان">${icon('pause')}<span>إيقاف الحركة</span></button></div>
 <div class="sa-exam-schedule"><div class="sa-exam-date"><span>${icon('calendar-clock')}موعد الاختبار النظري</span><time datetime="${SRWE_EXAM_START}"><strong>الثلاثاء، 10 نوفمبر 2026</strong><small><b>9:50 صباحًا</b> · بتوقيت السعودية</small></time></div><div class="sa-countdown-wrap"><span class="sa-countdown-label">الوقت المتبقي لبدء الاختبار</span><div class="sa-countdown" role="timer" aria-live="off" aria-label="الوقت المتبقي لبدء الاختبار" dir="ltr" data-target="${SRWE_EXAM_START}">${[['hours','ساعة'],['minutes','دقيقة'],['seconds','ثانية']].map(([key,label])=>`<div class="sa-time-unit"><strong data-exam-time="${key}">--</strong><span>${label}</span></div>`).join('<i aria-hidden="true">:</i>')}</div></div></div>
 <div class="sa-layout">
 <div class="sa-copy"><div class="sa-overline">التوجيه والتحويل 1 · الجزء النظري</div><h1 id="sa-title">مرجع الاختبار النظري<br><span dir="ltr">4 <i>·</i> 5 <i>·</i> 6</span></h1><p class="sa-lead">راجع الشابترات المحددة للاختبار<br>بالشرح والأسئلة والتصحيح.</p><p class="sa-description">ابدأ مراجعتك من هنا: أسئلة تدريبية بالإنجليزية مع ترجمة عربية عند الطلب، وشرح لسبب صحة كل إجابة، ورسوم توضّح المفاهيم.</p>
 <div class="sa-facts"><div><strong>84</strong><span>سؤالًا مفسّرًا</span></div><div><strong>3</strong><span>شابترات</span></div><div><strong dir="ltr">EN <i>↔</i> AR</strong><span>إنجليزي وعربي</span></div></div>
 <a class="sa-cta" href="/network-review"><span>ادخل إلى مرجع الاختبار</span>${icon('arrow-up-left')}</a><span class="sa-saving">${icon('cloud-check')}مع تسجيل الدخول، يُحفظ تقدمك في حسابك.</span></div>
 <div class="sa-showcase"><div class="sa-stage-shadow" aria-hidden="true"></div><div class="sa-display">
 <div class="sa-display-top"><div class="sa-window-dots" aria-hidden="true"><i></i><i></i><i></i></div><span>معاينة المرجع</span><span class="sa-demo">مثال توضيحي</span></div>
 <div class="sa-panels">
 <div class="sa-panel" id="sa-panel-0" role="tabpanel" aria-labelledby="sa-tab-0">
 <div class="sa-panel-heading"><span class="sa-mini-icon">${icon('network')}</span><div><small>شرح مرئي للمفهوم</small><h2 dir="ltr">Inter-VLAN Routing</h2></div><span class="sa-chapter">04</span></div>
 <div class="sa-topology" aria-label="Router يربط شبكة VLAN 10 بشبكة VLAN 20 عبر Switch">
 <svg viewBox="0 0 440 245" role="img" aria-label="مسار بين جهازين في شبكتين مختلفتين يمر عبر Router"><defs><linearGradient id="sa-cable" x2="1" y2="1"><stop stop-color="#74d6d0"/><stop offset="1" stop-color="#bdacff"/></linearGradient><linearGradient id="sa-device" x2="0" y2="1"><stop stop-color="#304653"/><stop offset="1" stop-color="#14252c"/></linearGradient></defs>
 <ellipse cx="220" cy="224" rx="184" ry="13" fill="#000" opacity=".2"/>
 <path class="sa-wire" d="M220 72V123M193 145H86V180M247 145H354V180"/>
 <path class="sa-packet sa-up" pathLength="100" d="M86 180V145H220V72"/><path class="sa-packet sa-down" pathLength="100" d="M220 72V145H354V180"/>
 <g class="sa-router"><ellipse cx="220" cy="65" rx="43" ry="16" fill="#0b181e"/><path d="M177 50v15c0 22 86 22 86 0V50" fill="url(#sa-device)" stroke="#6a979e"/><ellipse cx="220" cy="50" rx="43" ry="15" fill="#304d58" stroke="#86c0c3"/><path d="m204 47 11 5-11 5m31-14-11 5 11 5m-21-15 7 4 7-4" fill="none" stroke="#b5e7e2" stroke-width="2"/><text x="220" y="18">Router</text></g>
 <g class="sa-switch"><path d="m177 128 14-10h64l14 10v24h-92Z" fill="url(#sa-device)" stroke="#607b8c"/><path d="M177 128h92M191 118l-14 10m78-10 14 10" stroke="#8ca7b3"/><path d="M188 138h8m5 0h8m5 0h8m5 0h8m5 0h8m5 0h6" stroke="#8bd2cb" stroke-width="4"/><text x="307" y="140">Switch</text></g>
 <g class="sa-pc"><rect x="60" y="179" width="52" height="34" rx="4" fill="#152c36" stroke="#80c7cd"/><path d="M64 183h44v24H64Z" fill="#254551"/><path d="m71 199 8-7 9 7 11-12" fill="none" stroke="#7dd5cf" stroke-width="2"/><path d="M86 213v7m-14 1h28" stroke="#80a9af" stroke-width="3"/><text x="86" y="240">VLAN 10</text></g>
 <g class="sa-pc"><rect x="328" y="179" width="52" height="34" rx="4" fill="#252c41" stroke="#b9a8eb"/><path d="M332 183h44v24h-44Z" fill="#3b3c57"/><path d="m339 199 8-7 9 7 11-12" fill="none" stroke="#c4b4f4" stroke-width="2"/><path d="M354 213v7m-14 1h28" stroke="#ad9dcf" stroke-width="3"/><text x="354" y="240">VLAN 20</text></g></svg>
 <span class="sa-route-tag">${icon('route')}الاتصال بين VLANs يحتاج إلى توجيه.</span></div>
 <div class="sa-source-line">${icon('file-text')}شرح مرتبط بصفحات المصدر الأصلية<span>Chapter 4</span></div>
 </div>
 <div class="sa-panel" id="sa-panel-1" role="tabpanel" aria-labelledby="sa-tab-1" hidden>
 <div class="sa-panel-heading"><span class="sa-mini-icon">${icon('list-checks')}</span><div><small>سؤال وتصحيح مفسّر</small><h2 dir="ltr">Question 4–01</h2></div><button type="button" class="sa-lang" data-sa-translate aria-pressed="false" aria-label="ترجمة سؤال المعاينة وخياراته إلى العربية"><span class="sa-lang-rays" aria-hidden="true"><i></i><i></i><i></i><i></i><i></i><i></i></span><span class="sa-lang-face" aria-hidden="true"></span><span class="sa-lang-icon" aria-hidden="true">${icon('languages')}</span><span class="sa-lang-label"><b>ترجمة</b><small dir="ltr">EN ↔ AR</small></span></button></div>
 <p class="sa-question" data-sa-demo-text="question" dir="ltr" lang="en">What is required for hosts in different VLANs to communicate?</p>
 <div class="sa-option" dir="ltr"><span>A</span><b class="sa-option-text" data-sa-demo-text="a">The same access port number</b><i></i></div><div class="sa-option sa-option-correct" dir="ltr"><span>D</span><b class="sa-option-text" data-sa-demo-text="d">A Router or a Layer 3 Switch</b>${icon('check-circle-2')}</div>
 <div class="sa-explanation"><strong>${icon('check')}لماذا هذه الإجابة؟</strong><p>نقل الحزم بين شبكات VLAN المختلفة يحتاج إلى وظيفة التوجيه في الطبقة الثالثة.</p></div>
 <div class="sa-source-line">${icon('message-square-text')}شرح الإجابة بعد التأكيد أو باختيارك</div>
 </div>
 <div class="sa-panel" id="sa-panel-2" role="tabpanel" aria-labelledby="sa-tab-2" hidden>
 <div class="sa-panel-heading"><span class="sa-mini-icon">${icon('bookmark-check')}</span><div><small>مراجعة منظمة</small><h2>أخطاؤك والأسئلة المعلّمة</h2></div><span class="sa-chapter">↺</span></div>
 <div class="sa-review-tabs"><span>${icon('circle-alert')}أخطائي السابقة</span><span>${icon('bookmark')}المعلّمة</span></div>
 <div class="sa-review-row"><span class="sa-review-dot"></span><div><b dir="ltr">Q4–01</b><small>التواصل بين شبكات VLAN</small></div><span class="sa-example-badge">خطأ سابق</span></div>
 <div class="sa-review-row"><span class="sa-review-dot sa-purple"></span><div><b dir="ltr">Q5–12</b><small>أولوية Root Bridge</small></div>${icon('bookmark')}</div>
 <div class="sa-review-row"><span class="sa-review-dot sa-mint"></span><div><b dir="ltr">Q6–24</b><small>قراءة حالة EtherChannel</small></div>${icon('check-circle-2')}</div>
 <div class="sa-retry-demo">${icon('rotate-ccw')}زر واحد لإعادة محاولة الأسئلة المصحّحة</div><p class="sa-demo-note">حالات توضيحية لعرض الميزة، وليست نتائجك.</p>
 </div></div>
 <div class="sa-sequence" role="tablist" aria-label="مراحل معاينة المرجع">${[['network','الشرح'],['list-checks','التصحيح'],['bookmark-check','المراجعة']].map(([ic,t],i)=>`<button type="button" role="tab" id="sa-tab-${i}" aria-controls="sa-panel-${i}" aria-selected="${i===0}" tabindex="${i===0?0:-1}" data-sa-stage="${i}">${icon(ic)}<span>${t}</span><i></i></button>`).join('')}</div>
 </div><div class="sa-caption"><i></i>معاينة متحركة لميزات المرجع<span dir="ltr">MADAR / NETWORK</span></div></div>
 </div>
 <div class="sa-bottom"><div class="sa-chapter-links" aria-label="افتح شابترًا محددًا">${[[4,'Inter-VLAN Routing','ربط شبكات VLAN'],[5,'STP Concepts','منع حلقات الشبكة'],[6,'EtherChannel','تجميع الوصلات']].map(([n,en,ar])=>`<a href="/network-review?chapter=${n}"><b>0${n}</b><span><strong dir="ltr">${en}</strong><small>${ar}</small></span>${icon('arrow-up-left')}</a>`).join('')}</div><div class="sa-detail-strip sa-summary"><span class="sa-summary-icon" aria-hidden="true">${icon('book-open')}</span><p>جمعنا لك الشرح والأسئلة والترجمة، ووضّحنا أسباب الإجابات ورتّبنا مراجعة أخطائك، لتذاكر بوضوح وتعود لما تحتاجه بسهولة.</p></div></div>
 </section>`;
}
function mountSrweAnnouncement(){
 disposeSrweAnnouncement();const el=document.querySelector('#srwe-announcement');if(!el)return;
 const controller=new AbortController(),signal=controller.signal,pref=matchMedia('(prefers-reduced-motion: reduce)');let stage=0,elapsed=0,visible=false,manuallyPaused=false;
 try{manuallyPaused=sessionStorage.getItem('madar-srwe-announcement-motion')==='paused';}catch{}
 const tabs=[...el.querySelectorAll('[data-sa-stage]')],panels=[...el.querySelectorAll('.sa-panel')],motion=el.querySelector('.sa-motion');
 const running=()=>visible&&!document.hidden&&!pref.matches&&!manuallyPaused;
 function updateCountdown(){const remaining=srweExamRemaining();for(const key of ['hours','minutes','seconds']){const cell=el.querySelector('[data-exam-time="'+key+'"]'),value=String(remaining[key]).padStart(2,'0');if(cell.textContent!==value)cell.textContent=value;}const timer=el.querySelector('.sa-countdown'),label=el.querySelector('.sa-countdown-label');timer.setAttribute('aria-label',remaining.reached?'حل موعد الاختبار المحدد':`متبقي ${remaining.hours} ساعة و${remaining.minutes} دقيقة و${remaining.seconds} ثانية`);label.textContent=remaining.reached?'حل موعد الاختبار المحدد':'الوقت المتبقي لبدء الاختبار';el.dataset.examReached=String(remaining.reached);}
 updateCountdown();const countdownTimer=setInterval(()=>{if(!document.hidden)updateCountdown();},1000);
 function sync(){el.dataset.running=String(running());motion.setAttribute('aria-pressed',String(manuallyPaused||pref.matches));motion.disabled=pref.matches;const name=pref.matches?'الحركة مخفّضة':manuallyPaused?'تشغيل الحركة':'إيقاف الحركة';motion.querySelector('span').textContent=name;motion.setAttribute('aria-label',name+' في الإعلان');const svg=motion.querySelector('svg');if(svg)svg.innerHTML=manuallyPaused||pref.matches?'<path d="m8 5 11 7-11 7Z"/>':'<path d="M8 5v14M16 5v14"/>';}
 function show(i){stage=i;elapsed=0;el.dataset.stage=String(i);tabs.forEach((t,k)=>{t.setAttribute('aria-selected',String(k===i));t.tabIndex=k===i?0:-1;panels[k].hidden=k!==i;});}
 el.querySelector('[data-sa-translate]').addEventListener('click',e=>{const button=e.currentTarget,ar=button.getAttribute('aria-pressed')!=='true';button.setAttribute('aria-pressed',String(ar));button.setAttribute('aria-label',ar?'إعادة سؤال المعاينة وخياراته إلى الإنجليزية':'ترجمة سؤال المعاينة وخياراته إلى العربية');button.querySelector('b').textContent=ar?'الأصل':'ترجمة';const copy=ar?{question:'ما المطلوب لتمكين الأجهزة الموجودة في شبكات VLAN مختلفة من التواصل؟',a:'رقم منفذ الوصول نفسه',d:'Router أو Switch من الطبقة الثالثة'}:{question:'What is required for hosts in different VLANs to communicate?',a:'The same access port number',d:'A Router or a Layer 3 Switch'};for(const node of el.querySelectorAll('[data-sa-demo-text]')){node.textContent=copy[node.dataset.saDemoText];node.dir=ar?'rtl':'ltr';node.lang=ar?'ar':'en';}el.querySelectorAll('#sa-panel-1 .sa-option').forEach(node=>node.dir=ar?'rtl':'ltr');},{signal});
 el.addEventListener('click',e=>{const tab=e.target.closest('[data-sa-stage]');if(tab){show(Number(tab.dataset.saStage));return;}if(e.target.closest('.sa-motion')){manuallyPaused=!manuallyPaused;try{sessionStorage.setItem('madar-srwe-announcement-motion',manuallyPaused?'paused':'running');}catch{}sync();}},{signal});
 el.addEventListener('keydown',e=>{const t=e.target.closest('[data-sa-stage]');if(!t)return;const key=e.key;if(!['ArrowLeft','ArrowRight','Home','End'].includes(key))return;e.preventDefault();const i=key==='Home'?0:key==='End'?2:(Number(t.dataset.saStage)+(key==='ArrowLeft'?1:2))%3;show(i);tabs[i].focus();},{signal});

 const io=new IntersectionObserver(entries=>{visible=entries[0].isIntersecting;sync();},{threshold:0});io.observe(el.querySelector('.sa-showcase'));
 document.addEventListener('visibilitychange',()=>{sync();updateCountdown();},{signal});pref.addEventListener('change',sync,{signal});
 const timer=setInterval(()=>{if(running()){elapsed+=250;if(elapsed>=9000)show((stage+1)%3);}},250);
 const display=el.querySelector('.sa-display');el.querySelector('.sa-showcase').addEventListener('pointermove',e=>{if(e.pointerType!=='mouse'||pref.matches||manuallyPaused)return;const r=display.getBoundingClientRect();display.style.setProperty('--sa-rx',((.5-(e.clientY-r.top)/r.height)*3).toFixed(2)+'deg');display.style.setProperty('--sa-ry',(((e.clientX-r.left)/r.width-.5)*4).toFixed(2)+'deg');},{signal});el.querySelector('.sa-showcase').addEventListener('pointerleave',()=>{display.style.removeProperty('--sa-rx');display.style.removeProperty('--sa-ry');},{signal});
 sync();disposeSrweAnnouncement=()=>{clearInterval(timer);clearInterval(countdownTimer);io.disconnect();controller.abort();disposeSrweAnnouncement=()=>{};};
}

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
    // OS1 uses the existing owner-scoped profile, notes and feedback services.
  let osVideo=null,osCleanup=null,osPaused=motionPreference.matches;
  const osList=()=>lessons.filter(l=>l.course==='os1'&&canLesson(l));
  const osTime=s=>`${Math.floor(Math.round(s)/60)}:${String(Math.round(s)%60).padStart(2,'0')}`;
  const osStep=l=>Math.max(0,Math.min(l.scenes.length-1,Number(profile().osPositions?.[l.id]?.step??(profile().visits.os1?.lesson===l.id?profile().visits.os1.step:0))||0));
  const osLectureName=l=>String(l.source||'').split(' · ')[0];
  function osCourseArt(){return '<div class="os-card-art"><span class="os-rack-number">01 / SYSTEMS</span><img src="/assets/os1/server-unit.webp" alt="" loading="lazy"><span class="os-equipment-label">WINDOWS SERVER <i></i></span></div>';}
  function osHome(){const last=lessonBy(profile().visits.os1?.lesson),start=canLesson(last)&&last.course==='os1'?last:osList()[0];return `<section class="os-home"><div class="os-home-top"><span class="os-eyebrow">WINDOWS SERVER 2012 R2</span><button data-os-motion class="os-quiet" aria-pressed="${osPaused}">${icon(osPaused?'play':'pause')} ${osPaused?'تشغيل الخلفية':'إيقاف حركة الخلفية'}</button></div><div class="os-hero"><div class="os-hero-copy"><h1>نظم التشغيل <em>1</em></h1><div class="os-hero-actions"><button class="mh-primary" data-go="lesson:${start?.id||''}">${profile().visits.os1?'كمّل من مكانك':'ابدأ الدرس الأول'} ${icon('arrow-left')}</button><button class="os-quiet" data-go="course:os1:lessons">استعرض الدروس ${icon('arrow-down')}</button></div></div></div>${osLessonCards()}</section>`;}
  function osLessonCards(){const photos=['server-unit.webp','server-interior.webp','server-room.webp'];return `<section class="os-lessons"><div class="os-section-head"><h2>الدروس</h2><span>${osList().length.toLocaleString('ar-SA')} ${osList().length<=10?'دروس':'درسًا'} <i>·</i> ${osList().reduce((n,l)=>n+l.scenes.length,0).toLocaleString('ar-SA')} مشهدًا</span></div><div class="os-lesson-grid">${osList().map((l,i)=>`<article class="os-lesson-card os-hardware-card os-hardware-${i+1}"><div class="os-hardware-visual" aria-hidden="true"><img src="/assets/os1/${photos[i%photos.length]}" alt="" loading="lazy" width="${i%photos.length===0?2048:1672}" height="${i%photos.length===0?768:941}"><span class="os-photo-plate">${['WINDOWS SERVER','SERVER CORE','ACTIVE DIRECTORY','DOMAINS & FORESTS'][i]||'WINDOWS SERVER'}</span></div><div class="os-hardware-copy"><div class="os-card-meta"><span>الدرس ${i+1}</span><bdi>${osTime(l.seconds)}</bdi></div><h3>${esc(l.title)}</h3><span class="os-lecture-code" dir="ltr">${esc(osLectureName(l))}</span><p>${esc(l.intro)}</p><div class="os-card-bottom"><span>${l.scenes.length} مشاهد</span><button data-go="lesson:${l.id}">${profile().osPositions?.[l.id]?'متابعة الدرس':'فتح الدرس'} ${icon('arrow-left')}</button></div></div></article>`).join('')}</div></section>`;}
  function osSection(section){if(section==='practice')return opPracticePage();if(section==='reference')return `<section class="os-reference">${heading('الملاحظات والمصادر','نظم التشغيل 1')}<div class="os-source-list">${osList().map((l,i)=>`<article><span>${String(i+1).padStart(2,'0')}</span><div><h2>${esc(l.title)}</h2><p dir="ltr">${esc(l.source)}</p><button data-go="lesson:${l.id}">المشاهد وملاحظاتي ${icon('arrow-left')}</button></div></article>`).join('')}</div><section class="os-feedback"><h2>شارك تجربتك أو بلّغ عن مشكلة</h2><div id="os-feedback"></div></section></section>`;return `<div class="os-library">${heading('الجزء العملي','نظم التشغيل 1')}${osLessonCards()}</div>`;}
  function osWarning(w){return `<aside class="os-warning"><strong><span class="os-warning-symbol" aria-hidden="true">!</span><span class="os-shine-text">تنبيه</span></strong><p class="os-shine-text">${esc(w)}</p></aside>`;}
  function osLessonPage(l){const n=osStep(l);return `<section class="os-workspace" data-os-lesson="${l.id}"><header class="os-lesson-heading"><button class="os-quiet" data-go="course:os1:lessons">${icon('arrow-right')} كل الدروس</button><div><span class="os-lecture-code" dir="ltr">${esc(osLectureName(l))}</span><h1>${esc(l.title)}</h1></div><button data-os-motion class="os-quiet os-motion" aria-pressed="${osPaused}" aria-label="${osPaused?'تشغيل':'إيقاف'} حركة الخلفية">${icon(osPaused?'play':'pause')}</button></header><div class="os-studio"><nav id="os-scenes" class="os-scenes" aria-label="مشاهد الدرس">${osSceneButtons(l,n)}</nav><div class="os-reader"><div id="os-active-scene">${osSceneMarkup(l,n)}</div><details class="os-notes" open><summary>ملاحظتي على الدرس ${icon('notebook-pen')}</summary><div id="lesson-notes"></div></details></div></div><p class="os-source-caption">${esc(l.source)} · موضعك محفوظ، والوصول للمشهد لا يعني إتقانه.</p></section>`;}
  function osSceneButtons(l,n){return `<div class="os-scenes-title"><span>مشاهد الدرس</span><small>${l.scenes.length} مشاهد</small></div>${l.scenes.map((s,i)=>`<button data-os-step="${i}" aria-current="${n===i?'step':'false'}"><span class="os-step-index">${String(i+1).padStart(2,'0')}</span><span class="os-step-name">${esc(s.title)}<small><bdi>${osTime(s.seconds)}</bdi>${profile().osBookmarks?.includes(s.id)?' · علامة محفوظة':''}</small></span>${n===i?icon('play'):''}</button>`).join('')}`;}
  function osSceneMarkup(l,n){const s=l.scenes[n],bookmarked=profile().osBookmarks?.includes(s.id);return `<div class="os-video-shell"><video id="os-video" controls playsinline preload="metadata" poster="${s.poster}" data-video-src="${s.video}" aria-label="${esc(s.title)}"></video><div class="os-player-caption"><span>WINDOWS SERVER · LESSON ${osList().findIndex(x=>x.id===l.id)+1}</span><bdi>${String(n+1).padStart(2,'0')} / ${String(l.scenes.length).padStart(2,'0')}</bdi></div></div><div class="os-video-loading" role="status">جارٍ تجهيز المقطع…</div><div class="os-video-error" role="status" hidden>تعذّر تحميل المقطع. <button data-os-retry>إعادة المحاولة</button><small data-os-error-code></small></div><div class="os-scene-heading"><div><span class="os-kicker">المشهد ${n+1}</span><h2 tabindex="-1" id="os-scene-title">${esc(s.title)}</h2></div><button data-os-bookmark class="os-bookmark" aria-pressed="${!!bookmarked}" aria-label="${bookmarked?'إزالة':'حفظ'} علامة لهذا المشهد">${icon('bookmark')}</button></div><section class="os-recap" aria-label="خطوات التطبيق"><h3>خطوات التطبيق</h3><ol>${s.steps.map(t=>`<li><span dir="auto">${esc(t)}</span></li>`).join('')}</ol>${s.notes.map(t=>`<p class="os-context">${esc(t)}</p>`).join('')}</section>${s.warnings.map(osWarning).join('')}${opEntryMarkup(l,n)}<div class="os-step-actions"><button class="os-quiet" data-os-step="${n-1}" ${n===0?'disabled':''}>${icon('arrow-right')} السابق</button><span>${n+1} من ${l.scenes.length}</span>${n===l.scenes.length-1?`<button class="mh-primary" data-go="${osList()[osList().findIndex(x=>x.id===l.id)+1]?'lesson:'+osList()[osList().findIndex(x=>x.id===l.id)+1].id:'course:os1:lessons'}">${osList()[osList().findIndex(x=>x.id===l.id)+1]?'الدرس التالي':'كل الدروس'} ${icon('arrow-left')}</button>`:`<button class="mh-primary" data-os-step="${n+1}">المشهد التالي ${icon('arrow-left')}</button>`}</div>`;}
  function captureOsPosition(){if(!osVideo?.ready)return;const {video,l,n}=osVideo;if(video.readyState<1||!Number.isFinite(video.currentTime))return;const p=profile();p.osPositions??={};const old=p.osPositions[l.id];const seconds=Number(video.currentTime.toFixed(2));if(old?.step===n&&old?.seconds===seconds)return;p.osPositions[l.id]={step:n,seconds};p.visits.os1={lesson:l.id,step:n};p.latest='os1';scheduleSave();}
  function disposeOsScene(){if(osVideo){osCleanup?.();osVideo.video.pause();osVideo=null;osCleanup=null;}const f=$('#os-background');f?.contentWindow?.postMessage({type:'os-active',active:false},location.origin);}
  function mountOsScene(){const active=root.dataset.course==='os1';let bg=$('#os-background');if(active&&!bg){bg=document.createElement('iframe');bg.id='os-background';bg.title='خلفية غرفة السيرفرات';bg.tabIndex=-1;bg.setAttribute('aria-hidden','true');bg.src='/os1-background.html';root.prepend(bg);bg.onload=()=>bg.contentWindow?.postMessage({type:'os-active',active:root.dataset.course==='os1'&&!osPaused},location.origin);}if(bg){bg.hidden=!active;bg.contentWindow?.postMessage({type:'os-active',active:active&&!osPaused},location.origin);}root.classList.toggle('os-paused',osPaused);if(!active)return;if(state.route==='course:os1:practice'){opPaint();return;}const lessonId=$('[data-os-lesson]')?.dataset.osLesson,l=lessonBy(lessonId);if(l){bindOsVideo(l,osStep(l));$('#mh-subnav [data-go="course:os1:lessons"]')?.setAttribute('aria-current','page');const selected=$('#os-scenes [aria-current=step]');selected?.scrollIntoView({block:'nearest',inline:'nearest',behavior:'instant'});}if($('#os-feedback')){$('#os-feedback').innerHTML=window.MADAR_FEEDBACK.markup();void window.MADAR_FEEDBACK.bind({subject:'OS1',bankVersion:'os1-scenes-20261027-v4',currentLesson:null,lessons:osList(),questions:[]});}}
  function bindOsVideo(l,n){
    const video=$('#os-video');if(!video)return;
    const pane=video.closest('#os-active-scene'),loading=pane.querySelector('.os-video-loading'),error=pane.querySelector('.os-video-error');
    const context={video,l,n,ready:false,load:null};osVideo=context;
    let last=0,controller=null,objectUrl=null,disposed=false,timeout=null;
    const listeners=[],listen=(type,fn)=>{video.addEventListener(type,fn);listeners.push([type,fn]);};
    const current=()=>!disposed&&osVideo===context;
    const release=()=>{controller?.abort();controller=null;clearTimeout(timeout);context.ready=false;video.pause();video.removeAttribute('src');video.load();if(objectUrl){URL.revokeObjectURL(objectUrl);objectUrl=null;}};
    const fail=(code='LOAD')=>{if(!current())return;loading.hidden=true;error.hidden=false;error.querySelector('[data-os-error-code]').textContent='رمز التحقق: C2-'+code;};
    const save=()=>{if(current())captureOsPosition();};
    listen('timeupdate',()=>{if(performance.now()-last>5000){last=performance.now();save();}});
    listen('pause',save);listen('ended',save);
    listen('loadedmetadata',()=>{if(!current())return;const p=profile().osPositions?.[l.id];if(p?.step===n&&p.seconds>0&&p.seconds<video.duration-.5)video.currentTime=p.seconds;context.ready=true;loading.hidden=true;error.hidden=true;});
    listen('error',()=>{if(video.getAttribute('src'))fail('MEDIA-'+(video.error?.code||0));});
    for(const [ev,type] of [['play','video_play'],['pause','video_pause'],['ended','video_end']])listen(ev,()=>{if(current()&&context.ready)window.MADAR_ACTIVITY?.emit(type,{lesson:l.id,value:n+1});});
    // The public asset gateway returns 200 for byte-range requests. Loading one
    // bounded short clip into a Blob lets Safari seek locally without HTTP ranges.
    context.load=async()=>{
      release();if(!current())return;loading.hidden=false;error.hidden=true;
      const request=new AbortController();controller=request;
      timeout=setTimeout(()=>request.abort(),45000);
      try{
        const response=await fetch(l.scenes[n].video,{signal:request.signal,credentials:'same-origin'});
        if(!response.ok||!/^video\/mp4(?:;|$)/i.test(response.headers.get('Content-Type')||'')||Number(response.headers.get('Content-Length'))>8*1024*1024)throw Error('Invalid media response');
        const blob=await response.blob();
        if(!current()||controller!==request||request.signal.aborted)return;
        if(!blob.size||blob.size>8*1024*1024)throw Error('Invalid media size');
        objectUrl=URL.createObjectURL(new Blob([blob],{type:'video/mp4'}));video.src=objectUrl;video.load();
      }catch(e){if(current()&&controller===request)fail(request.signal.aborted?'TIMEOUT':'FETCH');}
      finally{if(controller===request)clearTimeout(timeout);}
    };
    osCleanup=()=>{disposed=true;for(const [type,fn] of listeners)video.removeEventListener(type,fn);release();};
    void context.load();
  }
  root.addEventListener('click',()=>captureOsPosition(),{capture:true});
  root.addEventListener('click',async e=>{const b=e.target.closest('button');if(!b)return;if(b.hasAttribute('data-os-motion')){osPaused=!osPaused;root.classList.toggle('os-paused',osPaused);$('#os-background')?.contentWindow?.postMessage({type:'os-active',active:!osPaused},location.origin);$$('[data-os-motion]').forEach(x=>{x.setAttribute('aria-pressed',String(osPaused));x.setAttribute('aria-label',osPaused?'تشغيل حركة الخلفية':'إيقاف حركة الخلفية');x.innerHTML=icon(osPaused?'play':'pause')+(x.classList.contains('os-motion')?'':osPaused?' تشغيل الخلفية':' إيقاف حركة الخلفية');});paintIcons();return;}if(!osVideo)return;const {l,n}=osVideo;if(b.hasAttribute('data-os-retry')){void osVideo.load();return;}if(b.hasAttribute('data-os-bookmark')){const p=profile();p.osBookmarks??=[];const id=l.scenes[n].id;p.osBookmarks=p.osBookmarks.includes(id)?p.osBookmarks.filter(x=>x!==id):[...p.osBookmarks,id];window.MADAR_ACTIVITY?.emit(p.osBookmarks.includes(id)?'bookmark_add':'bookmark_remove',{lesson:l.id,value:n+1});b.setAttribute('aria-pressed',String(p.osBookmarks.includes(id)));b.setAttribute('aria-label',p.osBookmarks.includes(id)?'إزالة علامة لهذا المشهد':'حفظ علامة لهذا المشهد');$('#os-scenes').innerHTML=osSceneButtons(l,n);paintIcons();scheduleSave();return;}if(!b.hasAttribute('data-os-step'))return;const next=Number(b.dataset.osStep);if(!Number.isInteger(next)||next<0||next>=l.scenes.length||next===n)return;try{await persist();}catch{return;}disposeOsScene();profile().osPositions??={};profile().osPositions[l.id]={step:next,seconds:0};profile().visits.os1={lesson:l.id,step:next};profile().latest='os1';$('#os-active-scene').innerHTML=osSceneMarkup(l,next);$('#os-scenes').innerHTML=osSceneButtons(l,next);bindOsVideo(l,next);$('#os-background')?.contentWindow?.postMessage({type:'os-active',active:!osPaused},location.origin);paintIcons();scheduleSave();$('#os-scene-title').focus({preventScroll:true});$('.os-video-shell').scrollIntoView({block:'start',behavior:motionPreference.matches?'instant':'smooth'});});
  const flushOs=()=>{if(!osVideo)return;captureOsPosition();if(dirty)void persist().catch(()=>{});};addEventListener('pagehide',flushOs);document.addEventListener('visibilitychange',()=>{if(document.hidden)flushOs();});
  motionPreference.addEventListener('change',e=>{if(e.matches){osPaused=true;root.classList.add('os-paused');$('#os-background')?.contentWindow?.postMessage({type:'os-active',active:false},location.origin);}});

  const op=window.MadarOSPractice;
  const opAvailable=()=>op.tasks.filter(t=>t.enabled!==false&&canLesson(lessonBy('os1-lesson-'+t.lesson)));
  const opData=()=>profile().osPractice||{version:op.VERSION,active:null,entries:{}};
  function opWrite(){const p=profile();p.osPractice??={version:op.VERSION,active:null,entries:{}};return p.osPractice;}
  function opEntry(t){return opData().entries?.[t.id];}
  const opBtn=(label,action,extra='')=>`<button type="button" data-op-action="${action}" ${extra}>${label}</button>`;
  const opInput=(key,label,value='',extra='')=>`<label>${label}<input name="${key}" value="${esc(value)}" dir="ltr" autocomplete="off" maxlength="80" ${extra}></label>`;
  const opSelect=(key,label,values,value='')=>`<label>${label}<select name="${key}">${values.map(([v,n])=>`<option value="${esc(v)}" ${v===value?'selected':''}>${esc(n)}</option>`).join('')}</select></label>`;
  const opTick=(key,label,checked)=>`<label class="op-tick"><input name="${key}" type="checkbox" ${checked?'checked':''}>${label}</label>`;
  function opForm(action,title,body,submit){return `<form data-op-form="${action}" class="op-form"><h3>${title}</h3><div class="op-fields">${body}</div><button class="op-apply" type="submit">${submit}</button></form>`;}
  function opEntryMarkup(l,n){const matches=opAvailable().filter(t=>t.lesson===Number(l.id.split('-').pop())&&(t.kind==='curriculum'||t.scene===n+1));return matches.length?`<aside class="op-invite"><span class="op-mark">${icon('mouse-pointer-2')}</span><div><strong>جرّبها بنفسك</strong><p>مختبر جاهز هنا في مدار؛ لا يحتاج تثبيت برامج.</p></div>${matches.map(t=>`<button data-os-lab="${t.id}">${esc(t.title)} ${icon('arrow-left')}</button>`).join('')}</aside>`:'';}
  function opCards(){const tasks=opAvailable();return `<label class="oc-filter">انتقل إلى درس<select id="op-lesson-filter"><option value="all">جميع الدروس · 20</option>${[...new Set(tasks.map(t=>t.lesson))].map(n=>`<option value="${n}">${n}. ${esc(lessonBy('os1-lesson-'+n)?.title||'')}</option>`).join('')}</select></label><div class="oc-course-index">${[...new Set(tasks.map(t=>t.lesson))].map(n=>{const list=tasks.filter(t=>t.lesson===n),lesson=lessonBy('os1-lesson-'+n);return `<section class="oc-lesson-group" data-lesson-number="${n}"><header><span>${String(n).padStart(2,'0')}</span><div><h2>${esc(lesson?.title||list[0].title)}</h2><p>${list.length===1?'مختبر متكامل للدرس':list.length+' تطبيقات بحسب المهارات'} · ${list[0].kind==='curriculum'?list[0].sources.length+' مشاهد مرتبطة':'واجهة Windows وSConfig'}</p></div></header><div class="op-cards">${list.map(t=>{const e=opEntry(t),latest=e?.history?.filter(h=>!h.archived).at(-1),done=latest?.passed&&latest?.reasonCorrect,count=t.actions?.filter(a=>e?.sim?.lab?.proofs[a.id]?.ok).length;return `<article class="op-card"><span class="op-card-number">${esc(t.subtitle)}</span><h3>${esc(t.title)}</h3><p>${esc(t.why)}</p><div class="op-card-bottom"><span>${done?'نتيجة سابقة ناجحة داخل المحاكاة':t.actions&&e?count+' / '+t.actions.length+' عمليات متحققة':e?'محاولتك محفوظة':'بيئة جاهزة'}</span><button data-os-lab="${t.id}">${e?'متابعة التطبيق':'افتح المختبر'} ${icon('arrow-left')}</button></div></article>`;}).join('')}</div></section>`;}).join('')}</div>`;}
  function opGoal(t,s){const g=op.target(t.id,s.variant);let text=t.kind==='curriculum'?'طبّق العمليات في أدوات Windows داخل المختبر. لكل عملية قيم مطلوبة ومشهد مصدر، وتُحفظ حالتك لكل درس مستقلة.':'';
   if(t.id==='install')text='ثبّت Windows Server 2012 R2 Datacenter Evaluation بواجهة GUI على LON-SVR3، كتثبيت جديد على Drive 0 Unallocated Space. لا تغيّر DC1.';
   if(t.id==='ipv4'||t.id==='core-network')text=(t.id==='core-network'?`اضبط اسم السيرفر إلى ${g.name} والمنطقة الزمنية ${g.zone} باستخدام SConfig، ثم `:'')+'اضبط الشبكة بالقيم أدناه، وافحص الإعدادات المحفوظة'+(t.id==='core-network'?' والاسم.':'.');
   if(t.id==='join')text=`غيّر الاسم إلى ${g.name} والمنطقة الزمنية إلى ${g.zone}، ثم انضم إلى adatum.com وسجّل بحساب المجال. الشبكة جاهزة. تحقّق من الاسم والعضوية وهوية المستخدم.`;
   if(t.id==='core-domain')text=`الجهاز ${g.name} جاهز، لكن DNS غير صحيح. صححه ثم افحص الوصول إلى lon-dc1.adatum.com، وانضم إلى adatum.com عبر SConfig، وسجّل بحساب المجال. أخيرًا افحص العضوية وهوية المستخدم والاتصال.`;
   if(t.id==='promote')text='جهّز LON-SVR1 ليصبح Domain Controller إضافيًا في adatum.com. المطلوب DNS وGlobal Catalog مفعّلان، وRODC مغلق. افحص المتطلبات، ثم أكمل التهيئة وإعادة التشغيل والتحقق.';
   if(t.id==='gc')text='LON-SVR1 أصبح DC، لكن Global Catalog غير مفعّل عليه. فعّله على هذا السيرفر، واترك DC1 كما هو، ثم أعد فتح الخصائص للتأكد.';
   return `<section class="op-goal"><span class="op-eyebrow">مهمتك · ${s.variant?'بيانات تدريب بديلة':'قيم الدرس'}</span><h2>${esc(t.title)}</h2><p>${esc(text)}</p>${['ipv4','core-network','core-domain'].includes(t.id)?`<dl class="op-values">${[['IP',g.ip],['Subnet Mask',g.mask],['Gateway',g.gateway],['Preferred DNS',g.dns]].map(([k,v])=>`<div><dt>${k}</dt><dd dir="ltr">${v}</dd></div>`).join('')}</dl>`:''}<p class="op-small">${esc(t.why)}</p></section>`;
  }
  function opTerminal(s){return `<section class="op-terminal" aria-label="سطر أوامر المحاكاة"><div class="op-terminal-title"><span dir="ltr">${esc(s.name)} · ${s.shell==='prompt'?'Command Prompt':'SConfig'}</span><span>محاكاة</span></div><pre tabindex="0" id="op-output" dir="auto">${esc(s.output.join('\n\n'))}</pre><form data-op-form="command" class="op-command"><span aria-hidden="true">›</span><label class="op-sr" for="op-command-input">${s.shell==='password'?'رمز التدريب Pa$$w0rd':'أدخل أمرًا أو قيمة حسب الطلب'}</label><input id="op-command-input" name="value" dir="ltr" type="${s.shell==='password'?'password':'text'}" autocomplete="off" autocapitalize="off" spellcheck="false" maxlength="160" placeholder="${s.shell==='prompt'?'اكتب الأمر هنا':'اكتب الإجابة هنا'}"><button type="submit" aria-label="تنفيذ الإدخال">Enter ↵</button></form><details><summary>الأوامر المتاحة</summary><p dir="ltr">sconfig.cmd · hostname · ipconfig /all · ping lon-dc1.adatum.com · systeminfo · whoami</p><p>اكتب cancel لإلغاء الإدخال الحالي. هذه قائمة محاكاة محدودة لمهارات الدرس.</p></details></section>`;}
  function opMachine(t,s){return t.kind==='curriculum'?ocDesktop(t,opEntry(t)):vmDesktop(t,opEntry(t));}
  function opFeedback(t,e){if(!e.last)return '';const r=e.last;return `<section class="op-result ${r.passed&&r.reasonCorrect?'op-success':''}" role="status"><h3>${r.passed?(r.reasonCorrect?'تحققت المهمة والفكرة':'الإعداد صحيح؛ راجع تفسيرك'):'بقيت نقطة تستحق المراجعة'}</h3><ul>${r.checks.map(c=>`<li>${c.ok?'✓':'○'} ${esc(c.label)}</li>`).join('')}</ul><p>${esc(t.explain)}</p><p class="op-small">${r.passed&&r.reasonCorrect?(r.helpCount?'نجاح داخل المحاكاة بعد مساعدة مسجلة.':'نجاح داخل المحاكاة دون مساعدة مسجلة في هذه المحاولة.'):'هذه نتيجة المحاولة الحالية فقط.'} لا تثبت هذه النتيجة تنفيذًا على Windows فعلي.</p><button data-op-action="source">ارجع للمشهد المرتبط ${icon('arrow-left')}</button></section>`;}
  function opPracticePage(){const d=opData(),t=opAvailable().find(t=>t.id===d.active),e=t&&opEntry(t);if(!t||!e)return `<section class="op-hub"><span class="op-eyebrow">نظم التشغيل · طبّق وتحقّق</span><h1>البيئة جاهزة. جرّب المهارة.</h1><p class="op-lead">تطبيقات قصيرة بحسب محتوى الدرس، بلا تثبيت برامج وبلا ترتيب إجباري. اختر ما تحتاجه الآن.</p>${opCards()}<details class="op-context"><summary>عن بيئة المختبر وحدود المحاكاة</summary><p>أسماء الأجهزة وأدوارها مأخوذة من دروسك ومرجع «20410 تشغيل Hyper V»: DC1 مسؤول المجال، SVR3 يبدأ فارغًا، CORE مثبت مسبقًا، وSVR1 عضو في المجال. الحالة تختلف بحسب المهارة؛ لا تحتاج تجهيز Hyper-V هنا.</p><p>تعمل داخل واجهة تحاكي نوافذ Windows Server 2012 R2 ومسارات مهارات هذه الدروس. اختُصرت مدة الانتظار، وكلمة مرور المختبر هي Pa$$w0rd؛ ليست نظام Windows كاملًا. التجربة الفعلية في الكلية تبقى تحققًا منفصلًا.</p><p>الدروس تحدد المهارات؛ هذه مراجع Microsoft لضبط الواجهة والسلوك فقط:</p><ul><li><a href="https://learn.microsoft.com/en-us/previous-versions/windows/it-pro/windows-server-2012-r2-and-2012/jj134147(v=ws.11)" target="_blank" rel="noopener">Server Manager · 2012/2012 R2</a></li><li><a href="https://learn.microsoft.com/en-us/previous-versions/windows/it-pro/windows-server-2012-r2-and-2012/jj647766(v=ws.11)" target="_blank" rel="noopener">SConfig · 2012/2012 R2</a></li><li><a href="https://learn.microsoft.com/en-us/previous-versions/windows/it-pro/windows-server-2012-r2-and-2012/hh831809(v=ws.11)" target="_blank" rel="noopener">Add Roles and Features · 2012/2012 R2</a></li><li><a href="https://learn.microsoft.com/en-us/windows-server/identity/ad-ds/deploy/install-a-replica-windows-server-2012-domain-controller-in-an-existing-domain--level-200-" target="_blank" rel="noopener">إضافة DC في مجال موجود · مسار Windows Server 2012</a></li></ul></details></section>`;
   if(e.sim.version!==op.VERSION)return '<section class="op-hub"><h1>محاولتك من إصدار سابق</h1><p>احتفظنا بها. نزّل بيانات مساحتك قبل تحديثها؛ لم نستبدل تقدمك.</p></section>';
   const s=e.sim,g=op.target(t.id,s.variant);return `<section class="op-lab" data-op-lab="${t.id}"><header class="op-header"><button data-op-action="list">${icon('arrow-right')} كل التطبيقات</button><span>الدرس ${t.lesson} · تدريب اختياري</span><button data-op-action="source">مشهد الشرح ${icon('play')}</button></header><h1 class="vm-task-title">${esc(t.title)}</h1><div class="op-layout"><details class="vm-brief" ${e.desktop?.briefOpen?'open':''}><summary>المهمة والقيم المطلوبة والمساعدة</summary>${opGoal(t,s)}<div class="op-environment"><div><span class="op-status-dot"></span><bdi>20410C-LON-DC1</bdi><small>المجال وDNS · جاهز</small></div><div><span class="op-status-dot"></span><bdi>${esc(g.name)}</bdi><small>${t.id==='install'?'الجهاز الذي ستثبّت عليه':'جهاز تطبيقك · حالة مستقلة'}</small></div></div><div class="op-help"><h3>تحتاج مساعدة؟</h3><p>اختر مقدار المساعدة. لا يتغير إعدادك تلقائيًا.</p><button data-op-action="help" data-help="hint">${icon('lightbulb')} وضّح الفكرة <small>توجيه يترك التنفيذ لك</small></button><button data-op-action="help" data-help="reveal">${icon('eye')} كشف الخطوة كاملة <small>يعرض مسار الحل</small></button>${e.helpShown?`<p class="op-help-text ${e.helpShown==='reveal'?'op-reveal':''}">${esc(e.helpShown==='reveal'?t.reveal:t.hint)}</p>`:''}<small>${e.help.length} مساعدات مختلفة مسجلة في المحاولة</small></div></details><div class="op-main-column">${t.id==='promote'?'<p class="op-source-note">في تسجيل الدرس ظهرت رسالة فشل ولم يُعرض حلّها. هنا تتدرّب على مسار نجاح محاكى بعد اجتياز الفحص؛ لا ننسب هذه النتيجة إلى الفيديو.</p>':''}${opMachine(t,s)}${t.kind==='curriculum'?'':`<p class="op-live" aria-live="polite">${esc(s.message)}</p>`}<section class="op-reason"><h3>تأكد من الفكرة</h3><p>${esc(t.question)}</p><div role="group" aria-label="اختر تفسيرك">${t.options.map((option,i)=>`<label><input type="radio" name="op-reason" value="${i}" ${e.reason===i?'checked':''}>${esc(option)}</label>`).join('')}</div></section><div class="op-checkbar"><button class="mh-primary" data-op-action="check">${icon('check-check')} تحقّق من النتيجة</button><span>نفّذ وافحص، ثم اختر تفسيرك.</span></div>${opFeedback(t,e)}<details class="op-history"><summary>محاولاتي وإعادة التدريب (${e.history.length})</summary><p>محاولة جديدة تبدأ ببيئة جاهزة وتبقي نتائجك السابقة. تكرار البيانات ليس قياسًا جديدًا للاحتفاظ.</p><div class="op-toolbar">${opBtn('محاولة جديدة بنفس المطلوب','retry')}${['ipv4','join','core-network','core-domain'].includes(t.id)?opBtn('جرّب بيانات مختلفة','vary'):''}</div>${e.history.length?`<ol>${e.history.slice().reverse().map(h=>`<li>${new Date(h.at).toLocaleDateString('ar-SA')} · ${h.archived?'إعداد محفوظ قبل بدء محاولة جديدة':h.passed&&h.reasonCorrect?'تحققت المهمة والفكرة':'تحتاج مراجعة'} · ${h.helpCount} مساعدات · ${h.variant?'بيانات بديلة':'قيم الدرس'}</li>`).join('')}</ol>`:'<p>لا توجد نتائج تحقق مسجلة بعد.</p>'}</details><details class="op-report"><summary>ملاحظتي أو بلاغ عن هذا التدريب</summary><p>يمكنك حفظ ملاحظتك مع الدرس، أو إرسال بلاغ يذكر اسم التدريب: ${esc(t.title)}.</p><div id="lesson-notes"></div><div id="op-feedback"></div></details></div></div></section>`;
  }
  function opPaint(focusCommand=false){const holder=$('#mh-main');if(!holder)return;holder.innerHTML=opPracticePage();paintIcons();vmAfterPaint();const t=opAvailable().find(t=>t.id===opData().active);if(t){const e=opEntry(t);for(const form of $$('[data-op-form]'))for(const [name,value] of Object.entries(e.drafts?.[form.dataset.opForm]||{})){const field=form.elements.namedItem(name);if(field&&field.type!=='password'){if(field.type==='checkbox')field.checked=!!value;else field.value=value;}}void window.MADAR_NOTES?.mount('os1-lesson-'+t.lesson,{video:false});const fb=$('#op-feedback');if(fb){fb.innerHTML=window.MADAR_FEEDBACK.markup();void window.MADAR_FEEDBACK.bind({subject:'OS1',bankVersion:'os1-scenes-20261027-v4',currentLesson:'os1-lesson-'+t.lesson,lessons:osList(),questions:[]});}}const output=$('#op-output');if(output)output.scrollTop=output.scrollHeight;if(focusCommand)$('#op-command-input')?.focus({preventScroll:true});}
  function opNew(t,variant,history=[]){return {attempt:crypto.randomUUID(),sim:op.create(t.id,variant),reason:null,help:[],helpShown:null,last:null,history};}
  function opSave(){scheduleSave();}
  function opHelp(e,type){if(!e.help.some(h=>h.type===type))e.help.push({type,strength:type.startsWith('reveal')?4:type==='feedback'?3:1,at:new Date().toISOString()});}
  root.addEventListener('input',ev=>{const field=ev.target,form=field.closest('[data-op-form]'),e=opData().entries?.[opData().active];if(!form||!e||!field.name||field.type==='password'||form.dataset.opForm==='command')return;e.drafts??={};e.drafts[form.dataset.opForm]??={};e.drafts[form.dataset.opForm][field.name]=field.type==='checkbox'?field.checked:field.value;opSave();});
  root.addEventListener('change',ev=>{if(ev.target.name!=='op-reason')return;const e=opData().entries?.[opData().active];if(!e)return;e.reason=Number(ev.target.value);e.last=null;$('.op-result')?.remove();opSave();});
  root.addEventListener('submit',ev=>{const form=ev.target.closest('[data-op-form]');if(!form)return;ev.preventDefault();const e=opData().entries?.[opData().active];if(!e)return;const data=Object.fromEntries(new FormData(form));for(const input of form.querySelectorAll('input[type=checkbox]'))data[input.name]=input.checked;e.sim=op.act(e.sim,form.dataset.opForm,data);if(e.drafts)delete e.drafts[form.dataset.opForm];e.last=null;opSave();opPaint(form.dataset.opForm==='command');});
  root.addEventListener('click',async ev=>{const b=ev.target.closest('button');if(!b)return;
   if(b.dataset.osLab){const t=opAvailable().find(t=>t.id===b.dataset.osLab);if(!t)return;const d=opWrite();d.entries[t.id]??=opNew(t,0);d.active=t.id;opSave();await go('course:os1:practice');opPaint();window.MADAR_ACTIVITY?.emit('detail_open',{lesson:'os1-lesson-'+t.lesson,value:'practice'});return;}
   if(!b.dataset.opAction)return;const action=b.dataset.opAction,d=opWrite(),t=opAvailable().find(t=>t.id===d.active),e=t&&d.entries[t.id];if(action==='list'){d.active=null;opSave();opPaint();return;}if(!t||!e)return;
   if(action==='source'){profile().osPositions??={};profile().osPositions['os1-lesson-'+t.lesson]={step:t.scene-1,seconds:0};opSave();await go('lesson:os1-lesson-'+t.lesson);return;}
   if(action==='help'){vmState(t,e).briefOpen=true;opHelp(e,b.dataset.help);e.helpShown=b.dataset.help;opSave();opPaint();return;}
   if(action==='retry'||action==='vary'){const box=b.closest('.op-toolbar');box.innerHTML=`<p>سيُحفظ إعدادك الحالي في السجل، وتبدأ بيئة جديدة.</p>${opBtn('ابدأ المحاولة الجديدة','confirm-retry',`data-mode="${action}"`)}${opBtn('إلغاء','cancel-retry')}`;return;}
   if(action==='cancel-retry'){opPaint();return;}
   if(action==='confirm-retry'){const history=e.history.slice();history.push({id:crypto.randomUUID(),at:new Date().toISOString(),variant:e.sim.variant,passed:!!e.last?.passed,reasonCorrect:!!e.last?.reasonCorrect,helpCount:e.help.length,archived:true,state:clone(e.sim)});d.entries[t.id]=opNew(t,b.dataset.mode==='vary'?(e.sim.variant+1)%3:e.sim.variant,history);opSave();opPaint();return;}
   if(action==='check'){if(e.reason===null){say('اختر تفسيرك في «تأكد من الفكرة» ثم تحقّق.');return;}if(e.last){say('نتيجة هذه الحالة ظاهرة؛ غيّر الإعداد أو ابدأ محاولة جديدة.');return;}const result=op.inspect(e.sim),record={id:crypto.randomUUID(),attempt:e.attempt,at:new Date().toISOString(),version:op.VERSION,variant:e.sim.variant,...result,answer:e.reason,reasonCorrect:e.reason===t.answer,helpCount:e.help.length,strength:Math.max(0,...e.help.map(x=>x.strength)),state:clone(e.sim)};e.history.push(record);e.last=record;opHelp(e,'feedback');opSave();opPaint();window.MADAR_ACTIVITY?.emit('training_check',{lesson:'os1-lesson-'+t.lesson,value:result.passed&&record.reasonCorrect?'correct':'incorrect'});$('#op-output')?.blur();$('.op-result')?.scrollIntoView({block:'nearest',behavior:'instant'});return;}
   e.sim=op.act(e.sim,action,{account:b.dataset.account,server:b.dataset.server});e.last=null;opSave();opPaint();
  });

  root.addEventListener('toggle',ev=>{if(ev.target.matches('.vm-brief')){const {e,u}=vmCurrent();if(e&&u&&u.briefOpen!==ev.target.open){u.briefOpen=ev.target.open;opSave();}}},true);

  root.addEventListener('change',ev=>{if(ev.target.id==='op-lesson-filter'){const value=ev.target.value;for(const section of $$('.oc-lesson-group'))section.hidden=value!=='all'&&section.dataset.lessonNumber!==value;}});

// Decorative Windows-inspired folds, not a real system state or lesson step.
function vmWindowsBackdrop(){return `<svg class="vm-windows-waves" viewBox="0 0 1600 900" preserveAspectRatio="xMidYMid slice" aria-hidden="true" focusable="false">
<defs>
 <linearGradient id="vm-wave-silk" x1="0" y1="0" x2="1" y2=".8"><stop stop-color="#080f1b"/><stop offset=".36" stop-color="#152c44"/><stop offset=".55" stop-color="#244b69"/><stop offset=".63" stop-color="#14283c"/><stop offset="1" stop-color="#09121e"/></linearGradient>
 <linearGradient id="vm-wave-fold" x1="0" y1="1" x2=".9" y2="0"><stop stop-color="#080e18"/><stop offset=".48" stop-color="#132c43"/><stop offset=".76" stop-color="#284f6a"/><stop offset=".81" stop-color="#3a6a83"/><stop offset=".86" stop-color="#172f47"/><stop offset="1" stop-color="#0b1727"/></linearGradient>
 <linearGradient id="vm-wave-edge" x1="0" y1="1" x2="1" y2="0"><stop stop-color="#5788a1" stop-opacity="0"/><stop offset=".48" stop-color="#5788a1" stop-opacity=".4"/><stop offset=".76" stop-color="#80aabe" stop-opacity=".55"/><stop offset="1" stop-color="#5788a1" stop-opacity="0"/></linearGradient>
 <radialGradient id="vm-wave-shade"><stop stop-color="#0c1723" stop-opacity=".45"/><stop offset=".67" stop-color="#07101b" stop-opacity=".05"/><stop offset="1" stop-color="#060d17" stop-opacity=".65"/></radialGradient>
</defs>
<g class="vm-wave-layer vm-wave-far">
 <path fill="url(#vm-wave-silk)" d="M-180 850C100 690 270 740 420 575S620 190 960 150s470 160 830-230V-200H-180Z"/>
 <path fill="none" stroke="url(#vm-wave-edge)" stroke-width="1.4" d="M-180 850C100 690 270 740 420 575S620 190 960 150s470 160 830-230"/>
 <path class="vm-wave-current" d="M-180 850C100 690 270 740 420 575S620 190 960 150s470 160 830-230"/>
</g>
<g class="vm-wave-layer vm-wave-middle">
 <path fill="url(#vm-wave-fold)" d="M-200 1100C120 600 430 980 650 680S800 90 1180 220s450-140 650-520V1100Z"/>
 <path fill="none" stroke="url(#vm-wave-edge)" stroke-width="2" d="M-200 1100C120 600 430 980 650 680S800 90 1180 220s450-140 650-520"/>
 <path class="vm-wave-current" d="M-200 1100C120 600 430 980 650 680S800 90 1180 220s450-140 650-520"/>
</g>
<g class="vm-wave-layer vm-wave-near">
 <path fill="url(#vm-wave-silk)" d="M-100 1150C190 785 550 990 880 680s230-400 510-330 300-120 450-280V1100Z"/>
 <path fill="none" stroke="url(#vm-wave-edge)" stroke-width="1.5" d="M-100 1150C190 785 550 990 880 680s230-400 510-330 300-120 450-280"/>
 <path class="vm-wave-current" d="M-100 1150C190 785 550 990 880 680s230-400 510-330 300-120 450-280"/>
</g>
<rect width="1600" height="900" fill="url(#vm-wave-shade)"/>
</svg><div class="vm-wave-atmosphere" aria-hidden="true"></div>`;}


  // Reuse the exact MADAR sphere and fluid satellite from the reference artwork.
  let vmOrbits=[];
  const vmOrbitTime={};
  function vmOrbitalMark(kind){return `<div class="mh-main-mark vm-orbital-mark vm-orbit-${kind}" data-vm-orbit="${kind}" aria-hidden="true"><div class="mh-orbit-core"></div><span class="vm-orbit-server">${vmGlyph('server')}</span><div class="mh-liquid-bubble"><canvas></canvas></div></div>`;}
  function vmOrbitSync(){
    for(const item of vmOrbits){vmOrbitTime[item.key]=item.orbit.snapshot();item.orbit.dispose();}
    vmOrbits=$$('[data-vm-orbit]').map(mark=>({key:mark.dataset.vmOrbit,mark,orbit:createLiquidOrbit(mark,{...vmOrbitTime[mark.dataset.vmOrbit],speed:.16,colorSpeed:.35})}));
  }
  function vmOrbitTick(t,stopped){
    if(!vmOrbits.length)return;
    const bench=$('.vm-workbench'),hold=stopped||!bench||bench.dataset.motion==='paused';
    for(const item of vmOrbits)item.orbit.tick(t,hold);
    if(!bench){for(const item of vmOrbits){vmOrbitTime[item.key]=item.orbit.snapshot();item.orbit.dispose();}vmOrbits=[];}
  }
  // Windows lab presentation. Only browser simulation state is changed.
  // Decorative vector icons; labels and lesson actions remain the same.
  function vmFocusWindow(ev){const panel=ev.target.closest('[data-window-id]');if(!panel)return;const {u}=vmCurrent();if(!u)return;const w=u.windows.find(x=>x.id===panel.dataset.windowId);if(!w)return;u.windows=u.windows.filter(x=>x!==w).concat(w);for(const el of $$('[data-window-id]')){el.style.zIndex=20+u.windows.findIndex(x=>x.id===el.dataset.windowId);el.classList.toggle('vm-front',el===panel);}opSave();}
  root.addEventListener('click',vmFocusWindow,true);
  root.addEventListener('focusin',vmFocusWindow);
  function vmGlyph(name){const paths={server:'<rect x="4" y="3" width="16" height="7" rx="1.5"/><rect x="4" y="14" width="16" height="7" rx="1.5"/><path d="M8 6.5h.01M8 17.5h.01M12 6.5h5M12 17.5h5"/>',terminal:'<rect x="2" y="4" width="20" height="16" rx="2"/><path d="m6 9 3 3-3 3m6 0h5"/>',windows:'<path d="M3 4 11 3v8H3Zm10-1 8-1v9h-8ZM3 13h8v8l-8-1Zm10 0h8v9l-8-1Z"/>',network:'<rect x="8" y="2" width="8" height="6" rx="1"/><path d="M12 8v5M4 16v-3h16v3"/><rect x="1" y="16" width="6" height="5" rx="1"/><rect x="9" y="16" width="6" height="5" rx="1"/><rect x="17" y="16" width="6" height="5" rx="1"/>',clock:'<circle cx="12" cy="12" r="9"/><path d="M12 6v6l4 2"/>',user:'<circle cx="12" cy="8" r="4"/><path d="M4 22v-3a8 8 0 0 1 16 0v3"/>',monitor:'<rect x="2" y="3" width="20" height="14" rx="2"/><path d="M12 17v4m-5 0h10"/>'};return `<svg class="vm-glyph" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false">${paths[name]||paths.server}</svg>`;}
  const vmNames=['LON-DC1','LON-SVR1','LON-SVR3','LON-CORE'];
  function vmMachineNames(t,s){const n=op.target(t.id,s.variant).name;return vmNames.map(x=>t.kind==='core'&&x==='LON-CORE'?n:t.id==='join'&&x==='LON-SVR3'?n:x);}
  const vmTitles={server:'Server Manager',network:'Network Connections',ethernet:'Ethernet Status',adapter:'Ethernet Properties',ipv4:'Internet Protocol Version 4 (TCP/IPv4) Properties',system:'System Properties',rename:'Computer Name/Domain Changes',credentials:'Windows Security',datetime:'Date and Time',timezone:'Time Zone Settings',clock:'Date and Time Settings',boot:'Virtual Machine Connection',promoteCredentials:'Windows Security',terminal:'Administrator: Command Prompt',roles:'Add Roles and Features Wizard',promotion:'Active Directory Domain Services Configuration Wizard',sites:'Active Directory Sites and Services',ntds:'NTDS Settings Properties',settings:'Virtual Machine Settings',browse:'Open',setup:'Windows Setup',control:'Control Panel',message:'Microsoft Windows'};
  function vmCurrent(){const t=opAvailable().find(x=>x.id===opData().active),e=t&&opEntry(t);return {t,e,s:e?.sim,u:e&&vmState(t,e)};}
  function vmState(t,e){if(!e.desktop)e.desktop={version:2,screen:'host',selected:op.target(t.id,e.sim.variant).name,windows:[],next:1,start:false,menu:null,serverPage:'Dashboard',tree:['Sites'],setup:{},roleStep:0,promoteStep:0,login:false,trace:[]};return e.desktop;}
  const vb=(text,a,extra='')=>`<button type="button" data-vm="${a}" ${extra}>${text}</button>`;
  const vopen=(label,id)=>vb(label,'open',`data-window="${id}"`);
  const vi=(name,label,value='',type='text')=>`<label class="vm-field">${label}<input name="${name}" value="${esc(value)}" type="${type}" autocomplete="off" spellcheck="false" dir="ltr"></label>`;
  const vs=(name,label,options,value)=>`<label class="vm-field">${label}<select name="${name}">${options.map(([v,l])=>`<option value="${esc(v)}" ${v===value?'selected':''}>${esc(l)}</option>`).join('')}</select></label>`;
  const vt=(name,label,checked=false)=>`<label class="vm-tick"><input type="checkbox" name="${name}" ${checked?'checked':''}> ${label}</label>`;
  const vf=(action,body,submit='OK')=>`<form data-vm-form="${action}">${body}<footer class="vm-dialog-footer"><button type="submit">${submit}</button>${vb('Cancel','close')}</footer></form>`;
  function vmOpen(u,id){let w=u.windows.find(w=>w.id===id);if(!w){w={id,key:u.next++,x:36+u.windows.length*20,y:30+u.windows.length*18,min:false,max:false};u.windows.push(w);}else{w.min=false;u.windows=u.windows.filter(x=>x!==w).concat(w);}u.start=false;u.menu=null;u.trace.push({action:'open',window:id,at:new Date().toISOString()});u.trace=u.trace.slice(-100);}
  function vmClose(u,id){u.windows=u.windows.filter(w=>w.id!==id);const forms={ipv4:'network',rename:'rename',credentials:'credentials',timezone:'timezone',ntds:'ntds',settings:'dvd',clock:'clock',promoteCredentials:'promoteCredentials'};if(u.forms&&forms[id])delete u.forms[forms[id]];}
  function vmMessage(u,text,after=''){u.message=text;u.after=after;vmOpen(u,'message');}
  function vmCommit(e,action,data={}){e.sim=op.act(e.sim,action,data);e.last=null;}
  function vmWindow(t,e,w){const u=vmState(t,e),s=e.sim;return `<section class="vm-window ${u.windows.filter(x=>!x.min).at(-1)?.id===w.id?'vm-front':''} ${w.max?'vm-max':''} ${w.id==='terminal'?'vm-console-window':''} ${['server','roles','promotion','sites','setup','settings'].includes(w.id)?'vm-wide':''}" role="dialog" aria-label="${esc(vmTitles[w.id])}" data-window-id="${w.id}" style="--wx:${w.x}px;--wy:${w.y}px;z-index:${20+u.windows.indexOf(w)};${w.min?'display:none':''}"><header class="vm-titlebar" data-vm-drag="${w.id}"><span>${vmGlyph(w.id==='terminal'?'terminal':w.id==='network'?'network':'server')} ${esc(vmTitles[w.id])}</span><div>${vb('—','min',`aria-label="Minimize ${esc(vmTitles[w.id])}"`)}${vb(w.max?'❐':'□','max',`aria-label="Maximize ${esc(vmTitles[w.id])}"`)}${vb('×','close',`aria-label="Close ${esc(vmTitles[w.id])}"`)}</div></header><div class="vm-window-content">${vmBody(t,e,w.id)}</div></section>`;}
  function vmBody(t,e,id){const s=e.sim,u=vmState(t,e),g=op.target(t.id,s.variant),z=u.setup;
    if(id==='boot')return '<div class="vm-native-terminal"><p>Press any key to boot from CD or DVD . . .</p>'+vb('Press a key','boot-key')+'</div>';
    if(id==='clock'){const current=z.clock||new Date().toLocaleString('sv-SE',{timeZone:'Asia/Riyadh'}).slice(0,16).replace(' ','T');return vf('clock','<div class="vm-dialog">'+vi('clock','Date and time:',current,'datetime-local')+'<p dir="rtl">ساعة الجهاز المحاكى فقط. المرجع الحالي وقت الرياض.</p></div>');}
    if(id==='promoteCredentials')return vf('promoteCredentials','<div class="vm-dialog"><p>Supply credentials for ADATUM</p>'+vi('user','User name:','')+vi('password','Training password: Pa$$w0rd','','password')+'</div>');
    if(id==='message')return `<div class="vm-message"><span>ⓘ</span><p>${esc(u.message)}</p></div><footer class="vm-dialog-footer">${vb(u.after==='features'?'Add Features':u.after==='allow-restart'?'Yes':'OK','message-ok')}${['features','allow-restart'].includes(u.after)?vb('Cancel','close'):''}</footer>`;
    if(id==='settings')return `<div class="vm-split"><aside>Hardware<hr>IDE Controller 1<br>　DVD Drive<br>Network Adapter<hr>Management</aside><main><h2>DVD Drive</h2><p>Specify the media to use with this virtual DVD drive.</p>${vf('dvd',vs('iso','Image file:',[['','None'],['Windows2012R2RTM.iso','D:\\Program Files\\Microsoft Learning\\20410\\Drives\\Windows2012R2RTM.iso']],z.iso||'')+vopen('Browse…','browse'),'OK')}</main></div>`;
    if(id==='browse')return `<div class="vm-address">D: › Program Files › Microsoft Learning › 20410 › Drives</div><div class="vm-file-list"><p>Windows2012R2RTM.iso</p>${vb('Open','choose-iso')}</div><footer class="vm-dialog-footer">${vb('Cancel','close')}</footer>`;
    if(id==='server'){const local=u.serverPage==='Local Server';return `<div class="vm-manager-head"><strong>Server Manager › ${local?'Local Server':'Dashboard'}</strong><div>${vb('⚑','notifications')}${vb('Manage','manage')}${vb('Tools','tools')}${vb('View','view')}</div></div>${u.menu==='manage'?`<div class="vm-menu vm-top-menu">${vopen('Add Roles and Features','roles')}${vb('Server Manager Properties','manager-info')}</div>`:u.menu==='tools'?`<div class="vm-menu vm-top-menu">${vopen('Active Directory Sites and Services','sites')}</div>`:u.menu==='notifications'?`<div class="vm-menu vm-top-menu"><p>${s.roleInstalled?'Post-deployment Configuration':'No tasks are running'}</p>${s.roleInstalled?vopen('Promote this server to a domain controller','promotion'):''}</div>`:''}<div class="vm-split vm-manager"><nav>${['Dashboard','Local Server','All Servers',...(s.roleInstalled?['AD DS','DNS']:[])].map(n=>vb(n,'server-page',`data-page="${n}" class="${u.serverPage===n?'selected':''}"`)).join('')}</nav><main>${local?`<h3>PROPERTIES <small>${esc(s.name)}</small></h3><dl class="vm-properties"><dt>Computer name</dt><dd>${vopen(esc(s.name),'system')}</dd><dt>Domain</dt><dd>${vopen(esc(s.domain),'system')}</dd><dt>Windows Firewall</dt><dd>Public: On</dd><dt>Remote management</dt><dd>Enabled</dd><dt>Ethernet</dt><dd>${vopen(s.ip?esc(s.ip)+', IPv6 enabled':'IPv4 address assigned by DHCP, IPv6 enabled','network')}</dd><dt>Time zone</dt><dd>${vopen(esc(s.zone)+(s.zone==='UTC+03:00'?' Kuwait, Riyadh':' London'),'datetime')}</dd><dt>Operating system</dt><dd>Microsoft Windows Server 2012 R2</dd></dl>`:u.serverPage==='All Servers'?`<h2>All Servers</h2><table><tr><th>Name</th><th>IP address</th><th>Manageability</th></tr><tr><td>${esc(s.name)}</td><td>${esc(s.ip)}</td><td>Online</td></tr><tr><td>LON-DC1</td><td>${g.dns}</td><td>Online</td></tr></table>`:u.serverPage==='AD DS'||u.serverPage==='DNS'?`<h2>${u.serverPage}</h2><p>${s.roleInstalled?'Role installed':'Role not installed on this server'}</p>${s.roleInstalled&&!s.dc?vopen('More… Configuration required','promotion'):''}${s.dc?vb('Refresh server status','dc-check'):''}`:`<h2>Welcome to Server Manager</h2><div class="vm-quick"><span>QUICK START</span>${vb('① Configure this local server','server-page','data-page="Local Server"')}${vopen('② Add roles and features','roles')}</div><div class="vm-tiles"><div>Local Server<strong>✓ Manageability</strong></div><div>All Servers<strong>2 servers</strong></div>${s.roleInstalled?'<div>AD DS<strong>Configuration</strong></div>':''}</div>`}</main></div>`;}
    if(id==='control')return `<div class="vm-address">Control Panel › All Control Panel Items</div><div class="vm-control-grid">${vopen('▣ System','system')}${vopen('▦ Network Connections','network')}${vopen('◷ Date and Time','datetime')}${vopen('⚙ Administrative Tools','server')}</div>`;
    if(id==='network')return `<div class="vm-address">Control Panel › Network and Internet › Network Connections</div><div class="vm-adapter-item" data-vm-context="adapter"><button data-vm="open" data-window="ethernet">▦ <b>Ethernet</b><small>${s.domain==='WORKGROUP'?'Unidentified network':esc(s.domain)}<br>Microsoft Hyper-V Network Adapter</small></button></div><footer class="vm-dialog-footer">${vopen('Properties','adapter')}</footer>`;
    if(id==='ethernet')return `<div class="vm-tabs">General</div><div class="vm-dialog"><h3>Connection</h3><dl class="vm-properties"><dt>IPv4 Connectivity:</dt><dd>${op.canResolve(s)?'Network':'No network access'}</dd><dt>Media State:</dt><dd>Enabled</dd><dt>Speed:</dt><dd>10.0 Gbps</dd></dl><h3>Activity</h3><p>Sent　　▦ ─── ▦　　Received</p></div><footer class="vm-dialog-footer">${vopen('Properties','adapter')}${vb('Close','close')}</footer>`;
    if(id==='adapter')return `<div class="vm-tabs">Networking</div><div class="vm-dialog"><p>Connect using:</p><div class="vm-bordered">Microsoft Hyper-V Network Adapter</div><p>This connection uses the following items:</p><div class="vm-component-list"><label>☑ Client for Microsoft Networks</label><label>☑ File and Printer Sharing for Microsoft Networks</label><label>☑ QoS Packet Scheduler</label>${vb('☑ Internet Protocol Version 4 (TCP/IPv4)','select-ipv4',`class="${u.ipv4Selected?'selected':''}"`)}<label>☑ Internet Protocol Version 6 (TCP/IPv6)</label></div><div class="vm-right">${vb('Properties','ipv4-properties')}</div></div><footer class="vm-dialog-footer">${vb('OK','close')}${vb('Cancel','close')}</footer>`;
    if(id==='ipv4')return `<div class="vm-tabs">General</div>${vf('network',`<div class="vm-dialog"><p>You can get IP settings assigned automatically, or specify the appropriate IP settings.</p><label class="vm-tick"><input type="radio" name="addressMode" value="auto" ${s.ip?'':'checked'}> Obtain an IP address automatically</label><label class="vm-tick"><input type="radio" name="addressMode" value="static" ${s.ip?'checked':''}> Use the following IP address:</label><div class="vm-indent">${vi('ip','IP address:',s.ip)}${vi('mask','Subnet mask:',s.mask)}${vi('gateway','Default gateway:',s.gateway)}</div><label class="vm-tick"><input type="radio" name="dnsMode" value="auto" ${s.dns?'':'checked'}> Obtain DNS server address automatically</label><label class="vm-tick"><input type="radio" name="dnsMode" value="static" ${s.dns?'checked':''}> Use the following DNS server addresses:</label><div class="vm-indent">${vi('dns','Preferred DNS server:',s.dns)}<label class="vm-field">Alternate DNS server:<input disabled aria-label="Alternate DNS server" placeholder="Not used in this lesson"></label></div></div>`)} `;
    if(id==='system')return `<div class="vm-tabs">Computer Name　 Hardware　 Advanced</div><div class="vm-dialog"><p>Windows uses the following information to identify your computer on the network.</p><dl class="vm-properties"><dt>Full computer name:</dt><dd>${esc(s.pendingName||s.name)}${s.domain==='WORKGROUP'?'':'.'+s.domain}</dd><dt>${s.domain==='WORKGROUP'?'Workgroup:':'Domain:'}</dt><dd>${esc(s.domain)}</dd></dl><p>To rename this computer or change its domain or workgroup, click Change.</p><div class="vm-right">${vopen('Change…','rename')}</div>${s.pendingName||s.pendingDomain?'<p>Changes will take effect after you restart this computer.</p>':''}</div><footer class="vm-dialog-footer">${vb('OK','close')}${vb('Cancel','close')}</footer>`;
    if(id==='rename')return vf('rename',`<div class="vm-dialog">${vi('name','Computer name:',s.pendingName||s.name)}<fieldset><legend>Member of</legend><label class="vm-tick"><input type="radio" name="membership" value="domain" ${s.domain!=='WORKGROUP'?'checked':''}> Domain:</label>${vi('domain','',s.domain==='WORKGROUP'?'':s.domain)}<label class="vm-tick"><input type="radio" name="membership" value="workgroup" ${s.domain==='WORKGROUP'?'checked':''}> Workgroup:</label><input value="WORKGROUP" readonly></fieldset></div>`);
    if(id==='credentials')return vf('credentials',`<div class="vm-dialog"><h2>Windows Security</h2><p>Enter the name and password of an account with permission to join the domain.</p>${vi('user','User name:','')}${vi('password','Password (training: Pa$$w0rd):','','password')}<p class="vm-training-note" dir="rtl">استخدم رمز التدريب Pa$$w0rd فقط، وليس كلمة مرور شخصية.</p></div>`);
    if(id==='datetime')return `<div class="vm-tabs">Date and Time　 Additional Clocks</div><div class="vm-dialog"><div class="vm-clock">◷</div><h3>Date and Time</h3><p>Time zone: ${esc(s.zone)}</p>${vopen('Change date and time…','clock')}${vopen('Change time zone…','timezone')}<p>${esc(z.clock||'Current laboratory time')}</p></div><footer class="vm-dialog-footer">${vb('OK','close')}</footer>`;
    if(id==='timezone')return vf('timezone',`<div class="vm-dialog">${vs('zone','Time zone:',[['UTC+00:00','(UTC) Dublin, Edinburgh, Lisbon, London'],['UTC+03:00','(UTC+03:00) Kuwait, Riyadh']],s.zone)}</div>`);
    if(id==='terminal')return `<div class="vm-native-terminal ${s.shell!=='prompt'?'vm-sconfig':''}"><pre id="op-output" tabindex="0">${esc(s.output.join('\n\n'))}</pre><form data-vm-form="command"><label for="vm-cmd">${s.shell==='prompt'?'C:\\Users\\Administrator>':'Select option:'}</label><input id="vm-cmd" name="value" aria-label="Command Prompt input" type="${s.shell==='password'?'password':'text'}" autocomplete="off" autocapitalize="off" spellcheck="false"><button type="submit">↵</button></form></div>`;
    if(id==='roles')return vmRoleWizard(t,e);
    if(id==='promotion')return vmPromotion(t,e);
    if(id==='setup')return vmSetup(t,e);
    if(id==='sites')return `<div class="vm-menubar">File　 Action　 View　 Help</div><div class="vm-split vm-mmc"><nav>${vb('▾ Active Directory Sites and Services','tree','data-node="root"')}${vb((u.tree.includes('Sites')?'▾':'▸')+' Sites','tree','data-node="Sites"')}${u.tree.includes('Sites')?`<div class="vm-tree-indent">${vb((u.tree.includes('site')?'▾':'▸')+' Default-First-Site-Name','tree','data-node="site"')}${u.tree.includes('site')?`<div class="vm-tree-indent">${vb((u.tree.includes('Servers')?'▾':'▸')+' Servers','tree','data-node="Servers"')}${u.tree.includes('Servers')?['LON-DC1','LON-SVR1'].map(n=>`<div class="vm-tree-indent">${vb((u.tree.includes(n)?'▾':'▸')+' '+n,'tree',`data-node="${n}"`)}${u.tree.includes(n)?`<div data-vm-context="ntds" data-server="${n}">${vb('▣ NTDS Settings','select-ntds',`data-server="${n}"`)}</div>`:''}</div>`).join(''):''}</div>`:''}</div>`:''}</nav><main><h3>${esc(u.ntdsServer||'Sites')}</h3><table><tr><th>Name</th><th>Type</th></tr><tr><td>${u.ntdsServer?'NTDS Settings':'Default-First-Site-Name'}</td><td>${u.ntdsServer?'NTDS Settings':'Site'}</td></tr></table>${u.ntdsServer?vb('Properties','ntds-properties'):''}</main></div>`;
    if(id==='ntds')return `<div class="vm-tabs">General　 Object　 Connections</div>${vf('ntds',`<div class="vm-dialog"><h3>NTDS Settings</h3><p>Server: ${esc(s.selectedDC)}</p>${vt('enabled','Global Catalog',s.selectedDC==='LON-SVR1'?s.gcSVR1:s.gcDC1)}</div>${vb('Apply','ntds-apply')}`,'OK')}`;
    return '';
  }
  const vmRolePages=['Before you begin','Installation Type','Server Selection','Server Roles','Features','AD DS','Confirmation','Results'];
  const vmPromotePages=['Deployment Configuration','Domain Controller Options','DNS Options','Additional Options','Paths','Review Options','Prerequisites Check','Results'];
  function vmWizard(pages,step,body,form,button='Next >'){return `<div class="vm-wizard-heading"><h2>${pages[step]}</h2><small>TARGET SERVER<br>LON-SVR1.Adatum.com</small></div><form data-vm-form="${form}"><div class="vm-wizard"><nav>${pages.map((p,i)=>`<span class="${i===step?'selected':''}">${p}</span>`).join('')}</nav><main>${body}</main></div><footer class="vm-dialog-footer">${step>0?vb('< Previous','wizard-back',`data-wizard="${form}"`):''}${button?`<button type="submit">${button}</button>`:''}${vb(step===pages.length-1?'Close':'Cancel','close')}</footer></form>`;}
  function vmRoleWizard(t,e){const u=vmState(t,e),s=e.sim,z=u.setup,k=u.roleStep;const bodies=[
    '<p>This wizard helps you install roles, role services, or features.</p><p>Before you continue, verify the following tasks:</p><ul><li>The Administrator account has a strong password.</li><li>Network settings, such as static IP addresses, are configured.</li><li>The most current security updates are installed.</li></ul>',
    '<label class="vm-tick"><input type="radio" name="type" value="role" checked> Role-based or feature-based installation</label><p>Configure a single server by adding roles, role services, and features.</p><label class="vm-tick"><input type="radio" name="type" value="rds"> Remote Desktop Services installation</label>',
    vs('host','Select a server from the server pool:',[['LON-SVR1','LON-SVR1.Adatum.com'],['LON-DC1','LON-DC1.Adatum.com']],z.host||'LON-SVR1')+'<p>Operating System: Microsoft Windows Server 2012 R2</p>',
    `<p>Select one or more roles to install on the selected server.</p>${vt('adcs','Active Directory Certificate Services',z.role==='AD CS')}${vt('adds','Active Directory Domain Services',z.role==='AD DS')}<p>${z.features?'✓ Management tools selected':''}</p>`,
    `<h3>Features</h3><p>☑ Group Policy Management</p><p>☑ Remote Server Administration Tools</p><p>　☑ Role Administration Tools</p><p>　　☑ AD DS and AD LDS Tools</p>`,
    '<p>Active Directory Domain Services stores information about users, computers, and other devices on the network.</p><p>After installing this role, use the AD DS Configuration Wizard to configure this server as a domain controller.</p>',
    `<p>Install the following roles, role services, or features on:</p><strong>${esc(z.host||'LON-SVR1')}</strong><p>${esc(z.role||'No role selected')}</p><p>Group Policy Management<br>AD DS management tools</p>${vt('autoRestart','Restart the destination server automatically if required',z.autoRestart)}`,
    `<div class="vm-success">${s.roleInstalled?'Installation succeeded':'Installation failed'}</div><p>${esc(s.message)}</p>${s.roleInstalled?vopen('Promote this server to a domain controller','promotion'):''}`];
    return vmWizard(vmRolePages,k,bodies[k],'roles',k===6?'Install':k===7?'':'Next >');}
  function vmPromotion(t,e){const u=vmState(t,e),s=e.sim,z=u.setup,k=u.promoteStep;const bodies=[
    vs('deployment','Select the deployment operation:',[['existing','Add a domain controller to an existing domain'],['new-domain','Add a new domain to an existing forest'],['forest','Add a new forest']],s.deployment||'existing')+vi('domain','Domain:',s.promoteDomain)+'<p>Supply the credentials to perform this operation:</p><p>'+esc(s.auth==='domain'?'ADATUM\\Administrator':'Local Administrator')+'</p>'+vopen('Change…','promoteCredentials'),
    `<p>Specify domain controller capabilities and site information.</p>${vt('dnsRole','Domain Name System (DNS) server',s.dnsRole)}${vt('gc','Global Catalog (GC)',s.gc)}${vt('rodc','Read only domain controller (RODC)',s.rodc)}${vs('site','Site name:',[['Default-First-Site-Name','Default-First-Site-Name']],z.site||'Default-First-Site-Name')}<p>Directory Services Restore Mode (DSRM) password:</p>${vi('secret','Password:','','password')}${vi('confirm','Confirm password:','','password')}<small dir="rtl">كلمة مرور الدرس: <bdi>Pa$$w0rd</bdi>؛ لا يُخزّن الإدخال.</small>`,
    '<div class="vm-warning">⚠ A delegation for this DNS server cannot be created because the authoritative parent zone cannot be found.</div><p>This laboratory uses the existing adatum.com DNS zone. Verify the deployment context before continuing.</p>',
    vs('replication','Replicate from:',[['any','Any domain controller'],['LON-DC1','LON-DC1.Adatum.com']],z.replication||'any'),
    vi('database','Database folder:',z.database||'C:\\Windows\\NTDS')+vi('logs','Log files folder:',z.logs||'C:\\Windows\\NTDS')+vi('sysvol','SYSVOL folder:',z.sysvol||'C:\\Windows\\SYSVOL'),
    `<h3>Review your selections</h3><p>Additional domain controller for ${esc(s.promoteDomain)}</p><p>DNS Server: ${s.dnsRole}<br>Global Catalog: ${s.gc}<br>Read-only DC: ${s.rodc}</p><p>Site: ${esc(z.site||'Default-First-Site-Name')}<br>Replicate from: ${esc(z.replication||'any')}</p><p>${esc(z.database||'C:\\Windows\\NTDS')}<br>${esc(z.sysvol||'C:\\Windows\\SYSVOL')}</p>`,
    `<div class="${s.precheck===s.revision?'vm-success':'vm-warning'}">${esc(s.message)}</div><p>All prerequisites must be checked after the latest change.</p>${vb('Rerun prerequisites check','precheck')}<p>The server will restart after successful configuration.</p>`,
    `<div class="vm-success">${s.pendingDC?'Configuration completed. Restart required.':s.dc?'This server is now a domain controller.':'Configuration not completed.'}</div>${s.pendingDC?vb('Restart now','restart'):''}`];
    return vmWizard(vmPromotePages,k,bodies[k],'promotion',k===6?(s.precheck===s.revision?'Install':''):k===7?'':'Next >');}
  function vmSetup(t,e){const u=vmState(t,e),s=e.sim,z=u.setup,k=z.step||0;const bodies=[
    `<div class="vm-setup-logo">▦ Windows Server 2012 R2</div>${vs('language','Language to install:',[['en','English (United States)']],'en')}${vs('locale','Time and currency format:',[['en','English (United States)']],'en')}${vs('keyboard','Keyboard or input method:',[['us','US']],'us')}`,
    '<div class="vm-setup-logo">▦ Windows Server 2012 R2</div><p>Install Windows Server</p>',
    `<h2>Select the operating system you want to install</h2>${vs('edition','Operating system:',[['Core','Windows Server 2012 R2 Datacenter Evaluation (Server Core Installation)'],['GUI','Windows Server 2012 R2 Datacenter Evaluation (Server with a GUI)']],z.edition||'Core')}<p>x64 · Windows Server 2012 R2</p>`,
    `<h2>License terms</h2><div class="vm-license">Training simulation — no actual software license is being accepted.<p>This screen represents the license-acceptance step in Windows Setup. Review the actual Microsoft license when installing a real system.</p></div>${vt('license','I accept the license terms (simulation)',z.license)}`,
    `<h2>Which type of installation do you want?</h2>${vs('mode','Installation type:',[['Upgrade','Upgrade: Install Windows and keep files, settings, and applications'],['Custom','Custom: Install Windows only (advanced)']],z.mode||'Upgrade')}`,
    `<h2>Where do you want to install Windows?</h2>${vs('disk','Drive:',[['Drive 0 Unallocated Space','Drive 0 Unallocated Space — 127.0 GB']],z.disk||'Drive 0 Unallocated Space')}<p>The disk selection affects this simulated machine only.</p>`,
    `<h2>Installing Windows</h2><div class="vm-progress"><i></i></div><p>✓ Copying Windows files<br>✓ Getting files ready for installation<br>✓ Installing features<br>✓ Finishing up</p><p dir="rtl">اكتمل الانتقال المحاكى دون انتظار التثبيت الحقيقي.</p>`,
    `<h2>Settings</h2><p>Set the local Administrator password.</p>${vi('password','Training password:','','password')}${vi('confirm','Confirm training password:','','password')}<p dir="rtl">أدخل Pa$$w0rd في الحقلين. لا تُستخدم كلمة مرور حقيقية.</p>`];
    return `<form data-vm-form="setup"><div class="vm-setup-page">${bodies[k]}</div><footer class="vm-dialog-footer">${k>1&&k<6?vb('← Back','setup-back'):''}<button type="submit">${k===1?'Install now':k===5?'Next':k===6?'Restart now':k===7?'Finish':'Next'}</button></footer></form>`;}
  function vmDesktop(t,e){const s=e.sim,u=vmState(t,e),g=op.target(t.id,s.variant),target=u.selected===g.name;return `<section class="vm-workbench ${u.expanded?'vm-expanded':''}" data-motion="${u.motionPaused?'paused':'running'}" aria-label="مختبر Windows Server الافتراضي"><div class="vm-lab-toolbar"><span>${vmOrbitalMark('badge')}<b>مـدار LAB</b><small>WINDOWS SERVER · 20410C</small></span><div>${vb('الأجهزة','host')}${vb(u.motionPaused?'تشغيل الحركة':'إيقاف الحركة','motion',`aria-pressed="${!!u.motionPaused}"`)}${u.screen==='guest'?vb('Ctrl + Alt + Delete','lock'):''}${vb('⛶','fullscreen','aria-label="ملء شاشة المختبر"')}</div><span class="vm-lab-state">● بيئة محاكاة محفوظة</span></div>${u.screen==='host'?`<div class="vm-hyperv"><div class="vm-host-title">${vmGlyph('server')} Hyper-V Manager</div><div class="vm-menubar">File　 Action　 View　 Help</div><div class="vm-host-grid"><nav>Hyper-V Manager<hr><strong>▣ COLLEGE-HOST</strong></nav><main><h2>Virtual Machines</h2><table><thead><tr><th>Name</th><th>State</th><th>Assigned Memory</th></tr></thead><tbody>${vmMachineNames(t,s).map(n=>`<tr class="${u.selected===n?'selected':''}" data-vm-select="${n}" tabindex="0" aria-label="20410C-${n}"><td>${vmGlyph('monitor')} 20410C-${n}</td><td>${n==='LON-SVR3'&&t.id==='install'&&!s.installed&&!u.power?'Off':'Running'}</td><td>${n==='LON-CORE'?'1024':'2048'} MB</td></tr>`).join('')}</tbody></table><div class="vm-host-preview"><span>${vmGlyph('server')}</span><div><h3>20410C-${esc(u.selected)}</h3><p>${u.selected==='LON-DC1'?'Domain Controller · DNS':u.selected==='LON-CORE'?'Server Core':u.selected==='LON-SVR1'?'Member Server':'Windows Server'}</p>${vb('Connect…','connect')}</div></div><p dir="rtl" class="vm-host-hint">انقر مرتين على الجهاز للاتصال به. الخطوات داخل هذه البيئة لا تغيّر جهازك الحقيقي.</p></main><aside><h3>Actions</h3><strong>${esc(u.selected)}</strong>${vb('Connect…','connect')}${vopen('Settings…','settings')}${vb('Start','power')}${vb('Restart','restart')}</aside></div></div>`:`<div class="vm-connectionbar" dir="ltr">20410C-${esc(u.selected)} on COLLEGE-HOST — Virtual Machine Connection <span>${vb('Action ▾','action-menu')}</span></div>${u.menu==='action'?`<div class="vm-menu">${vb('Start','power')}${vb('Ctrl + Alt + Delete','lock')}${vb('Restart','restart')}${vb('Return to Hyper-V Manager','host')}</div>`:''}<div class="vm-desktop ${t.kind==='core'?'vm-core-desktop':''}" data-vm-desktop><div class="vm-desktop-wallpaper" aria-hidden="true">${vmWindowsBackdrop()}</div><div class="vm-watermark"><b>${vmGlyph('windows')}</b><span>Windows Server<small>2012 R2 · ${esc(u.selected)}</small></span></div>${!target?`<div class="vm-remote-note"><h2>${esc(u.selected)}</h2><p>هذا الجهاز مرجع جاهز في بيئة المهارة الحالية. اختر جهاز التطبيق من Hyper-V Manager.</p>${vb('Hyper-V Manager','host')}</div>`:!u.login&&!(t.id==='install'&&!s.installed)?`<form class="vm-logon" data-vm-form="login"><div class="vm-avatar">${vmGlyph('user')}</div><h2>Administrator</h2>${vs('account','Sign in to:',[['local',s.name+' (local)'],['domain','ADATUM']],s.session)}${vi('password','Training password: Pa$$w0rd','','password')}<button type="submit">Sign in →</button><small dir="rtl">محاكاة؛ لا تستخدم كلمة مرور شخصية.</small></form>`:t.id==='install'&&!u.power&&!s.installed?`<div class="vm-off">The virtual machine is turned off.${vb('Start','power')}</div>`:`${u.start?`<div class="vm-start"><h2>Start</h2><div>${vopen('▤ Server Manager','server')}${vopen('▣ Command Prompt','terminal')}${vopen('⚙ Control Panel','control')}${vopen('▦ Network Connections','network')}${vopen('◷ Date and Time','datetime')}${vb('⏻ Restart','restart')}${vb('⇥ Sign out','lock')}</div></div>`:''}<div class="vm-desktop-icons">${t.kind==='core'||s.edition==='Core'?'':vopen(vmGlyph('server')+'<small>Server Manager</small>','server')}${vopen(vmGlyph('terminal')+'<small>Command Prompt</small>','terminal')}</div>`}<footer class="vm-taskbar">${t.kind==='core'?'':vb(vmGlyph('windows'),'start','aria-label="Start menu"')}${u.windows.map(w=>vb(`${vmGlyph(w.id==='terminal'?'terminal':'server')} <span>${esc(vmTitles[w.id])}</span>`,'restore',`data-window="${w.id}" class="${w.min?'':'active'}"`)).join('')}<span class="vm-taskbar-tray">${t.kind==='core'?'':vopen('◷ '+esc(s.zone),'datetime')}</span></footer></div>`}<div class="vm-window-layer">${u.windows.map(w=>vmWindow(t,e,w)).join('')}</div>${u.context?`<div class="vm-menu vm-context" style="left:${u.context.x}px;top:${u.context.y}px">${u.context.type==='adapter'?vopen('Properties','adapter'):vb('Properties','ntds-properties')}</div>`:''}<div class="vm-statusline"><span>المحاكاة تغطي مسارات الدروس الثلاثة · ليست نظام Windows كاملًا</span><span dir="ltr">${u.screen==='guest'?esc(u.selected):'Hyper-V Manager'}</span></div></section>`;}
  function vmPaint(focus=false){const scroll=window.scrollY;opSave();opPaint();window.scrollTo({top:scroll,behavior:'instant'});if(focus)$('#vm-cmd')?.focus({preventScroll:true});}
  function vmAfterPaint(){vmOrbitSync();const {e,u}=vmCurrent();if(!e)return;for(const form of $$('[data-vm-form]')){for(const [key,val] of Object.entries(u.forms?.[form.dataset.vmForm]||{})){const field=form.elements.namedItem(key);if(field&&field.type!=='password'){if(field.type==='checkbox')field.checked=!!val;else field.value=val;}}}const out=$('#op-output');if(out)out.scrollTop=out.scrollHeight;}
  root.addEventListener('input',ev=>{const form=ev.target.closest('[data-vm-form]'),f=ev.target,{u}=vmCurrent();if(!form||!u||!f.name||f.type==='password'||form.dataset.vmForm==='command')return;u.forms??={};u.forms[form.dataset.vmForm]??={};u.forms[form.dataset.vmForm][f.name]=f.type==='checkbox'?f.checked:f.value;opSave();});
  root.addEventListener('change',ev=>{const f=ev.target.closest('[data-vm-form="roles"]');if(!f)return;const {u}=vmCurrent();if(ev.target.name==='adds'&&ev.target.checked&&!u.setup.features){u.setup.role='AD DS';vmMessage(u,'Add features that are required for Active Directory Domain Services? Includes AD DS management tools and Group Policy Management.','features');vmPaint();}if(ev.target.name==='autoRestart'&&ev.target.checked&&!u.setup.restartConfirmed){u.setup.autoRestart=true;vmMessage(u,'The server may restart automatically if required. Allow automatic restart?','allow-restart');vmPaint();}});
  root.addEventListener('submit',ev=>{const f=ev.target.closest('[data-vm-form]');if(!f)return;ev.preventDefault();const {t,e,s,u}=vmCurrent();if(!e)return;const a=f.dataset.vmForm,d=Object.fromEntries(new FormData(f));for(const el of f.querySelectorAll('[type=checkbox]'))d[el.name]=el.checked;const z=u.setup;let focus=false;
    if(a==='clock'){if(d.clock){z.clock=d.clock;vmClose(u,'clock');}}
    if(a==='promoteCredentials'){if(d.password==='Pa$$w0rd'&&/^(administrator|adatum\\administrator|administrator@adatum\.com)$/i.test(d.user)){e.sim.auth='domain';e.sim.revision++;e.last=null;vmClose(u,'promoteCredentials');}else vmMessage(u,'Use the ADATUM Administrator training account and Pa$$w0rd.');}
    if(a==='dvd'){z.iso=d.iso;vmClose(u,'settings');}
    if(a==='login'){if(d.password!=='Pa$$w0rd')vmMessage(u,'Use Pa$$w0rd as the training password.');else{vmCommit(e,'login',{account:d.account});if(d.account==='domain'&&e.sim.session!=='domain')vmMessage(u,e.sim.message);else{u.login=true;u.windows=[];vmOpen(u,t.kind==='core'||e.sim.edition==='Core'?'terminal':'server');}}}
    if(a==='network'){if(d.addressMode!=='static'||d.dnsMode!=='static'){vmMessage(u,'Select the explicit IP and DNS settings required for this lab.');}else{vmCommit(e,'network',d);if(e.sim.message.startsWith('لم'))vmMessage(u,e.sim.message);else vmClose(u,'ipv4');}}
    if(a==='rename'&&!/^[a-zA-Z][a-zA-Z0-9-]{0,14}$/.test(d.name||'')){vmMessage(u,'The computer name is invalid. Use 1–15 letters, digits or hyphens, starting with a letter.');vmPaint();return;}
    if(a==='rename'){if(d.name!==(s.pendingName||s.name))vmCommit(e,'identity',{name:d.name,zone:s.zone});if(d.membership==='domain'&&d.domain!==s.domain){z.joinDomain=d.domain;vmOpen(u,'credentials');}else if(e.sim.pendingName){vmClose(u,'rename');vmMessage(u,'You must restart your computer to apply these changes.','restart-choice');}else vmClose(u,'rename');}
    if(a==='credentials'){if(d.password!=='Pa$$w0rd')vmMessage(u,'Use Pa$$w0rd as the training password.');else{const auth=/^(administrator|adatum\\administrator|administrator@adatum\.com)$/i.test(d.user)?'domain':'local';vmCommit(e,'join',{domain:z.joinDomain,auth});vmClose(u,'credentials');vmMessage(u,e.sim.message,e.sim.pendingDomain?'join-done':'');}}
    if(a==='timezone'){e.sim.zone=d.zone;e.sim.revision++;e.sim.lastCheck=null;e.last=null;vmClose(u,'timezone');}
    if(a==='command'){if(s.shell==='menu'&&d.value==='9'){vmOpen(u,'datetime');}else{vmCommit(e,'command',d);if(s.shell==='dns'&&e.sim.shell==='dns-alt')vmMessage(u,'Preferred DNS server set.');if(s.shell==='restart'&&/^y$/i.test(d.value)){u.login=false;u.windows=[];}focus=true;}}
    if(a==='ntds'){const old=s.selectedDC==='LON-SVR1'?s.gcSVR1:s.gcDC1;if(old!==d.enabled)vmCommit(e,'gc-apply',{enabled:d.enabled});vmClose(u,'ntds');}
    if(a==='roles'){const k=u.roleStep;if(k===1&&d.type!=='role')vmMessage(u,'This lab requires role-based or feature-based installation.');else if(k===2){z.host=d.host;u.roleStep++;}else if(k===3){z.role=d.adds?'AD DS':d.adcs?'AD CS':'';if(!z.role)vmMessage(u,'Select a server role.');else if(z.role==='AD DS'&&!z.features)vmMessage(u,'Add features that are required for Active Directory Domain Services? Includes AD DS management tools and Group Policy Management.','features');else u.roleStep++;}else if(k===6&&!z.restartConfirmed&&d.autoRestart){z.autoRestart=true;vmMessage(u,'The server may restart automatically if required. Allow automatic restart?','allow-restart');}else if(k===6){z.autoRestart=!!d.autoRestart;vmCommit(e,'role',{host:z.host,role:z.role,features:z.features});u.roleStep=7;}else u.roleStep++;}
    if(a==='promotion'){const k=u.promoteStep;if(k===0){Object.assign(e.sim,{deployment:d.deployment,promoteDomain:d.domain,auth:s.auth});e.sim.revision++;e.last=null;u.promoteStep++;}else if(k===1){vmCommit(e,'options',{...d,deployment:s.deployment,domain:s.promoteDomain,auth:s.auth});z.site=d.site;if(!e.sim.dsrm)vmMessage(u,'Enter the lesson password Pa$$w0rd in both DSRM fields.');else u.promoteStep++;}else if(k===3){z.replication=d.replication;u.promoteStep++;}else if(k===4){if(!['database','logs','sysvol'].every(k=>/^C:\\/i.test(d[k]||'')))vmMessage(u,'Choose an absolute path on the C: drive available in this lab.');else{Object.assign(z,d);u.promoteStep++;}}else if(k===5){vmCommit(e,'precheck');u.promoteStep=6;}else if(k===6){vmCommit(e,'promote');if(e.sim.pendingDC)u.promoteStep=7;else vmMessage(u,e.sim.message);}else u.promoteStep++;}
    if(a==='setup'){const k=z.step||0;if(k===0||k===1)z.step=k+1;else if(k===2){z.edition=d.edition;z.step++;}else if(k===3){if(d.license){z.license=true;z.step++;}else vmMessage(u,'Accept the simulated license step to continue.');}else if(k===4){z.mode=d.mode;z.step++;}else if(k===5){z.disk=d.disk;vmCommit(e,'install',{...z,host:u.selected,boot:true});if(e.sim.installed)z.step=6;else vmMessage(u,e.sim.message);}else if(k===6)z.step=7;else if(k===7){if(d.password!=='Pa$$w0rd'||d.confirm!=='Pa$$w0rd')vmMessage(u,'Enter Pa$$w0rd in both fields.');else{vmClose(u,'setup');u.login=false;u.power=true;}}}
    if(u.forms)delete u.forms[a];vmPaint(focus);
  });
  root.addEventListener('click',ev=>{const b=ev.target.closest('[data-vm]');if(!b)return;const {t,e,s,u}=vmCurrent();if(!e)return;const a=b.dataset.vm,wid=b.closest('[data-window-id]')?.dataset.windowId||u.windows.at(-1)?.id,w=u.windows.find(x=>x.id===wid);u.context=null;
    if(a==='open'){if(u.screen==='guest'&&!u.login&&!['settings','browse'].includes(b.dataset.window)){vmMessage(u,'Sign in to the simulated server first.');}else if(u.selected!==op.target(t.id,s.variant).name){vmMessage(u,'This reference machine is ready. Select the lesson target machine to change its configuration.');}else if(['server','roles','promotion','sites'].includes(b.dataset.window)&&(t.kind==='core'||s.edition==='Core')){vmMessage(u,'Server Core has no Server Manager desktop. Use SConfig in Command Prompt.');}else if(b.dataset.window==='promotion'&&!s.roleInstalled){vmMessage(u,'Install Active Directory Domain Services before starting configuration.');}else{vmOpen(u,b.dataset.window);if(b.dataset.window==='ipv4')e.sim.evidence.networkView=e.sim.revision;}}
    if(a==='close'){if(wid==='message'&&u.after==='allow-restart'){u.setup.autoRestart=false;if(u.forms?.roles)u.forms.roles.autoRestart=false;}if(wid==='message'&&u.after==='features'){u.setup.role='';if(u.forms?.roles)u.forms.roles.adds=false;}vmClose(u,wid);}if(a==='min'&&w)w.min=true;if(a==='max'&&w)w.max=!w.max;if(a==='restore')vmOpen(u,b.dataset.window);
    if(a==='host'){u.screen='host';u.windows=[];u.start=false;}
    if(a==='connect'){u.screen='guest';u.windows=[];u.login=false;if(t.id==='install'&&!s.installed&&u.power&&u.setup.iso&&u.selected==='LON-SVR3')vmOpen(u,'boot');}
    if(a==='boot-key'){vmClose(u,'boot');vmOpen(u,'setup');}
    if(a==='power'){u.power=!!u.setup.iso;if(t.id==='install'&&!s.installed){if(!u.setup.iso)vmMessage(u,'Boot failure. Attach installation media using Settings → DVD Drive.');else if(u.selected!=='LON-SVR3')vmMessage(u,'Select the blank installation machine. DC1 is already running.');else{u.screen='guest';u.setup.step=0;vmOpen(u,'boot');}}}
    if(a==='choose-iso'){u.setup.iso='Windows2012R2RTM.iso';u.forms??={};u.forms.dvd={iso:u.setup.iso};vmClose(u,'browse');}
    if(a==='start'&&u.login)u.start=!u.start;if(a==='lock'){u.login=false;u.windows=[];}
    if(a==='restart'&&u.selected!==op.target(t.id,s.variant).name){vmMessage(u,'This reference machine is kept ready. Select the lesson target machine.');vmPaint();return;}
    if(a==='restart'){vmCommit(e,'reboot');u.login=false;u.windows=[];u.screen='guest';}
    if(a==='server-page'){u.serverPage=b.dataset.page;u.menu=null;if(u.serverPage==='Local Server')e.sim.evidence.localView=e.sim.revision;}
    if(['manage','tools','notifications','action-menu'].includes(a))u.menu=u.menu===(a==='action-menu'?'action':a)?null:(a==='action-menu'?'action':a);
    if(a==='view')vmMessage(u,'This lab keeps the Server Manager console layout used in the lesson.');
    if(a==='manager-info')vmMessage(u,'Server Manager opens at logon in this lab.');
    if(a==='select-ipv4')u.ipv4Selected=true;
    if(a==='ipv4-properties'){if(u.ipv4Selected){vmOpen(u,'ipv4');e.sim.evidence.networkView=e.sim.revision;}else vmMessage(u,'Select Internet Protocol Version 4 (TCP/IPv4) first.');}
    if(a==='tree'){const n=b.dataset.node;u.tree=u.tree.includes(n)?u.tree.filter(x=>x!==n):[...u.tree,n];}
    if(a==='select-ntds')u.ntdsServer=b.dataset.server;
    if(a==='ntds-apply'){const form=b.closest('form');vmCommit(e,'gc-apply',{enabled:form.elements.enabled.checked});e.sim.ntdsOpen=true;}
    if(a==='ntds-properties'){if(u.ntdsServer){vmCommit(e,'open-ntds',{server:u.ntdsServer});vmOpen(u,'ntds');}}
    if(a==='precheck')vmCommit(e,'precheck');if(a==='dc-check'){vmCommit(e,'dc-check');vmMessage(u,e.sim.message);}
    if(a==='wizard-back'){if(b.dataset.wizard==='roles')u.roleStep=Math.max(0,u.roleStep-1);else u.promoteStep=Math.max(0,u.promoteStep-1);}
    if(a==='setup-back')u.setup.step=Math.max(0,(u.setup.step||0)-1);
    if(a==='message-ok'){const after=u.after;u.after='';vmClose(u,'message');if(after==='allow-restart')u.setup.restartConfirmed=true;if(after==='features'){u.setup.features=true;u.roleStep=3;}if(after==='join-done'){vmClose(u,'rename');vmMessage(u,'You must restart your computer before the changes take effect.');}}
    if(a==='motion'){u.motionPaused=!u.motionPaused;const bench=b.closest('.vm-workbench');bench.dataset.motion=u.motionPaused?'paused':'running';b.textContent=u.motionPaused?'تشغيل الحركة':'إيقاف الحركة';b.setAttribute('aria-pressed',String(u.motionPaused));opSave();return;}
    if(a==='fullscreen')u.expanded=!u.expanded;
    vmPaint(a==='open'&&b.dataset.window==='terminal');
  });
  root.addEventListener('click',ev=>{const row=ev.target.closest('[data-vm-select]');if(!row)return;const {u}=vmCurrent();if(u){u.selected=row.dataset.vmSelect;for(const r of $$('[data-vm-select]'))r.classList.toggle('selected',r===row);const name=$('.vm-host-preview h3');if(name)name.textContent='20410C-'+u.selected;const action=$('.vm-host-grid>aside>strong');if(action)action.textContent=u.selected;opSave();}});
  root.addEventListener('dblclick',ev=>{const row=ev.target.closest('[data-vm-select]'),bar=ev.target.closest('[data-vm-drag]');const {t,e,u}=vmCurrent();if(!u)return;if(row){u.selected=row.dataset.vmSelect;u.screen='guest';u.windows=[];u.login=false;if(t.id==='install'&&!e.sim.installed&&u.power&&u.setup.iso)vmOpen(u,'setup');vmPaint();}else if(bar){const w=u.windows.find(w=>w.id===bar.dataset.vmDrag);w.max=!w.max;vmPaint();}});
  root.addEventListener('contextmenu',ev=>{const el=ev.target.closest('[data-vm-context]');if(!el)return;ev.preventDefault();const {u}=vmCurrent(),r=$('.vm-workbench').getBoundingClientRect();if(el.dataset.server)u.ntdsServer=el.dataset.server;u.context={type:el.dataset.vmContext,x:Math.min(ev.clientX-r.left,r.width-190),y:ev.clientY-r.top};vmPaint();});
  root.addEventListener('pointerdown',ev=>{const panel=ev.target.closest('[data-window-id]');if(panel){const {u}=vmCurrent(),w=u.windows.find(x=>x.id===panel.dataset.windowId);u.windows=u.windows.filter(x=>x!==w).concat(w);for(const el of $$('[data-window-id]')){el.style.zIndex=20+u.windows.findIndex(x=>x.id===el.dataset.windowId);el.classList.toggle('vm-front',el===panel);}opSave();}const bar=ev.target.closest('[data-vm-drag]');if(!bar||ev.target.closest('button'))return;const {u}=vmCurrent(),w=u.windows.find(w=>w.id===bar.dataset.vmDrag);if(w.max)return;const el=bar.closest('.vm-window'),rect=$('.vm-workbench').getBoundingClientRect(),x=ev.clientX,y=ev.clientY,ox=w.x,oy=w.y;bar.setPointerCapture(ev.pointerId);const move=v=>{w.x=Math.max(0,Math.min(Math.max(0,rect.width-el.offsetWidth),ox+v.clientX-x));w.y=Math.max(20,Math.min(Math.max(20,rect.height-180),oy+v.clientY-y));el.style.setProperty('--wx',w.x+'px');el.style.setProperty('--wy',w.y+'px');};const up=()=>{bar.removeEventListener('pointermove',move);bar.removeEventListener('pointerup',up);opSave();};bar.addEventListener('pointermove',move);bar.addEventListener('pointerup',up);});

  root.addEventListener('keydown',ev=>{if(ev.key!=='Enter'||!ev.target.matches('[data-vm-select]'))return;const {t,e,u}=vmCurrent();u.selected=ev.target.dataset.vmSelect;u.screen='guest';u.login=false;u.windows=[];if(t.id==='install'&&!e.sim.installed&&u.power&&u.setup.iso)vmOpen(u,'boot');vmPaint();});

  root.addEventListener('keydown',ev=>{if(ev.key!=='Escape'||!ev.target.closest('.vm-workbench'))return;const {u}=vmCurrent();if(u.expanded)u.expanded=false;else if(u.context)u.context=null;else if(u.menu)u.menu=null;else if(u.start)u.start=false;else if(u.windows.length)vmClose(u,u.windows.at(-1).id);vmPaint();});

  const ocDrafts=new Map();
  function ocUI(e){return e.curriculumUI??={console:'Server Manager',action:null,page:0,draft:{},source:false,motionPaused:false};}
  const ocButton=(text,action,extra='')=>`<button type="button" data-oc="${action}" ${extra}>${text}</button>`;
  const ocNames={advanced:"Advanced Features",authorized:"Authorize this DHCP server",client:"Client computer",dc:"Domain Controller",disk:"Target disk number",domainLevel:"Domain functional level",features:"Include management tools / Add Features",file:"File name",first:"First name",folder:"Folder",forestLevel:"Forest functional level",gc:"Global Catalog",initials:"Initials",installed:"Install selected server role",kind:"Object type",last:"Last name",operation:"Operation",printer:"Printer",service:"Role service",share:"Share name",text:"File contents",user:"User account",zone:"DNS zone",name:'Name',parent:'Parent / Forest name',domain:'Domain name',account:'User name',password:'Password',confirm:'Confirm password',dsrm:'DSRM password',enabled:'Enabled',protected:'Protect object from accidental deletion',ou:'Organizational Unit',scope:'Group scope',type:'Type',members:'Members',member:'Member',group:'Group',mustChange:'User must change password at next logon',cannotChange:'User cannot change password',neverExpires:'Password never expires',tasks:'Tasks to delegate',objects:'Object types',principal:'User or group',city:'City',drive:'Connect drive',home:'Home folder — To',source:'Source template',computer:'Computer name',business:'This computer is part of a business network',domainNetwork:'My company uses a network with a domain',reuse:'Use existing computer account',command:'Command',start:'Start IP address',end:'End IP address',mask:'Subnet mask',exclusions:'Exclusions (last octet: 100-110,101)',leaseDays:'Lease duration — Days',gateway:'Router (Default Gateway)',dns:'DNS server',wins:'WINS server',active:'Activate scope',auto:'Obtain an IP address automatically',autoDNS:'Obtain DNS server address automatically',mac:'MAC Address',ip:'IP address',supported:'Supported types',interface:'Interface',server:'Server address / Name',protocol:'Routing protocol',integrated:'Store the zone in Active Directory',dynamic:'Dynamic updates',from:'From Server',to:'Destination Server',online:'Online',style:'Partition style',capacity:'Capacity (MB)',size:'Size (MB)',disks:'Selected disks (comma separated)',sizes:'Space on each disk (MB, comma separated)',filesystem:'File system',letter:'Drive letter',quick:'Quick format',amount:'Amount in MB',mode:'Operation',volume:'Volume',path:'Path',inheritance:'Enable inheritance',convert:'Convert inherited permissions to explicit',usersRead:'Local Users — Read',permission:'Permission',system:'Keep SYSTEM',administrators:'Keep Administrators',creatorOwner:'Keep CREATOR OWNER',abe:'Enable access-based enumeration',caching:'Offline Files — Caching',autoDetect:'Auto detect the printer driver',deviceType:'Device type',driver:'Printer driver',manufacturer:'Manufacturer',port:'Port',ports:'Selected ports',shared:'Share this printer',shareName:'Share name',listed:'List in the directory',directPrinting:'Enable Branch Office Direct Printing',pooling:'Enable printer pooling',acceptDriver:'Accept driver installation',starter:'Source Starter GPO',container:'Link location',enforced:'Enforced',order:'Link Order',general:'Disable the General page',read:'Removable Disks: Deny read access',write:'Removable Disks: Deny write access',execute:'Removable Disks: Deny execute access',test:'Client verification',computerOU:'Computer OU',userOU:'User OU',confirmDeletion:'Confirm deletion'};
  function ocLabel(a,k){if(k==='confirm'&&typeof a.values[k]==='boolean')return 'Confirm this action';if(k==='dynamic'&&a.entity==='disks')return 'Convert to Dynamic disk';return ocNames[k]||k;}
  function ocValue(v){return Array.isArray(v)?v.join(', '):typeof v==='boolean'?(v?'Yes':'No'):String(v);}
  function ocRequirements(a){return `<dl class="oc-requirements">${Object.entries(a.values).map(([k,v])=>`<div><dt>${esc(ocLabel(a,k))}</dt><dd dir="ltr">${esc(k==='tasks'?v.map(x=>ocTasks[x]||x).join(' · '):ocValue(v))}</dd></div>`).join('')}</dl>`;}
  function ocCurrent(){const t=opAvailable().find(x=>x.id===opData().active),e=t&&opEntry(t);return t?.kind==='curriculum'&&e?{t,e,u:ocUI(e),s:e.sim}:{};}
  const ocTasks={'manage-users':'Create, delete, and manage user accounts','reset-password':'Reset user passwords and force password change at next logon','read-users':'Read all user information','manage-groups':'Create, delete, and manage groups','membership':'Modify the membership of a group','gpo-links':'Manage Group Policy links','create':'Create selected objects in this folder','delete':'Delete selected objects in this folder','full-control':'Full Control'};
  function ocField(a,k,value){const expected=a.values[k],label=ocLabel(a,k),opts=a.choices?.[k]||(k==='type'&&a.op==='volume'?['Simple','Spanned','Striped','Mirrored','RAID-5']:null)||({mode:['Additional DC','Tree Domain','Child Domain','New forest'],scope:['Global','Domain Local','Universal'],type:['Security','Distribution'],filesystem:['NTFS','ReFS','FAT32'],style:['GPT','MBR'],caching:['Manual','None','All']}[k]);
    if(typeof expected==='boolean')return `<label class="vm-tick"><input type="checkbox" name="${esc(k)}" ${value===true?'checked':''}> ${esc(label)}</label>`;
    if(k==='tasks'){const selected=Array.isArray(value)?value:[];return `<fieldset class="oc-task-options"><legend>Delegate the following tasks</legend>${Object.entries(ocTasks).map(([v,label])=>`<label class="vm-tick"><input type="checkbox" name="tasks" data-oc-array="true" value="${v}" ${selected.includes(v)?'checked':''}>${esc(label)}</label>`).join('')}</fieldset>`;}
    if(Array.isArray(expected))return `<label class="vm-field">${esc(label)}<textarea name="${esc(k)}" dir="ltr" placeholder="Separate entries with commas">${esc(Array.isArray(value)?value.join(', '):value||'')}</textarea></label>`;
    if(opts&&opts.includes(expected))return `<label class="vm-field">${esc(label)}<select name="${esc(k)}" aria-label="${esc(label)}"><option value="">Select…</option>${opts.map(v=>`<option ${value===v?'selected':''}>${esc(v)}</option>`).join('')}</select></label>`;
    return `<label class="vm-field">${esc(label)}<input name="${esc(k)}" type="${['password','confirm','dsrm'].includes(k)&&typeof expected==='string'?'password':typeof expected==='number'?'number':'text'}" value="${['password','confirm','dsrm'].includes(k)?'':esc(value??'')}" dir="ltr" autocomplete="off" spellcheck="false" ${typeof expected==='number'?'min="1"':''}></label>`;
  }
  function ocDesktop(t,e){const s=e.sim,u=ocUI(e),r=s.lab.resources,actions=t.actions.filter(a=>a.console===u.console&&a.device===s.lab.device),allConsoles=[...new Set(t.actions.filter(a=>a.device===s.lab.device).map(a=>a.console))],a=t.actions.find(a=>a.id===u.action),completed=t.actions.filter(a=>s.lab.proofs[a.id]?.ok).length,next=t.actions.find(a=>!s.lab.proofs[a.id]?.ok);
    return `${next?`<div class="oc-next"><span>خطوتك التالية · المشهد ${next.scene}</span><b dir="ltr">${esc(next.title)}</b><small><bdi>${esc(next.device)}</bdi> · <bdi>${esc(next.console)}</bdi></small>${ocButton('اذهب للأداة','next',`data-operation="${esc(next.id)}"`)}</div>`:'<div class="oc-next">✓ نفذت عمليات الدرس. افحص النتيجة النهائية أدناه.</div>'}<section class="vm-workbench oc-workbench" data-motion="${u.motionPaused?'paused':'running'}" aria-label="مختبر الدرس ${t.lesson}"><div class="vm-lab-toolbar"><span>${vmOrbitalMark('badge')}<b>مـدار LAB</b><small>WINDOWS SERVER · 20410C</small></span><div>${ocButton('الأجهزة','machines')}${e.curriculumUndo?.length?ocButton('تراجع عن آخر عملية','undo'):''}${ocButton(u.motionPaused?'تشغيل الحركة':'إيقاف الحركة','motion')}</div><span class="vm-lab-state">● ${completed} / ${t.actions.length} عمليات متحققة</span></div><div class="vm-connectionbar" dir="ltr">20410C-${esc(s.lab.device)} — Virtual Machine Connection<span>${esc(s.lab.actor)}</span></div><div class="oc-desktop"><div class="vm-desktop-wallpaper" aria-hidden="true">${vmWindowsBackdrop()}</div>${u.showMachines?`<section class="oc-host"><h2>Hyper-V Manager</h2><p dir="rtl">كل جهاز ضمن مختبر هذا الدرس. تبديل الجهاز يحفظ الإعدادات ولا يغير حساب التنفيذ.</p>${op.machines(t.id).map(n=>ocButton(vmGlyph('monitor')+' '+esc(n),'device',`data-device="${esc(n)}" class="${n===s.lab.device?'selected':''}"`)).join('')}</section>`:''}<div class="oc-window" role="region" aria-label="${esc(u.console)}"><header class="vm-titlebar"><span>${vmGlyph('server')} ${esc(u.console)}</span><span>${esc(s.lab.device)}</span></header><div class="oc-menu" dir="ltr">${ocButton('Server Manager','manager')}${ocButton('Tools ▾','tools')}${ocButton('Refresh','refresh')}</div>${u.tools?`<div class="oc-tools" dir="ltr">${allConsoles.map(c=>ocButton(esc(c),'console',`data-console="${esc(c)}"`)).join('')}</div>`:''}<div class="oc-console-grid"><nav aria-label="Console tree" dir="ltr">${allConsoles.map(c=>ocButton(vmGlyph(c==='Windows PowerShell'||c==='Command Prompt'?'terminal':'server')+esc(c),'console',`data-console="${esc(c)}" class="${u.console===c?'selected':''}"`)).join('')}<p>20410C · ${esc(s.lab.device)}</p></nav><main>${u.console==='Server Manager'&&!actions.length?`<h2>Welcome to Server Manager</h2><p dir="rtl">اختر Tools للوصول لأدوات هذا الجهاز، ثم افتح العملية المطلوبة. قيم المهمة متاحة بجانب كل عملية.</p><div class="oc-tiles">${allConsoles.map(c=>ocButton(vmGlyph('server')+' '+esc(c),'console',`data-console="${esc(c)}"`)).join('')}</div>`:`<h2>${esc(u.console)}</h2><div class="oc-action-list">${actions.map(a=>`<article><span class="oc-operation-state ${s.lab.proofs[a.id]?.ok?'done':''}" aria-label="${s.lab.proofs[a.id]?.ok?'تم التحقق':'لم يتحقق'}">${s.lab.proofs[a.id]?.ok?'✓':'○'}</span><div><b dir="ltr">${esc(a.title)}</b><small>المشهد ${a.scene} · ${esc(t.sources[a.scene-1].title)}</small></div>${ocButton(a.op==='view'?'Open / Refresh':'Open…','open',`data-operation="${esc(a.id)}"`)}${ocButton('المطلوب','requirement',`data-operation="${esc(a.id)}"`)}</article>`).join('')}</div>`}<details class="oc-state"><summary>الحالة الحالية · نتيجة الإعدادات المحفوظة</summary>${ocResources(r,u.console)}</details></main></div><div class="oc-output" role="status"><strong>Result · ${esc(s.lab.actor)} @ ${esc(s.lab.device)}</strong>${ocResult(s.lab.output)}</div></div>${a?ocDialog(t,e,a):''}</div><div class="vm-statusline"><span>محاكاة خطوات الدرس ${t.lesson} · دون اتصال بنظامك أو شبكتك</span><span>Pa$$w0rd</span></div></section>${t.note?`<p class="op-source-note">${esc(t.note)}</p>`:''}<details class="oc-map"><summary>خريطة مشاهد الدرس والتطبيق</summary>${t.sources.map((sc,i)=>`<div><b>${i+1}. ${esc(sc.title)}</b><span>${t.actions.filter(a=>(a.scenes||[a.scene]).includes(i+1)).length} عمليات مرتبطة</span>${ocButton('المصدر والخطوات','source',`data-scene="${i}"`)}</div>`).join('')}</details>`;
  }
  function ocProperties(obj){if(obj===null||typeof obj!=='object')return esc(obj??'—');if(Array.isArray(obj))return obj.map(x=>typeof x==='object'?ocProperties(x):esc(x)).join(' · ');return `<dl class="oc-properties">${Object.entries(obj).filter(([k])=>!['passwordSet','pendingTrust'].includes(k)).map(([k,v])=>`<div><dt>${esc((typeof v==='boolean'&&['read','write','execute'].includes(k)?k.charAt(0).toUpperCase()+k.slice(1)+' access allowed':k==='dynamic'&&typeof v==='boolean'?'Dynamic disk':ocNames[k])||({online:'Status',dynamic:'Dynamic disk',healthy:'Healthy',capacity:'Capacity (MB)',members:'Members',trust:'Domain trust',extents:'Partitions',leaseDays:'Lease duration (days)',hasCore:'LON-CORE record present',hasFileZone:'File-based zone copied',generalPage:'General page visible',read:'Read access',write:'Write access',execute:'Execute access'}[k])||k)}</dt><dd>${k==='tasks'&&Array.isArray(v)?esc(v.map(x=>ocTasks[x]||x).join(' · ')):typeof v==='object'?ocProperties(v):esc(typeof v==='boolean'?(v?'Yes':'No'):v??'—')}</dd></div>`).join('')}</dl>`;}
  function ocResult(text){try{return `<div class="oc-result-data" dir="ltr">${ocProperties(JSON.parse(text))}</div>`;}catch{return `<pre dir="auto">${esc(text)}</pre>`;}}
  function ocDisks(r){return `<div class="oc-disks" dir="ltr">${Object.entries(r.disks).map(([id,d])=>{const used=d.extents.reduce((sum,e)=>sum+e.size,0),parts=d.protected?[{name:id==='0'?'Windows (C:)':'Allfiles (D:)',size:d.capacity}]:[...d.extents,...(d.capacity>used?[{name:null,size:d.capacity-used}]:[])];return `<div class="oc-disk"><div><b>Disk ${id}</b><span>${d.dynamic?'Dynamic':'Basic'} · ${d.style}</span><span>${d.online?'Online':'Offline'} · ${d.capacity} MB</span></div><div class="oc-partitions">${parts.map(e=>`<div class="oc-partition ${e.name?'allocated':'free'}" style="flex:${e.size};min-width:70px"><b>${esc(e.name||'Unallocated')}</b><span>${e.size} MB</span>${e.name?`<small>${esc(r.volumes[e.name]?.filesystem||'')} · ${d.protected?'Protected system disk':r.volumes[e.name]?.healthy?'Healthy':'Resynching'}</small>`:''}</div>`).join('')}</div></div>`;}).join('')}</div>`;}
  function ocResources(r,consoleName){const groups={'Active Directory Users and Computers':['ous','users','groups','computers','delegations'],'DHCP':['roles','scopes','reservations','leases'],'Routing and Remote Access':['interfaces','relay'],'Disk Management':['disks','volumes'],'DNS Manager':['zones','records','dnsCopies'],'Print Management':['printers','ports'],'Group Policy Management':['starters','gpos'],'File Explorer':['folders','shares','volumes'],'Windows PowerShell':['ous','users','groups']};return (consoleName==='Disk Management'?ocDisks(r):'')+(groups[consoleName]||['settings','interfaces','roles']).map(k=>`<h4>${esc(k)}</h4><div class="oc-data-table"><table><thead><tr><th>Name</th><th>Properties</th></tr></thead><tbody>${Object.entries(r[k]||{}).map(([name,val])=>`<tr><td dir="ltr">${esc(name)}</td><td>${ocProperties(val)}</td></tr>`).join('')||'<tr><td colspan="2">No objects</td></tr>'}</tbody></table></div>`).join('');}
  function ocDialog(t,e,a){const u=ocUI(e),s=e.sim,fields=Object.keys(a.values),pages=Math.max(1,Math.ceil(fields.length/4)),keys=fields.slice(u.page*4,u.page*4+4),draft=u.draft||{},source=t.sources[a.scene-1];return `<div class="oc-dialog-shade"><section class="oc-dialog" role="dialog" aria-modal="true" aria-label="${esc(a.title)}"><header class="vm-titlebar"><span>${esc(a.title)}</span>${ocButton('×','close','aria-label="Close operation"')}</header>${u.requirement?`<div class="oc-dialog-body" dir="rtl"><h3>المهمة · ${esc(source.title)}</h3><p>الجهاز: <bdi>${esc(a.device)}</bdi>. اكتب القيم المطلوبة في الأداة، ثم اقرأ النتيجة.</p>${ocRequirements(a)}${a.expected?`<div>النتيجة المطلوبة:${ocProperties(a.expected)}</div>`:''}${a.actor?`<p>اختبر بحساب <bdi>${esc(a.actor)}</bdi>؛ المتوقع ${a.expectedAllowed?'السماح':'رفض الإجراء'}.</p>`:''}<details><summary>خطوات المصدر — كشف الخطوة كاملة</summary>${ocButton('اعرض الخطوات','reveal-source')} ${u.source?`<ol>${source.steps.map(x=>`<li>${esc(x)}</li>`).join('')}</ol>${(source.warnings||[]).map(x=>`<p class="vm-warning">${esc(x)}</p>`).join('')}`:''}</details></div><footer>${ocButton('ارجع إلى الأداة','edit')}${ocButton('إغلاق','close')}</footer>`:s.lab.passwordStage?`<form data-oc-form="password"><div class="oc-dialog-body"><p>${esc(s.lab.output)}</p><label class="vm-field">Password<input name="value" type="password" autocomplete="off"></label><p dir="rtl">كلمة مرور الدرس فقط Pa$$w0rd. لا يُحفظ الإدخال.</p></div><footer><button type="submit">Enter</button></footer></form>`:`<form data-oc-form="operation"><div class="oc-wizard-progress" dir="ltr">${Array.from({length:pages},(_,i)=>`<span class="${i===u.page?'selected':''}">${i+1}</span>`).join('')}<span>${esc(a.device)} · ${esc(s.lab.actor)}</span></div><div class="oc-dialog-body" dir="ltr">${keys.map(k=>ocField(a,k,draft[k])).join('')}${fields.length?'':`<p>Read the current configuration of <strong>${esc(a.key||a.title)}</strong>.</p>`}<p class="oc-inline-result" dir="auto">${esc(u.result||'')}</p></div><footer>${u.page?ocButton('‹ Previous','previous'):''}${ocButton('المطلوب','requirement',`data-operation="${esc(a.id)}"`)}<button type="submit">${u.page<pages-1?'Next ›':a.op==='view'?'Refresh':a.op.includes('command')||a.op==='powershell'?'Run':'Apply'}</button>${ocButton('Cancel','close')}</footer></form>`}</section></div>`;}
  function aSource(t,u){return t.actions.find(a=>a.id===u.action)?.sourceScene||t.id;}
  function ocPaint(){opSave();opPaint();const dialog=$('.oc-dialog');if(dialog)(dialog.querySelector('input,select,textarea')||dialog.querySelector('button'))?.focus({preventScroll:true});}
  root.addEventListener('input',ev=>{const form=ev.target.closest('[data-oc-form="operation"]'),f=ev.target;if(!form||!f.name||f.type==='password')return;const {u}=ocCurrent();if(u){if(f.dataset.ocArray){u.draft[f.name]=[...form.querySelectorAll('input[data-oc-array]:checked')].map(x=>x.value);opSave();return;}u.draft[f.name]=f.type==='checkbox'?f.checked:f.value;opSave();}});
  root.addEventListener('click',ev=>{const btn=ev.target.closest('[data-oc]');if(!btn)return;const {t,e,u,s}=ocCurrent();if(!e)return;const action=btn.dataset.oc;
    if(action==='undo'&&e.curriculumUndo?.length){e.sim=e.curriculumUndo.pop();e.last=null;u.action=null;u.draft={};u.result='';ocDrafts.delete(e.attempt);}
    if(action==='next'){const target=t.actions.find(a=>a.id===btn.dataset.operation);e.sim=op.act(s,'lab-device',{device:target.device});u.console=target.console;u.showMachines=false;u.action=null;u.tools=false;}
    if(action==='machines')u.showMachines=!u.showMachines;
    if(action==='device'){e.sim=op.act(s,'lab-device',{device:btn.dataset.device});u.console='Server Manager';u.showMachines=false;u.action=null;}
    if(action==='motion'){u.motionPaused=!u.motionPaused;const bench=btn.closest('.vm-workbench');bench.dataset.motion=u.motionPaused?'paused':'running';btn.textContent=u.motionPaused?'تشغيل الحركة':'إيقاف الحركة';opSave();return;}
    if(action==='manager')u.console='Server Manager';if(action==='tools')u.tools=!u.tools;
    if(action==='console'){u.console=btn.dataset.console;u.tools=false;}
    if(action==='close'){ocDrafts.delete(e.attempt);u.action=null;u.draft={};u.result='';u.source=false;}
    if(action==='open'||action==='requirement'){if(u.action!==btn.dataset.operation){u.draft={};u.page=0;u.result='';u.source=false;ocDrafts.delete(e.attempt);}u.action=btn.dataset.operation;u.requirement=action==='requirement';}
    if(action==='edit')u.requirement=false;if(action==='previous')u.page=Math.max(0,u.page-1);
    if(action==='reveal-source'){u.source=true;opHelp(e,'reveal:'+aSource(t,u));}
    if(action==='source'){profile().osPositions??={};profile().osPositions['os1-lesson-'+t.lesson]={step:Number(btn.dataset.scene),seconds:0};opSave();void go('lesson:os1-lesson-'+t.lesson);return;}
    ocPaint();
  });
  root.addEventListener('submit',ev=>{const form=ev.target.closest('[data-oc-form]');if(!form)return;ev.preventDefault();const {t,e,u,s}=ocCurrent();if(!e)return;
    if(form.dataset.ocForm==='password'){e.sim=op.act(s,'lab-password',{value:form.elements.value.value});u.result=e.sim.lab.output;ocPaint();return;}
    const a=t.actions.find(x=>x.id===u.action),values=Object.fromEntries(new FormData(form)),secret=ocDrafts.get(e.attempt)||{};
    for(const f of form.querySelectorAll('input[type=checkbox]:not([data-oc-array])'))values[f.name]=f.checked;for(const f of form.querySelectorAll('[data-oc-array]'))values[f.name]=[...form.querySelectorAll('[data-oc-array]:checked')].map(x=>x.value);
    for(const [k,v] of Object.entries(values)){if(['password','confirm','dsrm'].includes(k)&&typeof a.values[k]==='string')secret[k]=v;else u.draft[k]=Array.isArray(a.values[k])?(Array.isArray(v)?v:String(v).split(',').map(x=>x.trim()).filter(Boolean)):typeof a.values[k]==='number'?Number(v):v;}
    ocDrafts.set(e.attempt,secret);
    const pages=Math.max(1,Math.ceil(Object.keys(a.values).length/4));if(u.page<pages-1){u.page++;ocPaint();return;}
    e.curriculumUndo??=[];e.curriculumUndo.push(clone(s));e.curriculumUndo=e.curriculumUndo.slice(-8);e.sim=op.act(s,'lab-action',{id:a.id,values:{...u.draft,...secret}});e.last=null;u.result=e.sim.lab.output;
    if(e.sim.lab.proofs[a.id]?.ok&&!e.sim.lab.passwordStage){u.action=null;u.draft={};ocDrafts.delete(e.attempt);}ocPaint();
  });

  root.addEventListener('keydown',ev=>{const dialog=$('.oc-dialog');if(!dialog)return;if(ev.key==='Escape'){ev.preventDefault();dialog.querySelector('[data-oc="close"]')?.click();}if(ev.key==='Tab'){const fields=[...dialog.querySelectorAll('button,input,select,textarea,summary,a[href]')].filter(x=>!x.disabled&&x.getClientRects().length);if(!fields.length)return;const first=fields[0],last=fields.at(-1);if(ev.shiftKey&&(document.activeElement===first||!dialog.contains(document.activeElement))){ev.preventDefault();last.focus();}else if(!ev.shiftKey&&(document.activeElement===last||!dialog.contains(document.activeElement))){ev.preventDefault();first.focus();}}});

  function networkPracticalIndex(){
    const available=lessons.filter(l=>l.course==='network'&&canLesson(l));
    const full=available.filter(l=>l.practice&&l.section!=='theory').sort((a,b)=>a.id.localeCompare(b.id,undefined,{numeric:true}));
    const review=available.filter(l=>!l.practice&&l.section!=='theory');
    return heading('دروس العملي كاملة','التوجيه والتحويل ١')+
      '<section class="np-intro"><div><span class="mh-kicker">'+full.length+' دروس من المصادر العملية المتاحة</span><h2>من التوصيل إلى التحقق من النتيجة</h2><p>افتح الدرس لتنفّذ خطواته داخل المحاكي. الرسم، إعداد الأجهزة، الأوامر وفحص النتيجة في المسار نفسه؛ والشرح وصور المصدر بجانب تطبيقك عند الحاجة.</p></div>'+
      (boot.canPractice?'<button class="mh-btn" data-go="course:network:lab">مختبراتي والمساحة الحرة</button>':'')+'</section>'+
      '<ol class="np-lessons" aria-label="الدروس العملية بترتيب المصادر">'+full.map((l,i)=>'<li class="np-lesson"><span class="np-number" aria-hidden="true">'+String(i+1).padStart(2,'0')+'</span><div class="np-body"><h2>'+theoryText(l.title.replace(/^\d+\s*·\s*/,''))+'</h2><p>'+theoryText(l.steps.filter(s=>!s.includes('كيف تستخدم')).join(' · '))+'</p><details class="np-source"><summary>مصدر هذا الدرس</summary><p>'+esc(l.source||'المصدر المرفق بالدرس')+'</p></details><div class="np-actions"><button class="mh-primary" data-go="lesson:'+esc(l.id)+'">افتح التطبيق الكامل '+icon('arrow-left')+'</button><button class="mh-btn" data-go="lesson:'+esc(l.id)+':reference">الشرح وصور المصدر</button></div></div></li>').join('')+'</ol>'+
      (review.length?'<details class="np-review"><summary>تدريبات مركزة للمراجعة · '+review.length+'</summary><p>تطبيقات جزئية للعودة إلى مهارة محددة. المسار الكامل لهذه المهارات موجود في الدروس أعلاه.</p>'+lessonRows(review)+'</details>':'');
  }

function networkReviewCard(){return [4,5,6].every(c=>lessons.some(l=>l.id==='network-srwe-'+c&&canLesson(l)))?`<section class="nt-srwe-entry"><div><span class="mh-eyebrow">مراجعة الشابترات 4 · 5 · 6</span><h2>الشرح وبنك الأسئلة</h2><p>84 سؤالًا بالإنجليزية مع زر للترجمة وتصحيح مفسّر ورسوم. راجع أخطاءك السابقة والأسئلة المعلّمة من فهرس واحد.</p><div class="nt-srwe-tags"><span>Inter-VLAN</span><span>STP</span><span>EtherChannel</span></div></div><a class="mh-primary" href="/network-review">فتح المرجع والأسئلة ←</a></section>`:'';}
function theoryLessons(){return lessons.filter(l=>l.section==='theory'&&canLesson(l));}
function theoryDictionary(entries){return `<dl class="nt-dictionary">${Object.entries(entries).sort(([a],[b])=>a.localeCompare(b)).map(([term,meaning])=>`<div data-nt-term="${esc(searchText(term+' '+meaning))}"><dt dir="ltr">${esc(term)}</dt><dd>${theoryText(meaning)}</dd></div>`).join('')}</dl>`;}
function networkTheoryIndex(){
 const list=theoryLessons();if(!list.length)return heading('الجزء النظري','التوجيه والتحويل ١')+'<div class="mh-empty">لا توجد أجزاء متاحة حاليًا.</div>';
 const chapters=[...new Set(list.map(l=>l.theory.chapter))];const glossary=Object.assign({},...list.map(l=>l.theory.glossary));
 return heading('المنهج','التوجيه والتحويل ١ / الجزء النظري')+networkReviewCard()+`<section class="nt-skill"><span class="mh-eyebrow">المهارات اللي بتتعلمها · المنهج المتاح</span><h2>شباتر التوجيه والتحويل ١</h2><p>ابدأ بالفكرة، شوف المثال، ثم تحقق من فهمك وارجع للمصطلح وقت ما تحتاجه.</p><div class="nt-meta"><span>${chapters.length} شباتر متاحة</span><span>${list.length} جزءًا</span><span>${list.reduce((n,l)=>n+l.theory.topics.length,0)} موضوعًا</span><span>${list.reduce((n,l)=>n+l.theory.checks.length,0)} سؤال مراجعة</span><span>شرح مدار بالعربية اعتمادًا على عروض Cisco المرفقة</span></div></section>${lessonBy(profile().visits.network?.lesson)?.section==='theory'?resume('network'):''}<div class="nt-chapters">${chapters.map(n=>{const parts=list.filter(l=>l.theory.chapter===n);return `<section class="nt-chapter"><header><span class="nt-number">${n}</span><div><span class="mh-kicker">الشابتر ${n}</span><h2 dir="ltr">${esc(parts[0].theory.chapterTitle)}</h2><p>${parts.length} أجزاء · ${parts.reduce((n,l)=>n+l.theory.topics.length,0)} موضوعًا</p></div></header>${parts.map(l=>`<button class="nt-part" data-go="lesson:${l.id}"><span><b>${esc(l.title)}</b><small dir="ltr">${esc(l.theory.english)}</small></span>${icon('arrow-left')}</button>`).join('')}<a class="nt-original-deck" href="${esc(parts[0].theory.sourceFile)}" download>تنزيل ملف الشابتر كاملًا · PPTX</a></section>`;}).join('')}</div><section class="nt-resource"><h2>معجم المصطلحات</h2><p>الاسم بالإنجليزية، ومعناه بالعربية. ابحث بأيٍّ منهما.</p><label for="nt-term-query">ابحث عن مصطلح<input id="nt-term-query" type="search" placeholder="مثل: SVI أو بوابة" autocomplete="off"></label><p id="nt-term-count" role="status">${Object.keys(glossary).length} مصطلحًا</p>${theoryDictionary(glossary)}</section><details class="nt-resource"><summary>المصادر وحدود هذه الدفعة</summary><p>الشباتر 1–9 وفق ترتيب المقرر المعتمد. الشابتر 8 مصدره SRWE Module 12، والشابتر 9 مصدره Module 14؛ أرقام المصدر لا تغير ترقيم مقررك. استُبعدت شرائح إرشاد المدرب والشرائح الفارغة من الدروس. يتاح ملف كل شابتر الأصلي كاملًا للتنزيل دون تعديل، بما فيه شرائح التخطيط والإرشاد المستبعدة من تسلسل الدرس. قد تتضمن ملفات المدرب إجابات.</p><p>تظهر الأدلة العملية المرسلة في قسم التطبيق بجانب المختبرات التفاعلية المتاحة. عنوان المهارة قد يكون أوسع من ملفاتها؛ لم نضف وحدات مفقودة من مجرد العنوان. فيديوهات وملفات الأنشطة المشار إليها داخل الشرائح لم تُرفق، لذلك نوضح أهدافها المتاحة ولا ندّعي توفير ملفاتها.</p><p>هذا شرح من إعداد مدار، وليس ترجمة رسمية معتمدة من Cisco. توضيحات اختلاف الشرائح عن المراجع تظهر في موضعها داخل الدروس.</p></details>`;
}
function theoryLessonPage(l){
 const th=l.theory,visit=profile().visits[l.course],saved=profile().theoryPositions?.[l.id]??(visit?.lesson===l.id?visit.step:0);const step=Math.max(0,Math.min(th.topics.length-1,Number(saved)||0)),t=th.topics[step];
 const all=th.guide?lessons.filter(x=>x.section==='practice-guide'&&canLesson(x)):theoryLessons(),pos=all.findIndex(x=>x.id===l.id),next=all[pos+1],previous=all[pos-1];
 return `<div class="nt-breadcrumb"><button data-go="${th.guide?'course:network:lessons':'course:network:theory'}">${icon('arrow-right')} ${th.guide?'التطبيق':'المنهج'}</button><span>${th.guide?'شرح ومرجع التطبيق العملي':'المهارة '+(th.skill||1)+' / الشابتر '+th.chapter} / ${esc(th.part)}</span></div>${heading(l.title,th.chapterTitle)}<div class="nt-reader"><aside class="nt-outline"><h2>داخل هذا الجزء</h2><p class="mh-footnote">${step+1} من ${th.topics.length} موضوعات</p><nav aria-label="موضوعات الجزء">${th.topics.map((x,i)=>`<button data-step="${i}" ${i===step?'aria-current="step"':''}><span class="nt-outline-number">${i+1}</span><span class="nt-outline-title">${theoryText(x.title)}</span></button>`).join('')}</nav><details><summary>أهداف هذا الجزء</summary><ul>${th.topics.map(x=>`<li>${theoryText(x.title)}</li>`).join('')}</ul></details><details><summary>مصطلحات هذا الجزء</summary>${theoryDictionary(th.glossary)}</details></aside><div class="nt-reading"><article class="nt-topic" aria-labelledby="nt-topic-title"><div class="nt-topic-top"><span class="mh-kicker">${esc(th.part)} · ${step+1} / ${th.topics.length}</span><span>${th.guide?'مرجع':'Module '+(th.sourceModule||th.chapter)+' · الشرائح'} ${esc(t.slides)}</span></div><h2 id="nt-topic-title" tabindex="-1">${theoryText(t.title)}</h2>${t.paragraphs.map(p=>`<p>${theoryText(p)}</p>`).join('')}${t.flow?`<ol class="nt-flow">${t.flow.map(f=>'<li>'+theoryText(f)+'</li>').join('')}</ol>`:''}${t.table?`<div class="nt-table-wrap" tabindex="0" role="region" aria-label="جدول ${esc(t.title)}"><table><thead><tr>${t.table[0].map(c=>'<th scope="col">'+theoryText(c)+'</th>').join('')}</tr></thead><tbody>${t.table.slice(1).map(r=>'<tr>'+r.map(c=>'<td>'+theoryText(c)+'</td>').join('')+'</tr>').join('')}</tbody></table></div>`:''}${t.code?`<details class="nt-code"><summary>كشف الأوامر كاملة — افتحها بعد محاولتك</summary><h3>اقرأ الأمر مع وضعه</h3><p>إذا ظهر Prompt فاكتب ما بعده فقط. الأسطر التي تبدأ بـ! توضيحات وليست أوامر مطلوبة. الكتل التي لا تعرض Prompt تبدأ من الوضع الموضح. القيم بين &lt; &gt; تستبدل بقيم المهمة.</p><pre dir="ltr" tabindex="0" aria-label="مثال الأوامر"><code>${esc(t.code)}</code></pre></details>`:''}${t.note?`<aside class="nt-note"><strong>انتبه لهذه النقطة</strong><p>${theoryText(t.note)}</p>${t.link?`<a target="_blank" rel="noopener noreferrer" href="${esc(t.link)}">مرجع التصحيح</a>`:''}</aside>`:''}<div class="nt-next"><button data-step="${step-1}" ${step===0?'disabled':''}>${icon('arrow-right')} السابق</button><span>${step+1} / ${th.topics.length}</span><button class="mh-primary" data-step="${step+1}" ${step===th.topics.length-1?'disabled':''}>التالي ${icon('arrow-left')}</button></div></article><section class="nt-review"><h2>راجع فهمك</h2><p>حاول تفسّر الإجابة بطريقتك، ثم افتح التوضيح للمقارنة. هذه مراجعة ذاتية من إعداد مدار؛ لا تُسجّل كاختبار أو إتقان.</p>${th.checks.map((q,i)=>`<div class="nt-check"><h3>${i+1}. ${theoryText(q.question)}</h3><details><summary>افتح التفسير بعد محاولتك</summary><p>${theoryText(q.answer)}</p></details></div>`).join('')}</section><details class="nt-resource"><summary>ملاحظتي على هذا الجزء</summary><div id="lesson-notes"></div></details><details class="nt-resource"><summary>مراجع الجزء</summary><p>${esc(l.source)} · ${esc(th.english)}</p><p>الأوامر والأمثلة مرتبطة بالطراز والسياق الواردين في الشرح. ${th.guide?"ملف التمرين الأصلي الكامل متاح أدناه. ارجع إلى التطبيق العملي لتنفيذ المهام داخل محاكي مدار؛ وتبقى الصفحات مرجعًا للمختبر الحقيقي.":"الأنشطة المذكورة أهدافها من العرض؛ ملفاتها المستقلة غير مرفقة."}</p></details>${sourceGallery(th)}<div class="nt-part-nav">${previous?`<button data-go="lesson:${previous.id}">الجزء السابق: ${esc(previous.title)}</button>`:''}${next?`<button data-go="lesson:${next.id}">الجزء التالي: ${esc(next.title)}</button>`:'<button data-go="course:network:theory">العودة للمنهج</button>'}</div><section class="nt-resource"><h2>شارك تجربتك أو بلّغ عن مشكلة</h2><div id="mh-network-feedback"></div></section></div></div>`;
}
root.addEventListener('input',e=>{if(e.target.id!=='nt-term-query')return;const words=searchText(e.target.value).split(/\s+/).filter(Boolean);let count=0;for(const row of $$('[data-nt-term]')){row.hidden=!words.every(w=>row.dataset.ntTerm.includes(w));if(!row.hidden)count++;}$('#nt-term-count').textContent=count?'عدد النتائج: '+count:'ما لقينا مصطلحًا مطابقًا؛ جرّب كلمة أقصر.';});
// Keep English commands and prompts in their reading direction inside Arabic prose.
function theoryText(value){const text=String(value);let out='',from=0;for(const m of text.matchAll(/\([A-Za-z][A-Za-z0-9-]*\)#|[A-Za-z0-9/#>][A-Za-z0-9 \t:._/()#<>+=%-]*/g)){const token=m[0].trimEnd();out+=esc(text.slice(from,m.index))+'<bdi dir="ltr">'+esc(token)+'</bdi>'+esc(m[0].slice(token.length));from=m.index+m[0].length;}return out+esc(text.slice(from));}

function sourceGallery(th){
 const slides=th.sourceSlides||[];
 if(!slides.length&&!th.sourceFile)return '';
 return `<details class="nt-resource nt-source-gallery"><summary>المصدر الأصلي كاملًا لهذا الجزء ${slides.length?'· '+slides.length+' '+(th.guide?'صفحة / صورة':'شريحة'):''}</summary><p>تظهر نصوص المصدر كما وردت؛ تصحيحات مدار موضحة في الشرح. بعض الملفات نسخ مدرب وتتضمن الإجابات، فحاول تنفيذ المهمة قبل فتحها.</p>${th.sourceNote?`<p class="nt-source-note">${esc(th.sourceNote)}</p>`:""}${th.sourceFile?`<p><a href="${esc(th.sourceFile)}" target="_blank" rel="noopener">${th.guide?'فتح الملف الأصلي':'تنزيل الملف الأصلي الكامل للشابتر'} (${th.sourceFile.endsWith('.pdf')?'PDF':th.sourceFile.endsWith('.pptx')?'PPTX':'DOCX'})</a></p>`:''}${slides.map(x=>`<figure><figcaption>${th.guide?'صفحة / صورة':'الشريحة'} ${x.number} · ${esc(x.title||'')}</figcaption><a href="${esc(x.image)}" target="_blank" rel="noopener" aria-label="تكبير ${th.guide?'الصفحة':'الشريحة'} ${x.number}"><img loading="lazy" decoding="async" src="${esc(x.image)}" alt="${esc(x.title||'رسم المصدر الأصلي')}" width="1280"></a>${x.text?.length?`<details><summary>نص الشريحة للقراءة والبحث</summary><div dir="auto">${x.text.map(p=>'<p>'+esc(p)+'</p>').join('')}</div></details>`:''}</figure>`).join('')}</details>`;
}

// Compose maintained hosted course views with the existing course-specific engines.
function createHostedCourseAdapter() {
  return createHostedCourseViews({ courses, lessons, canLesson,
    getBoot: () => boot, getRoute: () => state.route, heading, esc, lessonRows,
    osSection, osLessonPage, networkPracticalIndex, networkSelfTestPage, networkTheoryIndex,
    networkReference: () => networkReference(), theoryLessonPage,
    hintHistory: () => hintHistoryMarkup });
}

const hintHistoryMarkup = "<section id=\"mh-hint-history-root\"><div id=\"history\"><div class=\"intro\"><span class=\"eyebrow\">ارجع للمساعدة، وافهم خطوتك</span><h1>سجل التلميحات</h1><p>نصوص المساعدات كما ظهرت لك، من دروسك وتمارينك ومختبراتك. قراءة السجل ما تضيف مساعدة جديدة.</p></div>\n<p id=\"status\" role=\"status\">جارٍ قراءة سجلك المحفوظ…</p><div id=\"error\" role=\"alert\" hidden></div>\n<div class=\"toolbar\"><button id=\"refresh\">تحديث السجل</button><button id=\"export\" disabled>تنزيل السجل كاملًا</button></div>\n<section id=\"content\" hidden><div id=\"stats\" class=\"stats\" aria-label=\"ملخص السجل\"></div>\n<section class=\"filters\" aria-label=\"البحث والتصفية\"><label class=\"search\">ابحث في الخطوات ونصوص المساعدة<input id=\"query\" type=\"search\" placeholder=\"اسم الخطوة، أمر، أو اسم مختبر…\"></label>\n<label>المختبر<select id=\"lab\"><option value=\"\">كل المختبرات</option></select></label><label>نوع المساعدة<select id=\"degree\"><option value=\"\">جميع الدرجات</option><option value=\"1\">الدرجة الأولى</option><option value=\"2\">الدرجة الثانية</option><option value=\"3\">الدرجة الثالثة</option><option value=\"full\">كشف الخطوة كاملة</option></select></label>\n<label>الجزء<select id=\"scope\"><option value=\"\">كل الأجزاء</option></select></label><label>المحاولة<select id=\"attempt\"><option value=\"\">كل المحاولات</option></select></label><label>الترتيب<select id=\"sort\"><option value=\"new\">الأحدث أولًا</option><option value=\"old\">الأقدم أولًا</option></select></label></section>\n<div class=\"list-tools\"><p id=\"count\" role=\"status\"></p><div><button id=\"clear\">مسح التصفية</button><button id=\"expand\">فتح التفاصيل المعروضة</button><button id=\"collapse\">طي التفاصيل</button></div></div>\n<div id=\"records\"></div><p id=\"empty\" hidden></p><button id=\"more\" hidden>عرض المزيد</button>\n<aside class=\"note\">عدد المساعدات وقوة الكشف معلومات للمراجعة، وليست حكمًا على إتقانك. يشمل السجل المختبرات المخفية وآخر مختبر محذوف القابل للاسترجاع؛ الحذف النهائي للمختبر يزيل سجله معه.</aside></section></div></section>";

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
// Hosted network command-reference adapter. General hub search lives in
// public/hub/search.mjs; this function receives every DOM/normalization input.
function filterCommandCards({ query, cards, emptyMessage, normalize }) {
  const words = normalize(query).split(/\s+/).filter(Boolean);
  let shown = 0;
  for (const card of cards) {
    card.hidden = !words.every(word => card.dataset.commandSearch.includes(word));
    if (!card.hidden) shown++;
  }
  emptyMessage.hidden = Boolean(shown);
  return shown;
}

function networkReference(){
 const entries=[
  ['قبل الإعداد','enable','Switch> / Router>','ينقلك إلى علامة # حتى تتمكن من فحص الجهاز والدخول إلى إعداداته.'],
  ['قبل الإعداد','configure terminal','Switch# / Router#','يفتح Global Configuration؛ تظهر (config)#. تكتب أوامر الإعداد من هنا.'],
  ['التنقل','exit','Configuration Modes','يرجع مستوى واحدًا للخلف؛ مثل الانتقال من (config-if)# إلى (config)#.'],
  ['التنقل','end','Configuration Modes','يرجع مباشرة إلى علامة #.'],
  ['VLAN','show vlan brief','Switch#','يعرض أرقام VLAN وأسماءها ومنافذ access المنتمية إليها. قارنها بمتطلبات مختبرك.'],
  ['Trunk','show interfaces trunk','Switch#','يعرض وصلات trunk وNative VLAN وقائمة VLAN المسموح بها. قارن طرفي الوصلة.'],
  ['Inter-VLAN','show ip interface brief','Router#','يعرض أسماء الواجهات وعناوين IP وحالتي Status وProtocol. ابحث عن الواجهة المطلوبة في النتيجة.'],
  ['التحقق','show running-config','Switch# / Router#','يعرض الإعداد الحالي. انتقل إلى سطور الواجهة أو VLAN التي تفحصها.'],
  ['التحقق','do show vlan brief','Switch(config)#','do يشغّل أمر عرض مثل show من داخل وضع الإعداد دون الخروج منه؛ ليس أمر اختبار اتصال.'],
  ['الحفظ','copy running-config startup-config','Switch# / Router#','يحفظ إعداد الجهاز الحالي للإقلاع التالي. يختلف عن حفظ مختبرك في مدار.'],
  ['الاتصال','ping <عنوان IP>','PC / Switch# / Router#','يفحص وصول الطلب والرد إلى عنوان محدد. نجاح إضاءة المنفذ وحده لا يكفي لضمان نجاحه.']
 ];
 return '<section class="mh-reference"><p class="mh-muted">اختر ما تحتاجه؛ الأرقام والعناوين تأخذها من متطلبات مختبرك. علامتا &gt; و# تظهران تلقائيًا ولا تُكتبان ضمن الأمر.</p><label class="mh-reference-search">ابحث عن أمر أو وظيفة<input id="mh-command-query" type="search" placeholder="VLAN، حفظ، show…" autocomplete="off"></label><div class="mh-reference-list">'+entries.map(([group,command,mode,description])=>'<details class="mh-command-card" data-command-search="'+esc(searchText(group+' '+command+' '+description))+'"><summary><code dir="ltr">'+esc(command)+'</code><span>'+esc(group)+'</span></summary><div><p>'+esc(description)+'</p><small>يُستخدم عند: <bdi>'+esc(mode)+'</bdi></small></div></details>').join('')+'</div><p id="mh-command-empty" class="mh-muted" hidden>لا يوجد أمر مطابق في هذا المرجع المختصر.</p></section>';
}

  function networkSelfTestPage(section){
    const practical=lessons.filter(l=>l.course==='network'&&['vlan','trunk','inter'].includes(l.section)&&canLesson(l));
    const head=heading('تمارين وتقييم',courses.network.name)+(section==='quiz'?networkReviewCard():'');
    if(!boot.canPractice)return head+'<div class="mh-empty">التطبيق العملي غير متاح لهذا الحساب.</div>';
    const card=(label,title,text,route,button)=>'<article class="mh-selftest-card"><span class="mh-eyebrow">'+label+'</span><h2>'+esc(title)+'</h2><p>'+esc(text)+'</p><button class="mh-primary" data-go="'+route+'">'+button+' <span aria-hidden="true">←</span></button></article>';
    if(section==='quiz')return head+'<div class="mh-selftest-grid">'+card('01 / تمارين','تمرّن على درس','اختر درسًا من الجزء العملي. تتغيّر المتطلبات، وتختار الإرشاد المناسب لك.','course:network:practice','اختيار الدرس')+card('02 / تقييم شامل','اجمع الدروس في تقييم واحد','VLAN وTrunk وInter-VLAN في شبكة واحدة. نفّذ المتطلبات، ثم سلّم لمراجعة نتيجتك في كل جزء.','course:network:exam','فتح التقييم')+'</div>';
    if(section==='practice')return heading('تمارين الدروس',courses.network.name)+'<button class="mh-selftest-back" data-go="course:network:quiz">← تمارين وتقييم</button><div class="mh-selftest-grid">'+practical.map((l,i)=>card(String(i+1).padStart(2,'0')+' / تمرين متغيّر',l.title,'نفس مهارات الدرس، بقيم جديدة. تُجهّز المتطلبات السابقة اللازمة للبدء دون احتسابها من عملك.','course:network:practice-'+l.section,'فتح التمرين')).join('')+'</div>';
    const exam=section==='exam',scope=exam?'all':section.replace('practice-',''),lesson=practical.find(l=>l.section===scope);
    if(!exam&&!lesson)return head+'<div class="mh-empty">هذا التمرين غير متاح.</div>';
    const title=exam?'تقييم الدروس العملي كاملًا':'تمرين · '+lesson.title;
    return heading(title,courses.network.name)+'<button class="mh-selftest-back" data-go="course:network:'+(exam?'quiz':'practice')+'">← '+(exam?'تمارين وتقييم':'تمارين الدروس')+'</button><iframe allowfullscreen id="mh-network-lab" title="'+esc(title)+'" data-network-src="/network-lab?selftest='+(exam?'exam':'practice')+'&amp;scope='+scope+'" style="width:100%;height:1400px;border:0;border-radius:16px"></iframe>';
  }

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
    root.addEventListener('pointermove',e=>{const f=$('#mh-network-background');if(!f.hidden)f.contentWindow?.postMessage({type:'madar-background-pointer',x:e.clientX,y:e.clientY},location.origin);},{passive:true});
  $('#mh-owner-tools').hidden=!boot.account.isAdmin;
  addEventListener('message',e=>{const f=$('#mh-network-lab');if(e.origin!==location.origin||!f||e.source!==f.contentWindow)return;if(e.data?.type==='madar-workspace-expanded'){if(e.data.expanded&&!f.dataset.expanded){f.dataset.previousStyle=f.getAttribute('style')||'';f.dataset.expanded='true';f.style.cssText='position:fixed;inset:0;width:100vw;height:100dvh;border:0;border-radius:0;z-index:10000';}else if(!e.data.expanded&&f.dataset.expanded){f.setAttribute('style',f.dataset.previousStyle);delete f.dataset.expanded;delete f.dataset.previousStyle;}}if(e.data?.type==='madar-network-state'){if(!f.dataset.expanded)f.style.height=Math.max(600,Math.min(15000,Number(e.data.height)||1400))+'px';syncLessonProgress(f);}});
  if(store.conflict){$('#mh-error').hidden=false;status('يوجد تعارض مع نسخة الحساب. نزّل مسودتك قبل إعادة التحميل.');}
  render();status('');

  requestAnimationFrame(()=>{if(motionPreference.matches)setPaused(true);});
  // Read-only diagnostics for the local acceptance tests; never academic evidence.
  root.previewState=()=>clone(state);
})().catch(()=>{const main=document.getElementById('mh-main');main.innerHTML='<p role="alert">تعذر تحميل بيانات مدار. لم نستبدل الحفظ السابق.</p><button onclick="location.reload()">إعادة المحاولة</button>';});

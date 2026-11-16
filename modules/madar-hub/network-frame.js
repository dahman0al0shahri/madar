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

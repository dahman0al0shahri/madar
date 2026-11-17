async function mountAccessLab(host,lesson){
 const task=tasks[lesson.id];if(!task||!host)return;
 host.innerHTML='<section class="al-entry"><span class="al-kicker">مختبر الأكسس · تطبيق بيدك</span><h3>حوّل الشرح إلى خطوة تنفّذها.</h3><p>'+esc(task.mission)+'</p><button class="primary" data-start>افتح التدريب العملي</button><p class="small muted">بدون تثبيت · يحفظ تعديلاتك والتراجع. محاكاة تعليمية داخل مدار وليست برنامج Access الكامل.</p></section>';
 host.querySelector('[data-start]').onclick=async()=>{
 const btn=host.querySelector('[data-start]');btn.disabled=true;btn.textContent='نحمّل تدريبك المحفوظ…';
 const handle=await window.MADAR_WORKSHEETS.open(lesson.id);if(!host.isConnected)return;
 if(!handle.ready){btn.disabled=false;btn.textContent='إعادة تحميل التدريب';host.insertAdjacentHTML('beforeend','<p role="alert">تعذر تحميل الحفظ. أعد المحاولة عند عودة الاتصال؛ لن نستبدل عملك السابق.</p>');return;}
 let s=initial(task),history=[],future=[],mode='guided',step=0,hints=0,msg='',saveMsg='',dialog=null,lastFocus=null;
 const saved=handle.snapshot;
 try{if(saved){if(saved.activity!==LAB_VERSION+':'+lesson.id||!validLabState(JSON.parse(saved.current)))throw Error();s=JSON.parse(saved.current);history=saved.history;future=saved.future;({mode='guided',step=0,hints=0}=saved.guide||{});}}catch{host.innerHTML='<section class="panel"><h3>نسخة تدريب غير متوافقة</h3><p>لن نستبدلها. نزّل نسختك قبل طلب المساعدة.</p><button data-copy>تنزيل النسخة</button></section>';host.querySelector('[data-copy]').onclick=()=>handle.download();return;}
 mode=mode==='independent'?'independent':'guided';step=Math.min(task.steps.length-1,Math.max(0,Number.isInteger(step)?step:0));hints=Math.min(999,Math.max(0,Number.isInteger(hints)?hints:0));
 const snapshot=()=>({schema:1,activity:LAB_VERSION+':'+lesson.id,current:JSON.stringify(s),history,future,guide:{mode,step,hints}});
 const persist=()=>handle.update(snapshot());
 
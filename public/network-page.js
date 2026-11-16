// Standalone practical host. Embedded desktop labs keep their existing parent.
window.MadarNetworkPage=(()=>{
 let profileStore=null,lesson=null,lab=null,syncing=null,lastProgress='',timer=0;
 const standalone=parent===window;
 function mount(){
  if(!standalone)return;
  document.body.classList.add('network-standalone');
  const header=document.createElement('header');header.id='network-page-header';
  header.innerHTML='<div class="network-page-brand"><a href="/#madar">مدار</a><span>التوجيه والتحويل ١</span></div><nav aria-label="تنقّل المقرر"><a href="/account">حسابك في مدار</a><a href="/#course:network:lessons">الجزء العملي</a><a href="/#course:network:quiz">تمارين وتقييم</a><a href="/#course:network:hints">سجل التلميحات</a></nav><h1 id="network-page-title">محاكي الشبكات</h1><p id="network-page-save" role="status" hidden></p>';
  document.body.prepend(header);
  header.addEventListener('click',async e=>{
   const link=e.target.closest('a');if(!link||e.ctrlKey||e.metaKey||e.shiftKey||e.button!==0)return;
   e.preventDefault();const status=document.getElementById('network-page-save');
   try{
    status.hidden=false;status.textContent='جارٍ حفظ آخر تغييراتك…';
    if(lab?.dataset.restore==='failed')throw Error('تعذر استعادة المختبر؛ أعد المحاولة قبل المغادرة.');
    await lab?.flushSave?.();await window.MADAR_NOTES?.retry();await syncProgress();
    if(window.MADAR_NOTES?.hasPending()||window.MadarStore?.hasPending())throw Error('لم يكتمل الحفظ؛ أعد المحاولة. مسودتك باقية هنا.');
    location.assign(link.href);
   }catch(error){status.textContent=error.message||'لم يكتمل الحفظ؛ أعد المحاولة.';}
  });
 }
 async function syncProgress(){
  if(!standalone||!lesson||!profileStore||profileStore.conflict)return;
  if(syncing){await syncing;return syncProgress();}
  const progress=lab?.lessonProgress?.();if(!progress||progress.lesson!==lesson.id)return;
  const serialized=JSON.stringify(progress);if(serialized===lastProgress)return;
  const previous=profileStore.value||{};
  syncing=profileStore.save({...previous,version:1,latest:'network',visits:{...previous.visits,network:progress}});
  try{await syncing;lastProgress=serialized;}finally{syncing=null;}
 }
 async function ready(currentLab,currentLesson,mode){
  if(!standalone)return;lab=currentLab;lesson=currentLesson;
  document.getElementById('network-page-title').textContent=lesson?.title||(mode==='exam'?'تقييم الدروس العملي كاملًا':mode?'تمرين عملي':'محاكي الشبكات');
  document.title=document.getElementById('network-page-title').textContent+' · مدار';
  if(lesson){
   const notes=document.createElement('details');notes.className='network-page-notes';
   notes.innerHTML='<summary>ملاحظاتي في هذا الدرس</summary><div id="lesson-notes"></div>';document.getElementById('network-content').after(notes);
   await window.MADAR_NOTES?.mount(lesson.id,{video:false});
   window.MADAR_ACTIVITY?.emit('page_open',{lesson:lesson.id});
   try{profileStore=await MadarStore.open('profile');await syncProgress();}catch(error){report(error);}
   startSync();
  }
 }
 function report(error){const status=document.getElementById('network-page-save');status.hidden=false;status.textContent='تعذر تحديث موضع المتابعة. '+(error.message||'أعد المحاولة.');}
 function startSync(){clearInterval(timer);if(lesson)timer=setInterval(()=>{if(!document.hidden)void syncProgress().catch(report);},1500);}
 addEventListener('pagehide',()=>clearInterval(timer));
 addEventListener('pageshow',e=>{if(e.persisted&&lesson){startSync();void syncProgress().catch(report);}});
 mount();return {ready};
})();

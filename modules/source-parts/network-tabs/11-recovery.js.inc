const recovery=document.createElement('section');recovery.id='ml-recovery';recovery.hidden=true;recovery.innerHTML='<h3>لم تكتمل استعادة مختبراتك</h3><p>احتفظنا بالحفظ السابق. التحرير والحفظ الجديد متوقفان حتى نستعيده؛ لن نستبدله بمختبر فارغ.</p><button id="ml-recovery-retry" type="button">أعد محاولة الاستعادة</button><p id="ml-recovery-status" role="status"></p>';root.prepend(recovery);
function recoveryUI(failed){root.dataset.restore=failed?'failed':'ready';recovery.hidden=!failed;for(const el of root.children)if(el!==recovery)el.inert=failed;if(failed){delete root.dataset.ready;setSave('error','لم تكتمل الاستعادة؛ حُفظت النسخة السابقة دون استبدال.');}else root.dataset.ready='true';}
$('#ml-recovery-retry').onclick=async()=>{const button=$('#ml-recovery-retry');button.disabled=true;$('#ml-recovery-status').textContent='جارٍ استعادة مختبراتك…';const previous=state;try{const restored=await unpack(recoveryPayload);if(!restored)throw Error('لا توجد نسخة قابلة للاستعادة');loading=true;state=restored;root.dataset.restore='restoring';B.restore(active().data);loading=false;render();restoreFailure=null;recoveryPayload=null;recoveryUI(false);setSave('saved','استُعيدت مختبراتك المحفوظة');$('#ml-recovery-status').textContent='';}catch(e){loading=true;state=previous;B.restore(active().data);loading=false;restoreFailure=e.message;recoveryUI(true);$('#ml-recovery-status').textContent='لم تكتمل القراءة. النسخة السابقة ما زالت محفوظة؛ يمكنك إعادة المحاولة.';}finally{button.disabled=false;}};
loading=true;B.restore(active().data);loading=false;render();if(!restoreFailure&&window.openai?.widgetState?.privateContent?.format==='madar-tabs-gzip-1')setSave('saved','استُعيدت مختبراتك المحفوظة');
if(state.legacyUndoDiscarded){toast('استُعيدت مختبراتك. تراجع اللصق القديم لا يحفظ هوية الأجهزة، لذلك أُوقف لحماية الأجهزة البديلة. عملياتك الجديدة تحفظ التراجع.');delete state.legacyUndoDiscarded;}
// Read-only diagnostics for this preview's own tests; never learner-performance data.
root.getLabsState=()=>{capture();return clone({...state,dirty,saving,offset,clipboard:clipboard?{ids:clipboard.ids,cables:clipboard.cables.length}:null});};recoveryUI(!!restoreFailure);icons();
})();




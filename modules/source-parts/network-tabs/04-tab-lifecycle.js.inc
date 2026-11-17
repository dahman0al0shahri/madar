function guard(fn){if(!dirty){fn();return;}modal('الحفظ ما اكتمل',`<p>انتظر اكتمال الحفظ قبل إخفاء المختبر أو مغادرته. شغلك يبقى قدامك.</p><button id="ml-wait-save">احفظ ثم أكمل</button><button id="ml-stay-save">أبقى هنا</button>`);$('#ml-stay-save').onclick=close;$('#ml-wait-save').onclick=async()=>{await persist();while(saving)await new Promise(r=>setTimeout(r,60));if(!dirty){close();fn();}else toast('ما اكتمل الحفظ؛ مختبرك بقي مفتوحًا.');};}
const visible=()=>state.labs.filter(x=>x.kind==='scratch'&&!x.hidden);
function activate(id){if(!lab(id)){toast('هذا المختبر لم يعد موجودًا. المختبر الحالي محفوظ.');return;}if(B.busy()){toast('أكمل توصيل الكابل أولًا، ثم انتقل للمختبر.');return;}capture();state.active=id;active().hidden=false;rememberHelper(active());if(active().kind==='original')state.course=active().course;else if(active().helper&&lab(active().sourceOriginal)?.course)state.course=lab(active().sourceOriginal).course;selected.clear();placing=false;$('#ml-paste-guide').hidden=true;loading=true;B.restore(active().data);if(pendingPings.has(id))B.pendingPing();loading=false;render();ensureVisible();changed('view');}
function ensureVisible(id=state.active,instant=false){const i=visible().findIndex(x=>x.id===id);if(i<0)return;const step=stepWidth(),capacity=Math.max(1,Math.floor($('#ml-viewport').clientWidth/step));if(i<offset)offset=i;if(i>=offset+capacity)offset=Math.max(0,i-capacity+1);scrollTabs(instant);}
function stepWidth(){const width=$('#ml-viewport').clientWidth,peek=visible().length>1?(width<140?10:24):0;return Math.min(matchMedia('(max-width:600px)').matches?218:253,Math.max(32,width+8-peek));}
function scrollTabs(instant=false){const track=$('#ml-track'),viewport=$('#ml-viewport'),transition=track.style.transition;if(instant)track.style.transition='none';const list=visible(),step=stepWidth(),capacity=Math.max(1,Math.floor((viewport.clientWidth+8)/step));offset=Math.max(0,Math.min(offset,Math.max(0,list.length-capacity)));root.style.setProperty('--ml-tabwidth',(step-8)+'px');track.style.transform=`translateX(${offset*step}px)`;for(const [id,off]of [['#ml-back',offset===0],['#ml-next',offset+capacity>=list.length]]){$(id).hidden=false;$(id).disabled=off;$(id).style.visibility=off?'hidden':'visible';}viewport.scrollLeft=0;if(instant){void track.offsetWidth;track.style.transition=transition;}}
let suppressTabClickUntil=0;
const tabBar=$('.ml-tabs'),dropMark=document.createElement('div');
const deletedNotice=document.createElement('div');deletedNotice.id='ml-deleted-notice';deletedNotice.hidden=true;deletedNotice.innerHTML='<span role="status" id="ml-deleted-label"></span><button type="button" id="ml-undo-delete">التراجع عن آخر حذف</button>';tabBar.after(deletedNotice);
function renderDeletionUndo(){const d=state.lastDeletedLab;deletedNotice.hidden=!d;if(d)$('#ml-deleted-label').textContent='حُذف «'+d.lab.name+'». تقدر تسترجعه بأجهزته وإعداداته.';}
function focusLabTab(id=state.active){ensureVisible(id,true);const b=[...root.querySelectorAll('[role="tab"]')].find(x=>x.dataset.id===id);b?.focus({preventScroll:true});}
$('#ml-undo-delete').onclick=()=>{
 if(B.busy()){toast('أكمل حركة الكابل أولًا، ثم تراجع عن الحذف.');return;}
 const d=state.lastDeletedLab;if(!d||lab(d.lab.id))return;capture();
 const next=state.labs.findIndex(x=>x.id===d.next),prev=state.labs.findIndex(x=>x.id===d.previous),index=next>=0?next:prev>=0?prev+1:Math.min(d.index,state.labs.length);
 state.labs.splice(index,0,clone(d.lab));delete state.lastDeletedLab;normalizeCopies(state);
 if(d.wasActive)activate(d.lab.id);else{changed();render();}
 focusLabTab(d.wasActive?d.lab.id:state.active);toast('استُرجع المختبر بأجهزته وكابلاته وإعداداته؛ جارٍ الحفظ.');
};
dropMark.className='ml-drop-mark';dropMark.hidden=true;dropMark.setAttribute('aria-hidden','true');tabBar.append(dropMark);

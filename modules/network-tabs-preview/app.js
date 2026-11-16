(async()=>{
'use strict';
const root=document.getElementById('madar-labs'),engine=document.getElementById('madar-free'),$=s=>root.querySelector(s),clone=x=>JSON.parse(JSON.stringify(x)),uid=()=>crypto.randomUUID(),esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const icon=n=>`<i data-lucide="${n}" aria-hidden="true"></i>`,icons=()=>window.lucide?.createIcons({attrs:{width:18,height:18}});
if(!engine.labsBridge)await new Promise(resolve=>engine.addEventListener('labs:ready',resolve,{once:true}));
const B=engine.labsBridge,dialog=$('#ml-dialog'),body=$('#ml-dialog-body');
let state,loading=true,dirty=false,saving=false,saveTimer,version=0,savedVersion=0,offset=0,selected=new Set(),clipboard=null,placing=false,dragTab=null,pendingPings=new Map(),lastFocus=null,search='',lastOwnPayload='',restoreFailure=null,recoveryPayload=null;
const courseNames={vlan:'إنشاء VLAN',ports:'فحص المنافذ'};
B.prepare();const baseline=B.capture();baseline.ui.cliOpen=true;
const makeLab=(id,name,kind,data,course=null)=>({id,name,kind,description:'',hidden:false,data:clone(data),course,aliases:{},logs:[],logOpen:false,undo:null,savedAt:null,custom:false,revision:0,results:[],resultSeen:0,verdict:'',copied:false});
function initial(){return{schema:1,copyNumberingVersion:2,labLifecycleVersion:1,helperUseSequence:0,course:'vlan',active:'original-vlan',labs:[makeLab('original-vlan','مختبر التمرين','original',baseline,'vlan'),makeLab('original-ports','مختبر التمرين','original',baseline,'ports')],copyCounters:{}};}
state=initial();const lab=id=>state.labs.find(x=>x.id===id),active=()=>lab(state.active),original=()=>lab('original-'+state.course);
function repairCopyNumbering(s){
 if(s.copyNumberingVersion===2)return repairLabLifecycle(s);
 s.copyCounters=s.copyCounters||{};
 for(const group of new Set(s.labs.filter(x=>x.helper&&x.cloneOf).map(x=>x.cloneOf))){
  const source=s.labs.find(x=>x.id===group);if(!source)continue;
  const copies=s.labs.filter(x=>x.cloneOf===group&&!x.helper).sort((a,b)=>(a.copyNumber||0)-(b.copyNumber||0));
  copies.forEach((x,i)=>{x.copyNumber=i+1;if(!x.custom)x.name=`نسخة ${copies.length===1?'':(i+1).toLocaleString('ar-SA')+' '}من ${source.name}`;});
  s.copyCounters[group]=copies.length;
  for(const h of s.labs.filter(x=>x.helper&&x.cloneOf===group)){h.copyNumber=null;if(!h.custom)h.name='مساعد '+(courseNames[source.course]||source.name);}
 }
 s.copyNumberingVersion=2;return repairLabLifecycle(s);
}
function normalizeCopies(s){
 for(const group of new Set(s.labs.filter(x=>x.cloneOf&&!x.helper).map(x=>x.cloneOf))){
  const source=s.labs.find(x=>x.id===group),copies=s.labs.filter(x=>x.cloneOf===group&&!x.helper).sort((a,b)=>(a.copyNumber||0)-(b.copyNumber||0));
  const sourceName=source?.name||copies.find(x=>x.copySourceName)?.copySourceName||copies.find(x=>!x.custom)?.name.match(/^نسخة(?: [\d٠-٩]+)? من (.+)$/)?.[1];
  copies.forEach((x,i)=>{x.copyNumber=i+1;if(sourceName)x.copySourceName=sourceName;if(!x.custom&&sourceName)x.name=`نسخة ${copies.length===1?'':(i+1).toLocaleString('ar-SA')+' '}من ${sourceName}`;});
 }
 // This is a live count, never a serial identity. Hidden copies still exist.
 s.copyCounters=Object.fromEntries([...new Set(s.labs.filter(x=>x.cloneOf&&!x.helper).map(x=>x.cloneOf))].map(id=>[id,s.labs.filter(x=>x.cloneOf===id&&!x.helper).length]));
}
function repairLabLifecycle(s){
 normalizeCopies(s);
 for(const a of s.labs){
  // A legacy undo lacks the creation identity needed to distinguish replacements.
  if(a.undo&&!a.undo.instances){a.undo=null;s.legacyUndoDiscarded=true;}
 }
 s.helperUseSequence=Math.max(s.helperUseSequence||0,...s.labs.map(x=>x.helperUseOrder||0));
 if(s.labLifecycleVersion!==1){
  // Older saves have no usage history. Only their active helper is known.
  const a=s.labs.find(x=>x.id===s.active);if(a?.helper)a.helperUseOrder=++s.helperUseSequence;
  s.labLifecycleVersion=1;
 }
 return s;
}
function rememberHelper(a){if(a?.helper){state.helperUseSequence=(state.helperUseSequence||0)+1;a.helperUseOrder=state.helperUseSequence;}}
async function unpack(w){if(w?.privateContent?.format!=='madar-tabs-gzip-1')return null;const bytes=Uint8Array.from(atob(w.privateContent.data),c=>c.charCodeAt(0));const raw=await new Response(new Blob([bytes]).stream().pipeThrough(new DecompressionStream('gzip'))).text();const s=JSON.parse(raw);if(s.schema!==1||!Array.isArray(s.labs)||!s.labs.length||!s.labs.some(x=>x.id===s.active)||!s.labs.some(x=>x.id==='original-vlan')||!s.labs.some(x=>x.id==='original-ports'))throw Error('حالة غير متوافقة');return repairCopyNumbering(s);}
try{const s=await unpack(window.openai?.widgetState);if(s)state=s;}catch(e){restoreFailure=e.message;recoveryPayload=clone(window.openai?.widgetState);}
function capture(){if(!loading){const a=active();a.data=B.capture();}}
function setSave(type,text){$('#ml-save').dataset.state=type;$('#ml-save-text').textContent=text;$('#ml-retry').hidden=type!=='error';}
function semantic(s){return JSON.stringify({devices:Object.fromEntries(Object.entries(s.devices).map(([id,d])=>[id,d.type])),cables:s.cables.map(c=>[c.a,c.b,c.type]),network:s.network,admin:s.admin,power:s.power});}
function changed(reason='metadata'){if(loading||restoreFailure)return;const before=semantic(active().data);capture();if(reason==='engine'&&before!==semantic(active().data)){active().revision++;active().verdict='';if(active().training){active().training.completed=false;active().training.checks={};}}if(active().training?.selfTest&&active().copied)active().training.selfTest.copied=true;dirty=true;version++;setSave('saving','جارٍ حفظ تغييراتك، انتظر شوي قبل تطلع');clearTimeout(saveTimer);saveTimer=setTimeout(persist,450);updateContext();}
async function persist(){clearTimeout(saveTimer);if(restoreFailure||saving||!dirty)return;saving=true;const v=version;capture();const payloadState=clone(state),now=new Date().toISOString();payloadState.labs.forEach(x=>x.savedAt=now);try{
 if(!window.openai?.setWidgetState)throw Error('الحفظ غير متاح في هذه النافذة');
 const stream=new Blob([JSON.stringify(payloadState)]).stream().pipeThrough(new CompressionStream('gzip'));const bytes=new Uint8Array(await new Response(stream).arrayBuffer());let binary='';for(const b of bytes)binary+=String.fromCharCode(b);
 const payload={modelContent:{preview:'مختبرات مستقلة؛ تجربة تصميم لا أداء متعلم',labs:state.labs.length,active:active().name},privateContent:{format:'madar-tabs-gzip-1',data:btoa(binary)}};
 if(new TextEncoder().encode(JSON.stringify(payload)).length>15800)throw Error('بلغت مساحة حفظ المعاينة حدّها؛ صدّرنا لك التنبيه دون حذف مختبراتك');
 lastOwnPayload=payload.privateContent.data;await window.openai.setWidgetState(payload);savedVersion=v;if(v===version){dirty=false;state.labs.forEach(x=>x.savedAt=now);setSave('saved','تم حفظ كل تغييراتك · في هذه المعاينة');}
 }catch(e){setSave('error','تغييراتك الأخيرة ما انحفظت — '+e.message);saving=false;return;}saving=false;if(dirty)persist();}
$('#ml-retry').onclick=()=>persist();window.addEventListener('beforeunload',e=>{if(dirty){e.preventDefault();e.returnValue='';}});
document.addEventListener('visibilitychange',()=>{if(document.hidden&&dirty)persist();});
window.addEventListener('openai:set_globals',async e=>{if(restoreFailure||dirty||saving||e.detail?.globals?.widgetState?.privateContent?.data===lastOwnPayload)return;const v=version;try{const s=await unpack(e.detail?.globals?.widgetState);if(s&&!dirty&&!saving&&v===version&&JSON.stringify(s)!==JSON.stringify(state)){loading=true;state=s;B.restore(active().data);loading=false;render();setSave('saved','استُعيدت مختبراتك المحفوظة');}}catch(e){setSave('error','تعذّر استعادة الحفظ؛ مختبراتك الحالية لم تتغير');}});
function toast(t){$('#ml-toast').textContent=t;$('#ml-toast').hidden=false;}
// A tall embedded lab has a much larger viewport than the portion its user sees.
// Keep dialogs inside the intersection with the host viewport, not iframe centre.
function dialogViewport(){
 const v=window.visualViewport;let left=v?.offsetLeft||0,top=v?.offsetTop||0,right=left+(v?.width||innerWidth),bottom=top+(v?.height||innerHeight);
 try{if(window.frameElement&&parent!==window){const r=frameElement.getBoundingClientRect(),pv=parent.visualViewport,px=pv?.offsetLeft||0,py=pv?.offsetTop||0;left=Math.max(left,px-r.left);top=Math.max(top,py-r.top);right=Math.min(right,px+(pv?.width||parent.innerWidth)-r.left);bottom=Math.min(bottom,py+(pv?.height||parent.innerHeight)-r.top);}}catch{/* Independent previews can have a cross-origin host. */}
 return {left:left+12,top:top+12,width:Math.max(160,right-left-24),height:Math.max(80,bottom-top-24)};
}
function positionDialog(){
 const v=dialogViewport(),menu=!!body.querySelector('#ml-new-empty'),width=Math.min(menu?420:680,v.width);dialog.style.width=width+'px';dialog.style.maxHeight=v.height+'px';
 const height=Math.min(dialog.offsetHeight||320,v.height),anchor=lastFocus?.isConnected?lastFocus.getBoundingClientRect():null;
 let left=v.left+(v.width-width)/2,top=v.top+(v.height-height)/2;
 if(anchor&&v.width>540){left=Math.max(v.left,Math.min(anchor.right-width,v.left+v.width-width));if(anchor.bottom+10+height<=v.top+v.height)top=Math.max(v.top,anchor.bottom+10);else if(anchor.top-10-height>=v.top)top=anchor.top-10-height;}
 dialog.style.left=left+'px';dialog.style.top=Math.max(v.top,top)+'px';
}
let dialogPositionFrame=0;
function queueDialogPosition(){if(!dialog.open||dialogPositionFrame)return;dialogPositionFrame=requestAnimationFrame(()=>{dialogPositionFrame=0;positionDialog();});}
for(const target of [window,window.visualViewport])if(target){target.addEventListener('resize',queueDialogPosition);target.addEventListener('scroll',queueDialogPosition,{passive:true});}
try{if(parent!==window){parent.addEventListener('scroll',queueDialogPosition,{passive:true});parent.addEventListener('resize',queueDialogPosition);parent.visualViewport?.addEventListener('resize',queueDialogPosition);parent.visualViewport?.addEventListener('scroll',queueDialogPosition,{passive:true});}}catch{}
const dialogResizeObserver=new ResizeObserver(queueDialogPosition);dialogResizeObserver.observe(dialog);
window.addEventListener('pagehide',()=>{dialogResizeObserver.disconnect();cancelAnimationFrame(dialogPositionFrame);try{if(parent!==window){parent.removeEventListener('scroll',queueDialogPosition);parent.removeEventListener('resize',queueDialogPosition);parent.visualViewport?.removeEventListener('resize',queueDialogPosition);parent.visualViewport?.removeEventListener('scroll',queueDialogPosition);}}catch{}},{once:true});
function modal(title,html){dialog.removeAttribute('aria-describedby');const fresh=!dialog.open;if(fresh)lastFocus=document.activeElement;$('#ml-dialog-title').textContent=title;body.innerHTML=html;dialog.dataset.menu=String(!!body.querySelector('#ml-new-empty'));icons();positionDialog();if(fresh)dialog.showModal();positionDialog();$('#ml-dialog-close').focus({preventScroll:true});}
function close(){dialog.close();lastFocus?.isConnected&&lastFocus.focus({preventScroll:true});}
$('#ml-dialog-close').onclick=close;dialog.addEventListener('cancel',e=>{e.preventDefault();close();});dialog.addEventListener('click',e=>{if(e.target!==dialog)return;const r=dialog.getBoundingClientRect();if(e.clientX<r.left||e.clientX>r.right||e.clientY<r.top||e.clientY>r.bottom)close();});
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
function dragPosition(){
 const d=dragTab;if(!d?.started)return;
 const v=$('#ml-viewport').getBoundingClientRect(),bar=tabBar.getBoundingClientRect();
 d.valid=d.y>=bar.top-24&&d.y<=bar.bottom+24&&d.x>=v.left-$('#ml-next').offsetWidth&&d.x<=v.right+$('#ml-back').offsetWidth;
 dropMark.hidden=!d.valid;d.ghost.hidden=!d.valid;if(!d.valid)return;
 const x=Math.max(v.left,Math.min(v.right,d.x)),nodes=[...$('#ml-track').children].filter(b=>b.dataset.id!==d.id);
 // DOM order is right-to-left: the right half inserts before, the left half after.
 let index=nodes.findIndex(b=>{const r=b.getBoundingClientRect();return x>r.left+r.width/2;});
 if(index<0)index=nodes.length;d.index=index;
 const edge=index<nodes.length?nodes[index].getBoundingClientRect().right+4:nodes.length?nodes.at(-1).getBoundingClientRect().left-4:v.right;
 dropMark.style.left=(Math.max(v.left+2,Math.min(v.right-2,edge))-bar.left)+'px';
 d.ghost.style.left=(Math.max(0,Math.min(bar.width-d.ghost.offsetWidth,x-bar.left-d.ghost.offsetWidth/2)))+'px';
 d.ghost.style.top=(bar.height+5)+'px';
}
function dragScroll(now){
 const d=dragTab;if(!d?.started)return;
 dragPosition();const v=$('#ml-viewport').getBoundingClientRect(),edge=Math.min(24,v.width/4);
 const delta=d.valid?(d.x<v.left+edge?1:d.x>v.right-edge?-1:0):0;
 if(delta&&now-d.lastScroll>420){offset+=delta;scrollTabs(true);d.lastScroll=now;dragPosition();}
 d.frame=requestAnimationFrame(dragScroll);
}
function finishTabDrag(commit=false){
 const d=dragTab;if(!d)return;dragTab=null;cancelAnimationFrame(d.frame);
 d.button.classList.remove('ml-drag-source');root.classList.remove('ml-dragging');d.ghost?.remove();dropMark.hidden=true;
 if(d.button.hasPointerCapture(d.pointer))d.button.releasePointerCapture(d.pointer);
 if(!d.started)return;suppressTabClickUntil=performance.now()+500;
 if(commit&&d.valid){
  const before=visible(),after=before.filter(x=>x.id!==d.id);after.splice(d.index,0,lab(d.id));
  if(before.some((x,i)=>x.id!==after[i].id)){
   let i=0;state.labs=state.labs.map(x=>x.kind==='scratch'&&!x.hidden?after[i++]:x);
   changed();renderTabs();ensureVisible(d.id,true);toast('تم ترتيب التبويب؛ جارٍ حفظ ترتيب مختبراتك.');
  }
 }
}
function beginTabDrag(e,b){
 if(!e.isPrimary||e.button!==0||dragTab)return;
 dragTab={id:b.dataset.id,button:b,pointer:e.pointerId,x0:e.clientX,y0:e.clientY,x:e.clientX,y:e.clientY,started:false,lastScroll:performance.now()};
 b.setPointerCapture(e.pointerId);
}
function moveTabDrag(e){
 const d=dragTab;if(!d||e.pointerId!==d.pointer)return;d.x=e.clientX;d.y=e.clientY;
 if(!d.started){
  const dx=Math.abs(d.x-d.x0),dy=Math.abs(d.y-d.y0);
  if(dy>10&&dy>dx){finishTabDrag();return;}if(dx<7)return;
  d.started=true;d.button.classList.add('ml-drag-source');root.classList.add('ml-dragging');
  d.ghost=document.createElement('div');d.ghost.className='ml-drag-ghost';d.ghost.textContent=lab(d.id).name;d.ghost.setAttribute('aria-hidden','true');tabBar.append(d.ghost);
  d.frame=requestAnimationFrame(dragScroll);
 }
 e.preventDefault();dragPosition();
}
tabBar.addEventListener('click',e=>{if(performance.now()<suppressTabClickUntil){e.preventDefault();e.stopImmediatePropagation();}},true);
document.addEventListener('keydown',e=>{if(e.key==='Escape'&&dragTab){e.preventDefault();finishTabDrag();}});
window.addEventListener('blur',()=>finishTabDrag());
function renderTabs(){finishTabDrag();const orig=original();$('#ml-pinned').innerHTML=`<button id="ml-original-tab" role="tab" aria-controls="ml-workspace" aria-selected="${state.active===orig.id}" data-id="${orig.id}" data-tooltip="${courseNames[state.course]} · لا يُحذف">${icon('pin')}<span>مختبر التمرين</span></button>`;$('#ml-original-tab').onclick=()=>activate(orig.id);
 $('#ml-track').innerHTML=visible().map(x=>`<div class="ml-tab-item" data-id="${x.id}" role="presentation"><button class="ml-tab" role="tab" aria-controls="ml-workspace" aria-selected="${x.id===state.active}" data-id="${x.id}" draggable="false" data-tooltip="${esc(x.name)}">${icon(x.helper?'life-buoy':'flask-conical')}<span>${esc(x.name)}</span>${x.results.length>x.resultSeen?'<b aria-label="نتيجة جديدة"></b>':''}</button><button type="button" class="ml-tab-archive" data-hide-tab="${x.id}" aria-label="إخفاء ${esc(x.name)} في مختبراتي" title="إخفاء في مختبراتي">${icon('archive')}</button><button type="button" class="ml-tab-delete" data-delete-tab="${x.id}" aria-label="حذف ${esc(x.name)}" title="حذف المختبر">${icon('x')}</button></div>`).join('');
 $('#ml-track').querySelectorAll('.ml-tab-archive').forEach(b=>{b.onclick=e=>{e.stopPropagation();hideLab(b.dataset.hideTab);};b.onfocus=()=>ensureVisible(b.dataset.hideTab,true);});
 $('#ml-track').querySelectorAll('.ml-tab-delete').forEach(b=>{b.onclick=e=>{e.stopPropagation();deleteLab(b.dataset.deleteTab);};b.onfocus=()=>ensureVisible(b.dataset.deleteTab,true);});
 $('#ml-track').querySelectorAll('.ml-tab').forEach(b=>{
  b.onclick=()=>activate(b.dataset.id);b.onfocus=()=>{if(dragTab)return;ensureVisible(b.dataset.id,true);requestAnimationFrame(()=>$('#ml-viewport').scrollLeft=0);};
  b.ondragstart=e=>e.preventDefault();b.onpointerdown=e=>beginTabDrag(e,b);b.onpointermove=moveTabDrag;
  b.onpointerup=e=>{if(e.pointerId===dragTab?.pointer){if(dragTab.started)dragPosition();finishTabDrag(true);}};
  b.onpointercancel=b.onlostpointercapture=e=>{if(e.pointerId===dragTab?.pointer)finishTabDrag();};
  b.onkeydown=e=>{if(e.key==='Delete'){e.preventDefault();deleteLab(b.dataset.id);return;}if(['ArrowLeft','ArrowRight'].includes(e.key)){e.preventDefault();const buttons=[...$('#ml-track').querySelectorAll('.ml-tab')],i=buttons.indexOf(b);buttons[(i+(e.key==='ArrowLeft'?1:-1)+buttons.length)%buttons.length]?.focus({preventScroll:true});}};
 });icons();scrollTabs();renderDeletionUndo();}
$('#ml-back').onclick=()=>{offset--;scrollTabs();};$('#ml-next').onclick=()=>{offset++;scrollTabs();};new ResizeObserver(()=>{scrollTabs();ensureVisible();}).observe($('#ml-viewport'));
function updateContext(){const a=active();root.dataset.kind=a.kind;$('#ml-course').value=state.course;$('#ml-name').textContent=a.name;$('#ml-kind').textContent=a.kind==='original'?'مختبر التمرين · ثابت':a.helper?'المحاكي المساعد · مستقل':'مختبر مستقل · متاح في كل الدروس';$('#ml-description').textContent=a.description;$('#ml-hide').hidden=$('#ml-rename').hidden=a.kind==='original';$('#ml-return').hidden=!a.sourceOriginal||!lab(a.sourceOriginal);$('#ml-task-title').textContent=state.course==='vlan'?'أنشئ VLAN 20 على S1':'فعّل المنفذ G0/1 على R1';$('#ml-verdict').textContent=a.verdict||'';$('#ml-stale').hidden=!(a.helper&&lab(a.sourceOriginal)&&lab(a.sourceOriginal)?.revision!==a.sourceRevision&&a.ignoreStale!==lab(a.sourceOriginal)?.revision);$('#ml-undo-paste').disabled=!a.undo;$('#ml-paste').disabled=!clipboard;$('#ml-paste-guide').hidden=!placing;
 const live=new Set(B.deviceIds());selected=new Set([...selected].filter(id=>live.has(id)));const d=B.selected(),kind=a.data?.devices[d]?.type;const c=$('#ml-cli-context');if(c)c.textContent=a.name+' · '+(kind==='R'?'Router':kind==='S'?'Switch':'PC')+' '+(a.aliases[d]||d);
 B.aliases(a.aliases);B.helpContext({id:a.id,helper:!!a.helper,inline:!!a.inlineHelp,course:state.course,exercise:a.training?.exercise,step:a.training?.step});engine.querySelectorAll('[data-device]').forEach(el=>el.classList.toggle('ml-selected',selected.has(el.dataset.device)));learningRender();renderConfigTransfer();renderFreeNavigation();}
function render(){renderTabs();updateContext();renderLog();$('#nf-notice').textContent=Object.keys(active().data.devices).length?'مختبر مستقل. اسحب الأجهزة، وافصل الكابل أو شبّكه من منافذه.':'مساحة فارغة. أضف جهازًا، أو الصق التحديد اللي نسخته.';const c=$('#ml-cli-context');c.classList.remove('ml-flash');requestAnimationFrame(()=>{c.classList.add('ml-flash');ensureVisible();});}
$('#ml-course').onchange=e=>{const c=e.target.value;guard(()=>{state.course=c;activate('original-'+c);});if(dirty)e.target.value=state.course;};
function blank(data){const s=clone(data);s.devices={};s.cables=[];s.network={};s.cli={};s.power={};s.admin={};s.selected='';s.ui={};s.lesson=null;s.vlanExercise=false;s.editUndo=null;s.assistance=new window.MadarAssistance.Assistance().export();return s;}
function cloneLab(id,helper=false){capture();normalizeCopies(state);const source=lab(id),group=id,count=helper?null:(state.copyCounters[group]||0)+1;
 const name=helper?'مساعد '+courseNames[state.course]:`نسخة ${count===1?'':count.toLocaleString('ar-SA')+' '}من ${source.name}`;
 const n=makeLab(uid(),name,'scratch',source.data);n.course=source.course||state.course;n.cloneOf=group;n.copySourceName=source.name;n.copyNumber=count;n.aliases=clone(source.aliases);n.sourceOriginal=source.kind==='original'?source.id:source.sourceOriginal;n.sourceRevision=lab(n.sourceOriginal)?.revision;n.helper=helper;n.copied=source.copied;if(source.training){n.training=clone(source.training);delete n.training.selfTest;n.training.assessment=null;n.training.assessments=[];n.training.initial=clone(source.data);if(helper){n.training.sequence=[...(source.training.sequence||practiceScopes[source.training.scope]?.steps||L.order)];n.helperNavigationVersion=1;n.sourceOriginal=source.id;n.sourceRevision=source.revision;n.training.archive=[];n.training.assessment=null;n.training.checks={};n.training.completed=false;}}n.helpArchive=helper?[]:clone(source.helpArchive||[]);n.data.lesson=null;n.data.vlanExercise=false;n.data.editUndo=null;if(helper)n.data.assistance=new window.MadarAssistance.Assistance().export();state.labs.push(n);normalizeCopies(state);activate(n.id);close();return n;}
function openPlus(){modal('مساحة جديدة لتجربتك',`<button class="ml-menu-option" id="ml-new-empty">${icon('plus')} افتح تبويب جديد حر</button><button class="ml-menu-option" id="ml-new-copy">${icon('copy')} نسخ مختبر…</button><button class="ml-menu-option" id="ml-open-library">${icon('panels-top-left')} مختبراتي</button>`);$('#ml-new-empty').onclick=startBlank;$('#ml-new-copy').onclick=copyPicker;$('#ml-open-library').onclick=library;}
$('#ml-plus').onclick=openPlus;
function copyPicker(){modal('اختر المختبر اللي تبي تنسخه',`<label class="ml-form">المختبر<select id="ml-copy-source">${state.labs.map(x=>`<option value="${x.id}" ${x.id===state.active?'selected':''}>${esc(x.name)} · ${x.kind==='original'?courseNames[x.course]:'مستقل'}</option>`).join('')}</select></label><p id="ml-copy-desc"></p><small>نسخة مستقلة بنفس الحالة الحالية. الأصل ما يتغيّر.</small><button id="ml-create-copy">إنشاء نسخة مستقلة</button>`);const update=()=>$('#ml-copy-desc').textContent=lab($('#ml-copy-source').value).description||'لا يوجد وصف';$('#ml-copy-source').onchange=update;update();$('#ml-create-copy').onclick=()=>cloneLab($('#ml-copy-source').value);}
function editLab(id){const a=lab(id);if(a.kind==='original')return;modal('اسم المختبر ووصفه',`<label class="ml-form">اسم التبويب<input id="ml-edit-name" maxlength="70" value="${esc(a.name)}"></label><label class="ml-form">الوصف — اختياري<textarea id="ml-edit-desc" rows="3" maxlength="400">${esc(a.description)}</textarea></label><button id="ml-edit-save">حفظ الاسم والوصف</button>`);$('#ml-edit-save').onclick=()=>{const name=$('#ml-edit-name').value.trim();if(!name){$('#ml-edit-name').setCustomValidity('اكتب اسمًا للمختبر');$('#ml-edit-name').reportValidity();return;}a.name=name;a.custom=true;a.description=$('#ml-edit-desc').value.trim();changed();render();close();};}
$('#ml-rename').onclick=()=>editLab(state.active);
function hideLab(id){const a=lab(id);if(!a||a.kind==='original')return;if(B.busy()){toast('أكمل حركة الكابل أولًا، ثم أخفِ التبويب.');return;}guard(()=>{if(B.busy())return;a.hidden=true;if(state.active===id)activate(original().id);else{changed();renderTabs();}close();focusLabTab();toast('أُخفي «'+a.name+'». تقدر ترجعه من مختبراتي.');});}
$('#ml-hide').onclick=()=>hideLab(state.active);
function deleteLab(id,fromLibrary=false){
 const a=lab(id);if(!a||a.kind!=='scratch')return;
 if(B.busy()){toast('أكمل حركة الكابل أولًا، ثم احذف التبويب.');return;}
 capture();modal('حذف «'+a.name+'»؟',`<p id="ml-delete-description">بينحذف هذا التبويب ومختبره: ${Object.keys(a.data.devices).length} أجهزة و${a.data.cables.length} كابلات، مع إعداداته وسجلّه. المختبرات الثانية ما تتأثر.</p><small>تقدر تتراجع عن آخر حذف من الشريط، حتى بعد إعادة فتح الصفحة.${state.lastDeletedLab?' الحذف الجديد يستبدل فرصة التراجع عن الحذف السابق.':''}</small><button id="ml-delete-hide">إخفاء بدل الحذف</button><button id="ml-delete-cancel">إلغاء</button><button id="ml-delete-confirm" class="ml-danger">حذف المختبر</button>`);
 dialog.setAttribute('aria-describedby','ml-delete-description');
 $('#ml-delete-cancel').focus({preventScroll:true});
 $('#ml-delete-hide').onclick=()=>hideLab(id);$('#ml-delete-cancel').onclick=fromLibrary?library:close;
 $('#ml-delete-confirm').onclick=()=>{
  if(B.busy()){toast('أكمل حركة الكابل أولًا، ثم احذف التبويب.');return;}
  const current=lab(id);if(!current||current.kind!=='scratch')return;capture();normalizeCopies(state);
  const index=state.labs.indexOf(current),wasActive=state.active===id,list=visible(),vi=list.findIndex(x=>x.id===id),destination=list[vi+1]?.id||list[vi-1]?.id||original().id;
  const saved=clone(current);if(pendingPings.has(id)){saved.data.ui.pingPending=false;saved.data.ui.pingResult='أُوقف الفحص عند حذف المختبر؛ أعد تشغيل Ping للتحقق.';saved.data.ui.pingOk=null;saved.data.ui.pingTrace='';}
  state.lastDeletedLab={lab:saved,index,previous:state.labs[index-1]?.id,next:state.labs[index+1]?.id,wasActive};
  if(wasActive)activate(destination);
  state.labs=state.labs.filter(x=>x.id!==id);normalizeCopies(state);clearTimeout(pendingPings.get(id));pendingPings.delete(id);changed();render();
  close();if(fromLibrary)library();else focusLabTab();
 };
}
function moveLab(id,delta){const scratch=state.labs.filter(x=>x.kind==='scratch'),i=scratch.findIndex(x=>x.id===id),other=scratch[i+delta];if(!other)return;const a=state.labs.indexOf(lab(id)),b=state.labs.indexOf(other);[state.labs[a],state.labs[b]]=[state.labs[b],state.labs[a]];changed();renderTabs();library();}
function library(){capture();modal('مختبراتي',`<input id="ml-search" aria-label="ابحث في مختبراتي" placeholder="ابحث بالاسم أو الوصف" value="${esc(search)}"><div id="ml-lab-list"></div>`);$('#ml-search').oninput=e=>{search=e.target.value;libraryRows();};libraryRows();}
function libraryRows(){const rows=state.labs.filter(x=>(x.name+' '+x.description).toLowerCase().includes(search.toLowerCase()));$('#ml-lab-list').innerHTML=rows.map(x=>`<article class="ml-labrow" ${x.kind==='original'?'data-original':''}><div class="ml-rowhead"><strong>${esc(x.name)}</strong><span class="ml-sub">${x.kind==='original'?courseNames[x.course]:x.hidden?'مخفي':'ظاهر'}</span></div><p class="ml-sub">${esc(x.description||'بدون وصف')}</p><small>${Object.keys(x.data.devices).length} أجهزة · ${x.data.cables.length} كابلات · ${x.savedAt?'آخر حفظ '+new Date(x.savedAt).toLocaleTimeString('ar-SA',{hour:'2-digit',minute:'2-digit',timeZone:'Asia/Riyadh'}):'لم يُحفظ بعد'}</small><div class="ml-rowactions"><button data-open="${x.id}">${x.hidden?'إظهار':'انتقل إليه'}</button>${x.kind==='scratch'?`<button data-edit="${x.id}">تعديل</button><button data-hide="${x.id}">${x.hidden?'إظهار':'إخفاء'}</button><button data-move="${x.id}" data-delta="-1" aria-label="تقديم ${esc(x.name)}">↑</button><button data-move="${x.id}" data-delta="1" aria-label="تأخير ${esc(x.name)}">↓</button><button data-delete="${x.id}" class="ml-danger">حذف</button>`:'<span class="ml-sub">ثابت · لا يُحذف</span>'}</div></article>`).join('')||'<p>ما فيه مختبر يطابق بحثك.</p>';$('#ml-lab-list').style.display='grid';$('#ml-lab-list').style.gap='12px';$('#ml-lab-list').querySelectorAll('[data-open]').forEach(b=>b.onclick=()=>{activate(b.dataset.open);close();});$('#ml-lab-list').querySelectorAll('[data-edit]').forEach(b=>b.onclick=()=>editLab(b.dataset.edit));$('#ml-lab-list').querySelectorAll('[data-hide]').forEach(b=>b.onclick=()=>lab(b.dataset.hide).hidden?(activate(b.dataset.hide),close()):hideLab(b.dataset.hide));$('#ml-lab-list').querySelectorAll('[data-delete]').forEach(b=>b.onclick=()=>deleteLab(b.dataset.delete,true));$('#ml-lab-list').querySelectorAll('[data-move]').forEach(b=>b.onclick=()=>moveLab(b.dataset.move,Number(b.dataset.delta)));}
$('#ml-library').onclick=()=>{search='';library();};
$('#ml-helper').onclick=()=>{const o=original(),existing=state.labs.filter(x=>x.helper&&x.sourceOriginal===o.id).sort((a,b)=>(b.helperUseOrder||0)-(a.helperUseOrder||0))[0];if(existing){activate(existing.id);toast('رجعنا لآخر محاكي مساعد اشتغلت عليه في هذا التمرين؛ تجربتك باقية.');}else{cloneLab(o.id,true);toast('المحاكي المساعد مستقل. طبّق وخذ راحتك؛ النسخ لمختبر التمرين باختيارك.');}};
$('#ml-return').onclick=()=>{const id=active().sourceOriginal;if(id)activate(id);};$('#ml-stay').onclick=()=>{active().ignoreStale=lab(active().sourceOriginal)?.revision;changed();updateContext();};$('#ml-fresh').onclick=()=>cloneLab(active().sourceOriginal,true);
$('#ml-verify').onclick=()=>{capture();const a=active(),ok=B.verify(state.course);a.verdict=ok?(a.kind==='original'?'اكتمل المطلوب في مختبر التمرين. '+(a.copied?'التطبيق منسوخ؛ ليس قياس تنفيذ مستقل.':'هذا فحص للإعداد، وليس قياسًا للإتقان.'):'ضبطت معك هنا. ارجع للتمرين وطبّق أو انسخ اللي تحتاجه، ثم تحقّق هناك.'):'المطلوب لم يكتمل بعد. افحص الإعداد في الجهاز المحدد.';changed('view');updateContext();};
$('#ml-select').onclick=()=>{capture();modal('حدد الأجهزة اللي تبي تنسخها',Object.keys(active().data.devices).map(id=>`<label class="ml-selection"><input type="checkbox" value="${id}" ${selected.has(id)?'checked':''}><span>${esc(active().aliases[id]||id)}</span><small>${active().data.devices[id].type==='R'?'Router':active().data.devices[id].type==='S'?'Switch':'PC'}</small></label>`).join('')+'<button id="ml-selection-done">اعتماد التحديد</button>');$('#ml-selection-done').onclick=()=>{selected=new Set([...body.querySelectorAll('input:checked')].map(x=>x.value));updateContext();close();};};
engine.addEventListener('click',e=>{const b=e.target.closest('[data-device]');if(b){if(e.ctrlKey||e.metaKey){selected.has(b.dataset.device)?selected.delete(b.dataset.device):selected.add(b.dataset.device);}else selected=new Set([b.dataset.device]);updateContext();}});
engine.addEventListener('labs:device-removed',e=>{selected.delete(e.detail.id);delete active().aliases[e.detail.id];});
engine.addEventListener('labs:aliases-restored',e=>{active().aliases=clone(e.detail);});
$('#ml-copy').onclick=()=>{capture();const s=active().data;selected=new Set([...selected].filter(id=>s.devices[id]));const ids=(selected.size?[...selected]:[B.selected()]).filter(id=>s.devices[id]);if(!ids.length){toast('حدد جهازًا موجودًا للنسخ أولًا.');return;}const wires=s.cables.filter(c=>ids.some(id=>[c.a,c.b].some(k=>k?.startsWith(id+':'))));clipboard={ids,snapshot:clone(s),aliases:clone(active().aliases),source:active().name,cables:clone(wires),ends:{}};for(const c of wires)for(const k of [c.a,c.b])if(k)clipboard.ends[k]=B.endpoint(k);$('#ml-clipboard').textContent=`جاهز للنسخ: ${ids.length} أجهزة بإعداداتها و${wires.length} كابلات. الكابل ذو الطرف غير المنسوخ يبقى حرًّا.`;$('#ml-paste').disabled=false;toast('نُسخ التحديد. انتقل للمختبر اللي تبيه ثم اضغط لصق.');};
$('#ml-paste').onclick=()=>{if(!clipboard)return;placing=true;$('#ml-paste-guide').hidden=false;$('#nf-stage').scrollIntoView({block:'center',behavior:'instant'});};$('#ml-cancel-paste').onclick=()=>{placing=false;$('#ml-paste-guide').hidden=true;};
function pasteAt(p){capture();const a=active(),s=clone(a.data),clip=clipboard,map={},beforeAliases=clone(a.aliases);if(!clip?.ids.length||clip.ids.some(id=>!clip.snapshot.devices[id])){placing=false;updateContext();toast('التحديد المنسوخ غير صالح؛ حدد الأجهزة وانسخها من جديد.');return;}if(Object.keys(s.devices).length+clip.ids.length>128||s.cables.length+clip.cables.length>256){placing=false;updateContext();toast('هذا التحديد يتجاوز سعة مساحة المعاينة. لم يُنسخ أو يُحذف أي عنصر.');return;}const src=clip.snapshot,mean=[0,0,0];clip.ids.forEach(id=>src.devices[id].position.forEach((v,i)=>mean[i]+=v/clip.ids.length));const dx=p[0]-mean[0],dz=p[2]-mean[2];const shift=v=>[v[0]+dx,v[1],v[2]+dz];
 for(const id of clip.ids){const d=src.devices[id],type=d.type;let n=1;while(s.devices[type+n])n++;const next=type+n;map[id]=next;s.devices[next]={...clone(d),instanceId:uid(),position:shift(d.position)};s.power[next]=src.power[id];s.network[next]=clone(src.network[id]);s.cli[next]=clone(src.cli[id]||{mode:'user',lines:[],history:[],historyIndex:0});const base=clip.aliases[id]||id;let label=base,i=1;const names=Object.keys(s.devices).filter(x=>x!==next).map(x=>a.aliases[x]||x);while(names.includes(label))label=base+' — نسخة'+(i++===1?'':' '+(i-1));a.aliases[next]=label;for(const[k,v]of Object.entries(src.admin))if(k.startsWith(id+':'))s.admin[next+k.slice(id.length)]=v;}
 const key=k=>k&&map[k.split(':')[0]]?map[k.split(':')[0]]+k.slice(k.indexOf(':')):null,added=[];
 for(const c of clip.cables){const nc=clone(c);nc.id='paste-'+uid();for(const side of ['A','B']){const k=c[side.toLowerCase()],mapped=key(k);nc[side.toLowerCase()]=mapped;nc['home'+side]=mapped;if(!mapped){const end=k?clip.ends[k]:c['loose'+side];nc['loose'+side]={p:shift(end.p),n:clone(end.n)};}}
 s.cables.push(nc);added.push(nc.id);}
 const deviceIds=Object.values(map);s.selected=deviceIds[0]+(src.devices[clip.ids[0]].type==='S'?':G0/1':src.devices[clip.ids[0]].type==='R'?':G0/0':':F0');s.editUndo=null;a.undo={devices:deviceIds,instances:Object.fromEntries(deviceIds.map(id=>[id,s.devices[id].instanceId])),cables:added,aliases:beforeAliases};a.data=s;a.copied=true;loading=true;B.restore(s);loading=false;selected=new Set(deviceIds);placing=false;const conflicts=[];const ips={};for(const[id,c]of Object.entries(s.network)){const values=[c.pc?.ip,...Object.values(c.interfaces||{}).map(x=>x.ip)].filter(Boolean);for(const ip of values){if(ips[ip]&&ips[ip]!==id)conflicts.push(`${ip}: ${a.aliases[ips[ip]]||ips[ip]} و${a.aliases[id]||id}`);ips[ip]=id;}}
 a.logs.push({text:`${clip.source} ← ${a.name}: ${deviceIds.length} أجهزة و${added.length} كابلات. تم النسخ؛ لم يُتحقق من صحة التطبيق بعد.`,at:Date.now()});if(a.logs.length===1)a.logOpen=true;changed('engine');render();toast(`تم لصق ${deviceIds.length} أجهزة و${added.length} كابلات. تراجع متاح من الشريط.`+(conflicts.length?' تنبيه: عناوين IP مكررة — '+conflicts.join('، '):''));if(conflicts.length){Object.keys(ips).forEach(ip=>{for(const[id,c]of Object.entries(s.network))if(c.pc?.ip===ip&&conflicts.some(t=>t.startsWith(ip)))selected.add(id);});updateContext();}}
$('#nf-stage').addEventListener('pointerdown',e=>{if(placing){e.preventDefault();e.stopImmediatePropagation();const p=B.point(e);if(p)pasteAt(p);}},{capture:true});
$('#ml-undo-paste').onclick=()=>{capture();const a=active(),u=a.undo;if(!u)return;const s=a.data,remove=u.devices.filter(id=>u.instances?.[id]&&s.devices[id]?.instanceId===u.instances[id]);for(const id of remove){delete s.devices[id];delete s.network[id];delete s.cli[id];delete s.power[id];delete a.aliases[id];for(const k of Object.keys(s.admin))if(k.startsWith(id+':'))delete s.admin[k];}s.cables=s.cables.filter(c=>!u.cables.includes(c.id)&&![c.a,c.b].some(k=>remove.includes(k?.split(':')[0])));s.selected=Object.keys(s.devices)[0]?(Object.keys(s.devices)[0]+(s.devices[Object.keys(s.devices)[0]].type==='S'?':G0/1':s.devices[Object.keys(s.devices)[0]].type==='R'?':G0/0':':F0')):'';s.editUndo=null;a.undo=null;loading=true;B.restore(s);loading=false;selected.clear();changed('engine');render();toast('تراجعنا عن عناصر آخر لصق الباقية؛ الأجهزة الجديدة وبقية الشبكة محفوظة.');};
const cliContext=document.createElement('div');cliContext.id='ml-cli-context';$('#nf-cli').insertBefore(cliContext,$('#nf-cli').children[1]);
const tools=document.createElement('div');tools.className='ml-cli-tools';tools.innerHTML='<button id="ml-copy-commands">نسخ النص المحدد من CLI</button><button id="ml-paste-commands">لصق النص في خانة الأمر</button>';$('#nf-cli').append(tools);let commandClipboard='';$('#ml-copy-commands').onclick=()=>{commandClipboard=window.getSelection()?.toString()||$('#nf-command').value;if(commandClipboard)toast('نُسخ النص؛ اختر جهازك ثم الصقه.');else toast('حدد نص الأوامر أولًا.');};$('#ml-paste-commands').onclick=()=>{if(!commandClipboard){toast('انسخ نصًا أولًا.');return;}if(commandClipboard.includes('\n')){modal('نص أوامر متعدد الأسطر',`<small>راجع النص واختر أمرًا. لا ينفّذ النسخ أي أمر تلقائيًا.</small><textarea id="ml-command-text" rows="5" dir="ltr">${esc(commandClipboard)}</textarea><button id="ml-command-use">ضع السطر المحدد في خانة الأمر</button>`);$('#ml-command-use').onclick=()=>{const t=$('#ml-command-text'),line=t.value.slice(t.selectionStart,t.selectionEnd)||t.value.split('\n')[0];$('#nf-command').value=line.replace(/\r?\n/g,' ');$('#nf-command').dispatchEvent(new Event('input',{bubbles:true}));close();};}else{$('#nf-command').value=commandClipboard;$('#nf-command').dispatchEvent(new Event('input',{bubbles:true}));}};
const log=document.createElement('details');log.id='ml-copy-log';log.innerHTML='<summary>سجل النسخ والتحقق</summary><ul></ul>';$('#nf-cli').after(log);log.addEventListener('toggle',()=>{if(!loading&&active().logOpen!==log.open){active().logOpen=log.open;changed('view');}});
function renderLog(){log.open=!!active().logOpen;const lines=[...active().logs.map(x=>x.text),...active().results.map(x=>x.text)];log.querySelector('ul').innerHTML=lines.length?lines.map(t=>'<li>'+esc(t)+'</li>').join(''):'<li>ما فيه نسخ أو نتائج اتصال بعد.</li>';}
log.addEventListener('click',()=>{active().resultSeen=active().results.length;renderTabs();});
// A delayed delivery uses a captured network result and keeps its originating lab id.
$('#madar-free').addEventListener('labs:ping-display',()=>{clearTimeout(pendingPings.get(state.active));pendingPings.delete(state.active);});
$('#nf-ping-run').onclick=()=>{const id=state.active,source=$('#nf-ping-source').value,target=$('#nf-ping-target').value.trim();if(!source)return;capture();const result=clone(B.runPing(source,target)),revision=active().revision;clearTimeout(pendingPings.get(id));B.pendingPing();pendingPings.set(id,setTimeout(()=>{pendingPings.delete(id);const a=lab(id);if(!a)return;const stale=a.revision!==revision,text=`${source} → ${target}: ${result.ok?'نجح اختبار الاتصال':'لم ينجح اختبار الاتصال'}${stale?' — النتيجة تخص الإعداد وقت بدء الفحص':''}`;a.results.push({text,revision});Object.assign(a.data.ui,{pingResult:text,pingOk:stale?null:String(result.ok),pingPending:false,pingTrace:stale?'':result.trace.length?result.trace.join('\n'):result.reason});if(state.active===id){B.showPing(result,text,stale);renderLog();}changed('result');renderTabs();},1800));};
engine.addEventListener('labs:context',()=>{if(!loading)updateContext();});B.onChange(reason=>{if(!loading){changed(reason);updateContext();}});
const recovery=document.createElement('section');recovery.id='ml-recovery';recovery.hidden=true;recovery.innerHTML='<h3>لم تكتمل استعادة مختبراتك</h3><p>احتفظنا بالحفظ السابق. التحرير والحفظ الجديد متوقفان حتى نستعيده؛ لن نستبدله بمختبر فارغ.</p><button id="ml-recovery-retry" type="button">أعد محاولة الاستعادة</button><p id="ml-recovery-status" role="status"></p>';root.prepend(recovery);
function recoveryUI(failed){root.dataset.restore=failed?'failed':'ready';recovery.hidden=!failed;for(const el of root.children)if(el!==recovery)el.inert=failed;if(failed){delete root.dataset.ready;setSave('error','لم تكتمل الاستعادة؛ حُفظت النسخة السابقة دون استبدال.');}else root.dataset.ready='true';}
$('#ml-recovery-retry').onclick=async()=>{const button=$('#ml-recovery-retry');button.disabled=true;$('#ml-recovery-status').textContent='جارٍ استعادة مختبراتك…';const previous=state;try{const restored=await unpack(recoveryPayload);if(!restored)throw Error('لا توجد نسخة قابلة للاستعادة');loading=true;state=restored;root.dataset.restore='restoring';B.restore(active().data);loading=false;render();restoreFailure=null;recoveryPayload=null;recoveryUI(false);setSave('saved','استُعيدت مختبراتك المحفوظة');$('#ml-recovery-status').textContent='';}catch(e){loading=true;state=previous;B.restore(active().data);loading=false;restoreFailure=e.message;recoveryUI(true);$('#ml-recovery-status').textContent='لم تكتمل القراءة. النسخة السابقة ما زالت محفوظة؛ يمكنك إعادة المحاولة.';}finally{button.disabled=false;}};
loading=true;B.restore(active().data);loading=false;render();if(!restoreFailure&&window.openai?.widgetState?.privateContent?.format==='madar-tabs-gzip-1')setSave('saved','استُعيدت مختبراتك المحفوظة');
if(state.legacyUndoDiscarded){toast('استُعيدت مختبراتك. تراجع اللصق القديم لا يحفظ هوية الأجهزة، لذلك أُوقف لحماية الأجهزة البديلة. عملياتك الجديدة تحفظ التراجع.');delete state.legacyUndoDiscarded;}
// Read-only diagnostics for this preview's own tests; never learner-performance data.
root.getLabsState=()=>{capture();return clone({...state,dirty,saving,offset,clipboard:clipboard?{ids:clipboard.ids,cables:clipboard.cables.length}:null});};recoveryUI(!!restoreFailure);icons();
})();




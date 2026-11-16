// Navigation changes the selected task only, never configurations or completion evidence.
const freeSteps=document.createElement('nav');freeSteps.className='ml-free-steps';freeSteps.setAttribute('aria-label','التنقل الحر بين خطوات التطبيق');
freeSteps.innerHTML='<button id="ml-step-back" type="button">السابق</button><label>انتقل إلى أي خطوة<select id="ml-step-choice"></select></label><button id="ml-step-forward" type="button">التالي</button><small>تنقّل بحرية؛ تجاوز الخطوة لا يسجلها مكتملة.</small>';
$('.ml-task').after(freeSteps);
const skipStep=document.createElement('button');skipStep.id='ml-skip-step';skipStep.type='button';skipStep.textContent='تخطَّ الخطوة ←';skipStep.title='انتقل للخطوة التالية دون اشتراط نجاح التحقق؛ لا تُحسب هذه الخطوة مكتملة';
$('#ml-verify').after(skipStep);
let freeStepsKey='';
function renderFreeNavigation(){
 const t=active().training,seq=t?practiceSequence(t):[];
 freeSteps.hidden=seq.length<2;const key=JSON.stringify([active().id,seq]);
 if(key!==freeStepsKey){freeStepsKey=key;$('#ml-step-choice').innerHTML=seq.map((s,i)=>`<option value="${esc(s)}">${i+1}. ${esc(L.titles[s])}</option>`).join('');}
 $('#ml-step-choice').value=t?.step||'';const index=seq.indexOf(t?.step);
 $('#ml-step-back').disabled=B.busy()||index<=0;
 $('#ml-step-forward').disabled=B.busy()||index<0||index>=seq.length-1;
 skipStep.hidden=seq.length<2;skipStep.disabled=B.busy()||index<0||index>=seq.length-1;
 skipStep.textContent=index===seq.length-1?'أنت في آخر خطوة':'تخطَّ الخطوة ←';
 // Saved pre-navigation feedback must not contradict the now-unlocked controls.
 if(active().verdict==='لم يكتمل المطلوب. لن تنتقل للخطوة التالية حتى يُصحح.'){
  active().verdict='لم يكتمل المطلوب في هذه الخطوة. تقدر تراجعها أو تنتقل لغيرها.';
  $('#ml-verdict').textContent=active().verdict;
 }
 $('#ml-step-choice').disabled=B.busy();$('#ml-next-step').hidden=true;
}
function navigateFreeStep(key){
 const a=active(),t=a.training;if(B.busy()||!t||!practiceSequence(t).includes(key)||key===t.step)return;
 const from=t.step;t.step=key;a.verdict='';
 t.evidence.push({type:'step-navigation',from,to:key,at:new Date().toISOString()});
 changed('view');updateContext();
}
$('#ml-step-choice').onchange=e=>navigateFreeStep(e.target.value);
$('#ml-step-back').onclick=()=>{const t=active().training,seq=practiceSequence(t);navigateFreeStep(seq[seq.indexOf(t.step)-1]);};
$('#ml-step-forward').onclick=()=>{const t=active().training,seq=practiceSequence(t);navigateFreeStep(seq[seq.indexOf(t.step)+1]);};
skipStep.onclick=()=>$('#ml-step-forward').click();
// Move the existing controls, preserving zoom behavior and persistence.
const zoomDock=document.createElement('div');zoomDock.className='ml-zoom-dock';zoomDock.setAttribute('role','group');zoomDock.setAttribute('aria-label','حجم عرض الشبكة');
zoomDock.append($('#nf-plus'),$('#nf-minus'),$('#nf-all'));
// Outside the canvas event surface: zoom must not trigger selection, cable drag or paste.
$('#nf-stage').before(zoomDock);
// One horizontal workspace toolbar. Move live buttons rather than recreating handlers.
const workspaceBar=document.createElement('div');workspaceBar.className='ml-workspace-toolbar';
workspaceBar.innerHTML='<button type="button" class="ml-tools-arrow" id="ml-tools-start" aria-label="إظهار الأدوات السابقة">‹</button><div class="ml-tools-track" role="group" aria-label="أدوات مساحة الشبكة"></div><button type="button" class="ml-tools-arrow" id="ml-tools-end" aria-label="إظهار بقية الأدوات">›</button>';
$('#nf-stage').before(workspaceBar);const toolTrack=workspaceBar.querySelector('.ml-tools-track');
function workspaceGroup(label,nodes){const group=document.createElement('div');group.className='ml-tools-group';group.setAttribute('role','group');group.setAttribute('aria-label',label);group.append(...nodes);toolTrack.append(group);}
workspaceGroup('إضافة جهاز',[...engine.querySelectorAll('[data-add-device]')]);
workspaceGroup('نوع الكابل',[...cablePicker.querySelectorAll('[data-cable-choice]'),$('#ml-cable-replace'),$('#ml-cable-dce')]);
workspaceGroup('التحديد والحذف',[$('#ml-quick-cable-mode'),$('#ml-quick-multi'),$('#ml-quick-delete'),$('#ml-quick-wire')]);
workspaceGroup('التراجع والإعادة',[$('#ml-quick-undo'),$('#ml-restart')]);
workspaceGroup('حجم العرض',[$('#nf-plus'),$('#nf-minus'),$('#nf-all')]);
const toolsHelp=document.createElement('button');toolsHelp.type='button';toolsHelp.textContent='دليل الأدوات';toolsHelp.id='ml-tools-help';toolsHelp.setAttribute('aria-expanded','false');toolTrack.append(toolsHelp);
const toolsGuide=document.createElement('div');toolsGuide.id='ml-tools-guide';toolsGuide.hidden=true;
toolsGuide.append($('#ml-quick-target'),quickBar.querySelector('.ml-quick-tip'),$('#ml-cable-choice-help'),$('#ml-cable-current-info'),cablePicker.querySelector('details'));
workspaceBar.after(toolsGuide);toolsHelp.onclick=()=>{toolsGuide.hidden=!toolsGuide.hidden;toolsHelp.setAttribute('aria-expanded',String(!toolsGuide.hidden));};
// Retain the legacy undo node for its existing bridge, without a duplicate visible button.
engine.querySelector('.nf-build').hidden=true;engine.querySelector('.nf-tools').hidden=true;
quickBar.hidden=true;cablePicker.hidden=true;zoomDock.hidden=true;
// Cable state still uses its original nodes after they move into the unified strip.
const toolbarCableButtons=[...toolTrack.querySelectorAll('[data-cable-choice]')];
const priorRefreshCablePicker=refreshCablePicker;
refreshCablePicker=function(){priorRefreshCablePicker();for(const button of toolbarCableButtons){button.setAttribute('aria-pressed',String(button.dataset.cableChoice===B.cableChoice()));button.disabled=B.busy();}};
function toolbarEdges(){
 const max=Math.max(0,toolTrack.scrollWidth-toolTrack.clientWidth),position=Math.abs(toolTrack.scrollLeft);
 $('#ml-tools-start').hidden=max<2;$('#ml-tools-end').hidden=max<2;
 $('#ml-tools-start').disabled=position<2;$('#ml-tools-end').disabled=position>=max-2;
}
$('#ml-tools-start').onclick=()=>toolTrack.scrollBy({left:Math.max(180,toolTrack.clientWidth*.7),behavior:'smooth'});
$('#ml-tools-end').onclick=()=>toolTrack.scrollBy({left:-Math.max(180,toolTrack.clientWidth*.7),behavior:'smooth'});
toolTrack.addEventListener('scroll',toolbarEdges,{passive:true});
const toolsResize=new ResizeObserver(toolbarEdges);toolsResize.observe(toolTrack);
window.addEventListener('pagehide',()=>toolsResize.disconnect(),{once:true});


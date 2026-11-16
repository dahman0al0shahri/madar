// Fast actions stay next to the workspace; editing text never deletes network objects.
const quickBar=document.createElement('div');quickBar.className='ml-quick-edit';quickBar.innerHTML='<span id="ml-quick-target" role="status"></span><div><button id="ml-quick-cable-mode" type="button" aria-pressed="false">تحديد كابل</button><button id="ml-quick-multi" type="button">تحديد متعدد</button><button id="ml-quick-delete" type="button" title="حذف المحدد — Delete أو Backspace">'+icon('trash-2')+'<span>حذف المحدد</span></button><button id="ml-quick-wire" type="button">'+icon('unplug')+'حذف كابل المنفذ</button><button id="ml-quick-undo" type="button">'+icon('undo-2')+'تراجع</button></div><span class="ml-quick-tip">اضغط الجهاز أو رأس الكابل أو جسمه ثم Delete · Ctrl مع الضغط لتحديد عدة أجهزة</span>';
$('#nf-stage').before(quickBar);
// Keep restart visible beside the workspace, outside the folded learning tools.
quickBar.querySelector('div').append($('#ml-restart'));
root.addEventListener('labs:attempt-restarted',()=>{quickHead=null;quickCable=null;cableMode=false;selected.clear();});
const cablePicker=document.createElement('section');cablePicker.className='ml-cable-picker';cablePicker.setAttribute('aria-label','اختيار نوع الكابل');
cablePicker.innerHTML='<div class="ml-cable-options" role="group" aria-label="نوع الكابل الجديد"><strong>نوع الكابل</strong><button type="button" data-cable-choice="auto" aria-pressed="true">تلقائي</button><button type="button" data-cable-choice="straight" aria-pressed="false"><span class="ml-wire-sample" aria-hidden="true"></span><bdi>Straight-Through</bdi><small>مباشر</small></button><button type="button" data-cable-choice="crossover" aria-pressed="false"><span class="ml-wire-sample ml-wire-cross" aria-hidden="true"></span><bdi>Crossover</bdi><small>متقاطع</small></button></div><div class="ml-cable-options"><button type="button" data-cable-choice="console">Console · إدارة محلية</button><button type="button" data-cable-choice="serial">Serial · DCE / DTE</button></div><p id="ml-cable-choice-help" role="status"></p><div class="ml-cable-current"><span id="ml-cable-current-info"></span><button type="button" id="ml-cable-dce">اجعل الطرف المحدد DCE</button><button type="button" id="ml-cable-replace" disabled>استبدل الكابل المحدد</button></div><details><summary>أنواع الكابلات واستخدامها</summary><p id="ml-cable-pinmap" dir="ltr"></p><p>Ethernet اتصال الشبكة عبر منافذ RJ45 الحالية. المباشر يوصل كل رقم في الرأس الأول بالرقم نفسه في الثاني؛ المتقاطع يبدّل أزواج الأسلاك. التلقائي يختار النوع عند إكمال توصيل الطرفين، ويحتفظ الكابل بنوعه بعد ذلك.</p><p>Auto-MDIX تصحيح تلقائي لتوصيل الأزواج. في أجهزة هذا المختبر هو مفعّل في منافذ Switch؛ لذلك يمكنها العمل بالنوعين. منافذ PC وRouter هنا ممثلة دون هذا التصحيح، فتحتاج Crossover للاتصال المباشر بينها. لون الغلاف للتمييز البصري هنا، وليس معيارًا لتحديد نوع الكابل في الواقع.</p><p>Console يصل RS232 في PC بمنفذ Console في الجهاز للإدارة المحلية؛ لا ينقل اتصال IP. Serial يصل منفذي Serial، ويحدد طرف DCE مصدر الساعة. لكل منهما موصل مستقل، ولا يمكن إدخاله في منفذ Ethernet. التمثيل ثلاثي الأبعاد تعليمي ولا يطابق مقاسات طراز بعينه. Fiber خارج نطاق هذه الدروس.</p></details>';
quickBar.before(cablePicker);
function refreshCablePicker(){const choice=B.cableChoice(),info=quickCable?B.cableInfo(quickCable):null;for(const button of cablePicker.querySelectorAll('[data-cable-choice]')){button.setAttribute('aria-pressed',String(button.dataset.cableChoice===choice));button.disabled=B.busy();}$('#ml-cable-choice-help').textContent=choice==='auto'?'اسحب من منفذ إلى منفذ؛ يُختار النوع المناسب عند توصيل الطرف الثاني.':choice==='straight'?'مباشر: اخترته للكابل الجديد. اسحب من منفذ إلى منفذ.':'متقاطع: اخترته للكابل الجديد. اسحب من منفذ إلى منفذ.';$('#ml-cable-current-info').textContent=info?'الكابل المحدد: '+info.label+(info.autoPending?' · ينتظر اختيار الطرف الثاني':''):'لتغيير كابل موجود: حدده من رأسه أو جسمه، ثم اختر النوع واضغط استبدال.';$('#ml-cable-replace').disabled=!info||B.busy();$('#ml-cable-pinmap').textContent=info?.pins.length?'A → B: '+info.pins.map((v,i)=>(i+1)+'→'+v).join(' | '):'';}
cablePicker.querySelectorAll('[data-cable-choice]').forEach(button=>button.onclick=()=>{if(!B.chooseCable(button.dataset.cableChoice))toast('أكمل توصيل الكابل الحالي أو ألغِه أولًا.');refreshQuickEdit();});
$('#ml-cable-replace').onclick=()=>{if(B.replaceCable(quickCable)){updateContext();toast('استُبدل نوع الكابل؛ التراجع يعيد النوع السابق.');}};
const quickCanvas=$('#nf-stage canvas');quickCanvas.tabIndex=0;quickCanvas.removeAttribute('aria-hidden');quickCanvas.setAttribute('aria-label','مساحة الشبكة؛ حدد عنصرًا ثم Delete للحذف');
let quickCable=null,quickLabId='',quickPort='',cableMode=false;
let quickHead=null;
function chooseQuickCable(id){quickPort=B.capture().selected;quickCable=id;selected.clear();updateContext();}
// A tap selects a plug; movement belongs to the existing cable drag handlers.
function startHeadTap(e,target){quickHead={id:target.id,lab:state.active,pointer:e.pointerId,x:e.clientX,y:e.clientY,moved:false};quickCable=null;selected.clear();updateContext();}
function refreshQuickEdit(){
 if(quickLabId!==state.active){quickCable=null;cableMode=false;quickLabId=state.active;}
 const snap=B.capture();if(snap.selected!==quickPort){quickCable=null;quickPort=snap.selected;}selected=new Set([...selected].filter(id=>snap.devices[id]));if(quickCable&&!snap.cables.some(c=>c.id===quickCable))quickCable=null;
 const ids=cableMode?[]:selected.size?[...selected]:[B.selected()].filter(Boolean),wire=snap.cables.find(c=>c.id===quickCable);
 $('#ml-quick-target').textContent=wire?'الكابل: '+(wire.a||'طرف حر')+' ↔ '+(wire.b||'طرف حر'):ids.length?'المحدد: '+ids.map(id=>active().aliases[id]||id).join('، '):cableMode?'اضغط الكابل لتحديده، ثم احذفه. Escape للخروج.':'حدد جهازًا أو كابلًا';
 $('#ml-quick-cable-mode').setAttribute('aria-pressed',String(cableMode));$('#nf-stage').dataset.cableSelect=String(cableMode);
 $('#ml-quick-delete span').textContent=wire?'حذف الكابل':'حذف المحدد';
 $('#ml-quick-delete').disabled=B.busy()||(!wire&&!ids.length);$('#ml-quick-wire').disabled=B.busy()||!B.connectedCable();$('#ml-quick-wire').hidden=!!wire||cableMode;$('#ml-quick-undo').disabled=$('#nf-undo').disabled;B.highlightCable(quickCable);refreshCablePicker();
}
const quickOldUpdate=updateContext;updateContext=function(){quickOldUpdate();refreshQuickEdit();};
function quickDelete(){if(B.busy()||placing||(cableMode&&!quickCable))return;const ids=quickCable?[]:selected.size?[...selected]:[B.selected()];if(B.deleteItems(ids,quickCable)){quickCable=null;selected.clear();updateContext();quickCanvas.focus({preventScroll:true});toast('تم الحذف — تراجع متاح بجانب المساحة.');}}
$('#ml-quick-cable-mode').onclick=()=>{if(B.busy()||placing)return;cableMode=!cableMode;if(cableMode)engine.querySelector('.nf-zoom-head button')?.click();quickCable=null;selected.clear();updateContext();quickCanvas.focus({preventScroll:true});};
$('#ml-quick-delete').onclick=quickDelete;
$('#ml-quick-wire').onclick=()=>{if(B.deleteItems([],B.connectedCable())){quickCable=null;updateContext();quickCanvas.focus({preventScroll:true});toast('حُذف الكابل — تراجع متاح.');}};
$('#ml-quick-undo').onclick=()=>{$('#nf-undo').click();quickCable=null;selected.clear();updateContext();quickCanvas.focus({preventScroll:true});};
$('#ml-quick-multi').onclick=()=>{cableMode=false;quickCable=null;$('#ml-select').click();};
quickCanvas.addEventListener('pointerdown',e=>{
 if(e.button!==0||B.busy()||placing)return;const target=B.quickPick(e,{cableOnly:cableMode});quickCanvas.focus({preventScroll:true});
 if(target?.head&&!cableMode){startHeadTap(e,target);return;}
 if(target?.kind==='cable'){e.preventDefault();e.stopImmediatePropagation();quickCable=target.id;selected.clear();updateContext();return;}
 if(cableMode){e.preventDefault();e.stopImmediatePropagation();quickCable=null;selected.clear();updateContext();return;}
 quickCable=null;
 if(target?.kind==='device'){if(e.ctrlKey||e.metaKey){selected.has(target.id)?selected.delete(target.id):selected.add(target.id);}else selected=new Set([target.id]);}else selected.clear();
 updateContext();
},true);
quickCanvas.addEventListener('pointermove',e=>{if(cableMode){e.stopImmediatePropagation();}},true);
const quickLens=$('#nf-lens canvas');quickLens.tabIndex=0;quickLens.setAttribute('aria-label','رأس الكابل؛ اضغط للتحديد ثم Delete للحذف، أو اسحب للفصل والتوصيل');
quickLens.addEventListener('pointerdown',e=>{if(e.button!==0||B.busy()||placing)return;const target=B.quickPlugPick(e,true);if(target){quickLens.focus({preventScroll:true});startHeadTap(e,target);}},true);
root.addEventListener('pointermove',e=>{if(quickHead?.pointer===e.pointerId&&Math.hypot(e.clientX-quickHead.x,e.clientY-quickHead.y)>=5)quickHead.moved=true;},true);
root.addEventListener('pointerup',e=>{const h=quickHead;if(!h||h.pointer!==e.pointerId)return;quickHead=null;if(!h.moved&&Math.hypot(e.clientX-h.x,e.clientY-h.y)<5&&h.lab===state.active&&!B.busy())chooseQuickCable(h.id);});
root.addEventListener('pointercancel',()=>{quickHead=null;},true);
root.addEventListener('lostpointercapture',()=>{quickHead=null;});
root.addEventListener('keydown',e=>{if(e.key==='Escape')quickHead=null;},true);
root.addEventListener('keydown',e=>{if(e.key==='Escape'&&cableMode){cableMode=false;quickCable=null;quickCanvas.style.cursor='grab';updateContext();}});
engine.addEventListener('click',e=>{if(e.target.closest('[data-device]')){cableMode=false;quickCable=null;updateContext();}});
$('#nf-device').addEventListener('change',()=>{cableMode=false;quickCable=null;selected.clear();updateContext();});$('#nf-port').addEventListener('change',()=>{cableMode=false;quickCable=null;selected.clear();updateContext();});
root.addEventListener('keydown',e=>{
 if(!['Delete','Backspace'].includes(e.key)||e.repeat||e.ctrlKey||e.metaKey||e.altKey||e.shiftKey||dialog.open||placing)return;
 if(e.target.isContentEditable||e.target.closest('input,textarea,select,[role="textbox"]'))return;
 if(!e.target.closest('#nf-stage,#nf-lens,.ml-quick-edit'))return;e.preventDefault();quickDelete();
});

$('#ml-cable-dce').onclick=()=>{if(!B.setDCE())toast('حدد منفذًا موصولًا بكابل Serial أولًا.');refreshQuickEdit();};

// Choosing a location does not reveal an answer or record an exposure.
function assistanceOwners(a){
 const owners=[],seen=new Set();
 while(a&&!seen.has(a.id)){owners.push(a);seen.add(a.id);a=a.helper?lab(a.sourceOriginal):null;}
 return owners;
}
// Upgrade older single-step helpers without copying the source's progress or settings.
function migrateHelperNavigation(a){
 if(!a.helper||!a.training||a.helperNavigationVersion===1)return;
 const source=lab(a.sourceOriginal),t=a.training;
 t.sequence=[...(source?.training?.sequence?.length>1?source.training.sequence:practiceScopes[t.scope]?.steps||L.order)];
 t.completed=false;a.helperNavigationVersion=1;
}
for(const a of state.labs)migrateHelperNavigation(a);
function focusHelpPanel(){
 const panel=engine.querySelector('#ml-assistance');
 panel.scrollIntoView({block:'center',behavior:matchMedia('(prefers-reduced-motion: reduce)').matches?'auto':'smooth'});
 engine.querySelector('#ml-hint').focus({preventScroll:true});
}
function chooseHelpPlacement(){
 if(B.busy()){toast('أكمل حركة الكابل أولًا، ثم افتح المساعدة.');return;}
 const sourceId=active().id;
 const valid=()=>active().id===sourceId&&!B.busy();
 const inline=()=>{if(!valid())return;active().inlineHelp=true;close();changed('view');updateContext();focusHelpPanel();};
 modal('وين تبي تفتح المساعدة؟','<div class="ml-help-choices"><button id="ml-help-here" class="ml-menu-option"><strong>داخل التمرين الحالي</strong><span>تشوف المساعدة وتطبّق على أجهزة هذا التبويب.</span></button><button id="ml-help-separate" class="ml-menu-option"><strong>تبويب مساعد جديد ومستقل</strong><span>تبدأ من حالتك الحالية وتكمل الخطوات بتقدّم مستقل.</span></button></div><p class="ml-help-choice-note">تختار نوع المساعدة قبل كشفها. اختيار المكان وحده ما يُحسب مساعدة.</p>');
 $('#ml-help-here').onclick=inline;
 $('#ml-help-separate').onclick=()=>{
  if(!valid())return;
  modal('تأكيد فتح مساعد مستقل','<section class="ml-help-warning" aria-labelledby="ml-help-warning-title"><strong id="ml-help-warning-title">تنبيه — هذا التبويب مستقل عن تمرينك</strong><p>تقدر تكمل خطوات الدرس هنا؛ تقدّمك وحفظك مستقلان عن تبويب التمرين.</p><ul><li>تغييراتك وأوامرك فيه ما تنتقل للتمرين تلقائيًا؛ تنقل اللي تختاره بنفسك.</li><li>إكمال الخطوة في المساعد ما يُكملها في التمرين الأصلي؛ ارجع له وطبّق أو انسخ إعداداتك ثم تحقّق.</li><li>لو غيّرت التمرين بعد فتح المساعد، نسخته ما تتحدث تلقائيًا.</li></ul></section><div class="ml-help-confirm-actions"><button id="ml-help-confirm" class="ml-danger">فهمت، افتح تبويبًا مستقلًا</button><button id="ml-help-stay">افتحها داخل التمرين</button><button id="ml-help-cancel">إلغاء</button></div>');
  $('#ml-help-cancel').onclick=close;
  $('#ml-help-stay').onclick=inline;
  $('#ml-help-cancel').focus({preventScroll:true});
  $('#ml-help-confirm').onclick=()=>{
   if(!valid())return;
   if(state.labs.length>=100){toast('وصلت للحد الأقصى للمختبرات. تقدر تفتح المساعدة داخل التمرين.');return;}
   cloneLab(sourceId,true);focusHelpPanel();
  };
 };
}
$('#ml-helper').onclick=chooseHelpPlacement;
$('#ml-helper').title='اختر المساعدة داخل التمرين أو في تبويب مستقل';

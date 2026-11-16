// Included in the controller closure. One stable original per lesson; never reset on entry.
let lessonContext=null;
const lessonScopes={'network-vlan':'vlan','network-trunk':'trunk','network-inter':'inter'};
root.lessonProgress=()=>{
 if(!lessonContext||dirty||saving)return null;
 const t=lab(lessonContext.labId)?.training;if(!t)return null;
 const sequence=practiceSequence(t),index=sequence.indexOf(t.step);
 return {lesson:lessonContext.id,step:Math.max(0,index),stepTitle:L.titles[t.step],stepTotal:sequence.length,labStep:t.step,completed:!!t.completed};
};
const lessonGuide=document.createElement('section');lessonGuide.id='ml-lesson-guide';lessonGuide.hidden=true;
$('.ml-task').before(lessonGuide);
function lessonTarget(t){const e=t.exercise,vs=e.vlans,pc=e.pcPorts;
 const targets={
 create:'أنشئ على S1 وS2 الشبكات: '+vs.map((v,i)=>v+' — '+e.names[i]).join('، ')+'.',
 management:'اضبط واجهة إدارة VLAN '+vs[0]+' على S1 بعنوان 192.168.'+e.nets[0]+'.11 وعلى S2 بعنوان 192.168.'+e.nets[0]+'.12، بالقناع 255.255.255.0 والبوابة 192.168.'+e.nets[0]+'.1.',
 parking:'ضع المنافذ غير المستخدمة في VLAN '+vs[3]+' وأوقفها. راجع المنافذ المستخدمة في متطلبات المختبر قبل التعديل.',
 access:'اربط S1 / '+pc[0]+' بـVLAN '+vs[1]+'، وS2 / '+pc[1]+' بـVLAN '+vs[2]+'. اضبط منفذي الحاسبين في وضع access.',
 'vlan-check':'نفّذ show vlan brief على S1 وS2. طابق أرقام VLAN وأسماءها والمنافذ مع المتطلبات، ثم اضغط «تحقّق من التطبيق».',
 trunk:'اضبط '+e.uplink+' على S1 وS2، و'+e.routerSwitch+' على S1 كوصلات trunk. اجعل Native VLAN رقم '+vs[4]+'، واسمح بالشبكات '+[...vs.slice(0,3),vs[4]].join('، ')+'. فعّل هذه المنافذ.',
 save:'احفظ إعدادات S1 وS2 في startup-config — إعدادات بدء التشغيل — ثم تحقّق من حفظها.',
 parent:'فعّل منفذ '+e.routerPort+' في Router R1. هذا هو المنفذ المتصل بـS1 / '+e.routerSwitch+'.',
 subinterfaces:'أنشئ الواجهات الفرعية على R1 / '+e.routerPort+' للشبكات '+vs.slice(0,3).join('، ')+'. عناوين البوابات: '+e.nets.map(n=>'192.168.'+n+'.1/24').join('، ')+'. الواجهة الخاصة بـNative VLAN '+vs[4]+' بلا عنوان IP؛ أضف وصفًا للواجهات.',
 'router-check':'نفّذ show ip interface brief على R1، وراجع الواجهات الفرعية وعناوينها وحالتها. ثم تحقّق من التطبيق؛ Ping متاح لفحص الاتصال.'
 };return targets[t.step]||'اقرأ المتطلبات، نفّذ المطلوب ثم تحقّق من النتيجة.';
}
function renderLessonGuide(){
 if(!lessonContext)return;const a=active(),linked=a.id===lessonContext.labId||a.sourceOriginal===lessonContext.labId;
 lessonGuide.hidden=false;root.dataset.lesson=lessonContext.id;
 $('#ml-lesson-away').hidden=a.id===lessonContext.labId;
 $('#ml-lesson-away-text').textContent=linked?'أنت في نسخة مستقلة أو في المحاكي المساعد؛ لا ينتقل شيء إلا بالنسخ.':'أنت في مختبر آخر مستقل عن هذا الدرس.';
 if(linked&&a.training){$('#ml-task-detail').textContent=lessonTarget(a.training);$('#ml-requirements small').textContent='نطاق الدرس: '+lessonContext.source+'. الإعدادات المسبقة لا تُحسب تنفيذًا منك.';}
}
root.openLesson=async lesson=>{
 if(root.dataset.ready!=='true'||restoreFailure)throw Error('انتظر استعادة مختبراتك قبل فتح الدرس.');
 const scope=lessonScopes[lesson?.id];if(!scope)throw Error('الدرس غير معروف.');
 const c='lesson-'+lesson.id,id='original-'+c;courseNames[c]=lesson.title;
 let n=lab(id);
 if(!n){
  if(state.labs.length>=100)throw Error('وصلت للحد الأقصى للمختبرات. احتفظ بنسخة احتياطية ثم احذف مختبرًا مستقلًا غير مطلوب.');
  capture();const previous=clone(active().data),e=L.configure(0),sequence=[...practiceScopes[scope].steps];let data;
  loading=true;try{B.learning.fresh(e);if(sequence[0]!==L.order[0])B.learning.prerequisites(e,sequence[0]);data=B.capture();}finally{B.restore(previous);loading=false;}
  n=makeLab(id,'مختبر الدرس','original',data,c);n.training=training(e,data);Object.assign(n.training,{sequence,scope,guidance:'guided',step:sequence[0]});state.labs.push(n);
 }
 lessonContext={...lesson,labId:id};
 lessonGuide.innerHTML='<details class="ml-lesson-instructions"><summary>تفاصيل الدرس</summary><div class="ml-lesson-intro"><span class="ml-kicker">تعلّم وطبّق في المكان نفسه</span><h3>'+esc(lesson.title)+'</h3><p>'+esc(lesson.intro||lesson.summary||'')+'</p><small>المصدر: '+esc(lesson.source)+'</small></div><ol>'+lesson.steps.map(s=>'<li>'+esc(s)+'</li>').join('')+'</ol><p class="ml-lesson-prerequisite">'+(scope==='vlan'?'الأجهزة موصولة؛ نفّذ إعدادات هذا الجزء بنفسك.':scope==='trunk'?'إعداد VLAN جاهز في هذه النسخة لتبدأ Trunk مباشرة. لا يُحسب هذا الإعداد تنفيذًا منك.':'إعداد VLAN وTrunk جاهز في هذه النسخة لتبدأ إعداد Router مباشرة. لا يُحسب هذا الإعداد تنفيذًا منك.')+'</p></details><div id="ml-lesson-away" hidden><span id="ml-lesson-away-text"></span><button id="ml-lesson-return">ارجع لمختبر الدرس</button></div>';
 $('#ml-lesson-return').onclick=()=>guard(()=>activate(id));
 // Keep an independently saved tab selected when reloading this same lesson.
 const same=state.openLessonId===lesson.id;state.openLessonId=lesson.id;
 if(!same)activate(id);else render();
 renderLessonGuide();await root.flushSave?.();
};

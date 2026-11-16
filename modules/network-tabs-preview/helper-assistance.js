// Reuse the approved assistance renderer for the two tasks in this independent preview.
let tabsHelpContext={id:'',helper:false,course:'vlan'};
assistNames.set('tabs-vlan-create','إنشاء VLAN 20 على S1');
assistNames.set('tabs-port-enable','تفعيل G0/1 على R1');
const tabsCurrentAssistance=currentAssistance,tabsAssistanceContext=assistanceContext;
const helpBox=document.createElement('section');helpBox.id='ml-assistance';helpBox.hidden=true;
helpBox.innerHTML='<h3>المحاكي المساعد</h3><p>مساحة تطبق فيها المساعدة وتجرّب براحتك. مختبر التمرين مستقل؛ انسخ له ما تختاره بنفسك.</p><p id="ml-help-context" role="status"></p><button id="ml-hint" type="button">اطلب مساعدة</button><div id="ml-hint-body"></div>';
cliDetails.before(helpBox);
function tabsStep(){
 if(!tabsHelpContext.helper&&!tabsHelpContext.inline)return null;
 if(tabsHelpContext.exercise){
  const ids=window.MadarLearning.targets(tabsHelpContext.step);
  if(ids.some(id=>!devices[id]||!power[id]||ios.session(id).pending))return null;
  return window.MadarLearning.step(tabsHelpContext.exercise,tabsHelpContext.step,Object.fromEntries(ids.map(id=>[id,ios.session(id).mode])));
 }
 const vlan=tabsHelpContext.course==='vlan',id=vlan?'S1':'R1';
 if(!devices[id]||devices[id].type!==(vlan?'S':'R')||!power[id])return null;
 const s=ios.session(id);if(s.pending)return null;
 const enter=s.mode==='user'?'enable\nconfigure terminal':s.mode==='priv'?'configure terminal':'end\nconfigure terminal';
 const goal=vlan?'إنشاء VLAN 20 على S1':'تفعيل G0/1 على R1';
 return {id:vlan?'tabs-vlan-create':'tabs-port-enable',revision:1,goal,givenFacts:['task'],answerFacts:['solution'],hints:[
 {id:'concept',degree:1,benefit:vlan?'يوضح الفرق بين إنشاء VLAN وربط المنفذ بها.':'يوضح الفرق بين إغلاق المنفذ إداريًا وحالة الكابل.',body:vlan?'إنشاء VLAN يضيف شبكة افتراضية إلى قاعدة VLAN في Switch. تعيين منفذ لها عمل آخر؛ المطلوب هنا إنشاء الشبكة فقط على S1.':'قد يكون الكابل متصلًا والمنفذ مغلقًا من إعداد الجهاز. المطلوب إلغاء الإغلاق الإداري للمنفذ G0/1 في R1؛ نجاح الاتصال نفسه يحتاج أيضًا الطرف المقابل وإعداداته.',remaining:'اختيار أوامر التنفيذ الصحيحة وتنفيذها في الجهاز المطلوب.',adds:['concept'],authorReview:'tabs-task-review-20261015'},
 {id:'solution',degree:4,full:true,benefit:'يكشف أوامر المهمة الحالية كاملة، دون تنفيذها بدلًا عنك.',body:'اختر '+(vlan?'Switch S1':'Router R1')+' من قائمة الأجهزة أولًا.\nالأوامر التالية تبدأ من وضعه الحالي '+'\u2066'+ios.prompt(id)+'\u2069'+':\n'+enter+'\n'+(vlan?'vlan 20\nend\nshow vlan brief':'interface g0/1\nno shutdown\nend\nshow ip interface brief')+'\n'+(vlan?'ابحث عن VLAN 20 في الناتج، ثم اضغط تحقّق من التطبيق.':'تأكد أن سطر GigabitEthernet0/1 لا يعرض administratively down. قد يبقى down لسبب مادي؛ المطلوب هنا التفعيل الإداري.')+(tabsHelpContext.helper?'\nالتنفيذ يبقى في هذا المساعد؛ لا ينتقل إلى التمرين تلقائيًا.':'\nنفّذ الأوامر في هذا التبويب ثم تحقّق من التطبيق.'),adds:['solution'],authorReview:'tabs-task-review-20261015'}]};
}
currentAssistance=function(kind){return kind==='tabs'?tabsStep():tabsCurrentAssistance(kind);};
assistanceContext=function(kind){return kind==='tabs'?tabsHelpContext.id:tabsAssistanceContext(kind);};
mountAssistance('tabs','#ml-hint','#ml-hint-body');
root.labsBridge.helpContext=function(ctx){
 const switched=tabsHelpContext.id!==ctx.id;tabsHelpContext=ctx;helpBox.hidden=!(ctx.helper||ctx.inline);
 helpBox.querySelector('h3').textContent=ctx.helper?'المحاكي المساعد · مستقل':'المساعدة داخل التمرين';
 helpBox.querySelector('p').textContent=ctx.helper?'مختبر مستقل؛ تغييراتك هنا ما تنتقل لتمرينك إلا باختيارك.':'طبّق على أجهزة هذا التبويب. المساعدة تُسجّل هنا عند كشفها، بدون تنفيذ تلقائي.';
 const view=assistanceViews.tabs,step=tabsStep();
 if(switched||!(ctx.helper||ctx.inline)){const canvas=view.panel.querySelector('canvas');if(canvas)window.MadarAssistanceMotion.stop(canvas);view.panel.classList.remove('nf-assist-animating');}
 if(switched&&step){const last=assist.latest(step,ctx.id);view.lastExposure=last?assist.attempt+'|'+assist.key(step,ctx.id)+'|'+last.id:'';}
 renderAssistance('tabs');
 q('#ml-help-context').textContent=(ctx.helper||ctx.inline)&&!step?'المساعدة غير متاحة الآن: تأكد من وجود الجهاز المطلوب وتشغيله، وأنه لا ينتظر تأكيد أمر سابق. لم تتغير شبكتك.':(ctx.helper||ctx.inline)?'المساعدة تخص «'+(step?.goal||'المهمة الحالية')+'» في هذا المختبر.':'';
 if(step){const last=assist.latest(step,ctx.id),key=assist.key(step,ctx.id),feedback=last&&assist.feedbackEvents.filter(e=>e[0]===assist.attempt&&e[1]===key&&e[2]===last.id).at(-1);view.feedback.querySelectorAll('button').forEach((el,i)=>el.setAttribute('aria-pressed',String(feedback?.[3]===['useful','redundant','unclear'][i])));}
};


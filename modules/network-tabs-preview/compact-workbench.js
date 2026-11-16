// Progressive disclosure moves the existing controls; it never duplicates their state or handlers.
function foldTools(id,label,nodes,before){
 const d=document.createElement('details');d.id=id;d.className='ml-disclosure';
 const s=document.createElement('summary');s.textContent=label;d.append(s);
 before.before(d);for(const n of nodes)d.append(n);return d;
}
$('.ml-top h2').textContent='محاكي الشبكات';
$('.ml-task .ml-kicker').textContent='خطوتك الحالية';
$('#ml-helper').textContent='مساعدة';
$('#ml-helper').title='افتح المحاكي المساعد؛ تختار نوع المساعدة قبل كشفها';
const setupFold=foldTools('ml-setup-fold','تدريب جديد أو تغيير المختبر',[entry,$('.ml-course')],entry);
const helpFold=foldTools('ml-help-tools-fold','أدوات التعلّم',[learningTools,guide],learningTools);
const copyFold=foldTools('ml-copy-fold','نسخ ولصق',[$('.ml-copybar')],$('.ml-copybar'));
// One compact toolbar; only the selected group's contents expand below its key.
const secondary=document.createElement('div');secondary.className='ml-secondary';
$('#ml-workspace').before(secondary);secondary.append(helpFold,copyFold,setupFold);
for(const d of [helpFold,copyFold,setupFold])d.addEventListener('toggle',()=>{
 if(d.open)for(const other of [helpFold,copyFold,setupFold])if(other!==d)other.open=false;
});
const contextActions=$('#ml-context .ml-actions');
foldTools('ml-tab-options','خيارات التبويب',[contextActions],contextActions);
// Keep the destination/current step next to the actual task, not in a second explanatory panel.
$('#ml-task-title').before($('#ml-step-position'));
// Requirements stay visible; only auxiliary tools use disclosures.
$('#ml-task-title').after($('#ml-task-detail'));
$('#ml-locate').textContent='ساعدني أحدد الخطأ — الدرجة الثالثة';
// General operating instructions fold away; live errors and cable feedback stay visible.
const notice=engine.querySelector('.nf-notice');
if(notice){
 const text=document.createElement('p');text.textContent='اسحب الأجهزة والفراغ للتحريك، واسحب الكابل من منفذ إلى منفذ. اضغط اسم الجهاز لإظهار منافذه بوضوح. استخدم + و− للتقريب، و«عرض الكل» للعودة إلى الشبكة.';
 foldTools('ml-workspace-help','طريقة استخدام المساحة',[text],notice);
 const sync=()=>{notice.hidden=/^(مختبر مستقل\.|مساحة فارغة\. أضف جهازًا)/.test(notice.textContent);};
 const watcher=new MutationObserver(sync);watcher.observe(notice,{childList:true,subtree:true,characterData:true});sync();
 window.addEventListener('pagehide',()=>watcher.disconnect(),{once:true});
}
const ping=engine.querySelector('.nf-ping');
if(ping){foldTools('ml-ping-fold','فحص الاتصال · Ping',[ping],ping);ping.querySelector('h3').hidden=true;}
const cli=engine.querySelector('#nf-cli'),intro=cli.querySelector(':scope > p:not([id])');
if(intro){
 const supported=cli.querySelector(':scope > details'),limit=cli.querySelector(':scope > small');
 foldTools('ml-cli-guide','دليل الأوامر',[intro,supported,limit].filter(Boolean),intro);
}
const footer=engine.querySelector('footer');
if(footer)foldTools('ml-simulation-scope','نطاق المحاكاة وحدودها',[footer],footer);
const actions=engine.querySelector('.nf-actions'),extra=['nf-power','nf-delete-cable','nf-delete-device'].map(id=>$('#'+id));
foldTools('ml-device-actions','إجراءات الجهاز والكابل',extra,actions.nextSibling||actions);

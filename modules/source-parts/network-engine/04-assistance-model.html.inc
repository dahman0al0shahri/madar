class Assistance{
 constructor(saved){this.attempt='preview-1';this.events=[];this.feedbackEvents=[];if(saved)this.import(saved);}
 key(step,context='default'){return step.id+'@'+step.revision+'|'+context;}
 entries(step,context='default'){const key=this.key(step,context);return this.events.filter(e=>e[0]===this.attempt&&e[1]===key);}
 known(step,context){const ids=new Set(this.entries(step,context).map(e=>e[2]));return step.hints.filter(h=>ids.has(h.id)).flatMap(h=>h.adds);}
 options(step,context='default',alreadyKnown=[]){validate(step);const entries=this.entries(step,context);if(entries.some(e=>e[3]==='full'))return[];const ids=new Set(entries.map(e=>e[2])),known=new Set([...(step.givenFacts||[]),...this.known(step,context),...alreadyKnown]);return step.hints.filter(h=>!ids.has(h.id)&&h.adds.some(f=>!known.has(f))).map(h=>({id:h.id,level:classify(step,h,[...known]),label:LABELS[classify(step,h,[...known])],benefit:h.benefit}));}
 reveal(step,id,{context='default',alreadyKnown=[],render=()=>{},at=new Date().toISOString()}={}){
  validate(step);const h=step.hints.find(x=>x.id===id);if(!h)throw Error('Unknown assistance');
  const existing=this.entries(step,context).find(e=>e[2]===id);if(existing){render({...clone(h),level:existing[3],label:LABELS[existing[3]],reopened:true});return{recorded:false,level:existing[3]};}
  const options=this.options(step,context,alreadyKnown),choice=options.find(x=>x.id===id);if(!choice)return{recorded:false,reason:'no-new-information'};if(choice.id!==options[0].id&&choice.level!=='full')throw Error('Choose next meaningful hint or the full solution');
  if(!Number.isFinite(Date.parse(at)))throw Error('Invalid exposure time');
  // Commit only after the caller successfully displays the content. No execution or grading here.
  render({...clone(h),level:choice.level,label:choice.label,reopened:false});
  this.events.push([this.attempt,this.key(step,context),h.id,choice.level,at]);return{recorded:true,level:choice.level};
 }
 latest(step,context='default'){const e=this.entries(step,context).at(-1);return e?{...clone(step.hints.find(h=>h.id===e[2])),level:e[3],label:LABELS[e[3]]}:null;}
 summary(step,context='default'){return summarize(this.entries(step,context));}
 reviews(){const map=new Map();for(const e of this.events){const key=e[0]+'|'+e[1];if(!map.has(key))map.set(key,[]);map.get(key).push(e);}return[...map.values()].map(es=>({attempt:es[0][0],key:es[0][1],...summarize(es)})).sort((a,b)=>Number(b.full)-Number(a.full)||b.score-a.score);}
 newAttempt(id){if(!id||typeof id!=='string'||id.length>100)throw Error('Invalid attempt id');this.attempt=id;}
 merge(saved){const incoming=new Assistance(saved),seen=new Set(this.events.map(e=>JSON.stringify(e.slice(0,3))));for(const e of incoming.events){const k=JSON.stringify(e.slice(0,3));if(!seen.has(k)){this.events.push(e);seen.add(k);}}const feedbackKeys=new Set(this.feedbackEvents.map(e=>JSON.stringify(e)));for(const e of incoming.feedbackEvents){const k=JSON.stringify(e);if(!feedbackKeys.has(k)){this.feedbackEvents.push(e);feedbackKeys.add(k);}}this.attempt=incoming.attempt;}
 feedback(step,hintId,value,context='default'){if(!['useful','redundant','unclear'].includes(value)||!this.entries(step,context).some(e=>e[2]===hintId))throw Error('Feedback requires a displayed assistance');this.feedbackEvents.push([this.attempt,this.key(step,context),hintId,value,new Date().toISOString()]);}
 export(){return{version:VERSION,attempt:this.attempt,events:clone(this.events),feedback:clone(this.feedbackEvents)};}
 import(saved){if(saved?.version!==VERSION||typeof saved.attempt!=='string'||!Array.isArray(saved.events))throw Error('Unsupported assistance record');const events=[],seen=new Set();for(const e of saved.events){if(!Array.isArray(e)||e.length!==5||e.slice(0,3).some(x=>typeof x!=='string'||!x)||![1,2,3,'full'].includes(e[3])||!Number.isFinite(Date.parse(e[4])))throw Error('Invalid assistance event');const key=JSON.stringify(e.slice(0,3));if(seen.has(key))throw Error('Duplicate assistance event');seen.add(key);events.push([...e]);}const feedback=clone(saved.feedback||[]);if(!Array.isArray(feedback)||feedback.some(e=>!Array.isArray(e)||e.length!==5||!seen.has(JSON.stringify(e.slice(0,3)))||!['useful','redundant','unclear'].includes(e[3])||!Number.isFinite(Date.parse(e[4]))))throw Error('Invalid feedback');this.events=events;this.feedbackEvents=feedback;this.attempt=saved.attempt;}
}
function summarize(events){const count=events.length,full=events.some(e=>e[3]==='full'),degree=count?Math.max(...events.map(e=>e[3]==='full'?4:e[3])):null,score=count?WEIGHTS.degree*Math.min(degree,3)+WEIGHTS.count*Math.min(count,4)+(full?WEIGHTS.full:0):0;return{count,degree,full,score,reviewNeeded:count>0,independence:'unmeasured',countColor:full?'#b58aff':['#63d8ff','#419fe9','#6b85ed','#b58aff'][Math.min(Math.max(count,1),4)-1],degreeColor:full?'#ff6477':{1:'#ffe164',2:'#ffc24d',3:'#ff914d'}[degree]||'#a9b9bd'};}
const api={Assistance,validate,classify,summarize,LABELS,WEIGHTS};if(typeof module!=='undefined'&&module.exports)module.exports=api;else root.MadarAssistance=api;
})(typeof window!=='undefined'?window:globalThis);

(function(root){'use strict';
const review='content-review-2026-10-14-v1';
const hint=(id,degree,benefit,body,remaining)=>({id,degree,benefit,body,remaining,adds:[id],authorReview:review});
const full=body=>({id:'solution',degree:4,benefit:'يكشف طريقة تنفيذ المطلوب كاملًا مع سببها.',body,adds:['solution'],full:true,authorReview:review});
const step=(id,goal,hints)=>({id,revision:1,goal,givenFacts:['task-requirements'],answerFacts:['solution'],hints});
function basic(stage,{id='S1',port='G0/1',mode='config'}={}){const show=['user','priv'].includes(mode)?'show ip interface brief':'do show ip interface brief';const enter='من وضع Privileged EXEC # اكتب configure terminal للدخول إلى Global Configuration (config)#، ثم:\n';const defs={
 enable:step('port-enable','الدخول إلى Privileged EXEC',[full('اكتب enable ثم Enter. يتحول الرمز > إلى #؛ هذا يفتح Privileged EXEC، ولا يغيّر إعداد المنفذ.')]),
 config:step('port-config','الدخول إلى Global Configuration (config)#',[full('اكتب configure terminal ثم Enter. يظهر Global Configuration (config)#؛ الآن يمكنك اختيار المنفذ الذي ستعدّله. الاختصار غير الملتبس conf t مقبول.')]),
 interface:step('port-interface','اختيار منفذ التدريب',[full('داخل Global Configuration (config)# اكتب:\ninterface '+port.toLowerCase()+'\nسيظهر Interface Configuration (config-if)#. هذا يحدد '+id+' / '+port+' فقط؛ لا يفعّله بعد.')]),
 activate:step('port-activate','تفعيل المنفذ المختار',[full('وأنت في Interface Configuration (config-if)# للمنفذ '+id+' / '+port+' اكتب:\nno shutdown\nهذا يلغي الإغلاق الإداري؛ نجاح الاتصال ما زال يحتاج فحص الحالة والطرف المقابل.')]),
 verify:step('port-verify','فحص حالة المنفذ وقراءة دليل الاتصال',[
 hint('read-status',3,'يعطيك أمر الفحص؛ يبقى عليك تحديد السطر وتفسير حالته.', 'نفّذ:\n'+show+'\nاقرأ عمودي Status وProtocol: الأول حالة الواجهة، والثاني حالة بروتوكول الخط. حدّد سطر المنفذ المطلوب واستنتج هل الوصلة تعمل.','اختيار السطر المقصود وتفسير القيم الحالية.'),
 full('نفّذ:\n'+show+'\nابحث عن '+port+' في '+id+'. تحتاج up في Status وup في Protocol لتثبت أن الوصلة تعمل في هذه المحاكاة. administratively down يعني إغلاقًا إداريًا؛ down قد يرتبط بالكابل أو الطرف المقابل. نجاح هذه الخطوة لا يثبت صحة VLAN أو عناوين IP.')])
 };return defs[stage]||null;}
const switches=['S1','S2'],vlans={10:'Management',20:'Sales',30:'Operations',999:'Parking_Lot',1000:'Native'};
const enter='من Privileged EXEC (#) اكتب configure terminal للوصول إلى Global Configuration (config)#. إن كنت داخل Configuration Mode آخر، استخدم end ثم configure terminal.\n';
function vlan(stage){const defs={
 1:step('vlan-create','إنشاء وتسمية شبكات VLAN المطلوبة على S1 وS2',[
 hint('vlan-syntax',3,'يعطيك صيغة الإنشاء والتسمية؛ تختار الأرقام والأسماء من المتطلبات.','داخل Global Configuration (config)#:\nvlan <رقم الشبكة>\nname <اسم الشبكة>\nVLAN تقسيم منطقي للشبكة. الرقم يحددها؛ الاسم يصفها. لا تكتب القوسين.','تطبيق أزواج الأرقام والأسماء الصحيحة على كلا الجهازين.'),
 full(enter+switches.map(id=>id+':\n'+Object.entries(vlans).map(([v,n])=>'vlan '+v+'\nname '+n).join('\n')).join('\n\n')+'\nالأسماء وحدها لا تربط أجهزة الأقسام؛ تعيين المنافذ خطوة أخرى.')]),
 2:step('vlan-access','تعيين منفذ كل حاسب إلى شبكة قسمه',[
 hint('access-pattern',3,'يعطيك أوامر نوع المنفذ والتعيين؛ تبقى مطابقة الحاسب والمنفذ والشبكة عليك.','access منفذ يحمل شبكة واحدة للحاسب. داخل Interface Configuration (config-if)# لمنفذ الحاسب:\nswitchport mode access\nswitchport access vlan <رقم VLAN>\nno shutdown\nاستخرج المنفذ والرقم من توصيل الحاسب وبطاقة المتطلبات.','تحديد المنفذ الصحيح ورقم شبكة كل قسم.'),
 full(enter+'S1:\ninterface f0/6\nswitchport mode access\nswitchport access vlan 20\nno shutdown\n\nS2:\ninterface f0/18\nswitchport mode access\nswitchport access vlan 30\nno shutdown\nهذه منافذ الحواسيب في التوصيل الأصلي للمختبر؛ إذا غيّرت الكابلات فأعد تجهيز المختبر قبل استخدام هذا الحل.')]),
 2.5:step('vlan-parking','إغلاق منافذ المختبر غير المستخدمة ووضعها في VLAN 999',[
 hint('range-exclusion',2,'يعطيك طريقة تكوين مجموعة آمنة دون تعطيل الوصلات المستخدمة.','ابدأ بالمنافذ المستخدمة في بطاقة التوصيل واستبعدها. اجمع البقية في مجموعات متصلة؛ لا تغلق منفذ حاسب أو وصلة بين جهازين.','حساب المجموعات وكتابة أوامر تطبيقها.'),
 hint('range-syntax',3,'يعطيك صيغة المجموعة والأوامر؛ تبقى أرقام المنافذ التي تختارها.','داخل Global Configuration (config)#:\ninterface range <بداية> - <نهاية>, <مجموعة أخرى>\nswitchport mode access\nswitchport access vlan 999\nshutdown\nالأمر shutdown يغلق المجموعة إداريًا.','تكوين المجموعة الصحيحة لكل Switch دون إدخال المنافذ المستخدمة.'),
 full(enter+'S1:\ninterface range f0/2 - 4, f0/7 - 24, g0/1 - 2\nswitchport mode access\nswitchport access vlan 999\nshutdown\n\nS2:\ninterface range f0/2 - 17, f0/19 - 24, g0/1 - 2\nswitchport mode access\nswitchport access vlan 999\nshutdown\nطبق المجموعات على التوصيل الأصلي فقط؛ الغرض عزل المنافذ غير المستخدمة وإغلاقها.')]),
 3:step('vlan-trunk','إعداد وصلات trunk وقائمة الشبكات وnative',[
 hint('trunk-syntax',3,'يعطيك صيغ الإعداد؛ تختار الوصلات والأرقام المطلوبة.','trunk وصلة تحمل عدة شبكات. native الشبكة التي تمر بلا وسم هنا. لكل منفذ وصلة مطلوب:\nswitchport mode trunk\nswitchport trunk native vlan <رقم>\nswitchport trunk allowed vlan <قائمة أرقام>\nno shutdown\nيجب أن تتوافق إعدادات الطرفين.','تحديد منافذ الوصلات والقيم وتطبيقها في الطرفين.'),
 full(enter+[['S1','f0/1'],['S1','f0/5'],['S2','f0/1']].map(([id,n])=>id+':\ninterface '+n+'\nswitchport mode trunk\nswitchport trunk native vlan 1000\nswitchport trunk allowed vlan 10,20,30,1000\nno shutdown').join('\n\n')+'\nهذا يتيح حمل الشبكات المطلوبة؛ إعداد Router يأتي في الخطوات التالية.')]),
 4:step('vlan-parent','تفعيل المنفذ الفعلي في Router',[full(enter+'R1:\ninterface g0/1\nno shutdown\nالواجهات الفرعية تستخدم هذا المنفذ الفعلي؛ إغلاقه يمنع عملها.')]),
 5:step('vlan-subinterfaces','إعداد الواجهات الفرعية ووسوم VLAN وبواباتها',[
 hint('tag-mapping',2,'يوضح الفرق بين رقم الواجهة الفرعية ووسم الشبكة.','رقم الواجهة الفرعية اسم محلي؛ رقم VLAN في التغليف هو الذي يحدد الشبكة التي تستقبلها. خطّط لكل شبكة: الواجهة الفعلية، الوسم، عنوان البوابة، والقناع.','تحويل هذه المطابقة إلى أوامر صحيحة.'),
 hint('subinterface-syntax',3,'يعطيك ترتيب وصيغ الأوامر؛ تختار القيم لكل شبكة.','داخل Global Configuration (config)#:\ninterface g0/1.<رقم فرعي>\nencapsulation dot1q <رقم VLAN>\nip address <عنوان البوابة> <القناع>\nno shutdown\nأضف native لأمر التغليف في الشبكة الأصلية، واتركها بلا عنوان حسب المطلوب. dot1q هو وسم يميّز الشبكة على الوصلة.','ربط كل وسم بعنوانه وقناعه وتمييز الشبكة الأصلية.'),
 full(enter+'R1:\n'+[10,20,30,1000].map(v=>'interface g0/1.'+v+'\nencapsulation dot1q '+v+(v===1000?' native\nno ip address':'\nip address 192.168.'+v+'.1 255.255.255.0')+'\nno shutdown').join('\n')+'\nكل عنوان .1 هو بوابة شبكة قسمه. VLAN 1000 أصلية وبلا عنوان في هذا التدريب.')]),
 6:step('vlan-management','إعداد عنوان إدارة كل Switch وبوابته',[
 hint('svi-syntax',3,'يعطيك مكان عنوان الإدارة والبوابة؛ تبقى مطابقة عناوين الجهازين.','SVI واجهة افتراضية لإدارة Switch. من Global Configuration (config)#:\ninterface vlan <رقم شبكة الإدارة>\nip address <عنوان الجهاز> <القناع>\nno shutdown\nexit\nip default-gateway <عنوان البوابة>\nالبوابة في Global Configuration (config)#، وليست داخل الواجهة.','اختيار عنوان كل Switch ورقم شبكة الإدارة والبوابة.'),
 full(enter+switches.map((id,i)=>id+':\ninterface vlan 10\nip address 192.168.10.'+(11+i)+' 255.255.255.0\nno shutdown\nexit\nip default-gateway 192.168.10.1').join('\n\n')+'\nالعنوانان مختلفان لتجنب التعارض. هذه إدارة Switch وليست توجيهًا بين الأقسام.')]),
 7:step('vlan-ping','إجراء فحص الاتصال من PC1 إلى PC2',[full('افتح PC1، وفي سطر أوامره اكتب:\nping 192.168.30.3\nPing يختبر وصول طلب وعودة رد. اقرأ نتيجة الفحص؛ إذا فشل، فالأمر صحيح لكن الشبكة تحتاج تشخيصًا. يمكنك استخدام فحص الاتصال أسفل المساحة بالقيم نفسها.')])
 };return defs[stage]||null;}
function tracePort({pc='PC1',endpoint='S1:F0/6'}={}){return step('trace-port','تحديد منفذ Switch المتصل بالحاسب '+pc,[{...full('منفذ '+pc+' المقابل هو '+endpoint.replace(':',' / ')+'. تتبّع الكابل بين الطرفين لتربط اسم المنفذ بالتوصيل؛ تحديده هنا يكشف الإجابة كاملة.'),focus:endpoint}]);}
const api={basic,vlan,tracePort};if(typeof module!=='undefined'&&module.exports)module.exports=api;else root.MadarAssistanceCatalog=api;
})(typeof window!=='undefined'?window:globalThis);

/* Standalone teaching model: IPv4 connected routing and 802.1Q, not Cisco IOS. */
(function(global){
'use strict';
const clone=v=>JSON.parse(JSON.stringify(v));
const ipNumber=s=>{if(typeof s!=='string'||!/^\d{1,3}(\.\d{1,3}){3}$/.test(s))return null;const a=s.split('.').map(Number);return a.some(n=>n>255)?null:a.reduce((n,x)=>n*256+x,0)>>>0;};
const ipString=n=>[24,16,8,0].map(b=>(n>>>b)&255).join('.');
function maskBits(s){const n=ipNumber(s);if(n===null)return null;const bits=n.toString(2).padStart(32,'0');return /^1*0*$/.test(bits)?bits.indexOf('0')<0?32:bits.indexOf('0'):null;}
function hostAddress(ip,mask){const n=ipNumber(ip),m=ipNumber(mask),b=maskBits(mask);if(n===null||b===null||b<1||b>30||(n>>>24)===0||(n>>>24)===127||(n>>>24)>=224)return false;const host=(n&~m)>>>0;return host!==0&&host!==((~m)>>>0);}
const sameNet=(a,b,m)=>ipNumber(a)!==null&&ipNumber(b)!==null&&ipNumber(m)!==null&&((ipNumber(a)&ipNumber(m))===(ipNumber(b)&ipNumber(m)));
function vlanList(s){if(!/^\d+(?:-\d+)?(?:,\d+(?:-\d+)?)*$/.test(s))return null;const out=new Set();for(const part of s.split(',')){const [a,b=a]=part.split('-').map(Number);if(a<1||b>4094||a>b)return null;for(let n=a;n<=b;n++)out.add(n);}return [...out].sort((a,b)=>a-b);}
function compress(list){if(list==='all')return '1-4094';if(!list.length)return 'none';let a=[...list].sort((x,y)=>x-y),out=[];for(let i=0;i<a.length;i++){let j=i;while(a[j+1]===a[j]+1)j++;out.push(i===j?String(a[i]):a[i]+'-'+a[j]);i=j;}return out.join(',');}
const full=n=>n.startsWith('G')?'GigabitEthernet'+n.slice(1):n.startsWith('F')?'FastEthernet'+n.slice(1):n;
function normalizedInterface(s){const match=s.match(/^([a-z]+)(\d+(?:\/\d+)*(?:\.\d+)?)$/i);if(!match)return null;const prefix=match[1].toLowerCase(),number=match[2];for(const [name,short]of [['gigabitethernet','G'],['fastethernet','F'],['vlan','Vlan']])if(name.startsWith(prefix))return short+number;return null;}

